<template>
  <div class="notifications" v-if="hasNotifications">
    <div
      class="notification"
      v-for="(notification, i) in notificationList.slice().reverse()"
      v-bind:key="notification.id"
      @click="handleRemove(notification)"
      :class="{
        red: notification.type == 1,
        disappear: notification.show == false,
      }"
      :style="{
        bottom: `${16 + 46 * (extraNotification ? i + 1 : i)}px`,
      }"
    >
      <img
        v-if="notification.type == 0"
        :src="require('@/assets/customization/button-icon/icon-checkbox.png')"
      />
      <img v-else width="22px" :src="require('@/assets/error.svg')" />
      <span>{{ notification.text }}</span>
    </div>

    <div class="notification extra" v-if="extraNotification">
      <div class="loading">
        <div class="point"></div>
        <div class="point"></div>
        <div class="point"></div>
      </div>
      <span>{{ extraNotification.text }}</span>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    extraNotification() {
      return this.$store.state.extraNotification;
    },
    notificationList() {
      return this.$store.state.notifications;
    },
    hasNotifications() {
      return this.notificationList.length > 0 || this.extraNotification;
    },
  },
  methods: {
    handleRemove(notification) {
      if (!notification.persistent) notification.remove();
    },
  },
};
</script>

<style scoped>
.notification {
  padding: 8px 12px;
  background: #69ba6c;
  color: #fff;
  position: fixed;
  left: 16px;
  bottom: 16px;
  border-radius: 4px;
  animation: notification-appear 0.3s;
  z-index: 99999999;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.3s ease;
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3));
  cursor: pointer;
}

.notification.red {
  background: #e65353;
}

.notification.disappear {
  animation: notification-disappear 0.3s forwards;
}

.notification.extra {
  background: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.4);
  padding: 0 10px;
  height: 38px;
  backdrop-filter: blur(16px);
  cursor: default;
}

.loading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

.loading .point {
  width: 5px;
  height: 5px;
  margin: 0 2px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  animation: point-opacity 1s linear infinite;
}

.loading .point:nth-child(2) {
  animation-delay: 0.33s;
}
.loading .point:nth-child(3) {
  animation-delay: 0.66s;
}

@keyframes point-opacity {
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.2;
  }

  100% {
    opacity: 1;
  }
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

@keyframes notification-disappear {
  0% {
    opacity: 1;
    transform: translateX(0);
  }

  25% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    transform: translateX(-100%);
  }
}
</style>