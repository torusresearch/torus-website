import randomId from 'random-id'
import onloadTorus from './onload.js'

// import WebsocketSubprovider from './websocket.js'
var Elliptic = require('elliptic').ec
var log = require('loglevel')
var BN = require('bn.js')
const setupMultiplex = require('./utils/setupMultiplex').default
const toChecksumAddress = require('./utils/toChecksumAddress').default
// Make this a class. Use ES6
class Torus {
  instanceId = randomId()
  ec = Elliptic('secp256k1')
  setupMultiplex = setupMultiplex
  continueEnable(selectedAddress) {
    log.info('ENABLE WITH: ', selectedAddress)
    var oauthStream = this.communicationMux.getStream('oauth')
    oauthStream.write({ selectedAddress: selectedAddress })
  }
  updateStaticData(payload) {
    log.info('STATIC DATA:', payload)
    var publicConfigOutStream = this.metamaskMux.getStream('publicConfig')
    // JSON.stringify is used here even though the stream is in object mode
    // because it is parsed in the dapp context, this behavior emulates nonobject mode
    // for compatibility reasons when using pump
    if (payload.selectedAddress) {
      publicConfigOutStream.write(JSON.stringify({ selectedAddress: payload.selectedAddress }))
    } else if (payload.networkId) {
      publicConfigOutStream.write(JSON.stringify({ networkVersion: payload.networkId }))
    }
  }
  retrieveShares(endpoints, indexes, email, idToken, cb) {
    var promiseArr = []
    var responses = []
    var shareResponses = new Array(endpoints.length)
    // CommitmentRequestParams struct {
    //   MessagePrefix      string `json:"messageprefix"`
    //   TokenCommitment    string `json:"tokencommitment"`
    //   TempPubX           string `json:"temppubx"`
    //   TempPubY           string `json:"temppuby"`
    //   Timestamp          string `json:"timestamp"`
    //   VerifierIdentifier string `json:"verifieridentifier"`
    // }
    console.log(idToken)
    var tmpKey = this.ec.genKeyPair()
    var pubKey = tmpKey.getPublic()
    var tokenCommitment = this.web3.utils.keccak256(idToken)
    console.log(tokenCommitment)
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
          method: 'CommitmentRequest',
          id: 10,
          params: {
            messageprefix: 'mug00',
            tokencommitment: tokenCommitment.slice(2),
            temppubx: pubKey.getX().toString('hex'),
            temppuby: pubKey.getY().toString('hex'),
            timestamp: (Date.now() - 2000).toString().slice(0, 10),
            verifieridentifier: 'google'
          }
        })
      })
        .then(res => {
          if (res.ok) {
            return res.json()
          } else {
            throw new Error('Could not connect', res)
          }
        })
        .then(res => responses.push(res))
        .catch(err => {
          console.error(err)
        })
      promiseArr.push(p)
    }
    Promise.all(promiseArr)
      .then(() => {
        promiseArr = []

        // ShareRequestParams struct {
        //   Item []bijson.RawMessage `json:"item"`
        // }
        // ShareRequestItem struct {
        //   IDToken            string          `json:"idtoken"`
        //   NodeSignatures     []NodeSignature `json:"nodesignatures"`
        //   VerifierIdentifier string          `json:"verifieridentifier"`
        // }
        // NodeSignature struct {
        //   Signature   string
        //   Data        string
        //   NodePubKeyX string
        //   NodePubKeyY string
        // }
        // CommitmentRequestResult struct {
        //   Signature string `json:"signature"`
        //   Data      string `json:"data"`
        //   NodePubX  string `json:"nodepubx"`
        //   NodePubY  string `json:"nodepuby"`
        // }
        var nodeSigs = []
        for (var i = 0; i < responses.length; i++) {
          nodeSigs.push(responses[i].result)
        }
        for (i = 0; i < endpoints.length; i++) {
          let t = i
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
                item: [{ idtoken: idToken, nodesignatures: nodeSigs, verifieridentifier: 'google', email: email }]
              }
            })
          })
            .then(res => res.json())
            .then(res => {
              console.log('shareresponse here', res)
              shareResponses[t] = res
            })
            .catch(err => {
              console.error(err)
            })
          promiseArr.push(p)
        }
        return Promise.all(promiseArr)
      })
      .then(() => {
        try {
          // ShareRequestResult struct {
          //   Keys []KeyAssignment
          // }
          //         / KeyAssignmentPublic -
          // type KeyAssignmentPublic struct {
          // 	Index     big.Int
          // 	PublicKey common.Point
          // 	Threshold int
          // 	Verifiers map[string][]string // Verifier => VerifierID
          // }

          // // KeyAssignment -
          // type KeyAssignment struct {
          // 	KeyAssignmentPublic
          // 	Share big.Int // Or Si
          // }
          log.info('completed')
          var shares = []
          var nodeIndex = []
          log.info(shareResponses)
          for (var i = 0; i < shareResponses.length; i++) {
            if (shareResponses[i]) {
              shares.push(new BN(shareResponses[i].result.keys[0].Share, 16))
              nodeIndex.push(new BN(indexes[i], 16))
            }
          }
          log.info(shares, nodeIndex)
          var privateKey = this.lagrangeInterpolation(shares.slice(0, 3), nodeIndex.slice(0, 3))
          var ethAddress = this.generateAddressFromPrivKey(privateKey)
          cb(null, {
            ethAddress,
            privKey: privateKey.toString('hex')
          })
        } catch (err) {
          cb(err, null)
        }
      })
  }
  lagrangeInterpolation(shares, nodeIndex) {
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
          upper = upper.umod(this.ec.curve.n)
          let temp = nodeIndex[i].sub(nodeIndex[j])
          temp = temp.umod(this.ec.curve.n)
          lower = lower.mul(temp).umod(this.ec.curve.n)
        }
      }
      let delta = upper.mul(lower.invm(this.ec.curve.n)).umod(this.ec.curve.n)
      delta = delta.mul(shares[i]).umod(this.ec.curve.n)
      secret = secret.add(delta)
    }
    return secret.umod(this.ec.curve.n)
  }
  generateAddressFromPrivKey(privateKey) {
    var key = this.ec.keyFromPrivate(privateKey.toString('hex'), 'hex')
    var publicKey = key
      .getPublic()
      .encode('hex')
      .slice(2)
    var ethAddressLower = '0x' + this.web3.utils.keccak256(Buffer.from(publicKey, 'hex')).slice(64 - 38) // remove 0x
    var ethAddress = toChecksumAddress(ethAddressLower)
    return ethAddress
  }
  getPubKeyAsync(web3, endpoints, email, cb) {
    var promiseArr = []
    var shares = []
    var p = fetch(endpoints[Math.floor(Math.random() * endpoints.length)], {
      method: 'POST',
      cache: 'no-cache',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'KeyAssign',
        id: 10,
        params: {
          verifier: 'google',
          verifier_id: email
        }
      })
    })
      .then(res => res.json())
      .then(res => shares.push(res))
      .catch(err => {
        console.error(err)
      })
    promiseArr.push(p)

    // set a time out here
    // lets do a retry

    Promise.all(promiseArr)
      .then(() => {
        promiseArr = []
        shares = []
        var p = fetch(endpoints[Math.floor(Math.random() * endpoints.length)], {
          method: 'POST',
          cache: 'no-cache',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'VerifierLookupRequest',
            id: 10,
            params: {
              verifier: 'google',
              verifier_id: email
            }
          })
        })
          .then(res => res.json())
          .then(res => shares.push(res))
          .catch(err => {
            console.error(err)
          })
        promiseArr.push(p)
        return Promise.all(promiseArr)
      })
      .then(() => {
        try {
          log.info('completed')
          log.info(shares)

          var ethAddress = shares[0].result.keys[0].address
          log.info(ethAddress)
          cb(null, ethAddress)
        } catch (err) {
          cb(err, null)
        }
      })
  }
}

/* Inialize torus object on load */
const torus = onloadTorus(new Torus())

export default torus
