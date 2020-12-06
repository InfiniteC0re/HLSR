<template>
  <div id="wrap">
    <div id="form">
      <div class="title">{{ localization.get("#UI_CUSTOMIZATION") }}</div>
      <GameSelector v-model="selectedGame" />
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
    GameSelector
  },
  data() {
    return {
      localization: this.$parent.localization,
      selectedGame: 0
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