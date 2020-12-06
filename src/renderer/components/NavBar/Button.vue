<template>
    <div :class="[isSmall, isActive]" @click="toggleActive">
        <div :class="{icon: true, animated: isAnimated}" v-if="icon">
            <i :class="'fas fa-' + icon"></i>
        </div>
        <div v-if="lambdaVisible" class="lambda__container">
            <div :class="{lambda: true, green: lambdaColor == 2, blue: lambdaColor == 3}"></div>
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
        lambdaColor: {
            type: Number,
            default: 0
        },
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
        },
        lambdaVisible() {
            return this.lambdaColor > 0;
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
    .button .icon{
        width: 30px;
        margin-right: 8px;
        display: flex;
        justify-content:center;
    }

    .button, .button2 {
        width: 100%;
        display: flex;
        align-items:center;
        box-sizing: border-box;
        font-size: 16px;
        color: rgb(210,210,210);
        cursor: pointer;
        transition: color 100ms ease,
                    background-position-x 500ms ease;
        background: linear-gradient(90deg, rgba(0,0,0,.15) 60%, transparent);
        background-repeat: no-repeat;
        background-position-x: -500px;
    }

    .button{
        height: 64px;
        padding: 0 48px;
    }
      
    .button2{
        width: 100%;
        height: 44px;
        display: flex;
        align-items:center;
        padding: 0 88px;
        position: relative;
    }
      
    .button:hover, .button2:hover, .navbutton:hover{
        color: rgb(240,240,240) !important;
    }
      
    .button2.active, .button.active{
        background-position-x: 0;
        color: white !important;
        position: relative;
    }

    .button2.active::before, .button.active::before {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 3px;
        background: #00abff;
        opacity: 0;
        animation: appear 1s forwards;
    }

    .animated{
        animation: spin 1.6s infinite linear;
        will-change: transform;
    }

    .lambda__container {
        position: absolute;
        left: 52px;
    }

    .lambda {
        background: url(../../assets/lambda.svg);
        background-size: cover;
        background-position: center;
        width: 18px;
        height: 18px;
        filter: invert(0.4);
        transition: filter 150ms ease,
                    opacity 150ms ease;
        position: relative;
        opacity: 0.5;
    }

    .button2:hover .lambda, .button2.active .lambda {
        filter: invert(0.4) sepia(1) saturate(1.9);
    }

    .button2.active .lambda {
        opacity: 1;
    }

    .button2:hover .lambda.blue, .button2.active .lambda.blue {
        filter: invert(0.4) sepia(1) hue-rotate(180deg) saturate(1.9);
    }

    .button2:hover .lambda.green, .button2.active .lambda.green {
        filter: invert(0.4) sepia(1) hue-rotate(90deg) saturate(1.9);
    }

    @keyframes spin {
        0%{
            transform: rotateZ(0deg);
        }
        100%{
            transform: rotateZ(360deg);
        }
    }

    @keyframes appear {
        to {
            opacity: 1;
        }
    }
</style>