
<template>
  <div class="item" :class="{ active: picked }" @click="picking">
    <img
      class="img_fonts"
      :src="url"
    />
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
    i_index: {
      type: Number,
      default() {
        return {};
      },
    },
    onIndex: {
      type: Number,
      default() {
        return {};
      },
    },
  },
  data() {
    return {};
  },
  computed: {
    picked() {
      if (this.onIndex === this.i_index) {
        return true;
      }
    },
  },
  methods: {
    picking() {
      this.$emit("parentChangeAim", this.i_index);
    },
  },
};
</script>

<style scoped>
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

.item .img_fonts {
  position: relative;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  border-radius: 10px;
  z-index: -1;
  image-rendering: pixelated;
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