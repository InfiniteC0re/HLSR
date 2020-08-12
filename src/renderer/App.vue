<template>
  <div id="app">
    <Frame />
    <BackgroundTheme class="background" ref="theme" />
    <div style="display:flex;height:100%;max-height: 736px">
      <NavBar v-if="$router.currentRoute.name != 'hltp-loading'" ref="navbar" />
      <transition name="slide" mode="out-in" class="full">
        <router-view id="router" :key="$route.fullPath"></router-view>
      </transition>
    </div>
    <md-snackbar
      md-position="center"
      :md-duration="Infinity"
      :md-active.sync="!this.steam"
      md-persistent
    >
      <span>{{localization.get('#UI_STEAM_ERROR')}}</span>
      <md-button class="md-primary" @click="steamRetry">{{localization.get('#UI_RETRY')}}</md-button>
    </md-snackbar>
    <GameInstall ref="gameinstall" />
    <iframe
      style="display:none"
      width="100%"
      height="100%"
      id="sc"
      allow="autoplay"
      src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1024488982%3Fsecret_token%3Ds-Is2HJ3P7dhu&amp;color=%23511bcd&amp;auto_play=false&amp;hide_related=false&amp;show_comments=false&amp;show_user=true&amp;show_reposts=false&amp;show_teaser=true"
      @load="widgetLoaded = true"
    ></iframe>
    <md-dialog :md-active.sync="beta.form" :mdClickOutsideToClose="false">
      <md-dialog-title>Beta Authorization</md-dialog-title>
      <md-dialog-content>
        <md-field :class="betaKeyError">
          <label>Authorization Key</label>
          <md-input v-model="beta.key"></md-input>
          <span class="md-error">There is an error</span>
        </md-field>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click="betaExit">Exit</md-button>
        <md-button class="md-primary" @click="betaAuth">Auth</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
import Frame from "./components/Frame";
import Steamworks from "steam-integration";
import BackgroundTheme from "./components/BackgroundTheme";
import NavBar from "./components/NavBar";
import GameInstall from "./components/GameInstall.vue";
import localization from "@/utils/Language.js";
import "./utils/Soundcloud";
import Store from "./utils/Store.js";
import StoreDefaults from "./utils/StoreDefaults.js";
import { machineId, machineIdSync } from "node-machine-id";
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

const store = new Store({
  configName: "beta_auth",
  defaults: StoreDefaults.beta_auth,
});

const settings = new Store({
  configName: "settings",
  defaults: StoreDefaults.settings,
});

const local = new localization();

export default {
  name: "hltp",
  components: { BackgroundTheme, NavBar, GameInstall, Frame },
  data: () => ({
    steam: true,
    steamName: null,
    localization: local,
    widgetLoaded: false,
    rpc: null,
    standardRPC: {
      details: local.get("#UI_RPC_DETAILS"),
      startTimestamp: Date.now(),
      largeImageKey: "hlsr",
      largeImageText: "CLOSED BETA",
      smallImageKey: "steam",
      smallImageText: local.get("#UI_RPC_NOSTEAM"),
      instance: false,
    },
    lastRPC: {},
    songs: [],
    songsUpdater: null,
    updateAvailable: 0,
    beta: {
      enabled: true,
      form: false,
      key: "",
      error: 0,
    },
  }),
  computed: {
    betaKeyError() {
      return {
        "md-invalid": this.beta.error == -1,
      };
    },
  },
  methods: {
    betaExit() {
      var browserWindow = require("electron").remote.getCurrentWindow().close();
    },
    betaAuth() {
      var ctx = this;
      var machine_id = machineIdSync();

      fetch("https://hlsr.pro/validate_betakey.php", {
        method: "post",
        body: `key=${this.beta.key}&machine_id=${machine_id}&register=1`,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
        .then((data) => {
          return data.json();
        })
        .then((data) => {
          ctx.beta.error = data.status;
          if(data.status == 0) {
            ctx.beta.form = false;
          }
        })
        .catch((e) => {
          console.log("Error reading hlsr.pro answer");
        });
    },
    betaCheckRegistered() {
      var ctx = this;
      var machine_id = machineIdSync();

      fetch("https://hlsr.pro/validate_betakey.php", {
        method: "post",
        body: `machine_id=${machine_id}&register=0`,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
        .then((data) => {
          return data.json();
        })
        .then((data) => {
          if(data.status == 0) {
            ctx.beta.form = false;
          }else{
            ctx.beta.form = true;
          }
        })
        .catch((e) => {
          console.log("Error reading hlsr.pro answer");
        });
    },
    steamRetry() {
      this.$sw.command("InitSteamWorks");
    },
    updateRPC() {
      if(!settings.get('config').rpc) return;
      let ctx = this;
      let rpc = JSON.parse(JSON.stringify(this.standardRPC));
      let widget = SC.Widget(document.querySelector("#sc"));

      if (this.steamName) rpc.smallImageText = this.steamName;

      if (widget) {
        widget.isPaused((paused) => {
          if (!paused) {
            widget.getPosition((position) => {
              widget.getCurrentSound((sound) => {
                rpc.details = this.localization.get("#UI_RPC_MUSIC");
                rpc.state = sound.title;
                rpc.endTimestamp = Date.now() + sound.duration - position;

                let current = { state: rpc.state, details: rpc.details };
                if (JSON.stringify(current) != JSON.stringify(ctx.lastRPC))
                  ctx.rpc.setActivity(rpc);
                ctx.lastRPC = current;
              });
            });
          } else {
            let current = { state: rpc.state, details: rpc.details };
            if (JSON.stringify(current) != JSON.stringify(ctx.lastRPC))
              ctx.rpc.setActivity(rpc);
            ctx.rpc.setActivity(rpc);
            ctx.lastRPC = current;
          }
        });
      }
    },
  },
  mounted() {
    if (this.beta.enabled) this.betaCheckRegistered();
    let widget = SC.Widget(document.querySelector("#sc"));
    let ctx = this;

    widget.bind(SC.Widget.Events.READY, function () {
      ctx.songsUpdater = setInterval(() => {
        widget.getSounds((e) => {
          ctx.songs = e;
          let missing = 0;
          for (let i = 0; i < e.length; i++) {
            if (!e[i].title) missing++;
          }

          if (missing == 0) clearInterval(ctx.songsUpdater);
        });
      }, 1000);
    });
  },
  beforeCreate() {
    var ctx = this;

    const DiscordRPC = require("discord-rpc");

    const clientId = "731919817346383913";

    DiscordRPC.register(clientId);

    const rpc = new DiscordRPC.Client({ transport: "ipc" });
    const startTimestamp = new Date();

    rpc.on("ready", () => {
      this.rpc = rpc;
      this.updateRPC();
      setInterval(this.updateRPC, 8000);
    });

    rpc.login({ clientId }).catch(console.error);

    // Steamworks API
    var sw = new Steamworks();
    this.$sw = sw;

    sw.addCallback("MyName", (e) => {
      this.steamName = e.nickname;
    });

    sw.addCallback("NoSteam", () => {
      this.steam = false;
    });

    sw.addCallback("Steam", () => {
      sw.command("setRPC");
      this.steam = true;
    });

    sw.command("GetMyName");

    const { ipcRenderer } = require("electron");

    ipcRenderer.on("message", function (event, text) {
      if (text == "update-available") {
        ctx.updateAvailable = 1;
      } else if (text == "update-downloaded") {
        ctx.updateAvailable = 2;
      } else {
        ctx.updateAvailable = 0;
      }
    });
  },
};
</script>

<style>
.transition {
  transition: 0.08s all;
}

body {
  margin: 0;
  font-family: Rubik;
  user-select: none;
  overflow: hidden;
  display: flex;
}

.basictext {
  color: rgb(210, 210, 210);
}

#app {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.split {
  display: block;
  margin: 8px;
}

#wrapper,
#router {
  display: flex;
  height: 100%;
}

#router {
  width: 100%;
}

#form {
  width: 100%;
  padding: 32px;
  display: flex;
  flex-direction: column;
}

#form .title {
  font-size: 36px;
  font-weight: 900;
  text-transform: uppercase;
  /* color: rgb(210,210,210); */
  color: #00abff;
  text-shadow: 1px 1px 8px rgba(0, 0, 0, 0.4);
  line-height: normal;
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
  transition: 0.22s;
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
  max-height: 100%;
}

/* width */
::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

/* Track */
::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 32px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 32px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.4);
}

.CodeMirror-scrollbar-filler[cm-not-content="true"] {
  display: none !important;
}
</style>
