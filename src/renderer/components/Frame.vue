<template>
  <div id="frame" @dblclick="bardbl">
    <div style="display: flex">
      <div class="framebutton" @click="showDebugMenu" v-if="isDev">
        <i class="fas fa-database"></i>
      </div>
      <div class="framebutton" @click="showDevTools" v-if="isDev">
        <i class="fab fa-dev"></i>
      </div>
      <div
        class="framebutton"
        @click="require('electron').remote.getCurrentWindow().minimize()"
      >
        <i class="fal fa-minus"></i>
      </div>
      <div
        class="framebutton close"
        @click="require('electron').remote.getCurrentWindow().close()"
      >
        <i class="fal fa-times"></i>
      </div>
    </div>
  </div>
</template>

<script>
var isDev = require("process").env.WEBPACK_DEV_SERVER === "true";
export default {
  data: () => ({
    isDev,
  }),
  methods: {
    bardbl(e) {
      e.preventDefault();
    },
    showDebugMenu() {
      this.$store.commit("checkHLSRC");
    },
    showDevTools() {
      require("electron")
        .remote.getCurrentWindow()
        .webContents.toggleDevTools();
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

.framebutton:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.framebutton.close:hover {
  background: rgb(255, 0, 76);
  color: white;
}
</style>