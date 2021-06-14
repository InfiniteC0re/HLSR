<template>
  <div id="backgroundtheme" :class="{ blur }">
    <canvas class="blobsTheme" v-show="hideBackground"></canvas>
    <div
      v-if="!hideBackground"
      class="background"
      :style="{ backgroundImage: `url(${background})` }"
    ></div>
  </div>
</template>

<script>
import Store from "../scripts/Store.js";
import StoreDefaults from "../scripts/StoreDefaults.js";

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
      hideBackground: false,
    };
  },
  methods: {
    updateTheme() {
      if (store.get("config").mlpMode && store.get("config").theme == 3) {
        this.blur = true;
      } else {
        this.blur = false;
      }

      this.hideBackground = false;
      if (this.$store.state.blobs) this.$store.state.blobs.stop();

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
          if (this.blur) {
            if (Math.random() >= 0.5)
              this.background = require("@/assets/mlp.gif");
            else this.background = require("@/assets/mlp2.gif");
          } else this.background = require("@/assets/lancer.jpg");
          break;
        case 4:
          this.blur = true;
          this.hideBackground = true;
          if (this.$store.state.blobs) this.$store.state.blobs.start(this.$store);
          break;
      }
    },
  },
  computed: {
    blobs() {
      return this.$store.state.blobs;
    }
  },
  watch: {
    /* eslint-disable */
    blobs(newVal, oldVal) {
      if (oldVal == null && store.get("config").theme == 4)
        this.updateTheme();
    }
    /* eslint-enable */
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

#backgroundtheme::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(23, 46, 86, 0.7);
  z-index: 1;
}

#backgroundtheme.blur::after {
  backdrop-filter: blur(48px);
}

.blobsTheme {
  position: absolute;
}
</style>

