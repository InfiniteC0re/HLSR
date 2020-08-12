<template>
    <div id="navbar">
        <Header/>
        <div id="buttons">
            <NavBarButton :text="localization.get('#UI_HOME')" icon="home" standardActive="true" @click.native="goTo('home')"/>
            <NavBarButton :text="localization.get('#UI_LIBRARY')" icon="play" notActivable="true" @click.native="revealTab('games-tab')"/>
            <div class="tab" id="games-tab">
                <NavBarButton text="Half-Life" small="true" ref="hl" @click.native="goTo('game', {id: '70'})"/>
                <NavBarButton text="Half-Life: Opposing Force" ref="of" small="true" @click.native="goTo('game', {id: '50'})"/>
                <NavBarButton text="Half-Life: Blue Shift" ref="bs" small="true" @click.native="goTo('game', {id: '130'})"/>
                <span class="split"></span>  
            </div>
            <NavBarButton :text="localization.get('#UI_CONFIGS')" notActivable="true" icon="table" @click.native="revealTab('configs-tab')"/>
            <div class="tab" id="configs-tab">
                <NavBarButton :text="localization.get('#UI_CONFIGS_CONSTRUCTOR')" small="true" @click.native="goTo('config-constructor')"/>
                <NavBarButton :text="localization.get('#UI_CONFIGS_ADVANCED')" small="true" @click.native="goTo('advanced-configs')"/>
                <span class="split"></span>    
            </div>
            <!-- <NavBarButton :text="localization.get('#UI_CUSTOMIZATION')" notActivable="true" icon="sliders-h" @click.native="revealTab('customization-tab')"/>
            <div class="tab" id="customization-tab">
                <NavBarButton :text="localization.get('#UI_MENU_BACKGROUNDS')" small="true"/>
                <NavBarButton :text="localization.get('#UI_CROSSHAIR_SETTINGS')" small="true"/>
                <NavBarButton :text="localization.get('#UI_HUD_SETTINGS')" small="true"/>
                <NavBarButton :text="localization.get('#UI_SKYBOXES')" small="true"/>
                <NavBarButton :text="localization.get('#UI_MODELS')" small="true"/>
                <span class="split"></span>    
            </div> -->
            <NavBarButton :text="localization.get('#UI_SETTINGS')" icon="cog" @click.native="goTo('settings')"/>            
            <div class="bottom">
                <NavBarButton v-if="updateAvailable" animated="true" notActivable="true" :text="updateState" icon="sync-alt"/>
                <!-- <NavBarButton notActivable="true" text="#UI_DOWNLOADS_MARKET" icon="arrow-alt-circle-down"/>   -->
            </div>
        </div>
    </div>
</template>

<script>
import Header from "./NavBar/Header"
import NavBarButton from "./NavBar/Button"
import $ from "jquery";
import localization from "@/utils/Language.js"

const local = new localization();

export default {
    name: "NavBar",
    components: { Header, NavBarButton },
    props: {
        active: String
    },
    data: () => ({
        localization: local
    }),
    computed: {
        updateAvailable() {
            return this.$parent.updateAvailable > 0;
        },
        updateState() {
            console.log(this)
            switch(this.$parent.updateAvailable) {
                case 0:
                    return ""
                    break;
                case 1:
                    return this.localization.get("#UI_UPDATE_DOWNLOADING");
                    break;
                case 2:
                    return this.localization.get("#UI_UPDATE_READY");
                    break;
            }
        }
    },
    methods: {
        revealTab(id) {
            let shown = $("#" + id).css("display") != "none";
            $(".tab").slideUp();
            if(!shown)
                $("#" + id).slideToggle();
        },
        changeButtonsState(gameID) {
            if(!gameID) return;

            let button = null;
            if(gameID == "70") button = this.$refs.hl;
            else if(gameID == "50") button = this.$refs.of;
            else if(gameID == "130") button = this.$refs.bs;

            if(button) {
                button.deactivateButtons();
                button.toggleActive();
            }
        },
        goTo(path, query){
            let router = this.$router;
            let route = this.$route;
            if(!query) query = {};

            this.changeButtonsState(query.id);
            if(route.path != ("/" + path))
                return router.push({path, query});

            if(route.query.id != query.id || query.refresh) {
                router.push({query: {id: query.id, time: Date.now(), section: query.section}});
                this.changeButtonsState(query.id);
            }
        }
    }
}
</script>

<style scoped>
    #navbar{
        min-width: 380px;
        height: 100%;
        position: relative;
    }

    #buttons{
        display: flex;
        flex-flow: column;
    }  

    .tab{
        display: none;
    }

    .bottom{
        position: absolute;
        bottom: 0;
        width: 100%;
    }
</style>