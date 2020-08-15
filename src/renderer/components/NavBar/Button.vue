<template>
    <div :class="[isSmall, isActive]" @click="toggleActive">
        <div :class="{icon: true, animated: isAnimated}" v-if="icon">
            <i :class="'fas fa-' + icon"></i>
        </div>
        <div class="text">
            {{text}}
        </div>
    </div>
</template>

<script>
export default {
    name: "NavBarButton",
    data() {
        return {
            window: null
        }
    },
    props: {
        text: String,
        icon: String,
        small: {
            type: String,
            default: "false"
        },
        standardActive: {
            type: String,
            default: "false"
        },
        notActivable: {
            type: String,
            default: "false"
        },
        animated: {
            type: String,
            default: "false"
        }
    },
    methods: {
        toggleActive() {
            if(this.active || this.notActivable == "true") return;
            this.deactivateButtons();
            this.active = !this.active;
        },
        deactivateButtons() {
            let buttons = this.$navbarbuttons;
            for(let i = 0; i < buttons.length; i++) {
                let button = buttons[i];
                button.active = false;
            }
        }
    },
    computed: {
        isSmall(){
            if(this.small == "true") return "button2"
            else return "button";
        },
        isActive() {
            if(this.active) return "active";
            else return "";
        },
        isAnimated() {
            if(this.animated == "true" && !document.hidden) return true
            else return false;
        }
    },
    data() {
        return {
            active: false
        }
    },
    mounted() {
        this.active = (this.standardActive === "true");
        this.$navbarbuttons.push(this);
        // this.window = require("electron").remote.getCurrentWindow();
    }
}
</script>

<style>
    .button{
        width: 100%;
        height: 64px;
        display: flex;
        align-items:center;
        padding: 0 48px;
        box-sizing: border-box;
        font-size: 16px;
        color: rgb(210,210,210);
        cursor: pointer;
    }

    .button .icon{
        width: 30px;
        margin-right: 8px;
        display: flex;
        justify-content:center;
    }
      
    .button2{
        width: 100%;
        height: 44px;
        display: flex;
        align-items:center;
        padding: 0 88px;
        box-sizing: border-box;
        font-size: 16px;
        color: rgb(210,210,210);
    }
      
    .button:hover, .button2:hover, .navbutton:hover{
        color: rgb(240,240,240) !important;
    }
      
    .button2.active, .button.active{
        background: linear-gradient(90deg, rgba(0,0,0,.15) 60%, transparent);
        color: white !important;
    }

    .animated{
        animation: spin 1.6s infinite linear;
        will-change: transform;
    }

    @keyframes spin {
        0%{
            transform: rotateZ(0deg);
        }
        100%{
            transform: rotateZ(360deg);
        }
    }
</style>