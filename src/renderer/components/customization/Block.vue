
<template>
  <div class="item" :class="{ active: picked }" @click="picking">
    <div class="back" :style="{ backgroundImage: `url(${url})` }"></div>
    <img
      v-if="picked"
      :src="require('@/assets/customization/button-icon/icon-checkbox.png')"
      class="img_checkbox"
      alt=""
    />
  </div>
</template>

<script>
export default {
  name: "aimitem",
  props: {
    url: {
      type: String,
      default() {
        return {};
      },
    },
    target: {
      type: String,
      default: "",
    },
    value: {
      type: String,
      default: "",
    },
  },
  model: {
    prop: "value",
    event: "change",
  },
  data() {
    return {};
  },
  computed: {
    picked() {
      if (this.value === this.target) {
        return true;
      }
    },
  },
  methods: {
    picking() {
      this.$emit("change", this.target);
    },
  },
};
</script>

<style lang="scss" scoped>
.item {
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: 0.1s;
  border-radius: 10px;
}

.active {
  box-shadow: inset 0px 0px 0px 3px #00abff;
  cursor: default;
}

.item:hover {
  background: rgba(0, 0, 0, 0.2);
}

.active:hover {
  background: transparent;
}

.item .back {
  position: relative;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  z-index: -1;
  width: 100%;
  height: 100%;
}

.item .img_checkbox {
  position: absolute;
  width: 21px;
  z-index: 2;
  height: 21px;
  right: 12.5px;
  bottom: 12px;
  animation: roll 0.4s ease;
}

@keyframes roll {
  to {
    transform: rotate(360deg);
  }
}
</style>