<template>
  <div
    id="notification"
    v-if="notificationText"
    :class="{ red: notificationType == 1 }"
  >
    <img
      v-if="notificationType == 0"
      :src="require('@/assets/customization/button-icon/icon-checkbox.png')"
    />
    <img v-else width="22px" :src="require('@/assets/error.svg')" />
    <span>{{ notificationText }}</span>
  </div>
</template>

<script>
export default {
  computed: {
    notificationText() {
      return this.$store.state.notification.text;
    },
    notificationType() {
      return this.$store.state.notification.type;
    },
  },
};
</script>

<style scoped>
#notification {
  padding: 8px 12px;
  background: #69ba6c;
  color: #fff;
  position: fixed;
  left: 16px;
  bottom: 16px;
  border-radius: 4px;
  animation: notification-appear 0.2s;
  z-index: 99999999;
  display: flex;
  align-items: center;
  justify-content: center;
}

#notification.red {
  background: #e65353;
}

span {
  line-height: 1px;
  margin-left: 6px;
}

img {
  filter: grayscale(1) brightness(2);
}

@keyframes notification-appear {
  0% {
    opacity: 0;
    transform: translateY(100%);
  }

  25% {
    opacity: 0;
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>