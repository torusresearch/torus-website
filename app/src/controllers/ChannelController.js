import { connect, utils } from '@connext/client'
// TODO: remove ethers dep!
import { ethers } from 'ethers'

export default class ChannelController {
  /**
   * @constructor
   * @param {Object} opts
   */
  constructor(opts) {
    this.networkController = opts.networkController
    this.keyRingController = opts.keyRingController
    this.store = opts.store
    // generating a random mnemonic on start since im
    // not sure where you store yours. should delete!
    this.mnemonic = ethers.Wallet.createRandom().mnemonic
  }

  /**
   * Helper method for initializing the connext client.
   *
   * This should be called any time on app startup, or before
   * using any channel methods.
   *
   * @returns Promise<void>
   */
  initializeConnext() {
    const { ETH_PROVIDER_URL, NODE_URL, LOG_LEVEL } = process.env
    // client requires a few options to startup properly.

    // the store: currently using local storage, but is a simple
    // key-value store where clients can store their own channel
    // state.

    // optionally, you can use a pisa client to allow for user
    // state backups as well. A reference for this exists in the
    // daicard store factory
    const store = storeFactory()

    // you must also provide one of the following for signing states:
    //  - mnemonic: standard wallet mnemonic which will be used to
    //    generate app-specific signing keys
    //  - keyGen: a cb function that allows you to generate signing keys
    //    for apps without explicitly passing in the mnemonic
    //  - channelProvider: allows you access to an already set-up
    //    channel. you most likely will not want to instantiate
    //    the client this way, but instead will want to allow dapps
    //    to access a channel provider you've defined. however, if you
    //    want to use an existing channel (say one injected by metamask)
    //    then you can instantiate the client with this option.

    // for now i'll use a mnemonic since its easiest to get running
    // (and because the other PRs havent made it through npm quite yet)
    // but you will most likely want to update this to use the keygen
    // property, with something like:
    // keyGen: this.keyRingController.generateChannelKey()
    // where `generateChannelKey` returns an app-specific private key
    // but we are happy to work through this with you when the client
    // is properly updated!

    // other options are mostly for configuration. i've defaulted some
    // values here for easy start-up, but feel free to use your own!
    const connectOpts = {
      mnemonic: this.mnemonic,
      ethProviderUrl: ETH_PROVIDER_URL || 'https://rinkeby.indra.connext.network/api/ethprovider', // default to nodes provider
      logLevel: LOG_LEVEL || 5, // default to log everything
      nodeUrl: NODE_URL || 'wss://rinkeby.indra.connext.network/api/messaging', // default to rinkeby
      store
    }
    connect(connectOpts).then(channel => {
      // save channel in app storage
      this.saveChannel(channel)
    })
  }

  ///////////////////////////////////////////
  //// Core channel methods

  /**
   * Deposit into the channel.
   * @param {string} amount wei to deposit into channel
   * @param {string?} assetId token address to deposit (defaults to ETH)
   */
  deposit(amount, assetId) {
    const channel = this.getInitdChannel()
    return channel.deposit({
      amount,
      assetId
    })
  }

  /**
   * Perform in channel swap/exchange at given swap rate.
   * @param {string} amount wei to swap of fromAssetId
   * @param {string} swapRate swap rate in
   */
  swap(amount, swapRate, toAssetId, fromAssetId) {
    const channel = this.getInitdChannel()
    return channel.swap({
      amount,
      swapRate,
      toAssetId,
      fromAssetId
    })
  }

  /**
   * Create a linked payment that is redeemable by anyone.
   * Should save the generated paymentId and preImage to send
   * or allow to be redeemable.
   *
   * @param {string} amount wei to send of assetId
   * @param {string?} assetId asset to send, defaults to eth
   */
  linkTransfer(amount, assetId) {
    const channel = this.getInitdChannel()
    const paymentId = utils.createPaymentId()
    const preImage = utils.createPreImage()
    return channel
      .conditionalTransfer({
        assetId,
        amount,
        conditionType: 'LINKED_TRANSFER',
        paymentId: utils.createPaymentId(),
        preImage: utils.createPreImage()
      })
      .then(transfer => this.saveLinkInfo(paymentId, preImage))
  }

  /**
   * Creates an async payment to a recipient.
   *
   * @param {string} amount wei to send of assetId
   * @param {string} recipient payee's xpub
   * @param {string?} assetId asset to send, defaults to eth
   */
  transfer(amount, recipient, assetId) {
    const channel = this.getInitdChannel()
    return channel.conditionalTransfer({
      assetId,
      amount,
      conditionType: 'LINKED_TRANSFER_TO_RECIPIENT',
      paymentId: utils.createPaymentId(),
      preImage: utils.createPreImage(),
      recipient
    })
  }

  /**
   * Perform in channel swap/exchange at given swap rate.
   * @param {string} amount wei to withdraw of assetId
   * @param {string?} recipient address to withdraw to, should be accounts[0],
   * but will default to channel.freeBalanceAddress
   * @param {string?} assetId asset to withdraw, defaults to eth
   */
  withdraw(amount, recipient, assetId) {
    const channel = this.getInitdChannel()
    return channel.withdraw({
      amount,
      recipient,
      assetId
    })
  }

  /**
   * Returns the balance available to spend in the channel as an obj.
   *
   * To access user's available free balance:
   * const userFb = channel.getFreeBalance(assetId)
   *  .then(fb => fb[channel.freeBalanceAddress])
   *
   * @param {string?} assetId Address of asset you want balance of, defaults to ETH
   */
  getFreeBalance(assetId) {
    const channel = this.getInitdChannel()
    return channel.getFreeBalance(assetId)
  }

  ///////////////////////////////////////////
  //// Getters / setters
  saveChannel(channel) {
    return this.store.updateState({ channel })
  }

  saveLinkInfo(paymentId, preImage) {
    const links = this.store.getFlatState().links || []
    links.push({ paymentId, preImage })
    return this.store.updateState({ links })
  }

  getChannel() {
    const channel = this.store.getFlatState().channel
    if (!channel) {
      console.debug('Make sure to call "initializeConnext" before using channel')
      return
    }
    return channel
  }

  getInitdChannel() {
    const channel = this.getChannel()
    if (!channel) {
      throw new Error('Channel has not been initialized, call "initializeConnext"')
    }
    return channel
  }
}
