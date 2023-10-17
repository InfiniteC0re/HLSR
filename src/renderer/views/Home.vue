<template>
  <div id="wrap">
    <div id="form">
      <div class="title">
        {{ $t("#UI_HOME") }}
        <md-button
          @click.stop="changelog = true"
          class="md-icon-button"
          style="margin-left: auto; color: var(--accent-color)"
        >
          <md-icon
            class="fal fa-clipboard-list"
            style="color: var(--accent-color)"
          ></md-icon>
          <md-tooltip>{{ $t("#UI_CHANGELOG") }}</md-tooltip>
        </md-button>
      </div>
      <div id="grid">
        <div class="box quick-play">
          <div class="mini-title">
            {{ $t("#UI_QUICK_START") }}
          </div>
          <div id="quick-play-list">
            <div class="quick-play-game" @click.self="lastLaunchedGameStart">
              <span
                class="quick-play-game-name"
                :class="{ gray: cantQuickLaunch }"
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
            {{ $t("#UI_STEAM_FRIENDS") }}
          </div>
          <div class="center" v-if="!gotSteamFriendList">
            <LoaderSpinner v-if="isSteamStarted" />
            <div class="warning" v-else>
              <i class="fad fa-exclamation-triangle"></i>
              <p>
                {{ warningMessage }}
              </p>
            </div>
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
            {{ $t("#UI_SOUNDCLOUD") }}
            <i
              data-v-ebaf0836=""
              class="md-icon fas fa-list-music box-icon"
            ></i>
          </div>
          <SoundCloudWidget />
        </div>
      </div>
    </div>

    <!-- Changelog -->
    <md-dialog :md-active.sync="changelog" style="user-select: text">
      <md-dialog-title v-html="$t('#UI_CHANGELOG')"></md-dialog-title>
      <md-dialog-content
        style="opacity: 0.4"
        v-html="$t('#UI_CHANGELOG_CONTENT')"
      ></md-dialog-content>
    </md-dialog>
    
    <!-- SoundCloud settings -->
    <md-dialog :md-active.sync="soundCloudSettings">
      <md-dialog-title v-html="$t('#UI_SOUNDCLOUD_SETTINGS')"></md-dialog-title>
      <md-dialog-content>
        <span
          style="opacity: 0.4"
          v-html="$t('#UI_SOUNDCLOUD_SETTINGS_DESC')"
        ></span>
        <md-field>
          <label>{{ $t("#UI_SOUNDCLOUD_PLAYLIST") }}</label>
          <md-input v-model="playlistInput" class="playlistInput"></md-input>
        </md-field>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click="soundCloudSettings = false">{{
          $t("#UI_CANCEL")
        }}</md-button>
        <md-button class="md-primary" @click="saveSCPlaylist">{{
          $t("#UI_CUSTOMIZATION_BUTTON_SAVE")
        }}</md-button>
      </md-dialog-actions>
    </md-dialog>

  </div>
</template>

<script>
import Store from "@/utils/Store";
import StoreDefaults from "@/utils/StoreDefaults";
import LoaderSpinner from "@/components/Elements/Loader";
import SteamFriend from "@/components/Home/SteamFriend";
import SoundCloudWidget from "@/components/Home/SoundCloud";
import GameControl from "@/utils/GameControl";

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
  components: { SteamFriend, SoundCloudWidget, LoaderSpinner },
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
    isSteamStarted() {
      return this.$store.state.steamworks.started;
    },
    gotSteamFriendList() {
      return this.$store.state.steamworks.gotFriendList;
    },
    warningMessage() {
      return this.$t("#UI_NO_STEAM");
    },
    cantQuickLaunch() {
      let id = store.get("lastLaunched");
      let game = GameControl.getGame(id);
      if (!game) return false;

      let licenses = this.$store.state.steamworks.licenses;
      let hasGame = GameControl.checkInstalled(store, game.id);

      return (
        (navigator.onLine == false && !hasGame) ||
        this.isGameStarted ||
        (game.needSteam && (!licenses[id] || !this.isSteamStarted))
      );
    },
    checkLastLaunchedGameInstalled() {
      let id = store.get("lastLaunched");

      return GameControl.checkInstalled(store, id);
    },
    lastLaunchedGameName() {
      let id = store.get("lastLaunched");

      if (!this.checkLastLaunchedGameInstalled)
        return this.$t("#UI_RECENTGAME_NOGAME");

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
        text: this.$t("#UI_NOTIFICATION_SAVED"),
      });
    },
    openPrefs() {
      let gameID = store.get("lastLaunched");
      this.$parent.$refs.navbar.navigateTo("game", { id: gameID, section: 1 });
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

    if (this.$store.state.isNewVersion) {
      this.changelog = true;
      this.$store.state.isNewVersion = false;

      this.$store.commit("createNotification", {
        text: this.$t("#NEW_UPDATE_INSTALLED"),
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
  padding: 16px;

  .box-icon {
    font-size: 16px !important;
    float: right;
    line-height: 21px;
  }
}

.quick-play {
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
  padding: 0;

  .mini-title {
    margin: 16px;
  }

  #friends_list {
    height: 100%;
    overflow: auto;
    padding: 0 8px;
    margin-right: 8px;
    margin-bottom: 8px;
  }
}

.box2 {
  grid-row-start: 1;
  grid-row-end: 3;
}

.box3 {
  grid-column: 2;
  grid-row-start: 1;
  grid-row-end: 5;
}

.mini-title {
  color: #fff;
  font-size: 18px;
  font-weight: 500;
  opacity: 0.2;
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

.quick-play-game:hover .quick-play-game-name {
  color: #fff;
}

.quick-play-game-name {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.6);
  margin-left: 16px;
  pointer-events: none;
  transition: 0.1s ease;
  text-transform: uppercase;
}

.gray {
  color: rgba(255, 255, 255, 0.4);
}

.clickable {
  cursor: pointer;
  transition: 0.1s;
}

.clickable:hover {
  opacity: 0.4;
}

.warning {
  padding: 24px;
  bottom: 98px;
  display: flex;
  flex-direction: column;
  color: rgba(255, 208, 0, 0.6);
  text-align: center;
  border: 2px solid rgba(255, 208, 0, 0.40);
  background-color: rgba(255, 208, 0, 0.045);
  border-radius: 16px;
  opacity: 0.7;

  p {
    font-size: 0.76rem;
    line-height: 16px;
  }

  i {
    font-size: 1.6rem;
    margin-bottom: 8px;
  }
}

</style>
