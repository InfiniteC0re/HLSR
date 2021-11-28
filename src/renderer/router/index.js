import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [{
            path: '/',
            name: 'loading',
            component: require('@/views/Loading').default
        },
        {
            path: '/home',
            name: 'home',
            component: require('@/views/Home').default
        },
        {
            path: '/settings',
            name: 'settings',
            component: require('@/views/Settings').default
        },
        {
            path: '/game',
            name: "game-menu",
            component: require('@/views/GameMenu').default
        },
        {
            path: '/config-editor',
            name: "config-editor",
            component: require('@/views/ConfigEditor').default
        },
        {
            path: '/config-constructor',
            name: "config-constructor",
            component: require('@/views/ConfigConstructor').default
        },
        {
            path: '/customization',
            name: 'customization',
            component: require('@/views/Customization').default
        },
        {
            path: '/debug/hlsd',
            name: 'hlsd',
            component: require('@/views/Alternative/HLSDTEST.vue').default
        }
    ]
})