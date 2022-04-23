<template>
  <div id="wrap">
    <div id="form">
      <div class="title">
        {{ $localisation.get("#UI_HOME") }}
        <md-button
          @click.stop="changelog = true"
          class="md-icon-button"
          style="margin-left: auto; color: var(--accent-color)"
        >
          <md-icon
            class="fal fa-clipboard-list"
            style="color: var(--accent-color)"
          ></md-icon>
          <md-tooltip>{{ $localisation.get("#UI_CHANGELOG") }}</md-tooltip>
        </md-button>
      </div>
      <div id="grid">
        <div class="box quick-play">
          <div class="mini-title">
            {{ $localisation.get("#UI_QUICK_START") }}
          </div>
          <div id="quick-play-list">
            <div class="quick-play-game" @click.self="lastLaunchedGameStart">
              <span
                class="quick-play-game-name"
                :class="{ gray: isQuickGameButtonActive }"
                >{{ lastLaunchedGameName }}</span
              >
              <md-button
                :disabled="!checkLastLaunchedGameInstalled"
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
            {{ $localisation.get("#UI_STEAM_FRIENDS") }}
          </div>
          <div class="center" v-if="steamFriends.length == 0">
            <md-empty-state
              class="md-accent"
              md-rounded
              :md-description="$localisation.get('#UI_NO_FRIENDS')"
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
            {{ $localisation.get("#UI_SOUNDCLOUD") }}
            <i
              data-v-ebaf0836=""
              class="md-icon md-icon-font fas fa-cog md-theme-default"
              style="
                font-size: 16px !important;
                float: right;
                line-height: 21px;
              "
            ></i>
          </div>
          <SoundCloudWidget />
        </div>
      </div>
    </div>
    <md-dialog :md-active.sync="changelog">
      <md-dialog-title
        v-html="$localisation.get('#UI_CHANGELOG')"
      ></md-dialog-title>
      <md-dialog-content
        style="opacity: 0.4"
        v-html="$localisation.get('#UI_CHANGELOG_CONTENT')"
      ></md-dialog-content>
    </md-dialog>
    <md-dialog :md-active.sync="soundCloudSettings">
      <md-dialog-title
        v-html="$localisation.get('#UI_SOUNDCLOUD_SETTINGS')"
      ></md-dialog-title>
      <md-dialog-content>
        <span
          style="opacity: 0.4"
          v-html="$localisation.get('#UI_SOUNDCLOUD_SETTINGS_DESC')"
        ></span>
        <md-field>
          <label>{{ $localisation.get("#UI_SOUNDCLOUD_PLAYLIST") }}</label>
          <md-input v-model="playlistInput" class="playlistInput"></md-input>
        </md-field>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click="soundCloudSettings = false">{{
          $localisation.get("#UI_CANCEL")
        }}</md-button>
        <md-button class="md-primary" @click="saveSCPlaylist">{{
          $localisation.get("#UI_CUSTOMIZATION_BUTTON_SAVE")
        }}</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
import Store from "@/scripts/Store";
import StoreDefaults from "@/scripts/StoreDefaults";
import SteamFriend from "@/components/Home/SteamFriend";
import SoundCloudWidget from "@/components/Home/SoundCloud";
import GameControl from "@/scripts/GameControl";

const store = new Store({
  configName: "library",
  defaults: StoreDefaults.library,
});

const settingsStore = new Store({
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
      navigator: navigator,
      playlistInput: "",
    };
  },
  computed: {
    steamFriends() {
      return this.$store.state.steamworks.friends;
    },
    steamActive() {
      return this.$store.state.steamworks.started;
    },
    isGameStarted() {
      return (
        this.$store.state.game.started || this.$store.state.extraNotification
      );
    },
    isQuickGameButtonActive() {
      let id = store.get("lastLaunched");
      
      let game = GameControl.getGame(id);
      if (!game) return false;
      
      let licenses = this.$store.state.steamworks.licenses;

      return (
        (navigator.onLine == false && this.checkLastLaunchedGameInstalled) ||
        this.isGameStarted ||
        (!licenses[id] && game.needSteam)
      );
    },
    checkLastLaunchedGameInstalled() {
      let id = store.get("lastLaunched");

      return GameControl.checkInstalled(store, id);
    },
    lastLaunchedGameName() {
      let id = store.get("lastLaunched");

      if (!this.checkLastLaunchedGameInstalled)
        return this.$localisation.get("#UI_RECENTGAME_NOGAME");

      return GameControl.getTitle(id);
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

      let config = settingsStore.get("config");
      config.soundcloudPlaylist = this.playlistInput;
      settingsStore.set("config", config);

      this.soundCloudSettings = false;

      this.$store.commit("createNotification", {
        text: this.$localisation.get("#UI_NOTIFICATION_SAVED"),
      });
    },
    openPrefs() {
      let gameID = store.get("lastLaunched");
      this.$parent.$refs.navbar.goTo("game", { id: gameID, section: 1 });
    },
    lastLaunchedGameStart() {
      let gameID = store.get("lastLaunched");

      if (GameControl.checkInstalled(store, gameID) && !this.isGameStarted)
        GameControl.startGame(
          this.$hlsrConsole,
          store,
          gameID,
          this.$store,
          this.$parent.$refs.navbar
        );
    },
  },
  mounted() {
    let config = settingsStore.get("config");
    this.playlistInput = config.soundcloudPlaylist || "";

    if (this.$store.state.shouldOpenChangelog == true) {
      this.changelog = true;
      this.$store.state.shouldOpenChangelog = false;

      this.$store.commit("createNotification", {
        text: this.$localisation.get("#NEW_UPDATE_INSTALLED"),
      });
    }
  },
};
</script>

<style lang="scss" scoped>
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
  border-radius: 8px;
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
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  align-items: center;
  cursor: pointer;
  font-weight: 500;
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
  padding: 16px;

  .mini-title {
    margin: 0;
  }
}

.mini-title {
  color: #fff;
  font-size: 18px;
  font-weight: 500;
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
  pointer-events: none;
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