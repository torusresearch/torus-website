import Vue from 'vue'
import Router from 'vue-router'

import WalletDiscover from './containers/WalletDiscover'
import WalletHistory from './containers/WalletHistory'
import { WalletHome, WalletHomeCollectible, WalletHomeMain } from './containers/WalletHome'
import WalletSettings from './containers/WalletSettings'
import {
  WalletTopupHome,
  WalletTopupMercuryo,
  WalletTopupMoonpay,
  WalletTopupRampNetwork,
  WalletTopupSimplex,
  WalletTopupTransak,
  WalletTopupWyre,
  WalletTopupXanpool,
} from './containers/WalletTopup'
import WalletTransfer from './containers/WalletTransfer'
import Confirm from './views/Confirm'
import End from './views/End'
import Login from './views/Login'
import Popup from './views/Popup'
import ProviderChange from './views/ProviderChange'
import RedirectCatch from './views/RedirectCatch'
import Start from './views/Start'
import Wallet from './views/Wallet'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login,
      meta: { requiresAuth: false, title: 'Login' },
    },
    {
      path: '/start',
      name: 'start',
      component: Start,
      meta: { requiresAuth: false, title: 'Start' },
    },
    {
      path: '/end',
      name: 'end',
      component: End,
      meta: { requiresAuth: false, title: 'End' },
    },
    {
      path: '/logout',
      name: 'logout',
      component: Login,
      meta: { requiresAuth: false, title: 'Logout' },
    },
    {
      path: '/popup',
      name: 'popup',
      component: Popup,
      meta: { requiresAuth: false },
    },
    {
      path: '/redirect',
      name: 'redirect',
      component: RedirectCatch,
      meta: { requiresAuth: false },
    },
    {
      path: '/confirm',
      name: 'confirm',
      component: Confirm,
      meta: { requiresAuth: false, title: 'Confirm' },
    },
    {
      path: '/providerchange',
      name: 'providerchange',
      component: ProviderChange,
      meta: { requiresAuth: false, title: 'Provider Change' },
    },
    {
      path: '/wallet',
      component: Wallet,
      children: [
        {
          path: '/',
          name: 'walletDefault',
          component: WalletHome,
          redirect: { name: 'walletHomeMain' },
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
              component: WalletHomeMain,
              meta: { title: 'Home' },
            },
            {
              path: 'collectibles/:address',
              name: 'walletHomeCollectible',
              component: WalletHomeCollectible,
              meta: { title: 'Home' },
            },
          ],
        },
        {
          path: 'history',
          name: 'walletHistory',
          component: WalletHistory,
          meta: { title: 'Activity' },
        },
        {
          path: 'settings',
          name: 'walletSettings',
          component: WalletSettings,
          meta: { title: 'Settings' },
        },
        {
          path: 'transfer',
          name: 'walletTransfer',
          component: WalletTransfer,
          meta: { title: 'Transfer' },
        },
        {
          path: 'topup',
          name: 'walletTopup',
          component: WalletTopupHome,
          meta: { title: 'Topup' },
          children: [
            {
              path: 'rampnetwork',
              name: 'walletTopupRampNetwork',
              component: WalletTopupRampNetwork,
            },
            {
              path: 'simplex',
              name: 'walletTopupSimplex',
              component: WalletTopupSimplex,
            },
            {
              path: 'moonpay',
              name: 'walletTopupMoonpay',
              component: WalletTopupMoonpay,
            },
            {
              path: 'wyre',
              name: 'walletTopupWyre',
              component: WalletTopupWyre,
            },
            {
              path: 'xanpool',
              name: 'walletTopupXanpool',
              component: WalletTopupXanpool,
            },
            {
              path: 'mercuryo',
              name: 'walletTopupMercuryo',
              component: WalletTopupMercuryo,
            },
            {
              path: 'transak',
              name: 'walletTopupTransak',
              component: WalletTopupTransak,
            },
          ],
        },
        {
          path: 'discover',
          name: 'walletDiscover',
          component: WalletDiscover,
          meta: { title: 'Discover' },
        },
      ],
    },
    { path: '*', component: Login },
  ],
})

function hasQueryParameters(route) {
  return Object.prototype.hasOwnProperty.call(route.query, 'instanceId')
}

router.beforeResolve((to, from, next) => {
  if (
    Object.prototype.hasOwnProperty.call(to, 'meta') &&
    Object.prototype.hasOwnProperty.call(to.meta, 'requiresAuth') &&
    to.meta.requiresAuth === false
  ) {
    if (to.name === 'logout') {
      return next()
    }
    if (!hasQueryParameters(to) && hasQueryParameters(from)) {
      return next({ name: to.name, query: from.query, hash: to.hash, params: to.params })
    }
    return next()
  }
  if (!hasQueryParameters(to) && hasQueryParameters(from)) {
    if (!to.name.includes('Topup') && to.name !== 'walletTransfer') {
      Object.keys(from.query).forEach((key) => key === 'instanceId' || delete from.query[key])
    }
    return next({ name: to.name, query: from.query, hash: to.hash, params: to.params })
    // next()
  }
  return next()
})
router.beforeEach((to, _, next) => {
  document.title = to.meta.title ? `${to.meta.title} | Torus` : 'Torus'
  next()
})

export default router
