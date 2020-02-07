import log from 'loglevel'
import Vue from 'vue'
import App from './App.vue'
import { vuetify } from './plugins'
import './registerServiceWorker'
import './reset.css'
import router from './router'
import store from './store'
// import torus from './torus'

log.enableAll()
Vue.config.productionTip = false

// Loglevel init
const buildEnv = process.env.VUE_APP_TORUS_BUILD_ENV
let logLevel
switch (buildEnv) {
  case 'staging':
    logLevel = 'info'
    log.setDefaultLevel(logLevel)
    break
  case 'testing' || 'development' || 'lrc' || 'alpha1':
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

Vue.mixin({
  methods: {
    t(data) {
      return vuetify.framework.lang.t(`$vuetify.${data}`)
    }
  }
})

new Vue({
  router,
  store,
  render: h => h(App),
  vuetify
}).$mount('#app')

// window.Vue = vue
