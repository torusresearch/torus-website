
console.log('INJECTED IN', window.location.href)

cleanContextForImports()
var Web3 = require('web3')
const log = require('loglevel')
const LocalMessageDuplexStream = require('post-message-stream')
const MetamaskInpageProvider = require('./inpage-provider.js')
const setupMultiplex = require('./stream-utils.js').setupMultiplex
const embedUtils = require('./embedUtils.js')

//const styleColor = document.currentScript.getAttribute('style-color'); 
const styleColor = 'black';
const stylePosition = document.currentScript.getAttribute('style-position'); 

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
    <div id="torusWidget" class="widget">\
      <button id="torusLogin" />\
      <button id="torusMenuBtn"/>\
    </div>\
  ');
  var ifrm = embedUtils.htmlToElement('\
    <div id="torusIframeContainer">\
      <iframe id="torusIFrame" frameBorder="0" src="https://localhost:3000/widget"></iframe>\
    </div>\
  ');
  var bindOnLoad = function() {
    var loginBtn = document.getElementById("torusLogin");
    loginBtn.addEventListener("click", function() {
      window.communicationStream.write({name: "oauth", data: "test"})
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

  var torusMenuBtn = document.getElementById("torusMenuBtn");
  torusMenuBtn.addEventListener("click", function() {
    window.document.getElementById('torusMenuBtn').style.display = 'none';
    window.document.getElementById('torusIframeContainer').style.display = 'block';
  })

  torusMenuBtn.style.backgroundColor = styleColor;
  document.getElementById("torusLogin").style.backgroundColor = styleColor;
  console.log("STYLE POSITION: " + stylePosition);
  switch(stylePosition) {
    case 'top-left':
      document.getElementById("torusWidget").style.top = '8px';
      document.getElementById("torusWidget").style.left = '8px';
      break;
    case 'top-right':
      document.getElementById("torusWidget").style.top = '8px';
      document.getElementById("torusWidget").style.right = '8px';
      break;
    case 'bottom-right':
      document.getElementById("torusWidget").style.bottom = '8px';
      document.getElementById("torusWidget").style.right = '8px';
      break;
    case 'bottom-left':
      document.getElementById("torusWidget").style.bottom = '8px';
      document.getElementById("torusWidget").style.left = '8px';
      break;
    default:
      document.getElementById("torusWidget").style.bottom = '8px';
      document.getElementById("torusWidget").style.left = '8px';
  }

}

function setupWeb3() {
  console.log('setupWeb3 running')
  // setup background connection
  window.metamaskStream = new LocalMessageDuplexStream({
    name: 'embed_metamask',
    target: 'iframe_metamask',
    targetWindow: window.document.getElementById('torusIFrame').contentWindow
  })
  window.metamaskStream.setMaxListeners(100)

  // Due to compatibility reasons, we cannot set up multiplexing on window.metamaskstream
  // because the MetamaskInpageProvider also attempts to do so.
  // We create another LocalMessageDuplexStream for communication between dapp <> iframe
  window.communicationStream = new LocalMessageDuplexStream({
    name: 'embed_comm',
    target: 'iframe_comm',
    targetWindow: window.document.getElementById('torusIFrame').contentWindow
  })
  window.communicationStream.setMaxListeners(100)

  // compose the inpage provider
  var inpageProvider = new MetamaskInpageProvider(window.metamaskStream)
  inpageProvider.setMaxListeners(100)
  window.ethereum = inpageProvider
  inpageProvider.enable = function() {
    return new Promise((resolve, reject) => resolve())
  }

  var commMux = setupMultiplex(window.communicationStream);
  commMux.setMaxListeners(100)

  var widget = commMux.createStream('widget')
  widget.on('data', function() {
    window.document.getElementById('torusLogin').style.display = 'none';
    window.document.getElementById('torusIframeContainer').style.display = 'none';
    window.document.getElementById('torusMenuBtn').style.display = 'block';
  })

  var approveTransactionDisplay = commMux.createStream('approveTransactionDisplay');
  approveTransactionDisplay.on('data', function() {
    window.document.getElementById('torusIframeContainer').style.display = 'block';
  });

  var sendTransaction = commMux.createStream('sendTransaction');
  sendTransaction.on('data', function() {
    window.web3.eth.sendTransaction({from: arguments[0].from, to: arguments[0].to, value: arguments[0].value, gasLimit: 21000, gasPrice: 20000000000}, function(error, hash) {
        if (error) {
          console.log(error);
        } else {
          console.log(hash);
        }
      })
  });

  var closeWindow = commMux.createStream('close');
  closeWindow.on('data', function() {
    console.log("CLOSE CALLED");
    window.document.getElementById('torusIframeContainer').style.display = 'none';
    window.document.getElementById('torusMenuBtn').style.display = 'block';
  });

  var denyTransaction = commMux.createStream('denyTransaction');
  denyTransaction.on('data', function() {
    window.document.getElementById('torusIframeContainer').style.display = 'none';
    window.document.getElementById('torusMenuBtn').style.display = 'block';
      
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
