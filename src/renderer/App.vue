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
      <SideBar v-if="$router.currentRoute.name != 'loading'" ref="navbar" />
      <transition name="slide" mode="out-in" class="full">
        <router-view
          id="router"
          :key="$route.fullPath"
          :class="{ overflow: overflow ? 'hidden' : 'unset' }"
        ></router-view>
      </transition>
    </div>
    <Notification />
  </div>
</template>

<script>
import SideBar from "./components/SideBar";
import Frame from "./components/Frame";
import BackgroundTheme from "./components/BackgroundTheme";
import Notification from "./components/Elements/Notification";
import Store from "./utils/Store.js";
import StoreDefaults from "./utils/StoreDefaults.js";
import Snow from "./utils/Snow";
import BlobsTheme from "./utils/BlobsTheme";
import "@/utils/SoundCloud";

// CSS
import "codemirror/lib/codemirror.css";
import "codemirror/addon/hint/show-hint.css";
import "@/css/codemirror-dracula-custom.css";

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
import GameList from "../games.config";

const { ipcRenderer } = require("electron");
const remote = require("@electron/remote");

const settings = new Store({
  configName: "settings",
  defaults: StoreDefaults.settings,
});

export default {
  name: "hlsr",
  components: {
    BackgroundTheme,
    Frame,
    Notification,
    SideBar,
  },
  data: function () {
    return {
      rpc: null,
      standardRPC: {
        details: this.$t("#RPC_DETAILS"),
        startTimestamp: Date.now(),
        largeImageKey: "hlsr",
        largeImageText: "v" + require("../../package.json").version,
        smallImageKey: "steam2",
        smallImageText: this.$t("#RPC_NOSTEAM"),
        instance: false,
        buttons: [{ label: this.$t("#RPC_WEBSITE"), url: "https://hlsr.pro/" }],
      },
      lastRPC: {},
      updateAvailable: 0,
      focused: true,
      overflow: false,
      launchInfo: {
        appid: null,
        started: false,
      },
      window: null,
    }
  },
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
      this.updateSteamStatus();
    },
    setRPC(rpc) {
      if (JSON.stringify(rpc) != JSON.stringify(this.lastRPC)) {
        this.rpc.setActivity(rpc);
        this.lastRPC = Object.assign({}, rpc);
      }
    },
    checkQuickLaunch() {
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
            this.$hlsrConsole,
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
    updateSteamStatus() {
      let status = ipcRenderer.sendSync("getSteamStatus");
      this.$store.state.steamworks.licenses =
        ipcRenderer.sendSync("getLicenses");
      this.$store.commit("steamworks_setStatus", status);

      if (status) {
        ipcRenderer.sendSync("setRichPresence", "HLSR");
        this.updateSteamFriends();
        this.updateSteamName();
        this.checkQuickLaunch();
      }
    },
    updateSteamFriends() {
      let friends = ipcRenderer.sendSync("getSteamFriends");
      this.$store.commit("steamworks_setFriends", friends);
    },
    updateSteamName() {
      let username = ipcRenderer.sendSync("getSteamName");
      this.$store.commit("steamworks_setName", username);
    },
    updateRPC() {
      if (!settings.get("config").rpc) return;
      let rpc = Object.assign({}, this.standardRPC);
      rpc.buttons[0].label = this.$t("#RPC_WEBSITE");

      if (settings.get("config").mlpMode && settings.get("config").theme == 3) {
        rpc.largeImageKey = "mlp";
        rpc.smallImageKey = "pony-steam";
        rpc.details = this.$t("#RPC_MLP");
        rpc.buttons[0].label = this.$t("#RPC_GET_FRIENDS");
        rpc.buttons[0].url = this.$t("#MLP_URL");
      } else {
        rpc.details = this.$t("#RPC_DETAILS");
      }

      let steamName = this.$store.state.steamworks.personaName;
      if (steamName) rpc.smallImageText = steamName;

      let gameState = this.$store.state.game;
      
      if (gameState.started) {
        rpc.details = this.$t("#RPC_PLAYING", gameState.name);
        rpc.startTimestamp = gameState.startDate;
        return this.setRPC(rpc); // Пропуск установки RPC для SoundCloud виджета (игра в приоритете)
      }

      if (!this.widget) return this.setRPC(rpc);

      if (!this.isPaused) {
        this.widget.getPosition((position) => {
          rpc.details = this.$t("#RPC_MUSIC");
          rpc.state = this.song.title;
          rpc.endTimestamp = this.$store.state.soundCloud.endTimestamp;

          this.setRPC(rpc);
        });
      } else {
        this.setRPC(rpc);
      }
    },
    windowFocus() {
      this.$store.state.window.focused = true;
    },
    windowBlur() {
      this.$store.state.window.focused = false;
    },
  },
  mounted() {
    // Updates
    ipcRenderer.on("updatemanager-status", (e, status) => {
      this.updateAvailable = status;
    });

    let browserWindow = remote.getCurrentWindow();
    this.$store.state.window.focused = browserWindow.isFocused();
    this.window = browserWindow;

    browserWindow.on("focus", this.windowFocus);
    browserWindow.on("blur", this.windowBlur);

    // Background extras
    let config = settings.get("config");
    this.$store.commit("setParticlesState", config.noParticles);

    let month = new Date().getMonth() + 1;
    if (month == 0 || month == 1 || month == 12) Snow.start(this.$store);
    this.$store.state.blobs = BlobsTheme;

    // SteamWorks
    setTimeout(() => {
      setInterval(() => {
        if (
          this.$store.state.steamworks.started &&
          this.$store.state.window.focused
        )
          this.updateSteamFriends();
      }, 5000);

      this.updateSteamStatus();
    }, 500);

    // SoundCloud
    let widget = SC.Widget(this.$refs.sc);

    widget.bind(SC.Widget.Events.READY, () => {
      this.$store.commit("setSCWidget", widget);

      let config = settings.get("config");

      if (config.soundcloudPlaylist) {
        widget.load(config.soundcloudPlaylist, {
          callback: this.waitForAllTracks,
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
    const rpc = (this.rpc = new DiscordRPC.Client({ transport: "ipc" }));

    rpc.on("ready", () => {
      this.updateRPC();
      setInterval(this.updateRPC, 5000);
    });

    rpc.login({ clientId }).catch(console.error);

    // quick game launch (shortcuts)
    ipcRenderer.on("start-game-quick", (e, appid) => {
      if (this.launchInfo.appid != null && !this.launchInfo.started) return;

      this.launchInfo.appid = appid;
      this.launchInfo.started = false;

      this.$store.commit("setExtraNotification", {
        text: this.$t(
          this.$t("#WAITING_FOR_STEAM")
        ),
      });

      setTimeout(() => {
        if (this.launchInfo.appid != null && !this.launchInfo.started) {
          this.$store.commit("createNotification", {
            text: this.$t(
              this.$t("#CANT_START_GAME_NOSTEAM")
            ),
            type: 1,
            lifetime: 0,
          });

          this.resetQuickLaunch();
        }
      }, 15000);

      // try to launch the game
      this.checkQuickLaunch();
    });

    // UI
    let currentVersion = require("../../package.json").version;
    let lastVersion = localStorage.getItem("lastVersion");

    if (lastVersion != currentVersion) {
      this.$store.state.shouldOpenChangelog = true;
      localStorage.setItem("lastVersion", currentVersion);
    }

    ipcRenderer.send("ready");
  },
  beforeDestroy() {
    this.window.removeAllListeners("focus");
    this.window.removeAllListeners("blur");
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
  color: var(--accent-color);
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
