import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

var BN = require('./vendor/bn.js')
var elliptic = require('./vendor/elliptic.js')
var log = require('./vendor/loglevel.js')
var web3 = window.web3

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

// Setup vendor imports
Object.defineProperty(Vue.prototype, '$BN', {
  value: BN
})
Object.defineProperty(Vue.prototype, '$elliptic', {
  value: elliptic
})
Object.defineProperty(Vue.prototype, '$log', {
  value: log
})
Object.defineProperty(Vue.prototype, '$web3', {
  value: web3
})
