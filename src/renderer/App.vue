<template>
  <div id="app">
    <Frame />
    <canvas
      id="events_background"
      :class="{ hide: !focused || noParticles }"
    ></canvas>
    <div class="hidden_elements" hidden>
      <iframe
        ref="sc"
        allow="autoplay"
        :src="
          'https://w.soundcloud.com/player/?url=' +
          $store.state.defaultSoundCloudPlaylist
        "
      ></iframe>
    </div>
    <BackgroundTheme class="background" ref="theme" />
    <div id="app__container">
      <NavBar
        v-if="$router.currentRoute.name != 'hltp-loading' && !compactMode"
        ref="navbar"
      />
      <Side-Bar
        v-else-if="$router.currentRoute.name != 'hltp-loading'"
        ref="navbar"
      />
      <transition name="slide" mode="out-in" class="full">
        <router-view
          id="router"
          :key="$route.fullPath"
          :class="{ overflow: overflow ? 'hidden' : 'unset' }"
        ></router-view>
      </transition>
    </div>
    <md-snackbar
      md-position="center"
      :md-duration="Infinity"
      :md-active="
        !steamActive &&
        $router.currentRoute.name != 'hltp-loading' &&
        $router.currentRoute.name == 'hltp-home' &&
        !compactMode
      "
      md-persistent
    >
      <span>{{ localization.get("#UI_STEAM_ERROR") }}</span>
      <md-button class="md-primary" @click="steamRetry">{{
        localization.get("#UI_RETRY")
      }}</md-button>
    </md-snackbar>
    <GameInstall ref="gameinstall" />
    <Notification />
  </div>
</template>

<script>
import SideBar from "./components/SideBar";
import Frame from "./components/Frame";
import BackgroundTheme from "./components/BackgroundTheme";
import NavBar from "./components/NavBar";
import Notification from "./components/Elements/Notification";
import GameInstall from "./components/GameInstall.vue";
import localization from "@/utils/Language.js";
import Store from "./utils/Store.js";
import StoreDefaults from "./utils/StoreDefaults.js";
import Snow from "./utils/Snow";
import HLSRConsole from "hlsr-console";
import "./utils/Soundcloud";

// CSS
import "codemirror/lib/codemirror.css";
import "codemirror/addon/hint/show-hint.css";
import "@/utils/infinite.css";

// CodeMirror Addons
import "codemirror/addon/selection/active-line.js";
import "codemirror/addon/hint/show-hint.js";
import "codemirror/addon/hint/javascript-hint.js";
import "codemirror/addon/selection/active-line.js";
import "codemirror/addon/scroll/annotatescrollbar.js";
import "codemirror/addon/search/matchesonscrollbar.js";
import "codemirror/addon/search/searchcursor.js";
import "codemirror/addon/search/match-highlighter.js";
import GameControl from "./utils/GameControl";
import GameList from "./GameList";

const Console = new HLSRConsole();
const { ipcRenderer } = require("electron");

const settings = new Store({
  configName: "settings",
  defaults: StoreDefaults.settings,
});

const local = new localization();

export default {
  name: "hltp",
  components: {
    BackgroundTheme,
    NavBar,
    GameInstall,
    Frame,
    Notification,
    SideBar,
  },
  data: () => ({
    localization: local,
    rpc: null,
    compactMode: false,
    standardRPC: {
      details: local.get("#RPC_DETAILS"),
      startTimestamp: Date.now(),
      largeImageKey: "hlsr",
      largeImageText: "v" + require("../../package.json").version,
      smallImageKey: "steam2",
      smallImageText: local.get("#RPC_NOSTEAM"),
      instance: false,
      buttons: [{ label: local.get("#RPC_WEBSITE"), url: "https://hlsr.pro/" }],
    },
    lastRPC: {},
    updateAvailable: 0,
    hlsrconsole: Console,
    focused: true,
    overflow: false,
    launchInfo: {
      appid: null,
      started: false,
    },
  }),
  computed: {
    isPaused() {
      return this.$store.state.soundCloud.isPaused;
    },
    widget() {
      return this.$store.state.soundCloud.widget;
    },
    song() {
      return this.$store.state.soundCloud.currentSound;
    },
    songs() {
      return this.$store.state.soundCloud.sounds;
    },
    steamActive() {
      return this.$store.state.steamworks.started;
    },
    noParticles() {
      return this.$store.state.noParticles;
    },
    isGameStarted() {
      return this.$store.state.game.started;
    },
  },
  methods: {
    waitForAllTracks() {
      let updateInterval = setInterval(() => {
        !this.$store.state.soundCloud.gotSounds
          ? this.$store.commit("getSCSounds")
          : clearInterval(updateInterval);
      }, 300);
    },
    steamRetry() {
      ipcRenderer.send("getSteamStatus");
      ipcRenderer.send("getSteamFriends");
    },
    setRPC(rpc) {
      if (JSON.stringify(rpc) != JSON.stringify(this.lastRPC)) {
        this.rpc.setActivity(rpc);
        this.lastRPC = Object.assign({}, rpc);
      }
    },
    quickLaunchShortcut() {
      if (this.launchInfo.appid != null && this.launchInfo.started == false) {
        const library = new Store({
          configName: "library",
          defaults: StoreDefaults.library,
        });

        let game = GameList.find((t) => t.id == this.launchInfo.appid);

        if (
          GameControl.checkInstalled(library, this.launchInfo.appid) &&
          !this.isGameStarted &&
          (this.steamActive || !game.needSteam)
        ) {
          GameControl.startGame(
            this.hlsrconsole,
            library,
            this.launchInfo.appid,
            this.$store,
            this.$refs.navbar
          );

          this.resetQuickLaunch();
        }
      }
    },
    resetQuickLaunch() {
      this.$store.state.extraNotification = null;
      this.launchInfo.appid = null;
      this.launchInfo.started = true;
    },
    updateRPC() {
      if (!settings.get("config").rpc) return;
      let rpc = Object.assign({}, this.standardRPC);
      rpc.buttons[0].label = this.localization.get("#RPC_WEBSITE");

      if (settings.get("config").mlpMode && settings.get("config").theme == 4) {
        rpc.largeImageKey = "mlp";
        rpc.smallImageKey = "pony-steam";
        rpc.details = this.localization.get("#RPC_MLP");
        rpc.buttons[0].label = this.localization.get("#RPC_GET_FRIENDS");
        rpc.buttons[0].url = this.localization.get("#MLP_URL");
      } else {
        rpc.details = this.localization.get("#RPC_DETAILS");
      }

      let steamName = this.$store.state.steamworks.personaName;
      if (steamName) rpc.smallImageText = steamName;

      let gameState = this.$store.state.game;
      if (gameState.started) {
        rpc.details = this.localization.get("#RPC_PLAYING", gameState.name);
        rpc.startTimestamp = gameState.date;
        return this.setRPC(rpc); // Пропуск установки RPC для SoundCloud виджета (игра в приоритете)
      }

      if (!this.widget) return this.setRPC(rpc);

      this.widget.getPosition((position) => {
        if (!this.isPaused) {
          rpc.details = this.localization.get("#RPC_MUSIC");
          rpc.state = this.song.title;
          rpc.endTimestamp = this.$store.state.soundCloud.endTimestamp;
        }

        this.setRPC(rpc);
      });
    },
  },
  mounted() {
    // Autoupdater
    ipcRenderer.on("message", (event, text) => {
      if (text == "update-available") this.updateAvailable = 1;
      else if (text == "update-downloaded") this.updateAvailable = 2;
      else this.updateAvailable = 0;
    });

    let ewindow = require("electron").remote.getCurrentWindow();

    ewindow.on("focus", () => {
      this.focused = true;
    });

    ewindow.on("blur", () => {
      this.focused = false;
    });

    let config = settings.get("config");
    this.$store.commit("setParticlesState", config.noParticles);

    let month = new Date().getMonth() + 1;
    if (month == 0 || month == 1 || month == 12) Snow.start(this.$store);

    // SteamWorks
    ipcRenderer.on("steamStatus", (e, status) => {
      let prevState = this.$store.state.steamworks.started ? true : false;
      this.$store.commit("steamworks_setStatus", status);

      if (status) {
        if (!prevState) ipcRenderer.send("setRichPresence", "HLSR");
        ipcRenderer.send("getSteamFriends");
        ipcRenderer.send("getSteamName");

        this.quickLaunchShortcut();
      }
    });

    ipcRenderer.on("steamFriends", (e, friends) => {
      this.$store.commit("steamworks_setFriends", friends);
    });

    ipcRenderer.on("steamName", (e, name) => {
      this.$store.commit("steamworks_setName", name);
    });

    setTimeout(() => {
      setInterval(() => {
        let window = require("electron").remote.getCurrentWindow();
        if (this.$store.state.steamworks.started && window.isFocused())
          ipcRenderer.send("getSteamFriends");
      }, 5000);

      ipcRenderer.send("getSteamStatus");
    }, 500);

    // SoundCloud
    let widget = SC.Widget(this.$refs.sc);

    widget.bind(SC.Widget.Events.READY, () => {
      this.$store.commit("setSCWidget", widget);

      let config = settings.get("config");

      if (config.soundcloudPlaylist) {
        widget.load(config.soundcloudPlaylist, {
          callback: () => {
            this.waitForAllTracks();
          },
        });
      } else this.waitForAllTracks();

      widget.bind(SC.Widget.Events.PAUSE, () => {
        this.$store.commit("setSCPaused", true);
      });

      widget.bind(SC.Widget.Events.PLAY, (info) => {
        let soundId = info.soundId;
        this.$store.commit("setSCPaused", false);

        if (this.$store.state.soundCloud.currentSound.id != soundId) {
          let track = this.$store.state.soundCloud.sounds.find(
            (sound) => sound.id == soundId
          );

          if (track) {
            this.$store.commit("setSCSound", track);
          }

          widget.seekTo(0);
        }
      });

      widget.bind(SC.Widget.Events.ERROR, (e) => {
        widget.load(this.$store.state.defaultSoundCloudPlaylist, {
          callback: () => {
            this.waitForAllTracks();
          },
        });
      });

      widget.bind(SC.Widget.Events.PLAY_PROGRESS, (e) => {
        if (e.currentPosition >= this.song.duration - 160) {
          let track = this.song;

          let lastSong = this.songs[this.songs.length - 1];

          if (track.id == lastSong.id) {
            widget.skip(this.songs[0].realIndex);
            widget.seekTo(0);
          }
        }
      });
    });

    // Discord RPC
    const DiscordRPC = require("discord-rpc");

    const clientId = "731919817346383913";

    DiscordRPC.register(clientId);

    const rpc = new DiscordRPC.Client({ transport: "ipc" });
    this.rpc = rpc;

    rpc.on("ready", () => {
      this.updateRPC();
      setInterval(this.updateRPC, 5000);
    });

    rpc.login({ clientId }).catch(console.error);

    // HLSRC
    ipcRenderer.on("hlsrc", (event, data) => {
      this.$store.commit("createNotification", {
        text: "Данные HLSRC файла прочитаны!",
      });
    });

    // Quick Game Launch (shortcuts)
    ipcRenderer.on("start-game-quick", (e, appid) => {
      if (this.launchInfo.appid != null && !this.launchInfo.started) return;

      this.launchInfo.appid = appid;
      this.launchInfo.started = false;

      this.$store.commit("setExtraNotification", {
        text: this.localization.get(
          this.localization.get("#WAITING_FOR_STEAM")
        ),
      });

      setTimeout(() => {
        if (this.launchInfo.appid != null && !this.launchInfo.started) {
          this.$store.commit("createNotification", {
            text: this.localization.get(
              this.localization.get("#CANT_START_GAME_NOSTEAM")
            ),
            type: 1,
            lifetime: 0,
          });

          this.resetQuickLaunch();
        }
      }, 15000);

      // Try to launch game
      this.quickLaunchShortcut();
    });

    // UI
    this.compactMode = settings.get("config").compactMode;

    let currentVersion = require("../../package.json").version;
    let lastVersion = localStorage.getItem("lastVersion");

    if (lastVersion != currentVersion) {
      this.$store.state.shouldOpenChangelog = true;
      localStorage.setItem("lastVersion", currentVersion);
    }

    ipcRenderer.send("ready");
  },
};
</script>

<style>
* {
  backface-visibility: hidden;
  margin: 0;
}

.transition {
  transition: 0.08s all;
}

body {
  font-family: Rubik;
  user-select: none;
  display: flex;
}

.basictext {
  color: rgb(210, 210, 210);
}

#app {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

#app__container {
  display: flex;
  flex: 1;
  max-height: calc(100vh - 32px);
  position: relative;
  z-index: 1;
}

#app__container::-webkit-scrollbar {
  visibility: hidden;
  width: 0;
}

.split {
  display: block;
  margin: 8px;
}

#router {
  flex: 1;
  display: flex;
  border-radius: 16px 0 0 0;
  position: relative;
}

#form {
  flex: 1;
  padding: 32px;
  display: flex;
  flex-direction: column;
  max-width: calc(100vw - var(--sidebar-width));
}

#form .title {
  font-size: 36px;
  font-weight: 900;
  text-transform: uppercase;
  color: #00abff;
  text-shadow: 1px 1px 8px rgba(0, 0, 0, 0.4);
  line-height: normal;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.element {
  padding: 12px;
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  margin-bottom: 8px;
  cursor: pointer;
}

.element:hover {
  background: rgba(0, 0, 0, 0.28);
}

.standardcursor {
  cursor: default;
}

.slide-leave-active,
.slide-enter-active {
  transition: 0.22s transform, 0.22s opacity;
}
.slide-enter {
  will-change: transform, opacity;
  transform: translate(0, 100%);
  pointer-events: none;
}
.slide-leave-to {
  transform: translate(0, -100%);
  opacity: 0;
}
.md-button-content {
  display: flex;
}
.md-dialog-container {
  width: 760px;
  max-height: 90%;
  background: rgb(62, 62, 62) !important;
}

.md-overlay {
  backdrop-filter: blur(4px);
  z-index: 6;
}

::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  transition: 100ms;
  border-radius: 8px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}

.CodeMirror-scrollbar-filler[cm-not-content="true"] {
  display: none !important;
}

.hide {
  opacity: 0 !important;
}

#events_background {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  opacity: 0.05;
  transition: 0.5s;
}

*:focus {
  outline: none;
}
</style>
