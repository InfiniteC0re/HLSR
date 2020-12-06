<template>
  <div id="wrap">
    <div id="form">
      <div class="title">{{ localization.get("#UI_CUSTOMIZATION") }}</div>
      <GameSelector v-model="selectedGame" />
      <!-- 
        <BackgroundItem v-for="(background, index)" :selected="selectedBackground == index" :image="background.index" v-bind:key="background._id" />
       -->
    </div>
  </div>
</template>

<script>
import Store from "../utils/Store.js";
import StoreDefaults from "../utils/StoreDefaults.js";

import GameSelector from "./Elements/GameSelector";

export default {
  name: "customization",
  components: {
    GameSelector,
  },
  data() {
    return {
      localization: this.$parent.localization,
      selectedGame: 0,
      selectedBackground: 0,
      background: [
        {
          url: require("@/assets/customization/Standard.jpg"),
        },
        {
          url: require("@/assets/customization/CF.jpg"),
        },
        {
          url: require("@/assets/customization/BM.jpg"),
        },
        {
          url: require("@/assets/customization/ST.jpg"),
        },
        {
          url: require("@/assets/customization/XEN.jpg"),
        },
        {
          url: require("@/assets/customization/XEN_2.jpg"),
        },
      ],
    };
  },
  mounted() {},
  methods: {},
};
</script>

<style scoped>
#form {
  overflow: auto;
}
</style>