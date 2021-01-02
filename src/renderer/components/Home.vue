<template>
  <div id="wrap">
    <div id="form">
      <div class="title">
        {{ localization.get("#UI_HOME") }}
        <md-button
          @click.stop="changelog = true"
          class="md-icon-button"
          style="margin-left: auto; color: #00abff"
        >
          <md-icon
            class="fal fa-clipboard-list"
            style="color: #00abff"
          ></md-icon>
          <md-tooltip>{{ localization.get("#UI_CHANGELOG") }}</md-tooltip>
        </md-button>
      </div>
      <div id="grid">
        <div class="box quick-play">
          <div class="mini-title">
            {{ localization.get("#UI_QUICK_START") }}
          </div>
          <div id="quick-play-list">
            <div class="quick-play-game" @click.self="lastLaunchedGameStart">
              <span
                class="quick-play-game-name"
                :class="{ gray: isLastLaunchedGame }"
                >{{ lastLaunchedGame }}</span
              >
              <md-button
                :disabled="lastLaunchedGameButton"
                @click.stop="openPrefs"
                class="md-icon-button"
                style="margin-left: auto"
              >
                <md-icon class="fas fa-cog"></md-icon>
              </md-button>
            </div>
          </div>
        </div>
        <div class="box box1">
          <div class="mini-title">
            {{ localization.get("#UI_STEAM_FRIENDS") }}
          </div>
          <div class="center" v-if="steamFriends.length == 0">
            <md-empty-state
              class="md-accent"
              md-rounded
              :md-description="localization.get('#UI_NO_FRIENDS')"
              :md-size="200"
            ></md-empty-state>
          </div>
          <div id="friends_list" v-else>
            <SteamFriend
              v-for="friend in steamFriends"
              :key="friend._id"
              :friend="friend"
            />
          </div>
        </div>
        <div class="box box3">
          <div class="mini-title clickable" @click="openSCSettings">
            {{ localization.get("#UI_SOUNDCLOUD") }}
            <i
              data-v-ebaf0836=""
              class="md-icon md-icon-font fas fa-cog md-theme-default"
              style="font-size:16px !important;float:right;line-height:21px"
            ></i>
          </div>
          <SoundCloudWidget />
        </div>
      </div>
    </div>
    <md-dialog :md-active.sync="changelog">
      <md-dialog-title
        v-html="localization.get('#UI_CHANGELOG')"
      ></md-dialog-title>
      <md-dialog-content
        style="opacity: 0.4"
        v-html="localization.get('#UI_CHANGELOG_CONTENT')"
      ></md-dialog-content>
    </md-dialog>
    <md-dialog :md-active.sync="soundCloudSettings">
      <md-dialog-title
        v-html="localization.get('#UI_SOUNDCLOUD_SETTINGS')"
      ></md-dialog-title>
      <md-dialog-content>
        <span
          style="opacity: 0.4"
          v-html="localization.get('#UI_SOUNDCLOUD_SETTINGS_DESC')"
        ></span>
        <md-field>
          <label>{{ localization.get("#UI_SOUNDCLOUD_PLAYLIST") }}</label>
          <md-input v-model="playlistInput" class="playlistInput"></md-input>
        </md-field>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click="soundCloudSettings = false">{{
          localization.get("#UI_CANCEL")
        }}</md-button>
        <md-button class="md-primary" @click="saveSCPlaylist">{{
          localization.get("#UI_CUSTOMIZATION_BUTTON_SAVE")
        }}</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
import Store from "../utils/Store.js";
import StoreDefaults from "../utils/StoreDefaults.js";
import SteamFriend from "./Home/SteamFriend";
import SoundCloudWidget from "./Home/SoundCloud";
import GameControl from "../utils/GameControl";
import { ipcRenderer } from "electron";

const store = new Store({
  configName: "library",
  defaults: StoreDefaults.library,
});

const settings_store = new Store({
  configName: "settings",
  defaults: StoreDefaults.settings,
});

export default {
  name: "home-page",
  components: { SteamFriend, SoundCloudWidget },
  data() {
    return {
      soundCloudSettings: false,
      changelog: false,
      hlsrconsole: this.$parent.hlsrconsole,
      localization: this.$parent.localization,
      navigator: navigator,
      playlistInput: "",
    };
  },
  computed: {
    steamFriends() {
      return this.$store.state.steamworks.friends;
    },
    isLastLaunchedGame() {
      let id = store.get("lastLaunched");
      return !GameControl.checkInstalled(store, id);
    },
    lastLaunchedGame() {
      let id = store.get("lastLaunched");

      if (!GameControl.checkInstalled(store, id))
        return this.localization.get("#UI_RECENTGAME_NOGAME");

      switch (id) {
        case "70":
          return "Half-Life";
          break;
        case "50":
          return "Half-Life: Opposing Force";
          break;
        case "130":
          return "Half-Life: Blue Shift";
          break;
        case "220":
          return "Half-Life 2";
          break;
        default:
          return this.localization.get("#UI_RECENTGAME_NOGAME");
          break;
      }
    },
    lastLaunchedGameButton() {
      let id = store.get("lastLaunched");

      if (!GameControl.checkInstalled(store, id)) return true;

      if (id.length > 0) return false;
      else return true;
    },
  },
  methods: {
    openSCSettings() {
      this.soundCloudSettings = true;
    },
    saveSCPlaylist() {
      let playlistURL = this.playlistInput
        ? this.playlistInput
        : this.$store.state.defaultSoundCloudPlaylist;

      this.$store.state.soundCloud.gotSounds = false;
      this.$store.state.soundCloud.widget.load(playlistURL, {
        callback: () => {
          this.$store.state.soundCloud.isPaused = true;
          this.$parent.waitForAllTracks();
        },
      });

      let config = settings_store.get("config");
      config.soundcloudPlaylist = this.playlistInput;
      settings_store.set("config", config);

      this.soundCloudSettings = false;

      this.$store.commit("createNotification", {
        text: this.localization.get("#UI_NOTIFICATION_SAVED"),
      });
    },
    openPrefs() {
      let gameID = store.get("lastLaunched");
      this.$parent.$refs.navbar.goTo("game", { id: gameID, section: 1 });
    },
    lastLaunchedGameStart() {
      let gameID = store.get("lastLaunched");
      let config = store.get("config");

      if (GameControl.checkInstalled(store, gameID)) {
        this.hlsrconsole.execute([
          "game",
          require("path").join(
            require("electron").remote.app.getPath("userData"),
            "library"
          ),
          gameID,
          config[gameID].edited_dll ? "-dll" : "",
          config[gameID].bxt ? "-bxt" : "",
          config[gameID].rinput ? "-ri" : "",
          config[gameID].livesplit ? "-livesplit" : "",
          config[gameID].steam ? "-steam" : "",
          config[gameID].args,
        ]);
      }
    },
  },
  mounted() {
    let config = settings_store.get("config");
    this.playlistInput = config.soundcloudPlaylist || "";
  },
};
</script>

<style scoped>
#grid {
  margin-top: 24px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(4, 1fr);
  grid-gap: 24px;
  min-height: 0;
  height: 100%;
}

.box {
  overflow: hidden;
  border-radius: 2px;
  background: rgba(0, 0, 0, 0.16);
  display: flex;
  flex-direction: column;
}

.quick-play {
  padding: 16px 0;
  grid-column: 1;
  grid-row: 1;
}

#quick-play-list {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-items: center;
  margin-top: 16px;
  padding: 0 16px;
}

.quick-play-game {
  width: 100%;
  height: 47px;
  background-color: rgba(255, 255, 255, 0.06);
  transition: background-color 50ms ease-in-out;
  border-radius: 2px;
  overflow: hidden;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.quick-play-game:hover {
  background-color: rgba(255, 255, 255, 0.12);
}

.box1 {
  grid-row-start: 2;
  grid-row-end: 5;
  padding: 16px 0;
}

.box2 {
  grid-row-start: 1;
  grid-row-end: 3;
  padding: 16px 0;
}

.box3 {
  grid-column: 2;
  grid-row-start: 1;
  grid-row-end: 5;
  padding: 16px 0;
}

.mini-title {
  color: #fff;
  font-size: 20px;
  font-weight: bold;
  opacity: 0.2;
  margin: 0 16px;
}

#friends_list {
  height: 100%;
  margin-top: 16px;
  overflow: auto;
}

iframe {
  height: 100%;
}

.center {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: rgba(255, 255, 255, 0.4);
}

.quick-play-game-name {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.7);
  margin-left: 16px;
}

.gray {
  color: rgba(255, 255, 255, 0.3);
}

.clickable {
  cursor: pointer;
  transition: 0.1s;
}

.clickable:hover {
  opacity: 0.4;
}
</style>