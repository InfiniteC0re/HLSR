<template>
  <div class="sidebar-root" :class="{ blocked }">
    <div class="top">
      <div class="logo" :style="{ color: color }" @dblclick="changeColor">
        <div class="inner" :style="{ backgroundColor: color }"></div>
      </div>
    </div>
    <div class="middle">
      <div class="buttons">
        <div class="sbutton">
          <router-link to="/home">
            <button :class="{ active: $route.name == 'home' }">
              <i class="fas fa-home-lg"></i>
            </button>
          </router-link>
        </div>

        <div class="sbutton" ref="gamesButton">
          <button
            :class="{
              active: $route.name == 'game-menu',
              preActive: showGameList,
            }"
            @click="showGameList = !showGameList"
          >
            <i class="fas fa-play"></i>
          </button>
          <div class="items" :class="{ opened: showGameList }">
            <div
              class="item"
              @click="navigateTo('game', { id: '70' })"
              :class="{ selected: $route.query.id == '70' }"
            >
              <div class="lambda__container">
                <div class="lambda"></div>
              </div>
              Half-Life
              <span class="time">{{
                $t("#UI_SPENT_TIME", getPlayTime("70"))
              }}</span>
            </div>
            <div
              class="item"
              @click="navigateTo('game', { id: '50' })"
              :class="{ selected: $route.query.id == '50' }"
            >
              <div class="lambda__container">
                <div class="lambda green"></div>
              </div>
              Half-Life: Opposing Force
              <span class="time">{{
                $t("#UI_SPENT_TIME", getPlayTime("50"))
              }}</span>
            </div>
            <div
              class="item"
              @click="navigateTo('game', { id: '130' })"
              :class="{ selected: $route.query.id == '130' }"
            >
              <div class="lambda__container">
                <div class="lambda blue"></div>
              </div>
              Half-Life: Blue Shift
              <span class="time">{{
                $t("#UI_SPENT_TIME", getPlayTime("130"))
              }}</span>
            </div>
            <div
              class="item"
              @click="navigateTo('game', { id: '220' })"
              :class="{ selected: $route.query.id == '220' }"
            >
              <div class="lambda__container">
                <div class="lambda orange"></div>
              </div>
              Half-Life 2
              <span class="time">{{
                $t("#UI_SPENT_TIME", getPlayTime("220"))
              }}</span>
            </div>
            <div
              class="item"
              @click="navigateTo('game', { id: '218' })"
              :class="{ selected: $route.query.id == '218' }"
            >
              <div class="lambda__container">
                <div class="lambda orange"></div>
              </div>
              Half-Life 2: Ghosting
              <span class="time">{{
                $t("#UI_SPENT_TIME", getPlayTime("218"))
              }}</span>
            </div>
          </div>
        </div>

        <div
          class="sbutton"
          ref="configButton"
          @click="configList = !configList"
        >
          <button
            :class="{
              active:
                $route.name == 'config-editor' ||
                $route.name == 'config-constructor',
              preActive: configList,
            }"
          >
            <i class="fas fa-align-left"></i>
          </button>
          <div class="items" :class="{ opened: configList }">
            <div
              class="item"
              @click="navigateTo('config-constructor')"
              :class="{ selected: $route.name == 'config-constructor' }"
            >
              {{ $t("#UI_CONFIGS_CONSTRUCTOR") }}
            </div>
            <div
              class="item"
              @click="navigateTo('config-editor')"
              :class="{ selected: $route.name == 'config-editor' }"
            >
              {{ $t("#UI_CONFIGS_ADVANCED") }}
            </div>
          </div>
        </div>

        <div class="sbutton">
          <router-link to="/customization">
            <button :class="{ active: $route.name == 'customization' }">
              <i class="fas fa-sliders-h"></i>
            </button>
          </router-link>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="steam-icon">
        <svg
          width="24"
          height="24"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="steam"
          :class="{ steamActive }"
          @click="reconnectToSteam()"
        >
          <path
            d="M19.6758 9.62501C19.6758 14.8853 15.4343 19.1472 10.2011 19.1472C5.86047 19.1472 2.20639 16.2176 1.08499 12.2206L4.71619 13.7295C4.9603 14.9621 6.04738 15.8951 7.34423 15.8951C8.83943 15.8951 10.0867 14.6511 10.0219 13.073L13.2449 10.7615C15.2322 10.8114 16.899 9.19113 16.899 7.1715C16.899 5.19026 15.297 3.58147 13.325 3.58147C11.353 3.58147 9.75105 5.1941 9.75105 7.1715V7.21757L7.49299 10.5081C6.90178 10.4736 6.322 10.6387 5.83378 10.9727L0.756958 8.86093C1.14602 3.95775 5.22349 0.102783 10.2011 0.102783C15.4343 0.102783 19.6758 4.36475 19.6758 9.62501ZM6.6958 14.5512L5.53245 14.0674C5.74623 14.5143 6.11535 14.8667 6.56993 15.0581C7.59598 15.4881 8.77459 14.9966 9.20179 13.9676C9.40776 13.4685 9.41158 12.9194 9.20561 12.4202C8.99963 11.9211 8.61439 11.5295 8.11853 11.3221C7.62649 11.1148 7.10012 11.1225 6.63478 11.2991L7.83628 11.7982C8.59151 12.1131 8.95005 12.9847 8.63346 13.7449C8.31688 14.509 7.45103 14.8661 6.6958 14.5512ZM13.325 9.56357C12.0129 9.56357 10.9449 8.48848 10.9449 7.1715C10.9449 5.85451 12.0129 4.77942 13.325 4.77942C14.6372 4.77942 15.7052 5.85451 15.7052 7.1715C15.7052 8.48848 14.641 9.56357 13.325 9.56357ZM13.3288 8.9646C14.3168 8.9646 15.1178 8.15828 15.1178 7.16766C15.1178 6.1732 14.3168 5.37072 13.3288 5.37072C12.3409 5.37072 11.5399 6.17704 11.5399 7.16766C11.5438 8.15828 12.3448 8.9646 13.3288 8.9646Z"
            fill="white"
          />
        </svg>
        <md-tooltip v-if="!steamActive" md-direction="right">{{
          $t("#UI_STEAM_RECONNECT")
        }}</md-tooltip>
      </div>

      <router-link to="/settings">
        <button>
          <i class="fas fa-cog"></i>
        </button>
      </router-link>
      <div class="info">
        <p>v{{ version }}</p>
        <p>BETA BUILD</p>
      </div>
    </div>
  </div>
</template>

<script>
import Store from "@/utils/Store.js";
import StoreDefaults from "@/utils/StoreDefaults.js";

const store = new Store({
  configName: "library",
  defaults: StoreDefaults.library,
});

const storeSettings = new Store({
  configName: "settings",
  defaults: StoreDefaults.settings,
});

export default {
  data() {
    return {
      showGameList: false,
      configList: false,
      color: "white",
      version: null,
      c: 0,
    };
  },
  methods: {
    changeColor() {
      let config = storeSettings.get("config");

      if (this.c >= 2 && !config.mlpMode) {
        config.mlpMode = true;
        storeSettings.set("config", config);
        this.$store.commit("createNotification", {
          text: "My Little Pony!",
        });
      }

      this.color = `rgb(${Math.floor(Math.random() * 250)}, ${Math.floor(
        Math.random() * 250
      )}, ${Math.floor(Math.random() * 250)})`;

      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.color = "white";
        this.c += 1;
      }, 1500);
    },
    getPlayTime(gameid) {
      let config = store.get("config");

      if (config[gameid] && config[gameid].inGameTime)
        return (config[gameid].inGameTime / 3600000)
          .toFixed(1)
          .replace(".", ",");
      else return 0;
    },
    reconnectToSteam() {
      if (!this.steamActive) {
        this.$parent.steamRetry();
      }
    },
    navigateTo(path, query) {
      let router = this.$router;
      let route = this.$route;

      this.showGameList = false;

      if (!query) query = {};
      if (route.path != "/" + path) return router.push({ path, query });

      if (route.query.id != query.id || query.refresh) {
        router.push({
          query: {
            id: query.id,
            time: Date.now(),
            section: query.section,
            install: query.install,
          },
        });
      }
    },
    clickHandle(e) {
      if (!e.path.includes(this.$refs.gamesButton)) this.showGameList = false;
      if (!e.path.includes(this.$refs.configButton)) this.configList = false;
    },
  },
  computed: {
    steamActive() {
      return this.$store.state.steamworks.started;
    },
    blocked() {
      return this.$store.state.sidebarBlocked;
    },
  },
  mounted() {
    document.addEventListener("click", this.clickHandle);

    let root = document.documentElement;
    root.style.setProperty("--sidebar-width", "90px");

    this.version = require("../../../package.json").version;
  },
  beforeDestroy() {
    document.removeEventListener("click", this.clickHandle);
  },
};
</script>

<style lang="scss" scoped>
.sidebar-root {
  min-width: 90px;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 9;

  @keyframes button-became-active {
    0% {
      transform: scale(1);
    }

    50% {
      transform: scale(0.95);
    }

    100% {
      transform: scale(1);
    }
  }

  &.blocked {
    .middle,
    .bottom {
      opacity: 0.2;
      pointer-events: none;
    }
  }

  &::before {
    content: "";
    position: absolute;
    top: -32px;
    width: 100%;
    height: 100vh;
    backdrop-filter: blur(48px);
  }

  .bottom {
    z-index: 1;
    position: absolute;
    left: 0;
    bottom: 0px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: 0.2s opacity ease;

    button {
      width: 46px;
      height: 46px;
      font-size: 19px;
      border: none;
      background: var(--accent-color);
      outline: none;
      border-radius: 8px;
      color: #fff;
      margin-bottom: 16px;
      cursor: pointer;
      transition: 0.1s ease;

      &:active {
        transform: scale(0.95);
      }

      &:hover {
        background: #1fb4ff;
      }
    }

    .steam-icon {
      margin-bottom: 18px;
      height: 24px;
      cursor: pointer;

      .steam {
        opacity: 0.2;
        transition: 0.2s ease;

        &.steamActive {
          opacity: 1;
          cursor: default;
        }
      }
    }

    .info {
      font-size: 10px;
      color: rgba(255, 255, 255, 0.1);
      line-height: 14px;
      margin-right: 24px;
    }
  }

  .middle {
    z-index: 1;
    transition: 0.2s opacity ease;

    .buttons {
      display: grid;
      grid-template-rows: repeat(3, 70px);
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 50px;

      .sbutton {
        position: relative;
        height: 70px;
        display: flex;
        justify-content: center;
        align-items: center;

        .items {
          display: flex;
          flex-direction: column;
          width: max-content;
          position: absolute;
          background-color: rgba(20, 20, 20, 0.8);
          box-shadow: inset 0 0 0 2px rgb(42, 42, 42);
          backdrop-filter: blur(12px);
          top: 50%;
          left: 76px;
          font-size: 0.9rem;
          line-height: 1px;
          font-weight: 500;
          transform: translate(0, -50%);
          border-radius: 6px;
          opacity: 0;
          transition: 0.15s ease opacity;
          pointer-events: none;

          &.opened {
            pointer-events: all;
            opacity: 1;
          }

          .item {
            cursor: pointer;
            padding: 0px 14px;
            height: 44px;
            text-align: left;
            display: flex;
            align-items: center;
            color: rgba(255, 255, 255, 0.5);
            transition: 0.05s ease;
            width: 100%;
            display: flex;
            align-items: center;
            position: relative;

            &::after {
              content: "";
              position: absolute;
              height: 2px;
              left: 2px;
              right: 2px;
              bottom: 0;
              background: rgba(255, 255, 255, 0.03);
            }

            &:nth-last-child(1)::after {
              display: none;
            }

            .lambda__container {
              margin-right: 12px;

              .lambda {
                background: url("~@/assets/lambda.svg");
                background-size: cover;
                background-position: center;
                width: 14px;
                height: 14px;
                filter: invert(0.4);
                transition: 100ms ease;
                position: relative;
                opacity: 0.5;
              }

              .lambda {
                filter: invert(0.4) sepia(1) saturate(1.9);
              }

              .lambda.blue {
                filter: invert(0.4) sepia(1) hue-rotate(180deg) saturate(1.9);
              }

              .lambda.green {
                filter: invert(0.4) sepia(1) hue-rotate(90deg) saturate(1.9);
              }

              .lambda.orange {
                filter: invert(0.4) sepia(1) saturate(40);
              }
            }

            span.time {
              margin-left: auto;
              padding-left: 20px;
              color: rgba(255, 255, 255, 0.15);
              font-weight: 100;
              font-size: 0.8rem;
            }

            &:hover {
              color: rgba(255, 255, 255, 0.65);

              .lambda__container {
                .lambda {
                  opacity: 0.6;
                }
              }
            }

            &:active {
              color: #fff;

              .lambda__container {
                .lambda {
                  opacity: 0.8;
                }
              }
            }

            &.selected {
              color: var(--accent-color);
              cursor: default;
              pointer-events: none;

              .lambda__container {
                .lambda {
                  opacity: 1;
                }
              }
            }
          }
        }

        a {
          display: flex;
          justify-content: center;
          align-items: center;
          outline: none;
          cursor: pointer;
        }

        button {
          border: none;
          outline: none;
          background: none;
          font-size: 19px;
          color: rgba(255, 255, 255, 0.15);
          margin: 16px 0;
          transition: 0.1s ease;
          cursor: pointer;

          &:hover {
            color: rgba(255, 255, 255, 0.3);
          }

          &:active, &.preActive {
            color: rgba(255, 255, 255, 0.5);
            transform: scale(1.1);
          }

          &.active {
            background: rgba(0, 171, 255, 0.15);
            color: #fff;
            width: 50px;
            height: 50px;
            border-radius: 8px;
            border: 2px solid var(--accent-color);
            animation: button-became-active 0.3s;

            &:active {
              transform: unset;
            }
          }
        }
      }
    }
  }

  .top {
    .logo {
      width: 48px;
      height: 48px;
      background: transparent;
      background-size: cover;
      border-radius: 50%;
      border: 4px solid;
      color: #fff;
      position: relative;
      transition: 0.5s color;

      .inner {
        width: 20px;
        height: 20px;
        background: white;
        border-radius: 50%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        transition: 0.2s width, 0.2s height, 0.5s background;
      }

      &:hover {
        .inner {
          width: 26px;
          height: 26px;
        }
      }
    }
  }
}
</style>