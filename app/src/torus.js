import randomId from 'random-id'
import config from './config.js'
import onloadTorus from './onload.js'
import { generateJsonRPCObject, post } from './utils/httpHelpers.js'

// import WebsocketSubprovider from './websocket.js'
var Elliptic = require('elliptic').ec
var log = require('loglevel')
var BN = require('bn.js')
const setupMultiplex = require('./utils/setupMultiplex').default
const toChecksumAddress = require('./utils/toChecksumAddress').default
const ethUtil = require('ethereumjs-util')
// Make this a class. Use ES6
class Torus {
  constructor() {
    this.instanceId = randomId()
    this.ec = Elliptic('secp256k1')
    this.setupMultiplex = setupMultiplex
  }
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
  retrieveShares(endpoints, indexes, email, idToken) {
    // Swallow individual fetch errors to handle node failures
    // catch only logic errors
    return new Promise((resolve, reject) => {
      const promiseArr = []
      /* 
      CommitmentRequestParams struct {
        MessagePrefix      string `json:"messageprefix"`
        TokenCommitment    string `json:"tokencommitment"`
        TempPubX           string `json:"temppubx"`
        TempPubY           string `json:"temppuby"`
        Timestamp          string `json:"timestamp"`
        VerifierIdentifier string `json:"verifieridentifier"`
      } 
      */
      console.log(idToken)
      var tmpKey = this.ec.genKeyPair()
      var pubKey = tmpKey.getPublic()
      var tokenCommitment = this.web3.utils.keccak256(idToken)
      console.log(tokenCommitment)
      for (var i = 0; i < endpoints.length; i++) {
        var p = post(
          endpoints[i],
          generateJsonRPCObject('CommitmentRequest', {
            messageprefix: 'mug00',
            tokencommitment: tokenCommitment.slice(2),
            temppubx: pubKey.getX().toString('hex'),
            temppuby: pubKey.getY().toString('hex'),
            timestamp: (Date.now() - 2000).toString().slice(0, 10),
            verifieridentifier: 'google'
          })
        ).catch(err => {
          console.error(err)
        })
        promiseArr.push(p)
      }
      Promise.all(promiseArr)
        .then(responses => {
          const promiseArrRequest = []
          /*
          ShareRequestParams struct {
            Item []bijson.RawMessage `json:"item"`
          }
          ShareRequestItem struct {
            IDToken            string          `json:"idtoken"`
            NodeSignatures     []NodeSignature `json:"nodesignatures"`
            VerifierIdentifier string          `json:"verifieridentifier"`
          }
          NodeSignature struct {
            Signature   string
            Data        string
            NodePubKeyX string
            NodePubKeyY string
          }
          CommitmentRequestResult struct {
            Signature string `json:"signature"`
            Data      string `json:"data"`
            NodePubX  string `json:"nodepubx"`
            NodePubY  string `json:"nodepuby"`
          }
          */
          var nodeSigs = []
          for (var i = 0; i < responses.length; i++) {
            if (responses[i]) nodeSigs.push(responses[i].result)
          }
          for (i = 0; i < endpoints.length; i++) {
            var p = post(
              endpoints[i],
              generateJsonRPCObject('ShareRequest', {
                item: [{ idtoken: idToken, nodesignatures: nodeSigs, verifieridentifier: 'google', email: email }]
              })
            ).catch(err => {
              console.error(err)
            })
            promiseArrRequest.push(p)
          }
          return Promise.all(promiseArrRequest)
        })
        .then(shareResponses => {
          /*
          ShareRequestResult struct {
            Keys []KeyAssignment
          }
                  / KeyAssignmentPublic -
          type KeyAssignmentPublic struct {
          	Index     big.Int
          	PublicKey common.Point
          	Threshold int
          	Verifiers map[string][]string // Verifier => VerifierID
          }

          // KeyAssignment -
          type KeyAssignment struct {
          	KeyAssignmentPublic
          	Share big.Int // Or Si
          }
          */
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
          resolve({
            ethAddress,
            privKey: privateKey.toString('hex', 64)
          })
        })
        .catch(err => {
          console.error(err)
          reject(err)
        })
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
    var key = this.ec.keyFromPrivate(privateKey.toString('hex', 64), 'hex')
    var publicKey = key
      .getPublic()
      .encode('hex')
      .slice(2)
    var ethAddressLower = '0x' + this.web3.utils.keccak256(Buffer.from(publicKey, 'hex')).slice(64 - 38) // remove 0x
    var ethAddress = toChecksumAddress(ethAddressLower)
    return ethAddress
  }
  getPubKeyAsync(endpointUrl, email) {
    return new Promise((resolve, reject) => {
      post(
        endpointUrl,
        generateJsonRPCObject('VerifierLookupRequest', {
          verifier: 'google',
          verifier_id: email.toLowerCase()
        })
      )
        .catch(err => console.error(err))
        .then(lookupShare => {
          if (lookupShare.error) {
            return post(
              endpointUrl,
              generateJsonRPCObject('KeyAssign', {
                verifier: 'google',
                verifier_id: email.toLowerCase()
              })
            )
          } else if (lookupShare.result) {
            return this.getLookupPromise(lookupShare)
          }
        })
        .catch(err => console.error(err))
        .then(lookupShare => {
          log.info('completed')
          log.info(lookupShare)
          var ethAddress = lookupShare.result.keys[0].address
          log.info(ethAddress)
          resolve(ethAddress)
        })
        .catch(err => {
          log.error(err)
          reject(err)
        })
    })
  }
  getLookupPromise(lookupShare) {
    return new Promise((resolve, reject) => resolve(lookupShare))
  }

  getMessageForSigning(publicAddress) {
    return new Promise((resolve, reject) => {
      post(`${config.api}/auth/message`, {
        public_address: publicAddress
      })
        .then(response => {
          const { message } = response || {}
          resolve(message)
        })
        .catch(err => {
          log.error(err)
          reject(err)
        })
    })
  }

  hashMessage(message) {
    const bufferedMessage = ethUtil.toBuffer(message)
    return ethUtil.hashPersonalMessage(bufferedMessage)
  }
}

/* Inialize torus object on load */
const torus = onloadTorus(new Torus())

export default torus
