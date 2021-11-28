<template>
  <div id="frame" @dblclick="bardbl">
    <div style="display: flex">
      <div
        class="framebutton animated"
        @click="() => {}"
        v-if="updateAvailable"
      >
        <i class="fas fa-sync-alt"></i>
      </div>
      <ul class="debugbuttons" v-if="isDev">
        <router-link to="/debug/hlsd">
          <div class="framebutton" @click="showDebugMenu">
            <i class="fas fa-database"></i>
          </div>
        </router-link>
        <div class="framebutton" @click="showDevTools">
          <i class="fab fa-dev"></i>
        </div>
      </ul>
      <div class="framebutton" @click="remote.getCurrentWindow().minimize()">
        <i class="fal fa-minus"></i>
      </div>
      <div class="framebutton close" @click="remote.getCurrentWindow().close()">
        <i class="fal fa-times"></i>
      </div>
    </div>
  </div>
</template>

<script>
const remote = require("@electron/remote");

export default {
  data: () => ({
    isDev: process.env.WEBPACK_DEV_SERVER === "true",
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
          return this.$localisation.get("#UI_UPDATE_DOWNLOADING");
        case 2:
          return this.$localisation.get("#UI_UPDATE_READY");
      }
    },
  },
  methods: {
    bardbl(e) {
      e.preventDefault();
    },
    showDebugMenu() {
      this.$store.commit("checkHLSRC");
    },
    showDevTools() {
      remote.getCurrentWindow().webContents.openDevTools({
        mode: "undocked",
      });
    },
  },
};
</script>

<style scoped>
#frame {
  height: 32px;
  width: 100%;
  -webkit-app-region: drag;
  background: transparent;
  z-index: 999999;
  display: flex;
  justify-content: flex-end;
}

.framebutton {
  height: 32px;
  width: 48px;
  color: rgb(255, 255, 255, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  z-index: 1;
  -webkit-app-region: no-drag;
}

.animated {
  font-size: 1.1rem;
}

.animated i {
  animation: rotate 2s linear infinite;
}

@keyframes rotate {
  0% {
    transform: rotateZ(0);
  }

  100% {
    transform: rotateZ(360deg);
  }
}

.framebutton:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.framebutton.close:hover {
  background: rgb(255, 0, 76);
  color: white;
}

.debugbuttons {
  display: contents;
}
</style>