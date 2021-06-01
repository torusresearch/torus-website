import './plugins/bigint'
import './registerServiceWorker'
import './reset.css'

import VueGtm from '@gtm-support/vue2-gtm'
import log from 'loglevel'
import Vue from 'vue'

import App from './App.vue'
import { vuetify } from './plugins'
import router from './router'
import store from './store'
import { installSentry } from './utils/sentry'
// import torus from './torus'

log.enableAll()
Vue.config.productionTip = false

// Loglevel init
const buildEnvironment = process.env.VUE_APP_TORUS_BUILD_ENV
log.info('VUE_APP_TORUS_BUILD_ENV', process.env.VUE_APP_TORUS_BUILD_ENV)
let logLevel
switch (buildEnvironment) {
  case 'binance':
    logLevel = 'error'
    log.setDefaultLevel(logLevel)
    break
  case 'testing':
  case 'development':
  case 'lrc':
    logLevel = 'debug'
    log.setDefaultLevel(logLevel)
    break
  case 'production':
    logLevel = 'error'
    log.setDefaultLevel(logLevel)
    break
  default:
    logLevel = 'error'
    log.setDefaultLevel(logLevel)
    break
}

log.setLevel(logLevel)

Vue.use(VueGtm, {
  id: 'GTM-PDF8MFV', // Your GTM single container ID or array of container ids ['GTM-xxxxxxx', 'GTM-yyyyyyy']
  enabled: buildEnvironment === 'production' || buildEnvironment === 'binance', // defaults to true. change on production
  defer: true, // Defers script execution to end of page load
  debug: false, // Whether or not display console logs debugs (optional)
  loadScript: true,
  vueRouter: router, // Pass the router instance to automatically sync with router (optional)
})

Vue.mixin({
  methods: {
    t(data) {
      if (data === '') return data
      const translated = vuetify.framework.lang.t(`$vuetify.${data}`)
      return translated.replace('$vuetify.', '')
    },
  },
})

installSentry(Vue)

new Vue({
  router,
  store,
  render: (h) => h(App),
  vuetify,
}).$mount('#app')

// window.Vue = vue
