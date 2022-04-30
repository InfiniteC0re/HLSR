<template>
  <div class="install-menu">
    <h1 v-if="game">
      {{ $localisation.get("#UI_INSTALLING_GAME") }}{{ game.name }}
    </h1>
    <div class="content">
      <div class="path">
        <p>{{ $localisation.get("#UI_HLSR_LIB_WILL_BE_PLACED") }}</p>
        <div class="path-button">
          <p>{{ selectedPath }}</p>
          <div
            class="button"
            @click="selectFolder"
            :class="{
              disabled: disallowedToChangePath,
            }"
          >
            <i class="far fa-folder"></i>
            <md-tooltip md-direction="left" v-if="disallowedToChangePath">{{
              $localisation.get("#REMOVE_GAMES_TO_CHANGE")
            }}</md-tooltip>
          </div>
        </div>
      </div>
      <p>{{ $localisation.get("#UI_DOWNLOADABLE_CONTENT") }}</p>
      <ul v-if="game">
        <li v-for="(feature, i) in game.info.features" v-bind:key="i">
          {{ $localisation.get(feature) }}
        </li>
      </ul>
      <div class="space-info" v-if="game">
        <p :class="{ red: noSpace }">
          {{ $localisation.get("#UI_FREE_SPACE") }} {{ freeSpace }} MB
        </p>
        <p>
          {{ $localisation.get("#UI_SPACE_REQUIRED_AFTER") }}
          {{ game.info.totalSize }} MB
        </p>
        <p>
          {{ $localisation.get("#UI_SPACE_REQUIRED_TO") }}
          {{ game.info.totalSize + game.info.archiveSize }} MB
        </p>
      </div>

      <div class="progress-wrap" v-if="installing">
        <div class="status">
          <div class="left">
            {{ $localisation.get("#UI_PROGRESS") }} {{ progress }}%
          </div>
          <div class="right">
            {{ status }}
          </div>
        </div>
        <div class="progress">
          <div class="bar" :style="{ flex: progress / 100 }"></div>
        </div>
      </div>
      <div class="buttons" v-if="!installing">
        <AltButton :red="true" @click="cancel" :disabled="installed">
          <span>{{ $localisation.get("#UI_CANCEL") }}</span>
          <i class="far fa-ban"></i>
        </AltButton>
        <AltButton @click="startInstall" :disabled="installDisabled">
          <span>{{
            !installed
              ? $localisation.get("#UI_INSTALL")
              : $localisation.get("#UI_DONE")
          }}</span>
          <i class="fal fa-arrow-right"></i>
        </AltButton>
      </div>
    </div>
  </div>
</template>

<script>
const remote = require("@electron/remote");
import { ipcRenderer } from "electron";
import AltButton from "@/components/Elements/Button";
import Store from "@/scripts/Store.js";
import StoreDefaults from "@/scripts/StoreDefaults.js";
import GameControl from "@/scripts/GameControl";

const store = new Store({
  configName: "library",
  defaults: StoreDefaults.library,
});

export default {
  components: {
    AltButton,
  },
  data() {
    return {
      canceled: false,
      installed: false,
      installing: false,
      canChangeFolder: false,
      game: null,
      freeSpace: 0,
      noSpace: false,
      selectedPath: "",
      status: "",
      progress: 0,
      installDisabled: true,
    };
  },
  computed: {
    disallowedToChangePath() {
      return (
        this.installing ||
        !this.canChangeFolder ||
        this.canceled ||
        this.installed
      );
    },
  },
  mounted() {
    this.game = this.$parent.game;

    let installed = store.get("installed");

    this.selectedPath = GameControl.getLibraryPath(store);
    this.checkInstallAvailability().catch(this.handleAvailabilityErrors);

    if (Object.keys(installed).length == 0) this.canChangeFolder = true;
  },
  methods: {
    cancel() {
      this.$emit("cancel");
    },
    checkFreeSpace() {
      return new Promise((resolve, reject) => {
        let diskSpaceInfo = ipcRenderer.sendSync(
          "GetDiskFreeSpaceMbytes",
          this.selectedPath
        );

        this.freeSpace = diskSpaceInfo.TotalNumberOfFreeBytes;

        if (
          diskSpaceInfo.Result == 1 &&
          this.freeSpace -
            (this.game.info.totalSize + this.game.info.archiveSize) >=
            100
        ) {
          resolve();
        } else {
          reject(diskSpaceInfo.Result);
        }
      });
    },
    handleAvailabilityErrors(e) {
      switch (e.status) {
        case 1: // No Permissions
          break;
        case 2: // No Free Space
          break;
        case 3: // WinApi Error
          break;
        case 4: // Not Empty Folder
          this.$store.commit("createNotification", {
            text: this.$localisation.get(
              this.$localisation.get("#FOLDER_NOT_EMPTY")
            ),
            type: 1,
          });
          break;
        case 5: // Cyrillic Symbols
          this.$store.commit("createNotification", {
            text: this.$localisation.get("#INSTALLATION_CYRILLIC"),
            type: 1,
          });
          break;
      }
    },
    checkInstallAvailability() {
      return new Promise((res, rej) => {
        this.installDisabled = true;

        if (/[а-яА-ЯЁё]/.test(this.selectedPath)) {
          return rej({ status: 5 }); // Cyrillic Symbols
        }

        this.testPermissions(this.selectedPath)
          .then(() => {
            this.checkFreeSpace()
              .then(() => {
                // if (
                //   require("fs").readdirSync(this.selectedPath).length != 0 &&
                //   GameControl.getInstalledCount(store) == 0
                // ) {
                //   return rej({ status: 4 }); // Folder is not Empty
                // }

                this.installDisabled = false;
                return res();
              })
              .catch((getSpaceStatus) => {
                this.noSpace = true;
                return rej({ status: getSpaceStatus == 1 ? 2 : 3 }); // 2 - No Free Space; 3 - WinApi Error
              });
          })
          .catch(() => {
            rej({ status: 1 }); // No Permissions
          });
      });
    },
    unbindEvents() {
      ipcRenderer.removeAllListeners("progress-update");
      ipcRenderer.removeAllListeners("game-installed");
    },
    startInstall() {
      if (this.installed) {
        this.$parent.refresh();
        this.$parent.installationWindow = false;
        return;
      }

      ipcRenderer.on("progress-update", this.progressUpdate);

      this.checkInstallAvailability()
        .then(() => {
          this.installing = true;
          this.status = this.$localisation.get("#UI_DOWNLOADING");
          this.$store.state.sidebarBlocked = true;
          let gameId = this.game.id;

          // Start the download
          ipcRenderer.send("download-game", { gameId });

          ipcRenderer.once("download-game-reply", (e, reply) => {
            if (reply.status == 0) {
              this.status = this.$localisation.get("#UI_EXTRACTING");
              this.progress = 0;

              ipcRenderer.once("unpack-game-reply", (e, unpackReply) => {
                this.unbindEvents();
                this.installed = true;
                this.installing = false;
                this.$store.state.sidebarBlocked = false;

                if (unpackReply.status == 0) {
                  let libPath = GameControl.getLibraryPath(store);
                  let installed = store.get("installed");

                  if (!installed[gameId]) installed[gameId] = { inGameTime: 0 };
                  installed[gameId].installed = true;
                  installed[gameId].directory = libPath;

                  store.set("installed", installed);

                  new Notification("HLSR", {
                    body: this.$localisation.get(
                      "#UI_NOTIFICATION_INSTALLED",
                      this.game
                    ),
                  });
                }
              });
            } else if (reply.status == 1) {
              this.unbindEvents();
              this.installed = true;
              this.installing = false;
              this.canceled = true;
              this.$store.state.sidebarBlocked = false;

              this.$store.commit("createNotification", {
                text: this.$localisation.get(
                  this.$localisation.get("#UNABLE_TO_DOWNLOAD", this.game.name)
                ),
                type: 1,
                lifetime: 0,
              });
            }
          });

          // ipcRenderer.once("game-download-complete", (e) => {
          //   let libraryPath = GameControl.getLibraryPath(store);

          //   ipcRenderer.once("game-installed", (e) => {
          //     // Game was unpacked
          //     let installed = store.get("installed");

          //     if (!installed[this.game.id]) installed[this.game.id] = {};
          //     installed[this.game.id].installed = true;
          //     installed[this.game.id].directory = libraryPath;

          //     store.set("installed", installed);

          //     new Notification("HLSR", {
          //       body: this.$localisation.get(
          //         "#UI_NOTIFICATION_INSTALLED",
          //         this.game
          //       ),
          //     });

          //     this.installed = true;
          //     this.installing = false;
          //     this.$store.state.sidebarBlocked = false;

          //     ipcRenderer.removeAllListeners("progress-update");
          //     ipcRenderer.removeAllListeners("game-canceled");
          //   });
          // });
        })
        .catch(this.handleAvailabilityErrors);
    },
    progressUpdate(e, percent) {
      this.progress = Math.round(percent);
    },
    testPermissions(dir) {
      return new Promise((resolve, reject) => {
        if (require("fs").existsSync(dir)) {
          try {
            require("fs").writeFileSync(
              dir + "/permissions_test.txt",
              "permissions test"
            );
          } catch (e) {
            this.$store.commit("createNotification", {
              text: this.$localisation.get(
                this.$localisation.get("#ERROR_NO_WRITE_PERMISSIONS")
              ),
              type: 1,
            });

            reject();
            return;
          }
        } else {
          this.$store.commit("createNotification", {
            text: this.$localisation.get(
              this.$localisation.get("#PATH_NOT_EXISTS")
            ),
            type: 1,
          });

          reject();
          return;
        }

        require("fs").unlinkSync(dir + "/permissions_test.txt");
        resolve();
      });
    },
    selectFolder() {
      if (!this.disallowedToChangePath) {
        let eWindow = remote.getCurrentWindow();
        remote.dialog
          .showOpenDialog(eWindow, {
            properties: ["openDirectory"],
            title: this.$localisation.get("#SELECT_LIBRARY_FOLDER"),
          })
          .then((result) => {
            if (result.canceled == true) return;

            let newLibDir = result.filePaths[0];

            if (!require("fs").existsSync(newLibDir)) {
              this.$store.commit("createNotification", {
                text: this.$localisation.get(
                  this.$localisation.get("#PATH_NOT_EXISTS")
                ),
                type: 1,
              });

              return (this.installDisabled = true);
            }

            this.selectedPath = newLibDir;

            this.checkInstallAvailability()
              .then(() => {
                store.set("libraryPath", newLibDir);
              })
              .catch(this.handleAvailabilityErrors);
          });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.install-menu {
  position: absolute;
  left: 16px;
  right: 16px;
  bottom: 0;
  border-radius: 32px 32px 0 0;
  background: rgb(34, 34, 34);
  color: rgba(255, 255, 255, 0.6);
  padding: 40px;
  padding-bottom: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 16px rgba(0, 0, 0, 0.4);
  animation: appear 0.3s forwards;

  @keyframes appear {
    0% {
      opacity: 0;
      transform: translateY(100%);
    }

    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  h1 {
    color: rgba(255, 255, 255, 0.7);
    font-size: 1.6rem;
    text-align: center;
  }

  .content {
    margin: 8px;
    margin-top: 24px;
    display: flex;
    flex-direction: column;
    height: 100%;

    .path {
      margin: 8px 0;
      margin-bottom: 16px;

      .path-button {
        height: 42px;
        margin-top: 4px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 6px;
        display: flex;
        align-items: center;
        overflow: hidden;

        p {
          margin-left: 14px;
          margin-top: 1px;
        }

        .button {
          margin-left: auto;
          height: 100%;
          padding: 0 18px;
          display: flex;
          align-items: center;
          cursor: pointer;
          transition: 0.2s ease;

          &.disabled {
            cursor: default;
          }

          &:hover {
            background: rgba(255, 255, 255, 0.05);
          }

          &.disabled:hover {
            background: none;
          }
        }
      }
    }

    .space-info {
      margin: 16px 0;
      color: rgba(255, 255, 255, 0.3);
      margin-bottom: 8px;

      .red {
        color: #ff4949;
      }
    }

    .progress-wrap {
      margin-top: 4px;

      .status {
        margin: 6px 0;
        opacity: 0.4;
        display: flex;

        .right {
          margin-left: auto;
        }
      }

      .progress {
        display: flex;
        width: 100%;
        height: 6px;
        border-radius: 4px;
        opacity: 1;
        background: rgba(255, 255, 255, 0.1);

        .bar {
          flex: 0;
          background: var(--accent-color);
          position: relative;
          border-radius: 4px;
          transition: 0.1s ease;
        }
      }
    }

    .buttons {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: 12px;
      margin-top: 4px;
    }
  }
}
</style>
