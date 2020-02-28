/**
 * Controller reposible for communication with the relayer API
 *
 * @author Shubham Rathi
 */

import config from '../config'
import getNonceForRelay from '../utils/getNonceForRelay'
import TransferManager from '../assets/TransferManager.json'
import signOffchain from '../utils/signOffchain'
import { post } from '../utils/httpHelpers'
import log from 'loglevel'
import Web3 from 'web3'

import { ZERO_ADDRESS } from '../utils/enums'
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
        return (selectedEOA && selectedEOA.toLowerCase()) || ''
      } else return ''
    }
  }

  getSelectedEOA() {
    if (typeof this.opts.storeProps === 'function') {
      console.log(this.opts.storeProps())
      const { selectedEOA } = this.opts.storeProps() || {}
      return (selectedEOA && selectedEOA.toLowerCase()) || ''
    } else return ''
  }

  /**
   * Request relayer to create a smart contract wallet
   */
  async createSmartContractWallet() {
    // Make an API call to relayer to create a smart contract wallet
    // Update the Vue state to processing
    try {
      const obj = {
        ens: this.getSelectedEOA(),
        owner: this.getSelectedEOA()
      }
      const scw = await post(`${config.relayer}/createWallet`, obj)
      log.info(scw)
    } catch (err) {
      log.error(err)
    }
  }

  /**
    Sign the transaction and submit to the relayer
    @param txId {number} - the tx's Id
    @returns - rawTx {string}
  */
  async signTransaction(txId, txStateManager, chainId) {
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
    const walletAccount = this.web3.eth.accounts.privateKeyToAccount('0x' + privateKey)
    // log.info([walletAccount], TransferModule.options.address, fromSCW, 0, methodData, nonce, 0, 0)

    // Set temp tx ash
    const tempTxHash = 'PENDING_'.concat(txMeta.id)
    txMeta.hash = tempTxHash
    txStateManager.updateTx(txMeta, 'transactions#setTxHash')

    // Sign the transaction
    const signatures = await signOffchain([walletAccount], TransferModule.options.address, fromSCW, 0, methodData, nonce, 0, 0)
    const reqObj = {
      wallet: fromSCW,
      nonce,
      methodData,
      signatures,
      uniqueId: tempTxHash
    }

    log.info('SmartContractWalletController', txMeta)

    post(relayerURL, reqObj)
      .then(res => {
        // Incase it resolves
        txMeta.hash = res.txHash
        txStateManager.updateTx(txMeta, 'transactions#setTxHash')
      })
      .catch(err => {
        log.error(err)
        // Incase doesn't resolve,  Poll and update the txhash
      })

    return tempTxHash
  }
}
