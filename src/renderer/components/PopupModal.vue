<template>
  <div class="popup-modal" v-if="isVisible">
    <div class="overlay"></div>
    <div class="window" :class="{ wide: isWide }">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isVisible: {
      type: Boolean,
      default: true,
    },
    isWide: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
.popup-modal {
  position: fixed;
  left: 90px;
  right: 0;
  top: 0;
  bottom: 0;

  .window {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgb(34, 34, 34);
    color: rgba(255, 255, 255, 0.6);
    border-radius: 16px;
    padding: 40px;
    padding-bottom: 16px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 0 16px rgba(0, 0, 0, 0.4);
    max-width: 70%;
    width: 100%;

    &.wide {
      max-width: 100%;
      border-radius: 32px 32px 0 0;
      animation: appear 0.3s forwards;
    }
  }

  .overlay {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(16px);
    transition: 0.2s ease background-color;
  }

  //   @keyframes appear {
  //     0% {
  //       opacity: 0;
  //       transform: translateY(100%);
  //     }

  //     100% {
  //       opacity: 1;
  //       transform: translateY(0);
  //     }
  //   }
}
</style>
