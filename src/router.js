import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import(/* webpackChunkName: "LOGIN" */ './views/Login'),
      meta: { requiresAuth: false },
    },
    {
      path: '/start',
      name: 'start',
      component: () => import(/* webpackChunkName: "START" */ './views/Start'),
      meta: { requiresAuth: false },
    },
    {
      path: '/end',
      name: 'end',
      component: () => import(/* webpackChunkName: "END" */ './views/End'),
      meta: { requiresAuth: false },
    },
    {
      path: '/logout',
      name: 'logout',
      component: () => import(/* webpackChunkName: "LOGIN" */ './views/Login'),
      meta: { requiresAuth: false },
    },
    {
      path: '/popup',
      name: 'popup',
      component: () => import(/* webpackChunkName: "POPUP" */ './views/Popup'),
      meta: { requiresAuth: false },
    },
    {
      path: '/redirect',
      name: 'redirect',
      component: () => import(/* webpackChunkName: "REDIRECT_CATCH" */ './views/RedirectCatch'),
      meta: { requiresAuth: false },
    },
    {
      path: '/confirm',
      name: 'confirm',
      component: () => import(/* webpackChunkName: "CONFIRM" */ './views/Confirm'),
      meta: { requiresAuth: false },
    },
    {
      path: '/providerchange',
      name: 'providerchange',
      component: () => import(/* webpackChunkName: "PROVIDER_CHANGE" */ './views/ProviderChange'),
      meta: { requiresAuth: false },
    },
    {
      path: '/wallet',
      component: () => import(/* webpackChunkName: "WALLET" */ './views/Wallet'),
      children: [
        {
          path: '/',
          name: 'walletDefault',
          component: () => import(/* webpackChunkName: "WALLET_HOME" */ './containers/WalletHome/WalletHome'),
          redirect: { name: 'walletHomeMain' },
        },
        {
          path: 'home',
          name: 'walletHome',
          component: () => import(/* webpackChunkName: "WALLET_HOME" */ './containers/WalletHome/WalletHome'),
          redirect: { name: 'walletHomeMain' },
          children: [
            {
              path: '',
              name: 'walletHomeMain',
              component: () => import(/* webpackChunkName: "WALLET_HOME_MAIN" */ './containers/WalletHome/WalletHomeMain'),
            },
            {
              path: 'collectibles/:address',
              name: 'walletHomeCollectible',
              component: () => import(/* webpackChunkName: "WALLET_COLLECTIBLE" */ './containers/WalletHome/WalletHomeCollectible'),
            },
          ],
        },
        {
          path: 'history',
          name: 'walletHistory',
          component: () => import(/* webpackChunkName: "WALLET_HISTORY" */ './containers/WalletHistory'),
        },
        {
          path: 'settings',
          name: 'walletSettings',
          component: () => import(/* webpackChunkName: "WALLET_SETTINGS" */ './containers/WalletSettings'),
        },
        {
          path: 'transfer',
          name: 'walletTransfer',
          component: () => import(/* webpackChunkName: "WALLET_TRANSFER" */ './containers/WalletTransfer'),
        },
        {
          path: 'topup',
          name: 'walletTopup',
          component: () => import(/* webpackChunkName: "WALLET_TOPUP_HOME" */ './containers/WalletTopup/WalletTopupHome'),
          children: [
            {
              path: 'rampnetwork',
              name: 'walletTopupRampNetwork',
              component: () => import(/* webpackChunkName: "WALLET_TOPUP_RAMP" */ './containers/WalletTopup/WalletTopupRampNetwork'),
            },
            {
              path: 'simplex',
              name: 'walletTopupSimplex',
              component: () => import(/* webpackChunkName: "WALLET_TOPUP_SIMPLEX" */ './containers/WalletTopup/WalletTopupSimplex'),
            },
            {
              path: 'moonpay',
              name: 'walletTopupMoonpay',
              component: () => import(/* webpackChunkName: "WALLET_TOPUP_MOONPAY" */ './containers/WalletTopup/WalletTopupMoonpay'),
            },
            {
              path: 'wyre',
              name: 'walletTopupWyre',
              component: () => import(/* webpackChunkName: "WALLET_TOPUP_WYRE" */ './containers/WalletTopup/WalletTopupWyre'),
            },
            {
              path: 'xanpool',
              name: 'walletTopupXanpool',
              component: () => import(/* webpackChunkName: "WALLET_TOPUP_XANPOOL" */ './containers/WalletTopup/WalletTopupXanpool'),
            },
            {
              path: 'mercuryo',
              name: 'walletTopupMercuryo',
              component: () => import(/* webpackChunkName: "WALLET_TOPUP_MERCURYO" */ './containers/WalletTopup/WalletTopupMercuryo'),
            },
            {
              path: 'transak',
              name: 'walletTopupTransak',
              component: () => import(/* webpackChunkName: "WALLET_TOPUP_TRANSAK" */ './containers/WalletTopup/WalletTopupTransak'),
            },
          ],
        },
        {
          path: 'discover',
          name: 'walletDiscover',
          component: () => import(/* webpackChunkName: "WALLET_DISCOVER" */ './containers/WalletDiscover'),
        },
      ],
    },
    { path: '*', component: () => import(/* webpackChunkName: "LOGIN" */ './views/Login') },
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

export default router
