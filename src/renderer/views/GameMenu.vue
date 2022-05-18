<template>
  <div id="wrap">
    <div id="form" :class="{ overlay: installationWindow }">
      <div
        id="mainview"
        :style="{
          backgroundImage: `linear-gradient(0deg, #070707 10%, transparent 200%), ${background}`,
        }"
      >
        <div class="main">
          <div class="game-title">{{ game.name }}</div>
          <div class="game-top">
            <md-button
              :class="{ 'md-raised': true, installedGame: installed }"
              @click="gameButton"
              style="margin: 0"
              :disabled="isButtonDisabled"
            >
              <div class="icon">{{ buttonIcon() }}</div>
              <div class="text">{{ buttonText() }}</div>
            </md-button>
            <md-menu
              md-size="big"
              md-direction="bottom-start"
              class="menu-button"
              v-if="installed"
            >
              <md-button class="md-icon-button" md-menu-trigger>
                <md-icon class="fas fa-cog"></md-icon>
              </md-button>

              <md-menu-content style="margin-top: 3px; width: 280px">
                <md-menu-item @click="gameFolder">
                  <span>{{ $t("#UI_GAME_FOLDER") }}</span>
                  <md-icon
                    class="fas fa-folder"
                    style="margin-right: 2px"
                  ></md-icon>
                </md-menu-item>
                <md-menu-item @click="makeShortcut">
                  <span>{{ $t("#UI_MAKE_SHORTCUT") }}</span>
                  <md-icon
                    class="fas fa-star"
                    style="margin-right: 3.3px"
                  ></md-icon>
                </md-menu-item>
                <md-menu-item
                  @click="uninstallGameHandle"
                  class="gamemenu_uninstallButton"
                  :disabled="isGameStarted"
                >
                  <span>{{ $t("#UI_UNINSTALL") }}</span>
                  <md-icon class="fas fa-trash"></md-icon>
                </md-menu-item>
              </md-menu-content>
            </md-menu>
          </div>
        </div>
        <div class="panels">
          <div class="navpanel">
            <span class="name">{{ $t("#UI_MANAGEMENT") }}</span>
            <div
              v-for="section in sections"
              v-bind:key="section._id"
              :class="{
                navbutton: true,
                active: selectedSection == section.id,
                border: section.border,
                disabled: !installed && section.requiresInstalledGame,
              }"
              @click="section.cb"
            >
              <div class="text">
                <i v-if="section.icon" :class="section.icon"></i
                >{{ $t(section.name) }}
              </div>
            </div>
            <div class="warning" v-if="shouldShowWarning">
              <i class="fad fa-exclamation-triangle"></i>
              <p>
                {{ warningMessage }}
              </p>
            </div>
          </div>
          <div class="mainpanel">
            <Overview
              v-if="selectedSection == 0"
              :posts="posts"
              :id="$route.query.id"
            />
            <Configurator v-if="selectedSection == 1" :id="$route.query.id" />
            <LiveSplitSplits
              v-if="selectedSection == 2"
              :id="$route.query.id"
            />
          </div>
        </div>
      </div>
    </div>

    <GameInstall
      v-if="installationWindow"
      @cancel="installationWindow = false"
    />
  </div>
</template>

<script type="text/javascript">
const remote = require("@electron/remote");
import Overview from "@/components/GameMenu/Overview";
import LiveSplitSplits from "@/components/GameMenu/LiveSplitSplits";
import Configurator from "@/components/GameMenu/Configurator";
import Store from "@/utils/Store";
import StoreDefaults from "@/utils/StoreDefaults";
import GameControl from "@/utils/GameControl";
import AltButton from "@/components/Elements/Button";
import GameInstall from "@/components/GameInstall.vue";
import axios from "axios";
import path from "path";

const store = new Store({
  configName: "library",
  defaults: StoreDefaults.library,
});

export default {
  name: "GameMenu",
  components: {
    Overview,
    Configurator,
    LiveSplitSplits,
    AltButton,
    GameInstall,
  },
  methods: {},
  data() {
    return {
      posts: [],
      selectedSection: 0,
      game: {},
      background: "linear-gradient(rgb(140, 140, 140), rgb(140, 140, 140))",
      installed: false,
      installationWindow: false,
      cyrillic: false,
    };
  },
  computed: {
    sections() {
      return [
        {
          requiresInstalledGame: false,
          name: "#UI_OVERVIEW",
          id: 0,
          cb: () => {
            this.selectedSection = 0;
          },
        },
        {
          requiresInstalledGame: true,
          name: "#UI_CONFIGURATOR",
          id: 1,
          cb: () => {
            this.selectedSection = 1;
          },
        },
        {
          requiresInstalledGame: true,
          name: "#UI_LIVESPLIT_SPLITS",
          id: 2,
          cb: () => {
            this.selectedSection = 2;
          },
        },
        {
          requiresInstalledGame: false,
          name: "#UI_WIKI",
          cb: this.sourceRunsWiki,
          icon: `icon fal fa-link`,
          border: true,
        },
        {
          requiresInstalledGame: false,
          name: "#UI_LEADERBOARD",
          cb: this.leaderboard,
          icon: `icon fal fa-link`,
        },
      ];
    },
    isButtonDisabled() {
      return (
        (navigator.onLine == false && this.installed == false) ||
        this.isGameStarted ||
        (this.game.needSteam && (!this.hasLicense || !this.isSteamStarted))
      );
    },
    isGameStarted() {
      return (
        this.$store.state.game.started || this.$store.state.extraNotification
      );
    },
    isSteamStarted() {
      return this.$store.state.steamworks.started;
    },
    startedGameName() {
      return this.$store.state.game.name;
    },
    hasLicense() {
      return this.$store.state.steamworks.licenses[this.game.id];
    },
    shouldShowWarning() {
      return (
        (this.game.needSteam && (!this.hasLicense || !this.isSteamStarted)) ||
        this.cyrillic
      );
    },
    warningMessage() {
      if (!this.isSteamStarted && this.game.needSteam)
        return this.$t("#UI_NO_STEAM");

      if (this.game.needSteam && !this.hasLicense)
        return this.$t("#UI_NO_LICENSE");

      if (this.cyrillic) return this.$t("#UI_FOUND_CYRILLIC");

      return "";
    },
  },
  methods: {
    uninstallGameHandle() {
      GameControl.uninstallGame(store, this.game.id);

      this.$parent.$refs.navbar.navigateTo("game", {
        id: this.game.id,
        refresh: true,
      });

      this.$store.commit("createNotification", {
        text: this.$t("#UI_NOTIFICATION_REMOVED"),
      });
    },
    makeShortcut() {
      if (!this.$isDebug) {
        remote.shell.writeShortcutLink(
          path.join(
            remote.app.getPath("desktop"),
            `${this.$t("#SHORTCUT_LAUNCH")} ${this.game.name.replace(
              ":",
              ""
            )}.lnk`
          ),
          "create",
          {
            target: require("process").execPath,
            args: `-quick ${this.game.id}`,
            icon:
              process.resourcesPath +
              "\\app\\icons\\" +
              GameControl.getIcon(this.game.id),
            iconIndex: 0,
          }
        );
      }
    },
    buttonIcon() {
      if (this.installed) return ``;
      else return ``;
    },
    buttonText() {
      if (this.isGameStarted && this.startedGameName == this.game.name)
        return this.$t("#UI_STARTED");
      else if (this.installed) return this.$t("#UI_PLAY");
      else return this.$t("#UI_INSTALL");
    },
    updateBackground(fn) {
      this.background = `url(${require("@/assets/screenshots/" + fn)})`;
    },
    gameButton() {
      if (this.installed) {
        GameControl.startGame(
          this.$hlsrConsole,
          store,
          this.game.id,
          this.$store,
          this.$parent.$refs.navbar
        );
      } else {
        let isStandalone = this.game.info.isStandalone;
        let isReqGameInstalled = GameControl.checkInstalled(
          store,
          this.game.info.requiredGame
        );

        if (isStandalone || isReqGameInstalled) {
          this.installationWindow = true;
        } else {
          this.$parent.$refs.navbar.navigateTo("game", {
            id: this.game.info.requiredGame,
            install: true,
          });
        }
      }
    },
    sourceRunsWiki() {
      remote.shell.openExternal(GameControl.getSourceRunsLink(this.game.id));
    },
    leaderboard() {
      remote.shell.openExternal(GameControl.getLeaderboardLink(this.game.id));
    },
    gameFolder() {
      GameControl.openGameDir(this.game.id, store);
    },
    refresh() {
      this.installed = GameControl.checkInstalled(store, this.game.id);
      if (/[а-яА-ЯЁё]/.test(GameControl.getLibraryPath(store))) {
        this.cyrillic = true;
      }

      this.$forceUpdate();
    },
  },
  mounted() {
    let section = this.$route.query.section;
    if (section) this.section = section;

    this.game = GameControl.getGame(this.$route.query.id);
    this.installed = GameControl.checkInstalled(store, this.game.id);
    this.updateBackground(GameControl.getBackground(this.game.id));

    if (!this.installed && this.$route.query.install)
      this.installationWindow = true;

    if (navigator.onLine) {
      axios
        .get(
          `https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=${
            this.game.id == "218" ? "220" : this.game.id
          }&count=15`
        )
        .then((res) => {
          if (res.data.appnews) this.posts = res.data.appnews.newsitems;
        });
    }

    if (!this.installed) return;
    if (/[а-яА-ЯЁё]/.test(GameControl.getLibraryPath(store)))
      this.cyrillic = true;
  },
};
</script>

<style lang="scss" scoped>
#form::after {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background: transparent;
  backdrop-filter: blur(0);
  transition: 0.2s ease background-color;
  pointer-events: none;
}

#form.overlay::after {
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(16px);
  pointer-events: all;
}
</style>

<style type="text/css" scoped>
#form {
  display: flex;
  padding: 0;
  flex-direction: row;
  max-height: 100vh;
  overflow: hidden;
  position: absolute;
  top: -32px;
  bottom: 0;
  left: 0;
  right: 0;
}

#mainview {
  background-size: cover !important;
  background-position: center !important;
  background-repeat: no-repeat !important;
  flex: 1;
  display: flex;
  align-items: center;
  flex-direction: column;
}

#mainview > .main {
  margin-top: 112px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

#mainview .game-top {
  display: flex;
  align-items: center;
  margin-top: 32px;
}

#mainview .game-title {
  font-size: 48px;
  color: rgb(210, 210, 210);
  text-transform: uppercase;
  text-shadow: 1px 1px 8px rgba(0, 0, 0, 0.4);
  margin-bottom: 8px;
}

.md-raised {
  width: 200px;
  height: 48px;
  backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.22) !important;
  margin: auto;
  margin-top: 20px;
  color: rgb(210, 210, 210) !important;
  text-transform: uppercase;
  border-radius: 2px;
}

.md-raised.installedGame {
  background: #00abffc7 !important;
  color: #fff !important;
}

.main .button:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.33);
}

#mainview > .panels {
  display: flex;
  flex: 1;
  width: 100%;
  padding: 16px;
  padding-top: 32px;
  overflow: hidden;
}

.navpanel {
  height: 100%;
  background: rgba(33, 33, 33, 0.5);
  backdrop-filter: blur(16px);
  min-width: 260px;
  padding: 16px 0;
  margin-right: 16px;
  border-radius: 2px;
  position: relative;
  display: flex;
  gap: 2px;
  flex-direction: column;
  overflow: hidden;
}

.navpanel .name {
  color: rgb(80 80 80);
  margin-left: 16px;
  margin-bottom: 8px;
  font-weight: bolder;
  text-transform: uppercase;
  font-size: 0.8rem;
}

.navpanel .navbutton.disabled {
  color: rgb(120, 120, 120) !important;
  cursor: default;
  pointer-events: none;
}

.navpanel .navbutton.active {
  border-left: 4px solid;
  padding-left: 0px;
  color: var(--accent-color) !important;
}

.navpanel .warning {
  position: absolute;
  padding: 16px;
  bottom: 98px;
  left: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  color: rgba(255, 208, 0, 0.2);
  text-align: center;
  transition: 0.2s ease;
}

.navpanel .warning:hover {
  color: rgba(255, 208, 0, 0.6);
}

.navpanel .warning p {
  font-size: 0.76rem;
  line-height: 16px;
}

.navpanel .warning i {
  font-size: 1.6rem;
  margin-bottom: 8px;
}

.md-button.md-theme-default.md-raised.installedGame[disabled] {
  background: #7cd3ffc7 !important;
  color: #fff !important;
}

.navpanel .navbutton {
  width: 100%;
  height: 32px;
  display: flex;
  align-items: center;
  color: rgb(150, 150, 150);
  padding-left: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: 0.2s ease color;
}

.navpanel .navbutton .icon {
  margin-right: 16px;
}

.navpanel .navbutton.border {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 16px;
  box-sizing: content-box;
  margin-top: auto;
}

.navpanel .navbutton:hover {
  color: rgb(210, 210, 210);
}

.navbutton .text {
  margin-left: 16px;
}

.mainpanel {
  height: 100%;
  background: rgba(33, 33, 33, 0.5);
  width: 100%;
  padding: 16px 0;
  box-sizing: border-box;
  backdrop-filter: blur(16px);
  border-radius: 2px;
  position: relative;
  overflow: auto;
}

.icon {
  margin-right: 8px;
  font-family: "Font Awesome 5 Pro";
  font-weight: 900;
}

.gamemenu_uninstallButton * {
  color: #ff5252 !important;
}

.menu-button {
  margin-left: 16px;
  backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.22) !important;
  padding: 4px;
  border-radius: 2px;
}
</style>
