<template>
  <div class="steam-friend" :key="friend.SteamID">
    <img :src="avatar" class="steam-friend-avatar" draggable="false" />
    <div class="steam-friend-info">
      <div class="steam-friend-name">{{ friend.personaName }}</div>
      <div :class="['steam-friend-status', statusColor]">{{ statusText }}</div>
    </div>
    <!-- <div class="steam-friend-right" v-on:click="require('electron').shell.openExternal(`steam://friends/message/${friend.SteamID}`)">
        	<i class="fas fa-envelope"></i>
        	<md-tooltip>{{localization.get('#UI_SEND_MESSAGE')}}</md-tooltip>
    	</div> -->
  </div>
</template>

<script type="text/javascript">
export default {
  name: "steam-friend",
  props: ["friend"],
  data() {
    return {
      localization: this.$parent.localization
    };
  },
  methods: {
    toBase64(pixels) {
      var canvas = document.createElement("canvas");
      canvas.width = 64;
      canvas.height = 64;
      var ctx = canvas.getContext("2d");
      var imageData = ctx.createImageData(64, 64);

      for (var i = 0; i < imageData.data.length; i += 4) {
        imageData.data[i + 0] = pixels[i + 0];
        imageData.data[i + 1] = pixels[i + 1];
        imageData.data[i + 2] = pixels[i + 2];
        imageData.data[i + 3] = pixels[i + 3];
      }

      ctx.putImageData(imageData, 0, 0);
      var data = canvas.toDataURL("image/png");
      canvas.remove();

      this.friend.avatar = "";

      return data;
    },
  },
  computed: {
    avatar() {
      return this.toBase64(new Uint8Array(this.friend.avatar));
    },
    statusText() {
      var state = this.friend.state;
      if (state == -1) return this.localization.get("#UI_IN_LAUNCHER");
      if (state == 0) return this.localization.get("#UI_IN_HL");
      if (state == 1) return this.localization.get("#UI_IN_OTHER_GAME");
      if (state == 2) return this.localization.get("#UI_ONLINE");
      if (state == 3) return this.localization.get("#UI_OFFLINE");
    },
    statusColor() {
      var state = this.friend.state;
      if (state == -1) return "steam-yellow";
      if (state == 0) return "steam-orange";
      if (state == 1) return "steam-blue";
      if (state == 2) return "steam-green";
      if (state == 3) return "steam-white";
    },
  },
};
</script>

<style scoped>
.steam-friend {
  display: flex;
  align-items: center;
  height: 57px;
  padding: 0 16px;
  overflow: hidden;
}

.steam-friend:hover {
  background: rgba(0, 0, 0, 0.1);
}

.steam-friend-avatar {
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.2);
  background-position: center !important;
  background-size: cover !important;
  border-radius: 50%;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
}

.steam-friend-info {
  color: rgb(240, 240, 240) !important;
  margin-left: 8px;
}

.steam-orange {
  color: #ff880d;
}

.steam-green {
  color: #28d04c;
}

.steam-yellow {
  color: #d0cb28;
}

.steam-blue {
  color: #2490dc;
}

.steam-white {
  color: rgb(150, 150, 150);
}

.steam-friend-right {
  margin-left: auto;
  font-size: 20px;
  color: white;
  opacity: 0.2;
  cursor: pointer;
  transition: all 50ms ease-in-out;
}

.steam-friend-right:hover {
  opacity: 0.3;
}
</style>