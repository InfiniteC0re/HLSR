<template>
  <div id="wrapper">
    <Header absolute="true"/>
    <div class="info left">
        <span>Developed by InfiniteC0re</span>
    </div>
    <div class="info right">
        <img src="@/assets/bmd_logo.svg" width="160px"/>
    </div>
    <div id="content">
        <!-- Загрузочный экран --> 
        <LoadingIndicator size="55px" background="rgba(255, 255, 255, .2)"/>
        <!-- <span class="loading-status">Checking for new updates</span> -->

        <!-- <div class="loader">
            <div class="spinner">
                <span class="glow"></span>
                <span class="glow"></span>
                <span class="glow"></span>
                <span class="glow"></span>
            </div>
        </div> -->
    </div>
  </div>
</template>

<script>
    import LoadingIndicator from "./LoadingIndicator";
    import BackgroundTheme from "./BackgroundTheme";
    import Header from "./NavBar/Header";

    export default {
        name: "LoadingScreen",
        components: { BackgroundTheme, Header, LoadingIndicator },
        mounted() {
            setTimeout(() => {
                this.$router.push("home");
            }, 5000);
        },
        data(){
            return {
                bmd: require("@/assets/bmd_logo.svg")
            }
        },
    }
</script>

<style scoped>
    #loadingscreen{
        display: flex;
        width: 100%;
    }
    #content{
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-flow: column;
    }

    .info{
        position: absolute;
        bottom: 0;
        padding: 8px;
        color: rgba(255, 255, 255, 1);
        letter-spacing: 1px;
        opacity: 0.2
    }

    .right{
        right: 0;
        margin-right: 4px;
    }

    .left{
        left: 0;
        margin-left: 4px;
    }
</style>