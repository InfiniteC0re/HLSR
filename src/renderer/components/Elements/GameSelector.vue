<template>
  <div class="game-select">
    <div class="game hl" :class="{active: selected == 0}" @click="handleClick(0)">
      <HLIcon iconColor="#FF6000" />
      <p>Half-Life</p>
    </div>
    <div class="game of" :class="{active: selected == 1}" @click="handleClick(1)">
      <HLIcon iconColor="#6ED594" />
      <p>Half-Life: Opposing Force</p>
    </div>
    <div class="game bs" :class="{active: selected == 2}" @click="handleClick(2)">
      <HLIcon iconColor="#94BFFD" />
      <p>Half-Life: Blue Shift</p>
    </div>
    <div class="game" :class="{active: selected == 3}" @click="handleClick(3)">
      <HL2Icon iconColor="#FF6000" />
      <p>Half-Life 2</p>
    </div>
  </div>
</template>

<script>
import HLIcon from "../Icons/HL";
import HL2Icon from "../Icons/HL2";

export default {
  model: {
    prop: "selected",
    event: "select"
  },
  props: {
    selected: {
      type: Number,
      default: 0
    }
  },
  components: {
    HLIcon,
    HL2Icon,
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
}

.game:nth-child(1) {
  min-width: 140px;
}

.game:nth-child(2) {
  min-width: 270px;
}

.game:nth-child(3) {
  flex: 1;
}

.game:nth-child(4) {
  width: 160px;
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
</style>