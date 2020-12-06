<template>
    <div class="transition element standardcursor dropdown basictext">
        <div class="text basictext">{{ text }}</div>
        <div class="right">
            <div class="selected" @click="toggleMenu">
                <span>{{ getSelected }}</span>
                <div class="icon">
                    <i class="fas fa-sort-down"></i>
                </div>
            </div>
            <div class="list" ref="list" hidden>
                <div v-for="(item, index) in items" :num="index" @click="setItem($event)" :key="item.id">
                    <div class="item basictext">{{ item }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import $ from "jquery";
import SlideUpDown from 'vue-slide-up-down'

export default {
    name: "dropdown-component",
    components: {SlideUpDown},
    model: {
        prop: 'value',
        event: 'change'
    },
    props: {
        value: {
            type: Number,
            default: 0
        },
        text: {
            type: String,
            default: "null"
        },
        items: {
            type: Array,
            default: [null]
        }
    },
    computed: {
        getSelected(){
            return this.items[this.value];
        }
    },
    data() {
        return {
            locked: false
        }
    },
    methods: {
        toggleMenu() {
            if($(this.$refs.list).is(":hidden"))
            {
                $(".list").slideUp(300);
                $(this.$refs.list).slideToggle(300);
            }
            else {
                $(this.$refs.list).slideToggle(300);
            }
        },
        setLocked(state){
            if(state === true || state === false)
                this.locked = state;
        },
        setItem(e){
            let id = parseInt(e.currentTarget.getAttribute("num"));
            this.selected = e.currentTarget.innerText;
            this.$emit("change", id);
        }
    }
}
</script>

<style scoped>
    .dropdown .text{
        font-size: 15px;
        margin-bottom: auto;
        margin-top: 9px;
    }

    .right{
        margin-left: auto;
        position: relative;
    }
    
    .selected{
        padding: 8px 8px;
        background: rgba(0,0,0,.3);
        border-radius: 4px;
        width: 256px;
        display: flex;
        align-items: center;
        cursor: pointer;
    }

    .icon{
        margin-left: auto;
    }

    .list{
        overflow: hidden;
        border-radius: 4px;
        z-index: 2;
        border-radius: 4px;
        margin-top: 8px;
    }

    .item{
        padding: 8px;
        background: rgba(0,0,0,.3);
        cursor: pointer;
    }

    .item:hover {
        background: rgba(0,0,0,.4);
    }
</style>