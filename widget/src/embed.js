// Torus loading message
console.log('TORUS INJECTED IN', window.location.href)
if (window.torus === undefined) {
  window.torus = {}
}
cleanContextForImports()
var Web3 = require('web3')
const log = require('loglevel')
log.setDefaultLevel('info')
const LocalMessageDuplexStream = require('post-message-stream')
const MetamaskInpageProvider = require('./inpage-provider.js')
const setupMultiplex = require('./stream-utils.js').setupMultiplex
const embedUtils = require('./embedUtils.js')
const styleColor = document.currentScript.getAttribute('style-color'); 
const stylePosition = document.currentScript.getAttribute('style-position'); 

var torusWidget, torusMenuBtn, torusLogin, torusIframeContainer, torusIframe

restoreContextAfterImports()
createWidget()
embedUtils.runOnLoad(setupWeb3)

/**
 * Create widget
 */
function createWidget() {
  log.info('Creating Torus widget...')
  var link = window.document.createElement('link');
  link.setAttribute('rel', 'stylesheet');
  link.setAttribute('type', 'text/css');
  link.setAttribute('href', 'https://localhost:3000/widget.css');
  torusWidget = embedUtils.htmlToElement('\
    <div id="torusWidget" class="widget">\
    </div>\
  ');
  torusMenuBtn = embedUtils.htmlToElement('\
    <button id="torusMenuBtn"/>\
  ')
  torusLogin = embedUtils.htmlToElement('\
    <button id="torusLogin" />\
  ')
  torusWidget.appendChild(torusMenuBtn)
  torusWidget.appendChild(torusLogin)
  torusIframeContainer = embedUtils.htmlToElement('\
  <div id="torusIframeContainer">\
  </div>\
  ');
  torusIframe = embedUtils.htmlToElement('\
    <iframe id="torusIframe" frameBorder="0" src="https://localhost:3000/widget"></iframe>\
  ')
  torusIframeContainer.appendChild(torusIframe)
  var bindOnLoad = function() {
    torusLogin.addEventListener("click", function() {
      window.torus.communicationStream.write({name: "oauth", data: {}})
    })
  }
  var attachOnLoad = function() {
    window.document.head.appendChild(link)
    window.document.body.appendChild(torusIframe)
    window.document.body.appendChild(torusWidget)
    // embedUtils.runOnComplete(bindOnComplete)
  }
  embedUtils.runOnLoad(attachOnLoad)
  embedUtils.runOnLoad(bindOnLoad)
  torusMenuBtn.addEventListener("click", function() {
    torusMenuBtn.style.display = 'none';
    torusIframe.style.display = 'block';
  })
  torusMenuBtn.style.backgroundColor = styleColor;

  log.info("STYLE POSITION: " + stylePosition);
  switch(stylePosition) {
    case 'top-left':
      torusWidget.style.top = '8px';
      torusWidget.style.left = '8px';
      break;
    case 'top-right':
      torusWidget.style.top = '8px';
      torusWidget.style.right = '8px';
      break;
    case 'bottom-right':
      torusWidget.style.bottom = '8px';
      torusWidget.style.right = '8px';
      break;
    case 'bottom-left':
      torusWidget.style.bottom = '8px';
      torusWidget.style.left = '8px';
      break;
    default:
      torusWidget.style.bottom = '8px';
      torusWidget.style.left = '8px';
  }

}

function setupWeb3() {
  log.info('setupWeb3 running')
  // setup background connection
  window.torus.metamaskStream = new LocalMessageDuplexStream({
    name: 'embed_metamask',
    target: 'iframe_metamask',
    targetWindow: torusIframe.contentWindow
  })
  window.torus.metamaskStream.setMaxListeners(100)

  // Due to compatibility reasons, we should not set up multiplexing on window.metamaskstream
  // because the MetamaskInpageProvider also attempts to do so.
  // We create another LocalMessageDuplexStream for communication between dapp <> iframe
  window.torus.communicationStream = new LocalMessageDuplexStream({
    name: 'embed_comm',
    target: 'iframe_comm',
    targetWindow: torusIframe.contentWindow
  })
  window.torus.communicationStream.setMaxListeners(100)

  // compose the inpage provider
  var inpageProvider = new MetamaskInpageProvider(window.torus.metamaskStream)
  inpageProvider.setMaxListeners(100)
  window.ethereum = inpageProvider
  inpageProvider.enable = function() {
    return new Promise((resolve, reject) => resolve())
  }

  var commMux = setupMultiplex(window.torus.communicationStream);
  window.torus.commMux = commMux

  function torusLoggedIn() {
    if (window.web3 && window.web3.eth.accounts.length > 0) {
      return true
    } else {
      return false
    }
  }

  function showTorusOverlay() {
    torusLogin.style.display = 'none'
    torusMenuBtn.style.display = 'none'
    torusIframeContainer.style.display = 'block'
  }

  function showTorusButton() {
    torusIframeContainer.style.display = 'none'
    if (torusLoggedIn()) {
      torusMenuBtn.style.display = 'block'
      torusLogin.style.display = 'none'
    } else {
      torusLogin.style.display = 'block'
      torusMenuBtn.style.display = 'none'
    }
  }

  var displayStream = commMux.createStream('display')
  displayStream.on('data', function(msg) {
    if (msg === 'close') {
      showTorusButton()
    } else if (msg === 'open') {
      showTorusOverlay()
    }
  })

  
  // TODO: implement inpageProvider.enable
  
  if (typeof window.web3 !== 'undefined') {
    throw new Error(`Torus detected another web3.
      Torus will not work reliably with another web3 extension.
      This usually happens if you have two Torus' installed,
      or Torus and another web3 extension. Please remove one
      and try again.`)
  }

  window.web3 = new Web3(inpageProvider)
  log.info(Web3.version)
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
    log.warn('MetaMask - global.define could not be deleted.')
  }
}

/**
 * Restores global define object from cached reference
 */
function restoreContextAfterImports () {
  try {
    global.define = __define
  } catch (_) {
    log.warn('MetaMask - global.define could not be overwritten.')
  }
}
