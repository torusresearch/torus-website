import './registerServiceWorker'
import './reset.css'

import log from 'loglevel'
import Vue from 'vue'
import VueGtm from 'vue-gtm'

import App from './App.vue'
import { vuetify } from './plugins'
import router from './router'
import store from './store'
// import torus from './torus'

log.enableAll()
Vue.config.productionTip = false

// Loglevel init
const buildEnvironment = process.env.VUE_APP_TORUS_BUILD_ENV
let logLevel
switch (buildEnvironment) {
  case 'staging':
    logLevel = 'info'
    log.setDefaultLevel(logLevel)
    break
  case 'testing' || 'development' || 'lrc':
    logLevel = 'debug'
    log.setDefaultLevel(logLevel)
    break
  case 'production':
    logLevel = 'error'
    log.setDefaultLevel(logLevel)
    log.disableAll()
    break
  default:
    logLevel = 'error'
    log.setDefaultLevel(logLevel)
}
log.info('VUE_APP_TORUS_BUILD_ENV', process.env.VUE_APP_TORUS_BUILD_ENV)

Vue.use(VueGtm, {
  id: 'GTM-PDF8MFV', // Your GTM single container ID or array of container ids ['GTM-xxxxxxx', 'GTM-yyyyyyy']
  enabled: buildEnvironment === 'production', // defaults to true.
  debug: false, // Whether or not display console logs debugs (optional)
  loadScript: true,
  vueRouter: router, // Pass the router instance to automatically sync with router (optional)
})

Vue.mixin({
  computed: {
    whiteLabelGlobal() {
      const torusWhiteLabel = localStorage.getItem('torus-white-label')
      return torusWhiteLabel ? { logo: JSON.parse(torusWhiteLabel).logo, isWhiteLabelActive: true } : { isWhiteLabelActive: false }
    },
  },
  methods: {
    t(data) {
      if (data === '') return data
      const translated = vuetify.framework.lang.t(`$vuetify.${data}`)
      return translated.replace('$vuetify.', '')
    },
  },
})

new Vue({
  router,
  store,
  render: (h) => h(App),
  vuetify,
}).$mount('#app')

// window.Vue = vue
