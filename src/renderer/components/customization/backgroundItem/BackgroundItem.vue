<template>
  <div class="item" @click="picking" :class="{ active: picked }">
    <img class="img_fonts" :src="url" />
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
  name: "backgrounditem",
  props: {
    url: {
      type: String,
      default() {
        return {};
      },
    },
    i_index: {
      // порядковый номер элемента
      type: Number,
      default() {
        return {};
      },
    },
    onIndex: {
      // индекс выбранного фона
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
      // сравниваем и выделяем выбранный элемент
      if (this.onIndex === this.i_index) {
        return true;
      }
    },
  },
  methods: {
    // передаем в родитель то, что мы кликнули на элемент, как следствие меняем выбранный элемент
    picking() {
      this.$emit("parentChange", this.i_index);
    },
  },
};
</script>

<style scoped>
.item {
  cursor: pointer;
  position: relative;
  height: 178px;
  overflow: hidden;
  transition: 0.1s;
  border-radius: 10px;
}

.item:nth-child(1) .img_fonts {
  transform: translateY(-20px);
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
  height: calc(100% + 20px);
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  border-radius: 10px;
  z-index: -1;
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