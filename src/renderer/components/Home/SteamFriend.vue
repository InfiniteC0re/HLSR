<template>
  <div :class="['steam-friend', statusColor]" :key="friend.SteamID">
    <img
      :src="friend.avatarUrl"
      @error="imgErr"
      class="steam-friend-avatar"
      draggable="false"
    />
    <div class="steam-friend-info">
      <div class="steam-friend-name">{{ friend.personaName }}</div>
      <div class="steam-friend-status">{{ statusText }}</div>
    </div>
    <!-- <div class="steam-friend-right" @click="() => openChat()">
      <i class="fas fa-envelope"></i>
      <md-tooltip>{{ $t("#UI_SEND_MESSAGE") }}</md-tooltip>
    </div> -->
  </div>
</template>

<script type="text/javascript">
import { shell } from "electron";

export default {
  name: "steam-friend",
  props: {
    friend: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    // openChat() {
    //   console.log(`steam://friends/message/${this.friend.friendID}`);
    //   shell.openExternal(`steam://friends/message/${this.friend.friendID}`);
    // },
    imgErr(e) {
      e.target.src = require("@/assets/noavatar.png");
    },
  },
  computed: {
    statusText() {
      switch (this.friend.priority) {
        case -1:
          return this.$t("#UI_IN_LAUNCHER", this.friend.friendRPC);
        case 0:
          return this.$t("#UI_IN_HL");
        case 1:
          return this.$t("#UI_IN_OTHER_GAME");
        case 2:
          return this.$t("#UI_ONLINE");
        case 3:
          return this.$t("#UI_OFFLINE");
      }
    },
    statusColor() {
      switch (this.friend.priority) {
        case -1:
          return "steam-yellow";
        case 0:
          return "steam-orange";
        case 1:
          return "steam-blue";
        case 2:
          return "steam-green";
        case 3:
          return "steam-white";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.steam-friend {
  display: flex;
  align-items: center;
  height: 48px;
  padding: 0 8px;
  overflow: hidden;
  border-radius: 4px;
  
  &.steam-orange {
    --status-color: 255, 136, 13;
  }

  &.steam-green {
    --status-color: 40, 208, 76;
  }

  &.steam-yellow {
    --status-color: 208, 203, 40;
  }

  &.steam-blue {
    --status-color: 36, 144, 220;
  }

  &.steam-white {
    --status-color: 150, 150, 150;
  }

  &:hover {
    background-image: linear-gradient(45deg, rgba(var(--status-color), 0.1), transparent);
  }

  .steam-friend-status {
    color: rgb(var(--status-color));
  }
}

.steam-friend-avatar {
  width: 38px;
  height: 38px;
  background: rgba(255, 255, 255, 0.2);
  background-position: center !important;
  background-size: cover !important;
  border-radius: 4px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
}

.steam-friend-info {
  color: rgb(240, 240, 240) !important;
  margin-left: 8px;
  font-size: 12px;
  line-height: 18px;
}

.steam-friend-name {
  font-weight: 500;
}

.steam-friend-right {
  margin-left: auto;
  font-size: 18px;
  color: white;
  opacity: 0.2;
  cursor: pointer;
  transition: all 50ms ease-in-out;
}

.steam-friend-right:hover {
  opacity: 0.3;
}
</style>
