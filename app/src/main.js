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
log.setDefaultLevel('info')
Vue.config.productionTip = false

// Loglevel init
const buildEnv = process.env.TORUS_BUILD_ENV
let loglevel
switch (buildEnv) {
  case 'staging':
    logLevel = 'info'
    log.setDefaultLevel(logLevel)
    break
  case 'testing':
    logLevel = 'debug'
    log.setDefaultLevel(logLevel)
    break
  case 'development':
    let logLevel = 'debug'
    log.setDefaultLevel(logLevel)
    break
  default:
    logLevel = 'error'
    log.setDefaultLevel(logLevel)
    log.disableAll()
    break
}
log.info('TORUS_BUILD_ENV', process.env.TORUS_BUILD_ENV)

// Object.defineProperty(Vue.prototype, 'torus', { value: torus })
// Object.defineProperty(Vue.prototype, 'Buffer', { value: Buffer })
new Vue({
  router,
  store,
  render: h => h(App),
  vuetify,
  mounted: () => document.dispatchEvent(new Event('x-app-rendered'))
}).$mount('#app')

// window.Vue = vue
