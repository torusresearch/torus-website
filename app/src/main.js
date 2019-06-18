import Vue from 'vue'
import './plugins'
import App from './App.vue'
import router from './router'
import store from './store'
import log from 'loglevel'
import './registerServiceWorker'
// import torus from './torus'

log.setDefaultLevel('info')
console.log('NODE_ENV', process.env.NODE_ENV)

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
