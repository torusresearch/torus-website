import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import router from './router'
import store from './store'
import log from 'loglevel'
import torusUtils from './utils/torusUtils'

log.setDefaultLevel('info')

Vue.use(require('vue-script2'))
Vue.use(Vuex)
Vue.config.productionTip = false

Object.defineProperty(Vue.prototype, 'TorusUtils', { value: torusUtils })

var vue = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

window.Vue = vue
