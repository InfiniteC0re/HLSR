<template>
  <md-dialog
    :md-active.sync="show"
    :mdClickOutsideToClose="first == false || third == true"
    :mdCloseOnEsc="false"
  >
    <md-dialog-title>{{
      localization.get("#UI_GAME_INSTALL")
    }}</md-dialog-title>
    <md-steppers :md-active-step.sync="active" md-alternative md-linear>
      <md-step
        id="first"
        :md-label="localization.get('#UI_INSTALL_SETTINGS')"
        :md-editable="false"
        :md-done.sync="first"
      >
        <p>{{ localization.get("#UI_INSTALLATION", game) }}</p>
        <ul>
          <li v-for="item in items" :key="item._id">{{ item }}</li>
        </ul>
        <div style="display: flex; align-items: center; margin-bottom: 8px">
          <span style="margin-top: auto; margin-left: 8px; opacity: 0.2"
            >{{ localization.get("#UI_SPACE_REQUIRED") }} {{ memory }} MB</span
          >
          <md-button
            class="md-primary md-raised"
            style="margin-left: auto"
            @click="setDone('first', 'second')"
            >{{ localization.get("#UI_NEXT") }}</md-button
          >
        </div>
        <md-progress-bar
          class="md-primary"
          md-mode="indeterminate"
        ></md-progress-bar>
      </md-step>

      <md-step
        id="second"
        :md-label="localization.get('#UI_INSTALL_STATUS')"
        :md-editable="false"
        :md-done.sync="second"
      >
        <div style="display: flex; align-items: center; margin-bottom: 8px">
          <span style="margin-top: auto; margin-left: 8px; opacity: 0.2"
            >{{ localization.get("#UI_PROGRESS") }} {{ progress }}%</span
          >
          <span
            style="
              margin-top: auto;
              margin-left: auto;
              margin-right: 8px;
              opacity: 0.2;
            "
            v-if="progress != 100"
            >{{ status }}</span
          >
          <span
            style="margin-top: auto; margin-left: auto; margin-right: 8px"
            v-if="unpacked == true"
          >
            <md-button
              class="md-primary md-raised"
              style="margin-left: auto"
              @click="setDone('second', 'third')"
              >{{ localization.get("#UI_NEXT") }}</md-button
            >
          </span>
        </div>
        <md-progress-bar
          md-mode="determinate"
          :md-value="progress"
        ></md-progress-bar>
      </md-step>

      <md-step
        id="third"
        :md-label="localization.get('#UI_INSTALL_FINISH')"
        :md-editable="false"
        :md-done.sync="third"
      >
        <div style="display: flex; align-items: center">
          <p style="opacity: 0.2">
            {{ localization.get("#UI_NOTIFICATION_INSTALLED", this.game) }}
          </p>
          <span
            style="margin-top: auto; margin-left: auto; margin-right: 8px"
            v-if="unpacked == true"
          >
            <md-button
              class="md-primary md-raised"
              style="margin-left: auto"
              @click="show = false"
              >{{ localization.get("#UI_DONE") }}</md-button
            >
          </span>
        </div>
      </md-step>
    </md-steppers>
  </md-dialog>
</template>

<script type="text/javascript">
import { ipcRenderer } from "electron";
import Store from "@/scripts/Store.js";
import StoreDefaults from "@/scripts/StoreDefaults.js";
import GameList from "@/GameList";
import GameControl from "@/scripts/GameControl";

const path = require("path");
const onezip = require("onezip");

const store = new Store({
  configName: "library",
  defaults: StoreDefaults.library,
});

export default {
  name: "game-install",
  components: {},
  data() {
    return {
      active: "first",
      show: false,
      first: false,
      second: false,
      third: false,
      items: [],
      game: "",
      memory: 0,
      progress: 0,
      unpacked: false,
      status: null,
      appid: null,
      localization: this.$parent.localization,
    };
  },
  methods: {
    setDone(id, index) {
      this[id] = true;

      if (index) this.active = index;

      if (id == "first") {
        // Скачивание игры
        let game = GameList.find((t) => t.id == this.appid);
        if (!game) return;

        this.status = this.localization.get("#UI_DOWNLOADING");

        let info = {
          url: game.info.url,
          properties: {
            directory: GameControl.getTempPath(store),
          },
        };

        // Начать загрузку
        ipcRenderer.send("game-download", info);

        ipcRenderer.once("game-download-complete", (e, l_path) => {
          let game = GameList.find((t) => t.id == this.appid);
          if (!game) return;

          let install_path = GameControl.getLibraryPath(store);

          this.status = this.localization.get("#UI_EXTRACTING");
          this.progress = 0;

          let extract_path = install_path;

          if (!game.info.isStandalone)
            extract_path = path.join(extract_path, game.info.installPath);

          const extract = onezip.extract(l_path, extract_path);

          extract.on("progress", (percent) => {
            this.progress = percent;
            require("electron")
              .remote.getCurrentWindow()
              .setProgressBar(percent / 100);
          });

          extract.on("end", () => {
            let installed = store.get("installed");

            if (!installed[this.appid]) installed[this.appid] = {};
            installed[this.appid].installed = true;
            installed[this.appid].directory = install_path;

            store.set("installed", installed);

            new Notification("HLSR", {
              body: this.localization.get(
                "#UI_NOTIFICATION_INSTALLED",
                this.game
              ),
            });

            this.unpacked = true;
            this.$parent.$refs.navbar.goTo("game", {
              id: this.appid,
              refresh: true,
            });

            let window = require("electron").remote.getCurrentWindow();
            if (!window.isDestroyed()) window.setProgressBar(0);

            ipcRenderer.removeAllListeners("game-download-progress");
          });
        });

        ipcRenderer.on("game-download-progress", this.progressUpdate);
      }
    },
    progressUpdate(e, data) {
      this.progress = Math.round(data.percent * 100);
    },
    open(appid) {
      let game = GameList.find((t) => t.id == appid);
      if (!game) return;

      this.active = "first";
      this.show = false;
      this.first = false;
      this.second = false;
      this.third = false;
      this.unpacked = false;
      this.progress = 0;

      if (!GameControl.checkInstalled(store, appid)) {
        if (
          game.info.isStandalone ||
          GameControl.checkInstalled(store, game.info.requiredGame)
        ) {
          this.show = true;
        } else {
          this.$parent.$refs.navbar.goTo("game", {
            id: game.info.requiredGame,
          });
          return this.open(game.info.requiredGame);
        }

        this.game = game.name;

        switch (appid) {
          case "70":
            this.memory = 429;
            this.items = [
              this.localization.get("#UI_WON"),
              this.localization.get("#UI_STEAM"),
              "Edited DLL with HUD settings",
              "Bunnymod XT",
              "LiveSplit with splits",
              "RInput",
            ];
            break;
          case "50":
            this.memory = 513;
            this.items = [
              this.localization.get("#UI_WON"),
              this.localization.get("#UI_STEAM"),
              "Bunnymod XT",
              "LiveSplit with splits",
              "RInput",
            ];
            break;
          case "130":
            this.memory = 285;
            this.items = [
              this.localization.get("#UI_STEAM"),
              "Bunnymod XT",
              "LiveSplit with splits",
              "RInput",
            ];
            break;
          case "220":
            this.memory = 3464;
            this.items = [
              "Source Unpack (New Engine)",
              "Source Pause Tool",
              "LiveSplit with splits",
              "RInput",
            ];
          case "218":
            this.memory = 4933;
            this.items = [
              "Ghosting Mod",
              "Cutsceneless Mod",
              "Half-Life 1 Movement Mod",
              "LiveSplit with splits",
              "RInput",
            ];
        }

        this.appid = appid;

        // Check if any games are already installed and offer to set an installation path if not
        let installed = store.get("installed");

        if (Object.keys(installed) == 0) {
          let eWindow = require("electron").remote.getCurrentWindow();
          require("electron")
            .remote.dialog.showOpenDialog(eWindow, {
              properties: ["openDirectory"],
              title: this.localization.get("#SELECT_LIBRARY_FOLDER"),
            })
            .then((result) => {
              if (result.canceled == true) {
                this.$store.commit("createNotification", {
                  text: this.localization.get(
                    this.localization.get("#INSTALLATION_CANCELED")
                  ),
                  type: 1,
                });

                return (this.show = false);
              }

              let newLibDir = result.filePaths[0];

              if (!require("fs").existsSync(newLibDir)) {
                this.$store.commit("createNotification", {
                  text: this.localization.get(
                    this.localization.get("#PATH_NOT_EXISTS")
                  ),
                  type: 1,
                });

                return (this.show = false);
              }

              if (require("fs").readdirSync(newLibDir).length == 0) {
                // Folder is empty

                const cyrillicPattern = /[а-яА-ЯЁё]/;

                if (cyrillicPattern.test(newLibDir)) {
                  // Cyrillic symbols were found

                  this.$store.commit("createNotification", {
                    text: this.localization.get("#INSTALLATION_CYRILLIC"),
                    type: 1,
                  });

                  return (this.show = false);
                } else {
                  // Everything is okay

                  this.$store.commit("createNotification", {
                    text: "Okay",
                  });

                  store.set("libraryPath", newLibDir);
                }
              } else {
                // Folder isn't empty

                this.$store.commit("createNotification", {
                  text: this.localization.get(
                    this.localization.get("#FOLDER_NOT_EMPTY")
                  ),
                  type: 1,
                });

                return (this.show = false);
              }
            });
        }
      }
    },
  },
};
</script>