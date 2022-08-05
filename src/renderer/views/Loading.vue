<template>
  <div id="wrapper">
    <Logo :absolute="true" />
    <div class="info left">
      <span>Developed by InfiniteC0re</span>
    </div>
    <div id="content">
      <!-- Загрузочный экран -->
      <LoadingIndicator size="55px" background="rgba(255, 255, 255, .2)" />
      <span class="loading-status">{{ splash }}</span>
    </div>
  </div>
</template>

<script>
import LoadingIndicator from "@/components/LoadingIndicator";
import Logo from "@/components/Logo";

export default {
  name: "LoadingScreen",
  components: { Logo, LoadingIndicator },
  data() {
    return {
      splash: "",
    };
  },
  mounted() {
    if (localStorage.getItem("wasLaunched"))
      this.splash = this.$t("#UI_WELCOME_BACK");
    else this.splash = this.$t("#UI_WELCOME_HLSR");

    localStorage.setItem("wasLaunched", true);

    setTimeout(() => {
      this.$router.push("home");
    }, 5000);
  },
};
</script>

<style scoped>
#loadingscreen {
  display: flex;
  width: 100%;
}

#content {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
}

.info {
  position: absolute;
  bottom: 0;
  padding: 8px;
  color: rgba(255, 255, 255, 1);
  letter-spacing: 1px;
  opacity: 0.2;
}

.right {
  right: 0;
  margin-right: 4px;
}

.left {
  left: 0;
  margin-left: 4px;
}

.loading-status {
  position: absolute;
  top: calc(50% + 130px);
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  animation: animate 2s linear infinite;
  color: #fff;
}

@keyframes animate {
  0% {
    opacity: 0.3;
  }

  50% {
    opacity: 0.2;
  }

  100% {
    opacity: 0.3;
  }
}
</style>