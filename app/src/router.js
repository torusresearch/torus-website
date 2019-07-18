import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import Popup from './views/Popup.vue'
import Confirm from './views/Confirm.vue'
import ProviderChange from './views/ProviderChange.vue'
import Wallet from './views/Wallet.vue'
import WalletHome from './containers/WalletHome.vue'
import Login from './containers/Login.vue'
import WalletHistory from './containers/WalletHistory.vue'
import WalletSettings from './containers/WalletSettings.vue'
import WalletAccounts from './containers/WalletAccounts.vue'
import WalletTransfer from './containers/WalletTransfer.vue'
import WalletTopup from './containers/WalletTopup.vue'
import WalletAccountsHome from './containers/WalletAccountsHome.vue'
import WalletAccountImport from './containers/WalletAccountImport.vue'
import WalletDappPermision from './containers/WalletDappPermision.vue'

// const Popup = () => import('./views/Popup.vue')
// const Confirm = () => import('./views/Confirm.vue')
// const Wallet = () => import('./views/Wallet.vue')
// const Login = () => import('./containers/Login.vue')
// const WalletHome = () => import('./containers/WalletHome.vue')
// const WalletHistory = () => import('./containers/WalletHistory.vue')
// const WalletSettings = () => import('./containers/WalletSettings.vue')
// const WalletAccounts = () => import('./containers/WalletAccounts.vue')
// const WalletTransfer = () => import('./containers/WalletTransfer.vue')

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
      path: '/providerchange',
      name: 'providerchange',
      component: ProviderChange
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
          component: WalletAccountsHome, // tabs
          children: [
            {
              path: '',
              name: 'walletAccountsDefault',
              component: WalletAccounts // Account switcher
            },
            {
              path: 'home',
              name: 'walletAccountsHome',
              component: WalletAccounts // Account switcher
            },
            {
              path: 'import',
              name: 'walletAccountImport',
              component: WalletAccountImport // Account import
            }
          ]
        },
        {
          path: 'settings',
          name: 'walletSettings',
          component: WalletSettings
        },
        {
          path: 'dapp-ermision',
          name: 'WalletDappPermision',
          component: WalletDappPermision
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
          component: WalletTopup
        }
      ]
    },
    { path: '*', component: Login }
  ]
})

router.beforeResolve((to, ___, next) => {
  if (to.hasOwnProperty('meta') && to.meta.hasOwnProperty('requiresAuth') && to.meta.requiresAuth === false) {
    next()
  } else {
    if (store.state.selectedAddress === '') {
      next({ name: 'login', query: { redirect: to.path } })
    } else {
      next()
    }
  }
})

export default router
