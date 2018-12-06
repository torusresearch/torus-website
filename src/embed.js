
console.log('INJECTED IN', window.location.href)

cleanContextForImports()
var Web3 = require('web3')
const log = require('loglevel')
const LocalMessageDuplexStream = require('post-message-stream')
const MetamaskInpageProvider = require('./inpage-provider.js')
const setupMultiplex = require('./stream-utils.js').setupMultiplex
var mux, widget
restoreContextAfterImports()
log.setDefaultLevel(process.env.METAMASK_DEBUG ? 'debug' : 'warn')

createWidget()
setupWeb3()


/**
 * Create widget
 */
function createWidget() {
  console.log('Creating Torus widget...')

  var onLoad = function() {
    var link = window.document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    link.setAttribute('href', 'https://localhost:3000/widget.css');
    window.document.head.appendChild(link);
    var ifrm = window.document.createElement('iframe');
    ifrm.setAttribute('id', 'torusIFrame'); // assign an id
    ifrm.setAttribute("height", "0")
    ifrm.setAttribute("width", "0")
    ifrm.setAttribute("src", "https://localhost:3000/widget")
    window.document.body.appendChild(ifrm)
    var elem = htmlToElement('\
    <div id="torusWidget">\
      <button id="torusButton">\
      </button>\
      <button id="torusLogin" tabIndex="-1">\
      </button>\
      <div id="torusContainer"">\
        <table style="width:100%">\
          <tr>\
            <th> <img src="https://localhost:3000/images/logo.png" alt="Torus Logo" width="172.8" height="42.5" /></th>\
          </tr>\
          <tr style="justify-content: center;">\
            <th id="torusEmail" > example@gmail.com </th>\
          </tr>\
          <tr id="torusLabel" style="justify-content: center;">\
              <th> Address </th>\
          </tr>\
          <tr style="justify-content: center; font-size:7px">\
            <th id="torusAddress"> 0x00000000000000000000 </th>\
          </tr>\
          <tr id="torusLabel" style="justify-content: center;">\
            <th> Balance </th>\
          </tr>\
          <tr justify-content: center;">\
            <th id="torusBalance"> 0 ETH </th>\
          </tr>\
          <tr id="torusTransactions" style="justify-content: center;">\
            <th> Transactions </th>\
          </tr>\
          <tr id="torusLogOut" style="justify-content: center;">\
            <th> <button> Log Out </button> </th>\
          </tr>\
        </table>\
      </div>\
    </div>')
    window.document.body.appendChild(elem)
    window.document.getElementById('torusContainer').style.display = 'none';
    window.document.getElementById('torusButton').style.display = 'none';


    var retry = window.setInterval(function() {
      console.log('running')
      if (window.document.readyState !== "complete") {
        return
      }
      var coll = document.getElementById("torusLogin");
      coll.addEventListener("click", function() {
        window.metamaskStream.write({name: "oauth", data: "test"})
      })

      var collapsibleButton = document.getElementById("torusButton");
      collapsibleButton.addEventListener("click", function() {
        if (window.document.getElementById('torusContainer').style.display === 'none') {
          window.document.getElementById('torusContainer').style.display = 'flex';
        } else {
          window.document.getElementById('torusContainer').style.display = 'none';
        }
      })
      window.clearInterval(retry)
    }, 300)

    var updateBalance = window.setInterval(function() {
      // Update balance and transaction history if torus container is visible
      if (window.document.getElementById('torusContainer').style.display === 'flex') {
        console.log("UPDATING BALANCE");
        var ethAddress = window.document.getElementById('torusAddress').innerHTML;
        var checkSumAddress = window.web3.toChecksumAddress(ethAddress)
        // This uodate the balance of the user's ethereum address, but causes transactions to fail
        // Need to figure out what's wrong
        // window.web3.eth.getBalance(checkSumAddress, function(error, result){
        //    if(!error) {
        //     var accountBalance = Number(window.web3.fromWei(result));
        //     var accountBalanceContent = accountBalance.toFixed(4) + " ETH";
        //     window.document.getElementById('torusBalance').innerHTML = accountBalanceContent;
        //   } else {
        //     console.error(error);
        //   }
        // })
      }
    }, 3000)
  }
  if (window.document.body != null) {
    onLoad()
  } else {
    document.addEventListener("DOMContentLoaded", onLoad);
  }
}

function setupWeb3() {
  var onLoad = function() {
    console.log('setupWeb3 running')
    // setup background connection
    window.metamaskStream = new LocalMessageDuplexStream({
      name: 'embed',
      target: 'iframe',
      targetWindow: document.getElementById("torusIFrame").contentWindow
    })
    window.connectionStream = new LocalMessageDuplexStream({
      name: 'embed2',
      target: 'iframe2',
      targetWindow: document.getElementById("torusIFrame").contentWindow
    })
    mux = setupMultiplex(window.connectionStream)
    widget = mux.createStream('widget')
    widget.on('data', function() {
      console.log('Received data for widget', arguments)
      window.document.getElementById('torusLogin').style.display = 'none';
      window.document.getElementById('torusButton').style.display = 'flex';
      window.document.getElementById('torusAddress').innerHTML = arguments[0].ethAddress;
      window.document.getElementById('torusEmail').innerHTML = arguments[0].email;
      window.document.getElementById('torusBalance').innerHTML = arguments[0].balance;
    })
    // compose the inpage provider
    var inpageProvider = new MetamaskInpageProvider(window.metamaskStream)
    inpageProvider.setMaxListeners(1000)
    
    // inpageProvider.enable = function (options = {}) {
    //   return new Promise((resolve, reject) => {
    //     if (options.mockRejection) {
    //       reject('User rejected account access')
    //     } else {
    //       inpageProvider.sendAsync({ method: 'eth_accounts', params: [] }, (error, response) => {
    //         if (error) {
    //           reject(error)
    //         } else {
    //           resolve(response.result)
    //         }
    //       })
    //     }
    //   })
    // }
    
    //
    // setup web3
    //
    
    if (typeof window.web3 !== 'undefined') {
      throw new Error(`Torus detected another web3.
        Torus will not work reliably with another web3 extension.
        This usually happens if you have two Torus' installed,
        or Torus and another web3 extension. Please remove one
        and try again.`)
    }
    window.web3 = new Web3(inpageProvider)
    web3.setProvider = function () {
      log.debug('MetaMask - overrode web3.setProvider')
    }
    // pretend to be Metamask for dapp compatibility reasons
    web3.currentProvider.isMetamask = true
    web3.currentProvider.isTorus = true
    log.debug('MetaMask - injected web3')
  }
  if (window.document.body != null) {
    onLoad()
  } else {
    document.addEventListener("DOMContentLoaded", onLoad)
  }
}


// export global web3, with usage-detection and deprecation warning

/* TODO: Uncomment this area once auto-reload.js has been deprecated:
let hasBeenWarned = false
global.web3 = new Proxy(web3, {
  get: (_web3, key) => {
    // show warning once on web3 access
    if (!hasBeenWarned && key !== 'currentProvider') {
      console.warn('MetaMask: web3 will be deprecated in the near future in favor of the ethereumProvider \nhttps://github.com/MetaMask/faq/blob/master/detecting_metamask.md#web3-deprecation')
      hasBeenWarned = true
    }
    // return value normally
    return _web3[key]
  },
  set: (_web3, key, value) => {
    // set value normally
    _web3[key] = value
  },
})
*/

// set web3 defaultAccount
// inpageProvider.publicConfigStore.subscribe(function (state) {
//   web3.eth.defaultAccount = state.selectedAddress
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

function htmlToElement(html) {
  var template = window.document.createElement('template');
  html = html.trim(); // Never return a text node of whitespace as the result
  template.innerHTML = html;
  return template.content.firstChild;
}
