import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import log from 'loglevel'
import torus from './torus'

log.setDefaultLevel('info')

Vue.use(require('vue-script2'))

Vue.config.productionTip = false

Object.defineProperty(Vue.prototype, 'torus', { value: torus })
Object.defineProperty(Vue.prototype, 'Buffer', { value: Buffer })

var vue = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

window.Vue = vue
