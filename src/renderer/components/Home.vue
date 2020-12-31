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
              <span class="quick-play-game-name" :class="{ gray: isLastLaunchedGame }">{{ lastLaunchedGame }}</span>
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
          <div class="mini-title">{{ localization.get("#UI_SOUNDCLOUD") }}</div>
          <div class="center" v-if="!song.id">
            <md-empty-state
              class="md-accent"
              md-rounded
              :md-description="localization.get('#UI_NO_TRACKS')"
              :md-size="200"
            ></md-empty-state>
          </div>
          <div class="player-info" v-if="song.id">
            <div
              class="artwork"
              :style="soundcloudArtwork"
              :class="{ pause: !isPaused }"
              @click="widget.toggle()"
            ></div>
            <div class="player-song-wrapper">
              <div class="player-song">
                <div class="song-name">{{ song ? song.title : "" }}</div>
                <div class="song-genre">
                  {{ song && song.genre ? song.genre : "No specified genre" }}
                </div>
              </div>
              <div style="margin-top: auto">
                <div class="time">
                  <div>{{ soundcloud.songPos }}</div>
                  <div style="margin-left: auto">
                    {{ song ? toHHMMSS(song.duration / 1000) : "00:00" }}
                  </div>
                </div>
                <div class="progress" @click="SCMove">
                  <div
                    class="bar"
                    :style="{ flex: `${soundcloud.barWidth}` }"
                  ></div>
                </div>
              </div>
            </div>
            <div class="player-volume" @click.stop="SCVolumeChange">
              <div
                class="bar"
                :style="{ height: `${soundcloud.volume}%` }"
              ></div>
            </div>
          </div>
          <div class="player-songs" v-if="song.id">
            <div
              v-for="val in songsList"
              class="player-songs-song"
              :class="{ active: val.id == song.id }"
              @click="widget.skip(val.realIndex)"
              :key="val._id"
            >
              <div class="song-artwork" :style="getSongArtwork(val)"></div>
              <div class="song-title">{{ val.title }}</div>
            </div>
          </div>
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
  </div>
</template>

<script>
import Store from "../utils/Store.js";
import StoreDefaults from "../utils/StoreDefaults.js";
import SteamFriend from "./Home/SteamFriend";
import GameControl from "../utils/GameControl";
import { ipcRenderer } from "electron";

const store = new Store({
  configName: "library",
  defaults: StoreDefaults.library,
});

export default {
  name: "home-page",
  components: { SteamFriend },
  data() {
    return {
      changelog: false,
      hlsrconsole: this.$parent.hlsrconsole,
      localization: this.$parent.localization,
      navigator: navigator,
      soundcloud: {
        songPos: "00:00",
        barWidth: 0,
        volume: 100,
        updater: null,
      },
    };
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
    songsList() {
      return this.$store.state.soundCloud.sounds;
    },
    soundcloudArtwork() {
      return {
        background:
          this.song && this.song.artwork_url
            ? `url(${this.song.artwork_url}`
            : `rgba(0, 0, 0, .4)`,
      };
    },
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
    getSongArtwork(song) {
      return {
        background:
          song && song.artwork_url
            ? `url(${song.artwork_url}`
            : `rgba(0, 0, 0, .4)`,
      };
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
    toHHMMSS: (secs) => {
      var sec_num = parseInt(secs, 10);
      var hours = Math.floor(sec_num / 3600);
      var minutes = Math.floor(sec_num / 60) % 60;
      var seconds = sec_num % 60;

      return [hours, minutes, seconds]
        .map((v) => (v < 10 ? "0" + v : v))
        .filter((v, i) => v !== "00" || i > 0)
        .join(":");
    },
    SCUpdate() {
      if (this.widget) {
        this.widget.getPosition((pos) => {
          this.soundcloud.barWidth = pos / this.song.duration;
          this.soundcloud.songPos = this.toHHMMSS(pos / 1000);
        });

        this.widget.getVolume((volume) => {
          this.soundcloud.volume = volume;
        });
      }
    },
    SCMove(e) {
      if (this.song) {
        this.widget.seekTo(
          (e.offsetX * this.song.duration) / e.currentTarget.clientWidth
        );
        this.SCUpdate();
      }
    },
    SCVolumeChange(e) {
      this.soundcloud.volume =
        ((e.currentTarget.clientHeight - e.offsetY) * 100) /
        e.currentTarget.clientHeight;
      this.widget.setVolume(this.soundcloud.volume);
    },
  },
  mounted() {
    this.SCUpdate();

    this.soundcloud.updater = setInterval(() => {
      this.SCUpdate();
    }, 1000);
  },
  beforeDestroy() {
    clearInterval(this.soundcloud.updater);
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
  color: #fff !important;
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
.player-info {
  display: flex;
  padding: 16px;
}
.artwork {
  min-width: 96px;
  min-height: 96px;
  position: relative;
}

.artwork::after {
  font-family: "Font Awesome 5 Pro";
  font-weight: 900;
  font-size: 48px;
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(0px);
  transition: color 0.2s, background 0.2s;
  color: transparent;
  cursor: pointer;
}

.artwork:hover::after {
  background: rgba(0, 0, 0, 0.4);
  color: rgba(255, 255, 255, 0.6);
}

.artwork:hover::after {
  content: "";
}

.artwork.pause:hover::after {
  content: "";
}

.player-song-wrapper {
  padding: 8px;
  padding-bottom: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.player-song {
  margin-top: -8px;
  color: rgba(255, 255, 255, 0.4);
}

.player-volume {
  width: 6px;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  position: relative;
}

.player-volume .bar {
  height: 50%;
  width: 100%;
  background: rgba(255, 255, 255, 0.2);
  pointer-events: none;
  position: absolute;
  bottom: 0;
}

.progress {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
}

.progress .bar {
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
}
.time {
  color: rgba(255, 255, 255, 0.2);
  display: flex;
  margin-top: auto;
}
.song-genre {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.2);
}
.player-songs {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;
}
.player-songs-song {
  width: 100%;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 4px 16px;
}
.player-songs-song.active {
  background: rgba(255, 255, 255, 0.05) !important;
  cursor: default;
}
.player-songs-song.active .song-title {
  color: #00abff;
  opacity: 0.8;
}
.player-songs-song:hover {
  background: rgba(255, 255, 255, 0.1);
}
.song-artwork {
  min-height: 32px;
  min-width: 32px;
  background-color: rgba(0, 0, 0, 0.4);
  background-position: center !important;
  background-size: cover !important;
}
.song-title {
  white-space: nowrap;
  color: rgba(255, 255, 255, 0.3);
  text-overflow: ellipsis;
  overflow: hidden;
  margin-left: 8px;
  align-items: center;
  font-size: 13px;
}
.song-name {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.gray {
  color: rgba(255, 255, 255, 0.3);
}
</style>