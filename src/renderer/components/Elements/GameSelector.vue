<template>
  <div class="game-select">
    <div class="game hl" :class="{active: selected == 0, disabled: !hlActive}" @click="handleClick(0)">
      <HLIcon iconColor="#FF6000" />
      <p>Half-Life</p>
    </div>
    <div class="game of" :class="{active: selected == 1, disabled: !ofActive}" @click="handleClick(1)">
      <HLIcon iconColor="#6ED594" />
      <p>Half-Life: Opposing Force</p>
    </div>
    <div class="game bs" :class="{active: selected == 2, disabled: !bsActive}" @click="handleClick(2)">
      <HLIcon iconColor="#94BFFD" />
      <p>Half-Life: Blue Shift</p>
    </div>
    <div class="game" :class="{active: selected == 3, disabled: true}" @click="handleClick(3)" v-if="wHL2">
      <HL2Icon iconColor="#FF6000" />
      <p>Half-Life 2</p>
    </div>
    <div class="game empty" :class="{disabled: true}"></div>
  </div>
</template>

<script>
import Store from "../../utils/Store.js";
import StoreDefaults from "../../utils/StoreDefaults.js";
import HLIcon from "../Icons/HL";
import HL2Icon from "../Icons/HL2";
import GameControl from "../../utils/GameControl";

const store = new Store({
  configName: "library",
  defaults: StoreDefaults.library,
});

export default {
  model: {
    prop: "selected",
    event: "select"
  },
  props: {
    selected: {
      type: Number,
      default: 0
    },
    wHL2: {
      type: Boolean,
      default: false
    }
  },
  components: {
    HLIcon,
    HL2Icon,
  },
  data: () => ({
    GameControl,
    store,
    hlActive: false,
    ofActive: false,
    bsActive: false
  }),
  mounted() {
    this.hlActive = GameControl.checkInstalled(store, "70");
    this.ofActive = GameControl.checkInstalled(store, "50");
    this.bsActive = GameControl.checkInstalled(store, "130");
  },
  methods: {
    handleClick(i) {
      this.$emit("select", i);
    }
  }
};
</script>

<style scoped>
.game-select {
  width: 100%;
  height: 60px;
  display: flex;
  color: #fff;
  margin-top: 16px;
}

.game {
  font-family: "Rubik";
  width: fit-content;
  font-weight: 700;
  font-size: 16px;
  display: flex;
  align-items: center;
  border-bottom: 3px solid rgba(255, 255, 255, 0.25);
  justify-content: center;
  cursor: pointer;
  color: rgb(200, 200, 200);
  transition: 0.2s color;
  padding: 0 14px;
  padding-bottom: 12px;
}

.game.empty {
  flex: 1;
}

.game.disabled {
  cursor: default;
  opacity: 0.3;
  pointer-events: none;
}

.game.active {
  animation: appear 0.2s forwards;
  color: #fff;
}

.game svg {
  margin-right: 10px;
}

@keyframes appear {
  to {
    border-color: #2db9ff;
  }
}

@media screen and (max-width: 1215px) {
  .game {
    font-size: 14px;
  }
}
</style>