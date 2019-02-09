import Vue from 'vue'
import Router from 'vue-router'
const Home = () => import('./views/Home.vue')
const Popup = () => import('./views/Popup.vue')
const Confirm = () => import('./views/Confirm.vue')
const Privacy = () => import('./views/Privacy.vue')

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
      component: Privacy
    }
  ]
})
