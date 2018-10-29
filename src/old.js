const EventEmitter = require('events').EventEmitter
const async = require('async')
const Dnode = require('dnode')
const Eth = require('ethjs')
const EthQuery = require('eth-query')
const StreamProvider = require('web3-stream-provider')
const setupMultiplex = require('./stream-utils.js').setupMultiplex
const PortStream = require('extension-port-stream')
const Web3 = require('web3')
const MetamaskInpageProvider = require('metamask-inpage-provider')
const LocalMessageDuplexStream = require('post-message-stream')

var metamaskStream = new LocalMessageDuplexStream({
  name: 'inpage',
  target: 'contentscript', // just names used for communicating across js contexts in the browser (avoids CORS)
})

var inpageProvider = new MetamaskInpageProvider(metamaskStream)
// set a high max listener count to avoid unnecesary warnings
inpageProvider.setMaxListeners(100)

const proxiedInpageProvider = new Proxy(inpageProvider, {
  // straight up lie that we deleted the property so that it doesnt
  // throw an error in strict mode
  deleteProperty: () => true,
})

window.web3 = new Web3(proxiedInpageProvider)
