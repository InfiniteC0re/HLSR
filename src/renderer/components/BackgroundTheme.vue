<template>
    <div id="backgroundtheme">
        <div class="background" :style="{backgroundImage: `url(${background})`}"></div>
    </div>
</template>

<script>
import Store from '../utils/Store.js'
import StoreDefaults from '../utils/StoreDefaults.js'

const store = new Store({
    configName: 'settings',
    defaults: StoreDefaults.settings
});

export default {
    name: 'Background-Theme',
    components: { },
    data(){
        return {
            background: require("@/assets/blue.jpg")
        }
    },
    methods: {
        updateTheme() {
            switch(store.get('config').theme) {
                case 0:
                    this.background = require("@/assets/blue.jpg");
                    break;
                case 1:
                    this.background = require("@/assets/red.jpg");
                    break;
                case 2:
                    this.background = require("@/assets/lancer.png");
                    break;
            }
        }
    },
    mounted() {
        this.updateTheme();
    }
}
</script>

<style scoped>
    #backgroundtheme{
        height: 100%;
        width: 100%;
        display: flex;
        overflow: hidden;
        z-index: -1;
        height: 100%;
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
    }

    .background{
        background-position: center !important;
        background-size: cover !important;
        z-index: 1;
        height: 100%;
        width: 100%;
        position: relative;
    }

    .background::before{
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        backdrop-filter: blur(48px);
        background: rgba(23, 46, 86, 0.7);
    }
</style>