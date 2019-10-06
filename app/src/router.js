import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import Popup from './views/Popup'
import ProviderChange from './views/ProviderChange'
import UserInfoRequest from './views/UserInfoRequest'
import RedirectCatch from './views/RedirectCatch'
import Login from './views/Login'
import Confirm from './views/Confirm'
import Wallet from './views/Wallet'
import WalletHome from './containers/WalletHome'
import WalletHistory from './containers/WalletHistory'
import WalletSettings from './containers/WalletSettings'
import WalletTransfer from './containers/WalletTransfer'
import {
  WalletTopupHome,
  WalletTopupSimplex,
  WalletTopupMoonpay,
  WalletTopupWyre,
  WalletTopupCrypto,
  WalletTopupCoinDirect
} from './containers/WalletTopup'

// const Popup = () => import('./views/Popup.vue')
// const Confirm = () => import('./views/Confirm.vue')
// const Wallet = () => import('./views/Wallet.vue')
// const Login = () => import('./containers/Login.vue')
// const WalletHome = () => import('./containers/WalletHome.vue')
// const WalletHistory = () => import('./containers/WalletHistory.vue')
// const WalletSettings = () => import('./containers/WalletSettings.vue')
// const WalletAccounts = () => import('./containers/WalletAccounts.vue')

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login,
      meta: { requiresAuth: false }
    },
    {
      path: '/logout',
      name: 'logout',
      component: Login,
      meta: { requiresAuth: false }
    },
    {
      path: '/popup',
      name: 'popup',
      component: Popup,
      meta: { requiresAuth: false }
    },
    {
      path: '/redirect',
      name: 'redirect',
      component: RedirectCatch,
      meta: { requiresAuth: false }
    },
    {
      path: '/confirm',
      name: 'confirm',
      component: Confirm
    },
    {
      path: '/providerchange',
      name: 'providerchange',
      component: ProviderChange
    },
    {
      path: '/userinforequest',
      name: 'userInfoRequest',
      component: UserInfoRequest
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
          path: 'settings',
          name: 'walletSettings',
          component: WalletSettings
        },
        {
          path: 'transfer',
          name: 'walletTransfer',
          component: WalletTransfer,
          props: route => ({ address: route.query.address })
        },
        {
          path: 'topup',
          name: 'walletTopup',
          component: WalletTopupHome,
          children: [
            {
              path: 'simplex',
              name: 'walletTopupSimplex',
              component: WalletTopupSimplex
            },
            {
              path: 'moonpay',
              name: 'walletTopupMoonpay',
              component: WalletTopupMoonpay
            },
            {
              path: 'wyre',
              name: 'walletTopupWyre',
              component: WalletTopupWyre
            },
            {
              path: 'crypto',
              name: 'walletTopupCrypto',
              component: WalletTopupCrypto
            },
            {
              path: 'coindirect',
              name: 'walletTopupCoindirect',
              component: WalletTopupCoinDirect
            }
          ]
        }
      ]
    },
    { path: '*', component: Login }
  ]
})

function hasQueryParams(route) {
  return !!Object.keys(route.query).length
}

router.beforeResolve((to, from, next) => {
  if (to.hasOwnProperty('meta') && to.meta.hasOwnProperty('requiresAuth') && to.meta.requiresAuth === false) {
    if (!hasQueryParams(to) && hasQueryParams(from)) {
      next({ name: to.name, query: from.query })
    } else {
      next()
    }
  } else {
    if (store.state.selectedAddress === '') {
      next({ name: 'login', query: { redirect: to.path } })
    } else if (!hasQueryParams(to) && hasQueryParams(from)) {
      next({ name: to.name, query: from.query })
    } else {
      next()
    }
  }
})

export default router
