/**
 * Controller reposible for communication with the relayer API
 *
 * @author Shubham Rathi
 */

import config from '../config'
import getNonceForRelay from '../utils/getNonceForRelay'
import TransferManager from '../assets/TransferManager.json'
import signOffchain from '../utils/signOffchain'
import { post, get } from '../utils/httpHelpers'
import log from 'loglevel'
import Web3 from 'web3'
const randomId = require('@chaitanyapotti/random-id')

import { ZERO_ADDRESS, KOVAN } from '../utils/enums'

const loginMessage = 'Sign message to login to Biconomy with counter '
const signTxMessage = 'Sign message to send transaction to Biconomy with counter '
export default class SmartContractWalletController {
  constructor(opts = {}) {
    this.opts = opts
    this.web3 = new Web3(opts.provider)
    this.getWallet = opts.getWallet
    this._mapMethods()
  }

  //
  //           PRIVATE METHODS
  //
  /** maps methods for convenience */
  _mapMethods() {
    /** @returns the user selected address */
    this.getSelectedAddress = () => {
      if (typeof this.opts.storeProps === 'function') {
        const { selectedAddress } = this.opts.storeProps() || {}
        return (selectedAddress && selectedAddress.toLowerCase()) || ''
      } else return ''
    }
    /**  */
    this.getSelectedEOA = () => {
      if (typeof this.opts.storeProps === 'function') {
        console.log(this.opts.storeProps())
        const { selectedEOA } = this.opts.storeProps() || {}
        return selectedEOA || ''
      } else return ''
    }

    this.signature = async (message, nonce) => {
      let messageToSign

      if (!nonce) {
        messageToSign = message + 0
      } else {
        messageToSign = message + nonce
      }
      let privateKey = await this.getWallet(this.getSelectedEOA())
      let result = await this.web3.eth.accounts.sign(messageToSign, '0x' + privateKey)
      return result.signature
    }
  }

  /**
   * Request relayer to create a smart contract wallet
   */
  async createSmartContractWallet() {
    // Make an API call to relayer to create a smart contract wallet
    // Update the Vue state to processing
    try {
      let obj = {
        ens: randomId(),
        owner: this.getSelectedEOA()
      }

      let data = {
        signature: await this.signature(loginMessage, null),
        signer: obj.owner,
        message: loginMessage,
        provider: 100
      }

      let reqHeader = {
        headers: {
          'x-wallet-key': config.biconomyKey[KOVAN],
          'Content-Type': 'application/json; charset=utf-8'
        }
      }

      return await post(`${config.biconomy}/api/v1/wallet/wallet-login`, data, reqHeader)
    } catch (err) {
      log.error(err)
      return err
    }
  }

  /**
    Sign the transaction and submit to the relayer
    @param txId {number} - the tx's Id
    @returns - rawTx {string}
  */

  async getNonce() {
    let nonceURL = config.biconomy.concat('/api/v1/wallet/getContractNonce')
    let signer = this.getSelectedEOA()

    let response
    try {
      response = await get(`${nonceURL}?signer=${signer}`, {
        headers: {
          'x-wallet-key': config.biconomyKey[KOVAN]
        }
      })
      console.log(response)
      return response.nonce
    } catch (e) {
      log.error(e)
      return []
    }
  }

  async sendTransaction(biconomyReqObj) {
    let relayUrl = config.biconomy.concat('/api/v1/wallet/relay')

    let response
    try {
      response = await post(relayUrl, biconomyReqObj, {
        headers: {
          'x-wallet-key': config.biconomyKey[KOVAN],
          'Content-Type': 'application/json; charset=utf-8'
        }
      })
      console.log(response)
      return response
    } catch (e) {
      log.error(e)
      return []
    }
  }

  async signTransaction(txId, txStateManager, chainId) {
    try {
      const txMeta = txStateManager.getTx(txId)
      log.info('Transaction Controller, signTransaction', txMeta, txStateManager)

      let txParams = Object.assign({}, txMeta.txParams, { chainId })
      let transferValue, to, ETH_TOKEN
      const relayerURL = config.relayer.concat('/transfer/eth')
      log.info(relayerURL)
      const fromSCW = txParams.from

      // Handling Tokens
      if (txMeta.contractParams.erc20 || txMeta.contractParams.erc721) {
        ETH_TOKEN = txMeta.txParams.to
        transferValue = txMeta.methodParams
          .filter(x => x.name == '_value')
          .map(x => x.value)
          .shift()
          .toString()
        to = txMeta.methodParams
          .filter(x => x.name == '_to')
          .map(x => x.value)
          .shift()
          .toString()
      } else {
        ETH_TOKEN = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
        transferValue = txParams.value.toString()
        to = txParams.to
      }

      // Get nonce
      // const nonce = await getNonceForRelay(this.web3)
      const nonce = await this.getNonce()
      const signature = await this.signature(signTxMessage, nonce)
      const messageToSign = signTxMessage.concat(nonce)

      console.log('messageToSign :' + messageToSign)
      console.log('length :' + messageToSign.length)

      const biconomyReqObj = {
        signature: signature,
        signer: this.getSelectedEOA(),
        message: signTxMessage,
        provider: 100,
        to: to,
        messageLength: messageToSign.length,
        value: transferValue
      }

      const res = await this.sendTransaction(biconomyReqObj)

      // // log.info(`fromSCW ${fromSCW}, to ${to}, ETH_TOKEN ${ETH_TOKEN}, value ${transferValue}, nonce ${nonce}`)

      // // Encode method Data
      // // Remove the hardcoded contract value and handle erc20 and 721 gasless calls
      // const TransferModule = new this.web3.eth.Contract(TransferManager.abi, '0xD45256EEf4bFB182B108Cd8e0bCB4A9369342C1d')
      // const methodData = TransferModule.methods.transferToken(fromSCW, ETH_TOKEN, to, transferValue, ZERO_ADDRESS).encodeABI()

      // // Get EOA wallet to sign the transactions
      // const selectedEOA = this.getSelectedEOA()
      // // log.info('selectedEOA is', selectedEOA)
      // const privateKey = await this.getWallet(selectedEOA)
      // const walletAccount = this.web3.eth.accounts.privateKeyToAccount('0x' + privateKey)
      // // log.info([walletAccount], TransferModule.options.address, fromSCW, 0, methodData, nonce, 0, 0)

      // // Set temp tx ash, so the user doesn't have to wait for txhash to recieve
      // const tempTxHash = 'PENDING_'.concat(txMeta.id)
      // txMeta.hash = tempTxHash
      // txStateManager.updateTx(txMeta, 'transactions#setTxHash')

      // // Sign the transaction
      // const signatures = await signOffchain([walletAccount], TransferModule.options.address, fromSCW, 0, methodData, nonce, 0, 0)
      // const reqObj = {
      //   wallet: fromSCW,
      //   nonce,
      //   methodData,
      //   signatures,
      //   uniqueId: tempTxHash
      // }

      // log.info('SmartContractWalletController', txMeta)

      // // post(relayerURL, reqObj)
      // //   .then(res => {
      // //     // Incase it resolves
      // //     console.log('scwController', res.txHash)
      // //     txMeta.hash = res.txHash
      // //     txStateManager.updateTx(txMeta, 'transactions#setTxHash')
      // //   })
      // //   .catch(err => {
      // //     log.error(err)
      // //     // Incase doesn't resolve,  Poll and update the txhash
      // //   })

      // txStateManager.setTxStatusSubmitted(txId)

      // const res = await post(relayerURL, reqObj)
      // console.log('scwController', res.txHash)
      txMeta.hash = res.txHash
      txStateManager.updateTx(txMeta, 'transactions#setTxHash')
      return txMeta.hash
    } catch (err) {
      log.error(err)
      // Handle socket hangup and other issues
    }
  }
}
