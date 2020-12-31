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
        src="https://w.soundcloud.com/player/?url=https://api.soundcloud.com/playlists/1024488982%3Fsecret_token%3Ds-t3rIoE0luqj&color=%23e81387&auto_play=false&hide_related=false&show_comments=false&show_user=false&show_reposts=false&show_teaser=false"
      ></iframe>
    </div>
    <BackgroundTheme class="background" ref="theme" />
    <div id="app__container">
      <NavBar v-if="$router.currentRoute.name != 'hltp-loading'" ref="navbar" />
      <transition name="slide" mode="out-in" class="full">
        <router-view id="router" :key="$route.fullPath"></router-view>
      </transition>
    </div>
    <md-snackbar
      md-position="center"
      :md-duration="Infinity"
      :md-active="!steamActive && $router.currentRoute.name != 'hltp-loading'"
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
import Frame from "./components/Frame";
import BackgroundTheme from "./components/BackgroundTheme";
import NavBar from "./components/NavBar";
import Notification from "./components/Elements/Notification";
import GameInstall from "./components/GameInstall.vue";
import localization from "@/utils/Language.js";
import Store from "./utils/Store.js";
import StoreDefaults from "./utils/StoreDefaults.js";
import "./utils/Soundcloud";
import "codemirror/lib/codemirror.css";
import "@/utils/infinite.css";
import "codemirror/addon/selection/active-line.js";
import "codemirror/addon/hint/show-hint.js";
import "codemirror/addon/hint/show-hint.css";
import "codemirror/addon/hint/javascript-hint.js";
import "codemirror/addon/selection/active-line.js";
import "codemirror/addon/scroll/annotatescrollbar.js";
import "codemirror/addon/search/matchesonscrollbar.js";
import "codemirror/addon/search/searchcursor.js";
import "codemirror/addon/search/match-highlighter.js";
import "@/utils/hlscripts/hlscripts.js";

import Snow from "./utils/Snow";
import HLSRConsole from "hlsr-console";

const Console = new HLSRConsole();
const { ipcRenderer } = require("electron");

const settings = new Store({
  configName: "settings",
  defaults: StoreDefaults.settings,
});

const local = new localization();

export default {
  name: "hltp",
  components: { BackgroundTheme, NavBar, GameInstall, Frame, Notification },
  data: () => ({
    localization: local,
    rpc: null,
    standardRPC: {
      details: local.get("#UI_RPC_DETAILS"),
      startTimestamp: Date.now(),
      largeImageKey: "hlsr",
      largeImageText: "v" + require("../../package.json").version,
      smallImageKey: "steam",
      smallImageText: local.get("#UI_RPC_NOSTEAM"),
      instance: false,
    },
    lastRPC: {},
    updateAvailable: 0,
    hlsrconsole: Console,
    focused: true,
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
    steamActive() {
      return this.$store.state.steamworks.started;
    },
    noParticles() {
      return this.$store.state.noParticles;
    },
  },
  methods: {
    steamRetry() {
      ipcRenderer.send("getSteamStatus");
      ipcRenderer.send("getSteamFriends");
    },
    setRPC(rpc, currentRPC) {
      if (JSON.stringify(currentRPC) != JSON.stringify(this.lastRPC))
        this.rpc.setActivity(rpc);
      this.rpc.setActivity(rpc);
      this.lastRPC = currentRPC;
    },
    updateRPC() {
      if (!settings.get("config").rpc) return;
      let rpc = Object.assign({}, this.standardRPC);

      let steamName = this.$store.state.steamworks.personaName;
      if (steamName) rpc.smallImageText = steamName;

      if (!this.widget) return;

      let currentRPC = null;

      this.widget.getPosition((position) => {
        if (!this.isPaused) {
          rpc.details = this.localization.get("#UI_RPC_MUSIC");
          rpc.state = this.song.title;
          rpc.endTimestamp = Date.now() + this.song.duration - position;
        }

        currentRPC = { state: rpc.state, details: rpc.details };
        this.setRPC(rpc, currentRPC);
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

    let window = require("electron").remote.getCurrentWindow();

    window.on("focus", () => {
      this.focused = true;
    });

    window.on("blur", () => {
      this.focused = false;
    });

    let config = settings.get("config");
    this.$store.commit("setParticlesState", config.noParticles);

    let month = new Date().getMonth() + 1;
    if (month == 0 || month == 1 || month == 12) Snow.start(this.$store);

    // SteamWorks

    setTimeout(() => {
      ipcRenderer.on("steamStatus", (e, status) => {
        this.$store.commit("steamworks_setStatus", status);

        if (status) {
          ipcRenderer.send("setRichPresence");
          ipcRenderer.send("getSteamFriends");
          ipcRenderer.send("getSteamName");
        }
      });

      ipcRenderer.on("steamFriends", (e, friends) => {
        this.$store.commit("steamworks_setFriends", friends);
      });

      ipcRenderer.on("steamName", (e, name) => {
        this.$store.commit("steamworks_setName", name);
      });

      setInterval(() => {
        let window = require("electron").remote.getCurrentWindow();
        if (this.$store.state.steamworks.started && window.isFocused())
          ipcRenderer.send("getSteamFriends");
      }, 10000);

      ipcRenderer.send("getSteamStatus");
    }, 500);

    // SoundCloud

    let widget = SC.Widget(this.$refs.sc);

    widget.bind(SC.Widget.Events.READY, () => {
      this.$store.commit("setSCWidget", widget);

      // ждём получения всех треков
      let updateInterval = setInterval(() => {
        !this.$store.state.soundCloud.gotSounds
          ? this.$store.commit("getSCSounds")
          : clearInterval(updateInterval);
      }, 1000);

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
    });

    // Discord RPC

    const DiscordRPC = require("discord-rpc");

    const clientId = "731919817346383913";

    DiscordRPC.register(clientId);

    const rpc = new DiscordRPC.Client({ transport: "ipc" });
    const startTimestamp = new Date();
    this.rpc = rpc;

    rpc.on("ready", () => {
      this.updateRPC();
      setInterval(this.updateRPC, 8000);
    });

    rpc.login({ clientId }).catch(console.error);

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
}

#app__container {
  display: flex;
  flex: 1;
  overflow: hidden;
  position: relative;
  z-index: 1;
}

.split {
  display: block;
  margin: 8px;
}

#router {
  flex: 1;
  display: flex;
  border-radius: 16px 0 0 0;
  overflow: hidden;
}

#form {
  flex: 1;
  padding: 32px;
  display: flex;
  flex-direction: column;
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
.md-snackbar {
  left: 380px !important;
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

/* width */
::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

/* Track */
::-webkit-scrollbar-track {
  background: transparent;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.4);
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
</style>
