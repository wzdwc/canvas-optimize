import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

const router = new Router({
    routes: [
        {
            path     : '/home',
            name     : 'home',
            meta     : {isShop: false, auth: true},
            component: r => require(['../views/home'], r),
        },
    ],
})

export default router
