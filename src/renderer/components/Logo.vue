<template>
  <div id="header" :style="positionStyle">
    <div class="logo">
      <div class="inner"></div>
    </div>
    <div class="title">
      HLSR
      <span style="color: rgba(255, 255, 255, 0.2)">
        <span class="header__version">BETA</span>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "NavBarHeader",
  props: ["absolute"],
  computed: {
    positionStyle() {
      return "position: " + (this.absolute ? "absolute" : "inherit");
    },
  },
};
</script>

<style scoped>
#header {
  padding: 32px;
  display: flex;
  align-items: center;
}
.logo {
  width: 48px;
  height: 48px;
  background: transparent;
  background-size: cover;
  border-radius: 50%;
  border: 4px solid;
  color: #fff;
  position: relative;
  transition: 0.5s color;
}
.logo .inner {
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: 0.2s width, 0.2s height, 0.5s background;
}
.logo:hover .inner {
  width: 26px;
  height: 26px;
}
.title {
  font-size: 22px;
  color: white;
  margin-left: 16px;
  font-family: Roboto;
  font-weight: bold;
  letter-spacing: 9px;
}
.header__version {
  font-size: 12px;
  letter-spacing: 0.5px;
  margin-left: -16px;
}
</style>
