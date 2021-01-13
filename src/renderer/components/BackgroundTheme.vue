<template>
  <div id="backgroundtheme">
    <div
      class="background"
      :class="{ blur }"
      :style="{ backgroundImage: `url(${background})` }"
    ></div>
  </div>
</template>

<script>
import Store from "../utils/Store.js";
import StoreDefaults from "../utils/StoreDefaults.js";

const store = new Store({
  configName: "settings",
  defaults: StoreDefaults.settings,
});

export default {
  name: "Background-Theme",
  components: {},
  data() {
    return {
      background: require("@/assets/gradient.jpg"),
      blur: false,
    };
  },
  methods: {
    updateTheme() {
      if (store.get("config").mlpMode && store.get("config").theme == 4) {
        this.blur = true;
      }

      switch (store.get("config").theme) {
        case 0:
          this.background = require("@/assets/gradient.jpg");
          break;
        case 1:
          this.background = require("@/assets/blue.jpg");
          break;
        case 2:
          this.background = require("@/assets/red.jpg");
          break;
        case 3:
          let hours = new Date().getHours();
          if (hours > 8 && hours < 15)
            this.background = require("@/assets/snow2.jpg");
          else this.background = require("@/assets/snow.jpg");
          break;
        case 4:
          if (this.blur) {
            if (Math.random() >= 0.5)
              this.background = require("@/assets/mlp.gif");
            else this.background = require("@/assets/mlp2.gif");
          } else this.background = require("@/assets/lancer.jpg");
          break;
        case 5:
          this.background = require("@/assets/lancer.jpg");
          break;
      }
    },
  },
  mounted() {
    this.updateTheme();
  },
};
</script>

<style scoped>
#backgroundtheme {
  height: 100%;
  width: 100%;
  display: flex;
  overflow: hidden;
  z-index: -5;
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.background {
  background-position: center !important;
  background-size: cover !important;
  z-index: 1;
  height: 100%;
  width: 100%;
  position: relative;
}

.background::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(23, 46, 86, 0.7);
}

.background.blur::before {
  backdrop-filter: blur(24px);
}
</style>

