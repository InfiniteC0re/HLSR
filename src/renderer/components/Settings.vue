<template>
    <div id="wrap">
        <div id="form">
            <div class="title">{{localization.get('#UI_SETTINGS')}}</div>
            <div class="section basictext">{{localization.get('#UI_INTERFACE_SETTINGS')}}</div>
            <dropdown v-model="language" :text="localization.get('#UI_INTERFACE_LANGUAGE')" @change="saveChoice" :items="languages"/>
            <dropdown v-model="theme" :text="localization.get('#UI_INTERFACE_THEME')" @change="themeChange" :items="themes"/>
            <div class="section basictext">{{localization.get('#UI_MISC_SETTINGS')}}</div>
            <checkbox v-model="rpc" @change="saveChoice" :text="localization.get('#UI_DISCORD_RPC_SETTINGS')"/> 
            <checkbox v-model="experimental" @change="saveChoice" :text="localization.get('#UI_EXPERIMENTAL_MODE_SETTINGS')"/>
        </div>
    </div>
</template>

<script>
import checkbox from "./Elements/Checkbox";
import dropdown from "./Elements/Dropdown";
import Store from '../utils/Store.js'
import StoreDefaults from '../utils/StoreDefaults.js'
import localization from "@/utils/Language.js"

const local = new localization();

const store = new Store({
    configName: 'settings',
    defaults: StoreDefaults.settings
});

export default {
    name: "settings-page",
    components: { checkbox, dropdown },
    data() {
        return {
            languages: [
                local.get('#UI_ENGLISH'),
                local.get('#UI_RUSSIAN')
            ],
            themes: [
                local.get('#UI_BLUE_THEME'),
                local.get('#UI_RED_THEME'),
                local.get('#UI_LANCER_THEME')
            ],
            language: 0,
            theme: 0,
            rpc: true,
            experimental: false,
            localization: local
        }
    },
    mounted() {
        let config = store.get('config');
        this.language = config.language;
        this.theme = config.theme;
        this.rpc = config.rpc;
        this.experimental = config.experimental;
    },
    methods: {
        themeChange() {
            this.saveChoice();
            this.$parent.$refs.theme.updateTheme();
        },
        saveChoice() {
            let config = store.get('config');
            let langChanged = config.language == this.language;
            config.language = this.language;
            config.theme = this.theme;
            config.rpc = this.rpc;
            config.experimental = this.experimental;
            store.set('config', config);

            this.$parent.$refs.navbar.$forceUpdate(); // Обновить панель навигации

            // Обновить себя
            this.languages = [
                local.get('#UI_ENGLISH'),
                local.get('#UI_RUSSIAN')
            ];
            this.themes = [
                local.get('#UI_BLUE_THEME'),
                local.get('#UI_RED_THEME'),
                local.get('#UI_LANCER_THEME')
            ]
        },
        pink() {
            document.body.style.filter = "hue-rotate(45deg)";
        }
    }
}
</script>

<style scoped>
    .section{
        margin-left: 26px;
        margin-top: 16px;
        margin-bottom: 16px;
    }
</style>