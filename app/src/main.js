import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import * as BN from './vendor/bn.js'
import * as elliptic from './vendor/elliptic.js'
import * as log from './vendor/loglevel.js'
import * as web3 from './vendor/web3.js'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

// Setup vendor imports
Object.defineProperty(Vue.prototype, '$BN', { value: BN })
Object.defineProperty(Vue.prototype, '$elliptic', { value: elliptic })
Object.defineProperty(Vue.prototype, '$log', { value: log })
Object.defineProperty(Vue.prototype, '$web3', { value: web3 })
