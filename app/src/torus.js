import randomId from 'random-id'
import { keccak256 } from 'web3-utils'
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
const eccrypto = require('eccrypto')

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
  retrieveShares(endpoints, indexes, verifier, verifierParams, idToken) {
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
      log.info(idToken)
      const tmpKey = eccrypto.generatePrivate()
      const pubKey = eccrypto.getPublic(tmpKey).toString('hex')
      const pubKeyX = pubKey.slice(2, 66)
      const pubKeyY = pubKey.slice(66)
      const tokenCommitment = keccak256(idToken)
      log.info(tokenCommitment)
      for (var i = 0; i < endpoints.length; i++) {
        var p = post(
          endpoints[i],
          generateJsonRPCObject('CommitmentRequest', {
            messageprefix: 'mug00',
            tokencommitment: tokenCommitment.slice(2),
            temppubx: pubKeyX,
            temppuby: pubKeyY,
            timestamp: (Date.now() - 2000).toString().slice(0, 10),
            verifieridentifier: verifier
          })
        ).catch(err => {
          log.error(err)
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
                encrypted: 'yes',
                item: [{ ...verifierParams, idtoken: idToken, nodesignatures: nodeSigs, verifieridentifier: verifier }]
              })
            ).catch(err => {
              log.error(err)
            })
            promiseArrRequest.push(p)
          }
          return Promise.all(promiseArrRequest)
        })
        .then(async shareResponses => {
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
          var sharePromises = []
          var nodeIndex = []
          log.info(shareResponses)
          for (var i = 0; i < shareResponses.length; i++) {
            if (shareResponses[i] && shareResponses[i].result && shareResponses[i].result.keys && shareResponses[i].result.keys.length > 0) {
              shareResponses[i].result.keys.sort((a, b) => a.Index.cmp(b.Index))
              if (shareResponses[i].result.keys[0].Metadata) {
                const metadata = {
                  ephemPublicKey: Buffer.from(shareResponses[i].result.keys[0].Metadata.ephemPublicKey, 'hex'),
                  iv: Buffer.from(shareResponses[i].result.keys[0].Metadata.iv, 'hex'),
                  mac: Buffer.from(shareResponses[i].result.keys[0].Metadata.mac, 'hex'),
                  mode: Buffer.from(shareResponses[i].result.keys[0].Metadata.mode, 'hex')
                }
                sharePromises.push(
                  eccrypto.decrypt(tmpKey, {
                    ...metadata,
                    ciphertext: Buffer.from(atob(shareResponses[i].result.keys[0].Share), 'hex')
                  })
                )
              } else {
                sharePromises.push(Promise.resolve(Buffer.from(shareResponses[i].result.keys[0].Share, 'base64')))
              }
              nodeIndex.push(new BN(indexes[i], 16))
            }
          }

          const sharesResolved = await Promise.all(sharePromises)
          var shares = sharesResolved.map(x => new BN(x))
          log.info(shares, nodeIndex)
          var privateKey = this.lagrangeInterpolation(shares.slice(0, 3), nodeIndex.slice(0, 3))
          var ethAddress = this.generateAddressFromPrivKey(privateKey)
          resolve({
            ethAddress,
            privKey: privateKey.toString('hex', 64)
          })
        })
        .catch(err => {
          log.error(err)
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
    var ethAddressLower = '0x' + keccak256(Buffer.from(publicKey, 'hex')).slice(64 - 38) // remove 0x
    var ethAddress = toChecksumAddress(ethAddressLower)
    return ethAddress
  }
  getPubKeyAsync(endpointUrl, { verifier, verifierId }) {
    return new Promise((resolve, reject) => {
      post(
        endpointUrl,
        generateJsonRPCObject('VerifierLookupRequest', {
          verifier,
          verifier_id: verifierId.toString().toLowerCase()
        })
      )
        .catch(err => log.error(err))
        .then(lookupShare => {
          if (lookupShare.error) {
            return post(
              endpointUrl,
              generateJsonRPCObject('KeyAssign', {
                verifier,
                verifier_id: verifierId.toString().toLowerCase()
              })
            )
          } else if (lookupShare.result) {
            return this.getLookupPromise(lookupShare)
          }
        })
        .catch(err => log.error(err))
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
    const bufferedMessage = Buffer.from(message)
    return ethUtil.hashPersonalMessage(bufferedMessage)
  }
}

/* Inialize torus object on load */
const torus = onloadTorus(new Torus())

export default torus
