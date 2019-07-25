import log from 'loglevel'
import Vue from 'vue'
import App from './App.vue'
import './plugins'
import './registerServiceWorker'
import './reset.css'
import router from './router'
import store from './store'
// import torus from './torus'

log.setDefaultLevel('info')
log.info('NODE_ENV', process.env.NODE_ENV)

Vue.config.productionTip = false

// Object.defineProperty(Vue.prototype, 'torus', { value: torus })
// Object.defineProperty(Vue.prototype, 'Buffer', { value: Buffer })

// var vue =
new Vue({
  router,
  store,
  render: h => h(App),
  mounted: () => document.dispatchEvent(new Event('x-app-rendered'))
}).$mount('#app')

// window.Vue = vue
