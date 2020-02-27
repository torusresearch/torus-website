import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import Popup from './views/Popup'
import ProviderChange from './views/ProviderChange'
import UserInfoRequest from './views/UserInfoRequest'
import RedirectCatch from './views/RedirectCatch'
import { EmailLogin, EmailRegister, EmailVerify, PhoneLogin, PhoneRegister, PhoneVerify } from './views/TorusLogin'
import Login from './views/Login'
import Confirm from './views/Confirm'
import Wallet from './views/Wallet'
import { WalletHome, WalletHomeMain, WalletHomeCollectible } from './containers/WalletHome'
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
      path: '/torus-email-register',
      name: 'torusEmailRegister',
      component: EmailRegister,
      meta: { requiresAuth: false }
    },
    {
      path: '/torus-phone-register',
      name: 'torusPhoneRegister',
      component: PhoneRegister,
      meta: { requiresAuth: false }
    },
    {
      path: '/torus-email-verify',
      name: 'torusEmailVerify',
      component: EmailVerify,
      meta: { requiresAuth: false },
      beforeEnter: (to, from, next) => {
        if (to.query.email && to.query.hash) {
          next()
        } else {
          next(from.path)
        }
      }
    },
    {
      path: '/torus-phone-verify',
      name: 'torusPhoneVerify',
      component: PhoneVerify,
      meta: { requiresAuth: false },
      beforeEnter: (to, from, next) => {
        if (to.query.phone && to.query.hash) {
          next()
        } else {
          next(from.path)
        }
      }
    },
    {
      path: '/torus-email-login',
      name: 'torusEmailLogin',
      component: EmailLogin,
      meta: { requiresAuth: false },
      beforeEnter: (to, from, next) => {
        if ((to.query.state && to.query.redirect_uri) || (from.query.state && from.query.redirect_uri)) {
          next()
        } else {
          next(from.path)
        }
      }
    },
    {
      path: '/torus-phone-login',
      name: 'torusPhoneLogin',
      component: PhoneLogin,
      meta: { requiresAuth: false },
      beforeEnter: (to, from, next) => {
        if ((to.query.state && to.query.redirect_uri) || (from.query.state && from.query.redirect_uri)) {
          next()
        } else {
          next(from.path)
        }
      }
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
          path: '/',
          name: 'walletDefault',
          component: WalletHome,
          redirect: { name: 'walletHomeMain' }
        },
        {
          path: 'home',
          name: 'walletHome',
          component: WalletHome,
          redirect: { name: 'walletHomeMain' },
          children: [
            {
              path: '',
              name: 'walletHomeMain',
              component: WalletHomeMain
            },
            {
              path: 'collectibles/:address',
              name: 'walletHomeCollectible',
              component: WalletHomeCollectible
            }
          ]
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
          component: WalletTransfer
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
  return Object.prototype.hasOwnProperty.call(route.query, 'instanceId') || Object.prototype.hasOwnProperty.call(route.query, 'state')
}

router.beforeResolve((to, from, next) => {
  if (to.hasOwnProperty('meta') && to.meta.hasOwnProperty('requiresAuth') && to.meta.requiresAuth === false) {
    if (to.name === 'logout') {
      next()
    } else if (!hasQueryParams(to) && hasQueryParams(from)) {
      next({ name: to.name, query: from.query, hash: to.hash, params: to.params })
    } else {
      next()
    }
  } else {
    if (store.state.selectedAddress === '') {
      next({ name: 'login', query: { redirect: to.fullPath } })
    } else if (!hasQueryParams(to) && hasQueryParams(from)) {
      if (to.name !== 'walletTransfer') {
        Object.keys(from.query).forEach(key => key === 'instanceId' || delete from.query[key])
      }
      next({ name: to.name, query: from.query, hash: to.hash, params: to.params })
      // next()
    } else {
      next()
    }
  }
})

export default router
