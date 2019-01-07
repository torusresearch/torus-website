var Elliptic = require('elliptic').ec
var log = require('loglevel')
var BN = require('bn.js')

var TorusUtils = {
  ec: Elliptic('secp256k1'),
  updateStaticData: function () {
    console.log('updating static data')
  },
  retrieveShares: function (endpoints, email, idToken, cb) {
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
      }).then(res => res.json())
        .then(res => responses.push(res))
        .catch(err => {
          console.error(err)
        })
      promiseArr.push(p)
    }
    Promise.all(promiseArr).then(function () {
      console.log('completed')
      var shares = []
      var nodeIndex = []
      console.log(responses)
      responses.map(response => {
        shares.push(new BN(response.result.hexshare, 16))
        nodeIndex.push(new BN(response.result.index, 10))
      })
      console.log(shares, nodeIndex)
      var privateKey = TorusUtils.lagrangeInterpolation(shares.slice(2), nodeIndex.slice(2))
      var key = TorusUtils.ec.keyFromPrivate(privateKey.toString('hex'), 'hex')
      var publicKey = key.getPublic().encode('hex').slice(2)
      var ethAddressLower = '0x' + window.web3.utils.keccak256(Buffer.from(publicKey, 'hex')).slice(64 - 38) // remove 0x
      var ethAddress = window.web3.utils.toChecksumAddress(ethAddressLower)
      // sessionStorage.setItem('ethAddress', ethAddress) // TODO: checksum address
      // console.log(window.web3.utils.keccak256(Buffer.from(publicKey, 'hex')))
      // sessionStorage.setItem('wallet', JSON.stringify({})) // reset wallet when logging in
      // var wallet = JSON.parse(sessionStorage.getItem('wallet'))
      // wallet[ethAddress] = privateKey.toString('hex')
      // sessionStorage.setItem('wallet', JSON.stringify(wallet))
      // console.log('Ethereum Address: ' + sessionStorage.getItem('ethAddress'))
      cb(null, {
        ethAddress,
        privKey: privateKey
      })
    })
  },
  lagrangeInterpolation: function (shares, nodeIndex) {
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
          upper = upper.umod(TorusUtils.ec.curve.n)
          let temp = nodeIndex[i].sub(nodeIndex[j])
          temp = temp.umod(TorusUtils.ec.curve.n)
          lower = lower.mul(temp).umod(TorusUtils.ec.curve.n)
        }
      }
      let delta = upper.mul(lower.invm(TorusUtils.ec.curve.n)).umod(TorusUtils.ec.curve.n)
      delta = delta.mul(shares[i]).umod(TorusUtils.ec.curve.n)
      secret = secret.add(delta)
    }
    return secret.umod(TorusUtils.ec.curve.n)
  },
  getPubKeyAsync: function (endpoints, email, cb) {
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
      }).then(res => res.json())
        .then(res => shares.push(res))
        .catch(err => {
          console.error(err)
        })
      promiseArr.push(p)
    }
    Promise.all(promiseArr).then(function () {
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
        }).then(res => res.json())
          .then(res => shares.push(res))
          .catch(err => {
            console.error(err)
          })
        promiseArr.push(p)
      }
      return Promise.all(promiseArr)
    }).then(function () {
      try {
        console.log('completed')
        console.log(shares)
        var Xs = {}
        var Ys = {}
        shares.map(function (share) {
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
        var pubk = TorusUtils.ec.keyFromPublic({
          x: finalX,
          y: finalY
        }).pub
        console.log(pubk.encode('hex'))
        var publicKey = pubk.encode('hex').slice(2)
        var ethAddress = '0x' + window.web3.utils.keccak256(Buffer.from(publicKey, 'hex')).slice(64 - 38)
        console.log(ethAddress)
        cb(null, ethAddress)
      } catch (err) {
        cb(err, null)
      }
    })
  }
}

export default TorusUtils
