<template>
  <div
    :class="{ button: true, red, disabled }"
    @mousedown="mouseDown"
    @click="onClick"
    ref="button"
  >
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
    mouseDown(e) {
      let waveElem = document.createElement("div");
      waveElem.classList.add("wave");
      waveElem.style.left = `${e.offsetX}px`;
      waveElem.style.top = `${e.offsetY}px`;

      this.$refs.button.appendChild(waveElem);

      setTimeout(() => {
        waveElem.remove();
      }, 800);
    },
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
  background: #00abff;
  border-radius: 2px;
  box-sizing: border-box;
  height: 52px;
  color: #fff;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 13px;
  transition: 0.1s;
  align-items: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.button *:nth-child(2) {
  margin-left: auto;
  font-size: 18px;
}

.button * {
  pointer-events: none;
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

.disabled,
.disabled:hover {
  color: grey !important;
  background: rgba(255, 255, 255, 0.13) !important;
  cursor: default !important;
}
</style>

<style>
.wave {
  width: 1px;
  height: 1px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  position: absolute;
  left: 50%;
  top: 50%;
  pointer-events: none;
  z-index: 1;

  animation: wave 0.8s ease;
}

@keyframes wave {
  0% {
    transform: scale(1);
  }

  50% {
    opacity: 1;
  }

  100% {
    transform: scale(400);
    opacity: 0;
  }
}
</style>