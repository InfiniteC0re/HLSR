<template>
  <div id="frame">
    <button class="animated" v-if="updateAvailable">
      <i class="fas fa-sync-alt"></i>
    </button>
    <ul class="debugbuttons" v-if="$isDebug">
      <button @click="showDevTools">
        <i class="fab fa-dev"></i>
      </button>
    </ul>
    <button @click="remote.getCurrentWindow().minimize()">
      <i class="fal fa-minus"></i>
    </button>
    <button class="red" @click="remote.getCurrentWindow().close()">
      <i class="fal fa-times"></i>
    </button>
  </div>
</template>

<script>
const remote = require("@electron/remote");

export default {
  data: () => ({
    remote,
  }),
  computed: {
    updateAvailable() {
      return this.$parent.updateAvailable > 0;
    },
    updateState() {
      switch (this.$parent.updateAvailable) {
        case 0:
          return "";
        case 1:
          return this.$t("#UI_UPDATE_DOWNLOADING");
        case 2:
          return this.$t("#UI_UPDATE_READY");
      }
    },
  },
  methods: {
    showDevTools() {
      remote.getCurrentWindow().webContents.openDevTools({
        mode: "undocked",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
#frame {
  -webkit-app-region: drag;
  height: 32px;
  width: 100%;
  z-index: 9999;
  display: flex;
  background: transparent;
  justify-content: flex-end;

  button {
    -webkit-app-region: no-drag;
    height: 32px;
    width: 48px;
    background: none;
    border: none;
    outline: none;
    color: rgb(255, 255, 255, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    z-index: 1;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;

      &.red {
        background: rgb(255, 0, 76);
      }
    }

    &.animated {
      font-size: 1.1rem;

      @keyframes rotate {
        0% {
          transform: rotateZ(0);
        }

        100% {
          transform: rotateZ(360deg);
        }
      }

      i {
        animation: rotate 2s linear infinite;
      }
    }
  }
}
</style>
