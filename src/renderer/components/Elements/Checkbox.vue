<template>
  <div class="transition element checkbox basictext" @click="toggleMark">
    <div :class="['icon', isActive]"></div>
    <div class="text basictext">{{ text }}</div>
  </div>
</template>

<script>
export default {
  name: "checkbox-component",
  model: {
    prop: "checked",
    event: "change",
  },
  props: {
    text: {
      type: String,
      default: "null",
    },
    checked: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isActive() {
      if (this.checked) return "active";
      else return "";
    },
  },
  data() {
    return {
      locked: false,
    };
  },
  methods: {
    toggleMark() {
      this.$emit("change", !this.checked);
    },
    setLocked(state) {
      if (state === true || state === false) this.locked = state;
    },
  },
};
</script>

<style scoped>
.checkbox .icon {
  width: 30px;
  height: 30px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  position: relative;
}

.checkbox:nth-last-child(1) {
    margin-bottom: 0;
}

.checkbox .icon.active::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -60%) rotate(45deg);
  height: 11px;
  width: 6px;
  border-bottom: 3px solid;
  border-right: 3px solid;
}

.checkbox .text {
  font-size: 15px;
  margin-left: 12px;
}
</style>