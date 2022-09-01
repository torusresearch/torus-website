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
      component: () => import(/* webpackChunkName: "login" */ './views/Login'),
      meta: { requiresAuth: false, title: 'Login' },
    },
    {
      path: '/start',
      name: 'start',
      component: () => import(/* webpackChunkName: "start" */ './views/Start'),
      meta: { requiresAuth: false, title: 'Start', skipOpenLoginCheck: true },
    },
    {
      path: '/end',
      name: 'end',
      component: () => import(/* webpackChunkName: "end" */ './views/End'),
      meta: { requiresAuth: false, title: 'End', skipOpenLoginCheck: true },
    },
    {
      path: '/logout',
      name: 'logout',
      component: () => import(/* webpackChunkName: "login" */ './views/Login'),
      meta: { requiresAuth: false, title: 'Logout', skipOpenLoginCheck: true },
    },
    {
      path: '/popup',
      name: 'popup',
      component: () => import(/* webpackChunkName: "popup" */ './views/Popup'),
      meta: { requiresAuth: false },
    },
    {
      path: '/redirect',
      name: 'redirect',
      component: () => import(/* webpackChunkName: "redirect" */ './views/RedirectCatch'),
      meta: { requiresAuth: false, skipOpenLoginCheck: true },
    },
    {
      path: '/confirm',
      name: 'confirm',
      component: () => import(/* webpackChunkName: "confirm" */ './views/Confirm'),
      meta: { requiresAuth: false, title: 'Confirm', skipOpenLoginCheck: true },
    },
    {
      path: '/providerchange',
      name: 'providerchange',
      component: () => import(/* webpackChunkName: "providerchange" */ './views/ProviderChange'),
      meta: { requiresAuth: false, title: 'Provider Change', skipOpenLoginCheck: true },
    },
    {
      path: '/wallet',
      component: () => import(/* webpackChunkName: "wallet" */ './views/Wallet'),
      children: [
        {
          path: '/',
          name: 'walletDefault',
          component: () => import(/* webpackChunkName: "walletDefault" */ './containers/WalletHome/WalletHome'),
          redirect: { name: 'walletHomeMain' },
        },
        {
          path: 'home',
          name: 'walletHome',
          component: () => import(/* webpackChunkName: "walletHome" */ './containers/WalletHome/WalletHome'),
          redirect: { name: 'walletHomeMain' },
          children: [
            {
              path: '',
              name: 'walletHomeMain',
              component: () => import(/* webpackChunkName: "walletHomeMain" */ './containers/WalletHome/WalletHomeMain'),
              meta: { title: 'Home' },
            },
            {
              path: 'collectibles/:address',
              name: 'walletHomeCollectible',
              component: () => import(/* webpackChunkName: "walletHomeCollectible" */ './containers/WalletHome/WalletHomeCollectible'),
              meta: { title: 'Home' },
            },
          ],
        },
        {
          path: 'history',
          name: 'walletHistory',
          component: () => import(/* webpackChunkName: "walletHistory" */ './containers/WalletHistory'),
          meta: { title: 'Activity' },
        },
        {
          path: 'settings',
          name: 'walletSettings',
          component: () => import(/* webpackChunkName: "walletSettings" */ './containers/WalletSettings'),
          meta: { title: 'Settings' },
        },
        {
          path: 'transfer',
          name: 'walletTransfer',
          component: () => import(/* webpackChunkName: "walletTransfer" */ './containers/WalletTransfer'),
          meta: { title: 'Transfer' },
        },
        {
          path: 'topup',
          name: 'walletTopup',
          component: () => import(/* webpackChunkName: "walletTopup" */ './containers/WalletTopup/WalletTopupHome'),
          meta: { title: 'Topup' },
          children: [
            {
              path: 'rampnetwork',
              name: 'walletTopupRampNetwork',
              component: () => import(/* webpackChunkName: "walletTopupRampNetwork" */ './containers/WalletTopup/WalletTopupRampNetwork'),
            },
            {
              path: 'simplex',
              name: 'walletTopupSimplex',
              component: () => import(/* webpackChunkName: "walletTopupSimplex" */ './containers/WalletTopup/WalletTopupSimplex'),
            },
            {
              path: 'moonpay',
              name: 'walletTopupMoonpay',
              component: () => import(/* webpackChunkName: "walletTopupMoonpay" */ './containers/WalletTopup/WalletTopupMoonpay'),
            },
            {
              path: 'wyre',
              name: 'walletTopupWyre',
              component: () => import(/* webpackChunkName: "walletTopupWyre" */ './containers/WalletTopup/WalletTopupWyre'),
            },
            {
              path: 'xanpool',
              name: 'walletTopupXanpool',
              component: () => import(/* webpackChunkName: "walletTopupXanpool" */ './containers/WalletTopup/WalletTopupXanpool'),
            },
            {
              path: 'mercuryo',
              name: 'walletTopupMercuryo',
              component: () => import(/* webpackChunkName: "walletTopupMercuryo" */ './containers/WalletTopup/WalletTopupMercuryo'),
            },
            {
              path: 'transak',
              name: 'walletTopupTransak',
              component: () => import(/* webpackChunkName: "walletTopupTransak" */ './containers/WalletTopup/WalletTopupTransak'),
            },
            {
              path: 'banxa',
              name: 'walletTopupBanxa',
              component: () => import(/* webpackChunkName: "walletTopupBanxa" */ './containers/WalletTopup/WalletTopupBanxa'),
            },
          ],
        },
        {
          path: 'discover',
          name: 'walletDiscover',
          component: () => import(/* webpackChunkName: "walletDiscover" */ './containers/WalletDiscover'),
          meta: { title: 'Discover' },
        },
      ],
    },
    { path: '*', component: () => import(/* webpackChunkName: "login" */ './views/Login') },
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
  if (Object.prototype.hasOwnProperty.call(to, 'meta')) {
    document.title = to.meta.title ? `${to.meta.title} | Torus` : 'Torus'
  }
  next()
})

export default router
