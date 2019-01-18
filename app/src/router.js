import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Popup from './views/Popup.vue'
import Confirm from './views/Confirm.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/popup',
      name: 'popup',
      component: Popup
    },
    {
      path: '/confirm',
      name: 'confirm',
      component: Confirm
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: () => import('./views/Privacy.vue')
    }
  ]
})
