<template>
  <div :class="{button: true, red, disabled}" @click="onClick">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    red: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onClick() {
      if (!this.disabled) this.$emit("click");
    },
  },
};
</script>

<style scoped>
.button {
  width: 100%;
  height: 100%;
  display: flex;
  padding: 0 25px;
  background: #00ABFF;
  border-radius: 2px;
  box-sizing: border-box;
  height: 52px;
  color: #fff;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 13px;
  transition: 0.1s;
}

.button *:nth-child(2) {
  margin-left: auto;
  font-size: 18px;
}

.button:hover {
  background: #2db9ff;
}

.red {
    background: #ff576e;
}

.red:hover {
    background: #ff6e81;
}

.disabled, .disabled:hover {
    color: grey !important;
    background: rgba(255,255,255,.13) !important;
    cursor: default !important;
}
</style>