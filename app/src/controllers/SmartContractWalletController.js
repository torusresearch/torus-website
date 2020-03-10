/**
 * Controller reposible for communication with the relayer API
 *
 * @author Shubham Rathi
 */

import log from 'loglevel'
import Web3 from 'web3'

import TransferManager from '../assets/TransferManager.json'
import config from '../config'
import { ZERO_ADDRESS } from '../utils/enums'
import getNonceForRelay from '../utils/getNonceForRelay'
import { post } from '../utils/httpHelpers'
import signOffchain from '../utils/signOffchain'

const randomId = require('@chaitanyapotti/random-id')

export default class SmartContractWalletController {
  constructor(options = {}) {
    this.opts = options
    this.web3 = new Web3(options.provider)
    this.getWallet = options.getWallet
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
      }
      return ''
    }
  }
  // this.getSelectedEOA =() => {
  //   if (typeof this.opts.storeProps === 'function') {
  //     console.log(this.opts.storeProps())
  //     const { selectedEOA } = this.opts.storeProps() || {}
  //     return selectedEOA || ''
  //   } return ''
  // }}

  /**
   * Request relayer to create a smart contract wallet
   */
  async createSmartContractWallet() {
    // Make an API call to relayer to create a smart contract wallet
    // Update the Vue state to processing
    try {
      const object = {
        ens: randomId(),
        owner: this.getSelectedEOA()
      }
      log.info(object)
      const scw = await post(`${config.relayer}/createWallet`, object)
      log.info(scw)
      return scw
    } catch (error) {
      log.error(error)
      return error
    }
  }

  /**
  Sign the transaction and submit to the relayer
  @param txId {number} - the tx's Id
  @returns - rawTx {string}
  */
  async signTransaction(txId, txStateManager, chainId) {
    try {
      const txMeta = txStateManager.getTx(txId)
      log.info('Transaction Controller, signTransaction', txMeta, txStateManager)

      const txParameters = { ...txMeta.txParams, chainId }
      let transferValue
      let to
      let ETH_TOKEN
      const relayerURL = config.relayer.concat('/transfer/eth')
      log.info(relayerURL)
      const fromSCW = txParameters.from

      // Handling Tokens
      if (txMeta.contractParams.erc20 || txMeta.contractParams.erc721) {
        ETH_TOKEN = txMeta.txParams.to
        transferValue = txMeta.methodParams
          .filter(x => x.name === '_value')
          .map(x => x.value)
          .shift()
          .toString()
        to = txMeta.methodParams
          .filter(x => x.name === '_to')
          .map(x => x.value)
          .shift()
          .toString()
      } else {
        ETH_TOKEN = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
        transferValue = txParameters.value.toString()
        to = txParameters.to
      }

      // Get nonce
      const nonce = await getNonceForRelay(this.web3)
      // log.info(`fromSCW ${fromSCW}, to ${to}, ETH_TOKEN ${ETH_TOKEN}, value ${transferValue}, nonce ${nonce}`)

      // Encode method Data
      // Remove the hardcoded contract value and handle erc20 and 721 gasless calls
      const TransferModule = new this.web3.eth.Contract(TransferManager.abi, '0xD45256EEf4bFB182B108Cd8e0bCB4A9369342C1d')
      const methodData = TransferModule.methods.transferToken(fromSCW, ETH_TOKEN, to, transferValue, ZERO_ADDRESS).encodeABI()

      // Get EOA wallet to sign the transactions
      const selectedEOA = this.getSelectedEOA()
      // log.info('selectedEOA is', selectedEOA)
      const privateKey = await this.getWallet(selectedEOA)
      const walletAccount = this.web3.eth.accounts.privateKeyToAccount(`0x${privateKey}`)
      // log.info([walletAccount], TransferModule.options.address, fromSCW, 0, methodData, nonce, 0, 0)

      // Set temp tx ash, so the user doesn't have to wait for txhash to recieve
      const temporaryTxHash = 'PENDING_'.concat(txMeta.id)
      txMeta.hash = temporaryTxHash
      txStateManager.updateTx(txMeta, 'transactions#setTxHash')

      // Sign the transaction
      const signatures = await signOffchain([walletAccount], TransferModule.options.address, fromSCW, 0, methodData, nonce, 0, 0)
      const requestObject = {
        wallet: fromSCW,
        nonce,
        methodData,
        signatures,
        uniqueId: temporaryTxHash
      }

      log.info('SmartContractWalletController', txMeta)

      // post(relayerURL, reqObj)
      //   .then(res => {
      //     // Incase it resolves
      //     console.log('scwController', res.txHash)
      //     txMeta.hash = res.txHash
      //     txStateManager.updateTx(txMeta, 'transactions#setTxHash')
      //   })
      //   .catch(err => {
      //     log.error(err)
      //     // Incase doesn't resolve,  Poll and update the txhash
      //   })

      txStateManager.setTxStatusSubmitted(txId)

      const response = await post(relayerURL, requestObject)
      log.info('scwController', response.txHash)
      txMeta.hash = response.txHash
      txStateManager.updateTx(txMeta, 'transactions#setTxHash')
      return txMeta.hash
    } catch (error) {
      log.error(error)
      return error
      // Handle socket hangup and other issues
    }
  }
}
