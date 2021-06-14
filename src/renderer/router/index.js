import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [{
            path: '/',
            name: 'hltp-loading',
            component: require('@/views/Loading').default
        },
        {
            path: '/home',
            name: 'hltp-home',
            component: require('@/views/Home').default
        },
        {
            path: '/settings',
            name: 'hltp-settings',
            component: require('@/views/Settings').default
        },
        {
            path: '/game',
            name: "hltp-game-menu",
            component: require('@/views/GameMenu').default
        },
        {
            path: '/config-editor',
            name: "hltp-config-editor",
            component: require('@/views/ConfigEditor').default
        },
        {
            path: '/config-constructor',
            name: "hltp-config-constructor",
            component: require('@/views/ConfigConstructor').default
        },
        {
            path: '/customization',
            name: 'hltp-customization',
            component: require('@/views/Customization').default
        },
        {
            path: '/debug/hlsd',
            name: 'hlsd',
            component: require('@/views/Alternative/HLSDTEST.vue').default
        }
    ]
})