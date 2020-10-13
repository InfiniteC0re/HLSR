import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [{
            path: '/',
            name: 'hltp-loading',
            component: require('@/components/Loading').default
        },
        {
            path: '/home',
            name: 'hltp-home',
            component: require('@/components/Home').default
        },
        {
            path: '/settings',
            name: 'hltp-settings',
            component: require('@/components/Settings').default
        },
        {
            path: '/game',
            name: "hltp-game-menu",
            component: require('@/components/GameMenu').default
        },
        {
            path: '/config-editor',
            name: "hltp-game-menu",
            component: require('@/components/ConfigEditor').default
        },
        {
            path: '/config-constructor',
            name: "hltp-game-menu",
            component: require('@/components/ConfigConstructor').default
        },
        {
            path: '/customization',
            name: 'hltp-customization',
            component: require('@/components/Customization').default
        }
    ]
})