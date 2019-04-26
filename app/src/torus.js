import randomId from 'random-id'
import onloadTorus from './onload.js'

// import WebsocketSubprovider from './websocket.js'
var Elliptic = require('elliptic').ec
var log = require('loglevel')
var BN = require('bn.js')
const setupMultiplex = require('./utils/setupMultiplex').default
const toChecksumAddress = require('./utils/toChecksumAddress').default

var torus = {
  instanceId: randomId(),
  ec: Elliptic('secp256k1'),
  setupMultiplex,
  continueEnable: function(selectedAddress) {
    log.info('ENABLE WITH: ', selectedAddress)
    var oauthStream = torus.communicationMux.getStream('oauth')
    oauthStream.write({ selectedAddress: selectedAddress })
  },
  updateStaticData: function(payload) {
    log.info('STATIC DATA:', payload)
    var publicConfigOutStream = torus.metamaskMux.getStream('publicConfig')
    // JSON.stringify is used here even though the stream is in object mode
    // because it is parsed in the dapp context, this behavior emulates nonobject mode
    // for compatibility reasons when using pump
    if (payload.selectedAddress) {
      publicConfigOutStream.write(JSON.stringify({ selectedAddress: payload.selectedAddress }))
    } else if (payload.networkId) {
      publicConfigOutStream.write(JSON.stringify({ networkVersion: payload.networkId }))
    }
  },
  retrieveShares: function(endpoints, email, idToken, cb) {
    var promiseArr = []
    var responses = []
    for (var i = 0; i < endpoints.length; i++) {
      var p = fetch(endpoints[i], {
        method: 'POST',
        cache: 'no-cache',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'ShareRequest',
          id: 10,
          params: {
            index: 0,
            idtoken: idToken,
            email: email
          }
        })
      })
        .then(res => res.json())
        .then(res => responses.push(res))
        .catch(err => {
          console.error(err)
        })
      promiseArr.push(p)
    }
    Promise.all(promiseArr).then(function() {
      log.info('completed')
      var shares = []
      var nodeIndex = []
      log.info(responses)
      responses.map(response => {
        shares.push(new BN(response.result.hexshare, 16))
        nodeIndex.push(new BN(response.result.index, 10))
      })
      log.info(shares, nodeIndex)
      var privateKey = torus.lagrangeInterpolation(shares.slice(0, 3), nodeIndex.slice(0, 3))
      var key = torus.ec.keyFromPrivate(privateKey.toString('hex'), 'hex')
      var publicKey = key
        .getPublic()
        .encode('hex')
        .slice(2)
      var ethAddressLower = '0x' + torus.web3.utils.keccak256(Buffer.from(publicKey, 'hex')).slice(64 - 38) // remove 0x
      var ethAddress = toChecksumAddress(ethAddressLower)
      cb(null, {
        ethAddress,
        privKey: privateKey.toString('hex')
      })
    })
  },
  lagrangeInterpolation: function(shares, nodeIndex) {
    if (shares.length !== nodeIndex.length) {
      log.error('Shares do not match up')
      return null
    }
    var secret = new BN(0)
    for (let i = 0; i < shares.length; i++) {
      var upper = new BN(1)
      var lower = new BN(1)
      for (let j = 0; j < shares.length; j++) {
        if (i !== j) {
          upper = upper.mul(nodeIndex[j].neg())
          upper = upper.umod(torus.ec.curve.n)
          let temp = nodeIndex[i].sub(nodeIndex[j])
          temp = temp.umod(torus.ec.curve.n)
          lower = lower.mul(temp).umod(torus.ec.curve.n)
        }
      }
      let delta = upper.mul(lower.invm(torus.ec.curve.n)).umod(torus.ec.curve.n)
      delta = delta.mul(shares[i]).umod(torus.ec.curve.n)
      secret = secret.add(delta)
    }
    return secret.umod(torus.ec.curve.n)
  },
  getPubKeyAsync: function(web3, endpoints, email, cb) {
    var promiseArr = []
    var shares = []
    for (var i = 0; i < endpoints.length; i++) {
      var p = fetch(endpoints[i], {
        method: 'POST',
        cache: 'no-cache',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'SecretAssign',
          id: 10,
          params: {
            email
          }
        })
      })
        .then(res => res.json())
        .then(res => shares.push(res))
        .catch(err => {
          console.error(err)
        })
      promiseArr.push(p)
    }
    Promise.all(promiseArr)
      .then(function() {
        promiseArr = []
        shares = []
        for (var i = 0; i < endpoints.length; i++) {
          var p = fetch(endpoints[i], {
            method: 'POST',
            cache: 'no-cache',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({
              jsonrpc: '2.0',
              method: 'SecretAssign',
              id: 10,
              params: {
                email
              }
            })
          })
            .then(res => res.json())
            .then(res => shares.push(res))
            .catch(err => {
              console.error(err)
            })
          promiseArr.push(p)
        }
        return Promise.all(promiseArr)
      })
      .then(function() {
        try {
          log.info('completed')
          log.info(shares)
          var Xs = {}
          var Ys = {}
          shares.map(function(share) {
            if (share.result && share.result.PubShareX) {
              if (Xs[share.result.PubShareX] === undefined) {
                Xs[share.result.PubShareX] = 1
              } else {
                Xs[share.result.PubShareX]++
              }
            }
            if (share.result && share.result.PubShareY) {
              if (Ys[share.result.PubShareY] === undefined) {
                Ys[share.result.PubShareY] = 1
              } else {
                Ys[share.result.PubShareY]++
              }
            }
          })
          var finalX
          var finalY
          for (let key in Xs) {
            if (Xs[key] >= 3) {
              finalX = key
            }
          }
          for (let key in Ys) {
            if (Ys[key] >= 3) {
              finalY = key
            }
          }
          var pubk = torus.ec.keyFromPublic({
            x: finalX,
            y: finalY
          }).pub
          log.info(pubk.encode('hex'))
          var publicKey = pubk.encode('hex').slice(2)
          var ethAddress = '0x' + web3.utils.keccak256(Buffer.from(publicKey, 'hex')).slice(64 - 38)
          log.info(ethAddress)
          cb(null, ethAddress)
        } catch (err) {
          cb(err, null)
        }
      })
  }
}

/* Inialize torus object on load */
onloadTorus(torus)

export default torus
