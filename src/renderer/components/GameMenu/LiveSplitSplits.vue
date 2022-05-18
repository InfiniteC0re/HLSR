<template>
  <div id="wrap">
    <div class="title">{{ $t("#UI_LIVESPLIT_SPLITS") }}</div>
    <div class="buttons">
      <button @click="changeSplits">
        <i class="fal fa-file-search"></i>
        {{ $t("#UI_LIVESPLIT_SELECT_FILE") }}
      </button>
      <button @click="update">
        <i class="fal fa-sync"></i>
        {{ $t("#UI_LIVESPLIT_UPDATE") }}
      </button>
      <button @click="switchTimeMode">
        <i class="fal fa-stopwatch"></i>
        {{ timeButtonText }}
      </button>
    </div>
    <div class="info" v-if="splits && splits.liveSplitStatus == 0">
      <div class="stats">
        <h3>{{ splits.splitsInfo.gameName }}</h3>
        <h4>{{ splits.splitsInfo.categoryName }}</h4>
        <h4 class="attempts">{{ splits.splitsInfo.attemptCount }}</h4>
      </div>
      <div class="table-wrap">
        <table>
          <tr>
            <th class="full-width left">{{ $t("#UI_SEGMENT_NAME") }}</th>
            <th class="right">{{ $t("#UI_BEST_SEGMENT") }}</th>
            <th class="right">{{ $t("#UI_TIME") }}</th>
          </tr>
          <tr v-for="segment in segments" v-bind:key="segment._id">
            <td class="left">{{ segment.name }}</td>
            <td class="right">
              {{
                formatTime(
                  segment[
                    timeMode == 1 ? "bestGameTime" : "bestRealTime"
                  ].split(".")[0]
                )
              }}
            </td>
            <td class="right">
              {{
                formatTime(
                  segment[timeMode == 1 ? "gameTime" : "realTime"].split(".")[0]
                )
              }}
            </td>
          </tr>
        </table>
      </div>
    </div>
    <div class="info" v-else-if="!splits">
      <div class="stats">
        <h4 class="error">{{ $t("#UI_LIVESPLIT_LOADING") }}</h4>
      </div>
    </div>
    <div class="info" v-else-if="splits && splits.liveSplitStatus != 0">
      <div class="stats">
        <h4 class="error">{{ $t("UI_LIVESPLIT_ERROR") }}</h4>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
const remote = require("@electron/remote");
import { ipcRenderer } from "electron";

import GameControl from "../../utils/GameControl";
import Store from "@/utils/Store";
import StoreDefaults from "@/utils/StoreDefaults";

const store = new Store({
  configName: "library",
  defaults: StoreDefaults.library,
});

export default {
  name: "gamemenu-overview",
  components: {},
  data() {
    return {
      splits: null,
      timeMode: 0,
    };
  },
  props: {
    id: {
      type: String,
      default: "0",
    },
    posts: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    timeButtonText() {
      if (this.timeMode == 0) return this.$t("#UI_LIVESPLIT_REALTIME");
      else return this.$t("#UI_LIVESPLIT_GAMETIME");
    },
    segments() {
      return this.splits.splitsInfo.segments;
    },
  },
  methods: {
    switchTimeMode() {
      this.timeMode = !this.timeMode;
    },
    changeSplits() {
      let filePath = GameControl.getLiveSplitSplitsFile(store, this.id);

      remote.dialog
        .showOpenDialog({
          defaultPath: filePath,
          properties: ["openFile"],
          filters: [{ name: "LiveSplit Splits File", extensions: ["lss"] }],
        })
        .then((event) => {
          if (event.filePaths.length > 0) {
            let filePath = event.filePaths[0];

            this.loadSplits(filePath, (data) => {
              if (data.liveSplitStatus == 0) {
                this.splits = data;

                GameControl.setLiveSplitSplitsFile(store, this.id, filePath);
                this.$store.commit("createNotification", {
                  text: this.$t("#UI_NOTIFICATION_DONE"),
                });
              } else {
                this.$store.commit("createNotification", {
                  text: this.$t("#UI_LIVESPLIT_ERROR"),
                });
              }
            });
          }
        });
    },
    loadSplits(filePath, cb = null) {
      ipcRenderer.send("LiveSplitReadFile", filePath);
      ipcRenderer.once("LiveSplitReadFile_reply", (e, data) => {
        if (cb) cb(data);
      });
    },
    formatTime(time, i = 0) {
      if (time.startsWith("00:"))
        return this.formatTime(time.split("00:").slice(1).join("00:"), i + 1);
      else if (time.startsWith("0"))
        return this.formatTime(time.slice(1), i + 1);
      else if (time == "" && i != 0) return 0;
      else return time;
    },
    update() {
      let filePath = GameControl.getLiveSplitSplitsFile(store, this.id);

      if (filePath) {
        this.loadSplits(filePath, (data) => {
          this.splits = data;
        });
      }
    },
  },
  mounted() {
    this.update();
  },
  destroyed() {
    ipcRenderer.removeAllListeners("LiveSplitReadFile_reply");
  },
};
</script>

<style lang="scss" scoped>
#wrap {
  padding: 0 16px;

  .title {
    color: var(--accent-color) !important;
    font-size: 20px !important;
    font-weight: bold !important;
  }

  .info {
    /* Using Roboto font because it's monospace */
    font-family: Roboto, Arial, Helvetica, sans-serif;

    .stats {
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      margin-top: 12px;
      padding-bottom: 12px;
      position: relative;

      h3 {
        font-size: 0.9rem;
        margin-top: 12px;
      }

      h3,
      h4 {
        font-weight: 400;
        line-height: 18px;
        margin-left: 8px;
      }

      h4 {
        font-size: 0.8rem;
        color: rgb(150, 150, 150);

        &.error {
          margin-top: 8px;
          font-size: 0.8rem;
        }
      }

      .attempts {
        position: absolute;
        right: 0;
        top: 50%;
        margin: 0;
        margin-right: 8px;
        transform: translateY(-50%);
      }
    }

    .table-wrap {
      table {
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        border-spacing: 10px 8px;
        width: 100%;

        tr {
          white-space: nowrap;

          td {
            color: rgb(150, 150, 150);
            transition: 0.1s ease;
          }

          &:hover td {
            color: rgb(190, 190, 190);
          }
        }

        .full-width {
          width: 100%;
        }

        .left {
          text-align: left;
        }

        .right {
          text-align: right;
          font-weight: 500;
        }
      }
    }
  }

  .buttons {
    display: flex;
    margin-top: 16px;
    gap: 8px;

    button {
      color: rgb(170, 170, 170);
      background: rgba(255, 255, 255, 0.06);
      border-radius: 4px;
      border: none;
      outline: none;
      padding: 0 16px;
      height: 36px;
      font-family: Rubik;
      text-transform: uppercase;
      transition: 0.1s;
      display: flex;
      align-items: center;
      cursor: pointer;

      i {
        font-size: 1rem;
        margin-right: 8px;
      }

      &:hover {
        background: rgba(255, 255, 255, 0.1);
        color: #fff;
      }
    }

    &:hover {
      color: rgb(185, 185, 185);
    }

    &:nth-last-child(1) {
      margin-bottom: 0;
    }
  }
}
</style>
