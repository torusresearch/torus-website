import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
const Home = () => import('./views/Home.vue')
const Popup = () => import('./views/Popup.vue')
const Confirm = () => import('./views/Confirm.vue')
const Privacy = () => import('./views/Privacy.vue')
const Wallet = () => import('./views/Wallet.vue')
// const WalletTransfer = () => import('./views/WalletTransfer.vue')
const Login = () => import('./containers/Login.vue')
const WalletHome = () => import('./containers/WalletHome.vue')
const WalletHistory = () => import('./containers/WalletHistory.vue')
const WalletSettings = () => import('./containers/WalletSettings.vue')
const WalletAccounts = () => import('./containers/WalletAccounts.vue')
const WalletTransfer = () => import('./containers/WalletTransfer.vue')

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: { requiresAuth: false }
    },
    {
      path: '/popup',
      name: 'popup',
      component: Popup,
      meta: { requiresAuth: false }
    },
    {
      path: '/confirm',
      name: 'confirm',
      component: Confirm
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: Privacy,
      meta: { requiresAuth: false }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { requiresAuth: false }
    },
    {
      path: '/wallet',
      component: Wallet,
      children: [
        {
          path: '',
          name: 'walletDefault',
          component: WalletHome
        },
        {
          path: 'home',
          name: 'walletHome',
          component: WalletHome
        },
        {
          path: 'history',
          name: 'walletHistory',
          component: WalletHistory
        },
        {
          path: 'accounts',
          name: 'walletAccounts',
          component: WalletAccounts
        },
        {
          path: 'settings',
          name: 'walletSettings',
          component: WalletSettings
        },
        {
          path: 'transfer',
          name: 'walletTransfer',
          component: WalletTransfer,
          props: route => ({ address: route.query.address })
        }
      ]
    }
  ]
})

router.beforeResolve((to, ___, next) => {
  if (to.hasOwnProperty('meta') && to.meta.hasOwnProperty('requiresAuth') && to.meta.requiresAuth === false) {
    next()
  } else {
    if (store.state.selectedAddress === '') {
      next({ name: 'login' })
    } else {
      next()
    }
  }
})

export default router
