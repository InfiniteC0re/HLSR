<template>
  <div id="wrap">
    <div id="form">
      <div
        id="mainview"
        :style="{
          backgroundImage: `linear-gradient(0deg, #070707 10%, transparent 200%), ${background}`,
        }"
      >
        <div class="main">
          <div class="game-title">{{ gameTitle }}</div>
          <div style="display: flex; align-items: center; margin-top: 32px">
            <md-button
              :class="{ 'md-raised': true, installedGame: installed }"
              @click="gameButton"
              style="margin: 0"
              :disabled="isButtonDisabled"
            >
              <div class="icon">
                <i class="fas fa-play"></i>
              </div>
              <div class="text">
                {{
                  checkInstalled(gameID)
                    ? localization.get("#UI_PLAY")
                    : localization.get("#UI_INSTALL")
                }}
              </div>
            </md-button>
            <md-menu
              md-size="big"
              md-direction="bottom-start"
              style="
                margin-left: 16px;
                backdrop-filter: blur(8px);
                background: rgba(255, 255, 255, 0.22) !important;
                padding: 4px;
                border-radius: 2px;
              "
              v-if="installed"
            >
              <md-button class="md-icon-button" md-menu-trigger>
                <md-icon class="fas fa-cog"></md-icon>
              </md-button>

              <md-menu-content style="margin-top: 3px; width: 256px">
                <md-menu-item @click="gameFolder">
                  <span>{{ localization.get("#UI_GAME_FOLDER") }}</span>
                  <md-icon class="fas fa-folder"></md-icon>
                </md-menu-item>
                <md-menu-item
                  @click="uninstallGame"
                  class="gamemenu_uninstallButton"
                >
                  <span>{{ localization.get("#UI_UNINSTALL") }}</span>
                  <md-icon class="fas fa-trash"></md-icon>
                </md-menu-item>
              </md-menu-content>
            </md-menu>
          </div>
        </div>
        <div class="panels">
          <div class="navpanel">
            <div
              :class="['navbutton', section == 0 ? 'active' : '']"
              @click="section = 0"
            >
              <div class="text">{{ localization.get("#UI_OVERVIEW") }}</div>
            </div>
            <div
              :class="[
                'navbutton',
                section == 1 ? 'active' : '',
                !installed ? 'disabled' : '',
              ]"
              @click="
                () => {
                  if (installed) section = 1;
                }
              "
            >
              <div class="text">{{ localization.get("#UI_CONFIGURATOR") }}</div>
            </div>
            <div
              :class="['navbutton', section == 2 ? 'active' : '']"
              @click="sourceRunsWiki"
            >
              <div class="text">{{ localization.get("#UI_WIKI") }}</div>
            </div>
          </div>
          <div class="mainpanel">
            <Overview v-if="section == 0" :id="$route.query.id" />
            <Configurator v-if="section == 1" :id="$route.query.id" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
import Overview from "./GameMenu/Overview";
import Configurator from "./GameMenu/Configurator";
import Store from "../utils/Store.js";
import StoreDefaults from "../utils/StoreDefaults.js";

const store = new Store({
  configName: "library",
  defaults: StoreDefaults.library,
});

export default {
  name: "GameMenu",
  components: { Overview, Configurator },
  methods: {},
  data() {
    return {
      gameID: null,
      gameTitle: null,
      background: "linear-gradient(rgb(140, 140, 140), rgb(140, 140, 140))",
      section: 0,
      localization: this.$parent.localization,
      hlsrconsole: this.$parent.hlsrconsole,
      steamworks: this.$parent.steamworks,
      steamactive: false,
      installed: false,
    };
  },
  computed: {
    isButtonDisabled() {
      return (
        (!navigator.onLine && !checkInstalled(this.gameID)) || !this.steamactive
      );
    },
  },
  methods: {
    updateBackground(fn) {
      this.background = `url(${require("@/assets/screenshots/" + fn)})`;
    },
    checkInstalled(appid) {
      let installed = store.get("installed");
      return Object.keys(installed).indexOf(appid) >= 0;
    },
    gameButton() {
      let config = store.get("config");
      if (this.checkInstalled(this.gameID)) {
        this.hlsrconsole.execute([
          require("path").join(
            require("electron").remote.app.getPath("userData"),
            "library"
          ),
          this.gameID,
          config[this.gameID].edited_dll ? "-dll" : "",
          config[this.gameID].bxt ? "-bxt" : "",
          config[this.gameID].rinput ? "-ri" : "",
          config[this.gameID].livesplit ? "-livesplit" : "",
          config[this.gameID].steam ? "-steam" : "",
          config[this.gameID].allcores ? "-allcores" : "",
          config[this.gameID].allcores == false &&
          config[this.gameID].corescount == "1"
            ? "-onecore"
            : "",
          config[this.gameID].allcores == false &&
          config[this.gameID].corescount == "2"
            ? "-twocores"
            : "",
          config[this.gameID].allcores == false &&
          config[this.gameID].corescount == "3"
            ? "-threecores"
            : "",
          config[this.gameID].allcores == false &&
          config[this.gameID].corescount == "4"
            ? "-fourcores"
            : "",
          "-" + config[this.gameID].priority,
          config[this.gameID].args,
        ]);
        store.set("lastLaunched", this.gameID);
      } else {
        this.$parent.$refs.gameinstall.open(this.gameID);
      }
    },
    sourceRunsWiki() {
      let shell = require("electron").remote.shell;
      let url = "https://wiki.sourceruns.org/wiki/Category:Half-Life_1";

      switch (this.gameID) {
        case "50":
          url = "https://wiki.sourceruns.org/wiki/Category:Opposing_Force";
          break;
        case "130":
          url = "https://wiki.sourceruns.org/wiki/Category:Blue_Shift";
          break;
      }

      shell.openExternal(url);
    },
    gameFolder() {
      const libraryPath = require("path").join(
        require("electron").remote.app.getPath("userData"),
        "library"
      );

      let shell = require("electron").remote.shell;
      let path = "";

      if (this.gameID == "70")
        path = require("path").join(libraryPath, "Half-Life");
      else if (this.gameID == "50")
        path = require("path").join(libraryPath, "Half-Life", "gearbox_WON");
      else if (this.gameID == "130")
        path = require("path").join(libraryPath, "Half-Life", "bshift");

      try {
        shell.openPath(path);
      } catch (e) {
        console.error(e);
      }
    },
    uninstallGame() {
      const libraryPath = require("path").join(
        require("electron").remote.app.getPath("userData"),
        "library"
      );
      if (this.gameID == "70") {
        require("fs").rmdirSync(libraryPath, { recursive: true });
        store.set("installed", {});
      } else if (this.gameID == "50") {
        let installed = store.get("installed");

        let gamePath;
        gamePath = require("path").join(libraryPath, "Half-Life", "gearbox");
        require("fs").rmdirSync(gamePath, { recursive: true });
        gamePath = require("path").join(
          libraryPath,
          "Half-Life",
          "gearbox_WON"
        );
        require("fs").rmdirSync(gamePath, { recursive: true });

        delete installed["50"];
        store.set("installed", installed);
      } else if (this.gameID == "130") {
        let installed = store.get("installed");

        let gamePath;
        gamePath = require("path").join(libraryPath, "Half-Life", "bshift");
        require("fs").rmdirSync(gamePath, { recursive: true });

        delete installed["130"];
        store.set("installed", installed);
      }
      this.$parent.$refs.navbar.goTo("game", {
        id: this.gameID,
        refresh: true,
      });
    },
  },
  refresh() {
    this.$forceUpdate();
    this.installed = this.checkInstalled(this.gameID);
  },
  mounted() {
    let section = this.$route.query.section;
    if (section) {
      this.section = section;
    }

    this.steamactive = this.steamworks.module.SteamAPI_Init();

    this.gameID = this.$route.query.id;
    switch (this.gameID) {
      case "70":
        this.gameTitle = "Half-Life";
        this.updateBackground("half-life-background.jpg");
        break;
      case "50":
        this.gameTitle = "Half-Life: Opposing Force";
        this.updateBackground("opposing-force-background.jpg");
        break;
      case "130":
        this.gameTitle = "Half-Life: Blue Shift";
        this.updateBackground("blue-shift-background.jpg");
        break;
      default:
        this.gameTitle = "Unknown Game";
    }
    this.installed = this.checkInstalled(this.gameID);
    this.steam = this.$parent.steam || false;
  },
};
</script>

<style type="text/css" scoped>
#form {
  display: flex;
  padding: 0;
  flex-direction: row;
  max-height: 100vh;
  overflow: hidden;
  /* position: fixed;
  top: 0;
  height: 100vh;
  width: calc(100vw - 397.23px); */
}

#mainview {
  background: white;
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
  min-width: 260px;
  padding: 16px 0;
  margin-right: 16px;
  backdrop-filter: blur(16px);
  border-radius: 2px;
}

.navpanel .navbutton.disabled {
  color: rgb(120, 120, 120) !important;
  cursor: default;
}

.navpanel .navbutton.active {
  border-left: 4px solid;
  padding-left: 0px;
  color: #00abff !important;
}

.navpanel .navbutton {
  width: 100%;
  height: 32px;
  display: flex;
  align-items: center;
  color: rgb(210, 210, 210);
  margin: 6px 0;
  padding-left: 4px;
  cursor: pointer;
  font-weight: bold;
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
}

.gamemenu_uninstallButton * {
  color: #ff5252 !important;
}
</style>