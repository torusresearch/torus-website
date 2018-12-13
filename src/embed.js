
console.log('INJECTED IN', window.location.href)

cleanContextForImports()
var Web3 = require('web3')
const log = require('loglevel')
const LocalMessageDuplexStream = require('post-message-stream')
const MetamaskInpageProvider = require('./inpage-provider.js')
const setupMultiplex = require('./stream-utils.js').setupMultiplex
const embedUtils = require('./embedUtils.js')
var ifrm

restoreContextAfterImports()
log.setDefaultLevel(process.env.METAMASK_DEBUG ? 'debug' : 'warn')
createWidget()
embedUtils.runOnLoad(setupWeb3)

/**
 * Create widget
 */
function createWidget() {
  console.log('Creating Torus widget...')
  var link = window.document.createElement('link');
  link.setAttribute('rel', 'stylesheet');
  link.setAttribute('type', 'text/css');
  link.setAttribute('href', 'https://localhost:3000/widget.css');
  var elem = embedUtils.htmlToElement('\
    <div id="torusWidget">\
      <button id="torusLogin" tabIndex="-1" />\
    </div>\
  ');
  var ifrm = embedUtils.htmlToElement('\
    <div id="torusIframeContainer">\
      <iframe id="torusIFrame" src="https://localhost:3000/widget"></iframe>\
    </div>\
  ');
  var bindOnLoad = function() {
    elem.addEventListener("click", function() {
      window.metamaskStream.write({name: "oauth", data: "test"})
    })
  }
  var attachOnLoad = function() {
    window.document.head.appendChild(link)
    window.document.body.appendChild(ifrm)
    window.document.body.appendChild(elem)
    // embedUtils.runOnComplete(bindOnComplete)
  }
  embedUtils.runOnLoad(attachOnLoad)
  embedUtils.runOnLoad(bindOnLoad)
}

function setupWeb3() {
  console.log('setupWeb3 running')
  // setup background connection
  window.metamaskStream = new LocalMessageDuplexStream({
    name: 'embed',
    target: 'iframe',
    targetWindow: window.document.getElementById('torusIFrame').contentWindow
  })
  // compose the inpage provider
  var inpageProvider = new MetamaskInpageProvider(window.metamaskStream)
  inpageProvider.setMaxListeners(100)
  window.ethereum = inpageProvider
  inpageProvider.enable = function() {
    return new Promise((resolve, reject) => resolve())
  }

  var mux = setupMultiplex(window.metamaskStream);
  var approveTransactionDisplay = mux.createStream('approveTransactionDisplay');
  approveTransactionDisplay.on('data', function() {
    window.document.getElementById('torusIframeContainer').style.display = 'block';
  });

  var denyTransaction = mux.createStream('denyTransaction');
  denyTransaction.on('data', function() {
    window.document.getElementById('torusIframeContainer').style.display = 'none';
      
    // Send transaction with denyTransaction and completed field
    window.web3.eth.sendTransaction({
      from: arguments[0].params.from,
      to: arguments[0].params.to,
      data: arguments[0].params.data,
      value: arguments[0].params.value,
      nonce: arguments[0].params.nonce,
      id: arguments[0].params.id,
      denyTransaction: true,
      completed: true
    }, function(error, hash){
      console.log(error);
    });
  });

  
  // TODO: implement inpageProvider.enable
  
  if (typeof window.web3 !== 'undefined') {
    throw new Error(`Torus detected another web3.
      Torus will not work reliably with another web3 extension.
      This usually happens if you have two Torus' installed,
      or Torus and another web3 extension. Please remove one
      and try again.`)
  }
  window.web3 = new Web3(inpageProvider)
  console.log(Web3.version)
  window.torus = window.web3
  window.web3.setProvider = function () {
    log.debug('Torus - overrode web3.setProvider')
  }
  // pretend to be Metamask for dapp compatibility reasons
  window.web3.currentProvider.isMetamask = true
  window.web3.currentProvider.isTorus = true
  log.debug('Torus - injected web3')
}

// set web3 defaultAccount
// inpageProvider.publicConfigStore.subscribe(function (state) {
//   window.web3.eth.defaultAccount = state.selectedAddress
// })

// need to make sure we aren't affected by overlapping namespaces
// and that we dont affect the app with our namespace
// mostly a fix for web3's BigNumber if AMD's "define" is defined...
var __define

/**
 * Caches reference to global define object and deletes it to
 * avoid conflicts with other global define objects, such as
 * AMD's define function
 */
function cleanContextForImports () {
  __define = global.define
  try {
    global.define = undefined
  } catch (_) {
    console.warn('MetaMask - global.define could not be deleted.')
  }
}

/**
 * Restores global define object from cached reference
 */
function restoreContextAfterImports () {
  try {
    global.define = __define
  } catch (_) {
    console.warn('MetaMask - global.define could not be overwritten.')
  }
}
