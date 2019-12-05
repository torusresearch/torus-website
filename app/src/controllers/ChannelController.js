const connext = require('@connext/client')
const CFTypes = require('@counterfactual/types')
const channelStore = require('../utils/channelStore').default

class ChannelController {
  /**
   * @constructor
   * @param {Object} opts
   */
  constructor(opts) {
    this.networkController = opts.networkController
    this.keyringController = opts.keyringController
    this.store = opts.store
    this.initializeConnext()
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

    const xpub = this.keyringController.getChannelXPub()
    const keyGen = this.keyringController.getChannelKeyGen()

    const connectOpts = {
      xpub,
      keyGen,
      ethProviderUrl: ETH_PROVIDER_URL || 'https://rinkeby.indra.connext.network/api/ethprovider', // default to nodes provider
      logLevel: LOG_LEVEL || 5, // default to log everything
      nodeUrl: NODE_URL || 'wss://rinkeby.indra.connext.network/api/messaging', // default to rinkeby
      store: channelStore
    }

    connext.connect(connectOpts).then(channel => {
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
    const paymentId = connext.utils.createPaymentId()
    const preImage = connext.utils.createPreImage()
    return channel
      .conditionalTransfer({
        assetId,
        amount,
        conditionType: 'LINKED_TRANSFER',
        paymentId: connext.utils.createPaymentId(),
        preImage: connext.utils.createPreImage()
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
      paymentId: connext.utils.createPaymentId(),
      preImage: connext.utils.createPreImage(),
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
    console.log('[saveChannel] channel', channel)
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
      console.debug(`Make sure to call 'initializeConnext' before using channel`)
      return
    }
    return channel
  }

  getInitdChannel() {
    const channel = this.getChannel()
    if (!channel) {
      throw new Error(`Channel has not been initialized, call 'initializeConnext'`)
    }
    return channel
  }

  /**
   * A method for serving our channel provider over a given stream.
   * @param {*} channelMux - The stream to provide over.
   */
  setupChannelRpcStream(channelMux) {
    this.channelRpcStream = channelMux.getStream('channel_rpc')

    this.channelRpcStream.on('data', payload => this.onPayload(payload))
  }

  async onPayload(payload) {
    const channel = this.getInitdChannel()

    const { params, id, method } = payload

    if (!params || typeof params !== 'object') {
      throw new Error(`Invalid payload params. Payload: ${prettyPrint(payload)}`)
    }

    if (!id) {
      throw new Error(`Invalid payload id. Payload: ${prettyPrint(payload)}`)
    }

    if (!method || typeof method !== 'string') {
      throw new Error(`Invalid payload method. Payload: ${prettyPrint(payload)}`)
    }

    let errorMsg
    let result

    try {
      switch (method) {
        case 'chan_store_set':
          verifyFields(params, ['pairs'])
          const { pairs } = params
          result = await channel.channelRouter.set(pairs)
          break
        case 'chan_store_get':
          verifyFields(params, ['path'])
          const { path } = params
          result = await channel.channelRouter.get(path)
          break
        case 'chan_node_auth':
          verifyFields(params, ['message'])
          const { message } = params
          result = await channel.channelRouter.signMessage(message)
          break
        case 'chan_config':
          result = await channel.channelProviderConfig(params)
          break
        case CFTypes.Node.RpcMethodName.DEPOSIT:
          result = await channel.providerDeposit(params)
          break
        case CFTypes.Node.RpcMethodName.GET_STATE:
          result = await channel.getState(params)
          break
        case CFTypes.Node.RpcMethodName.GET_APP_INSTANCES:
          result = await channel.getAppInstances(params)
          break
        case CFTypes.Node.RpcMethodName.GET_FREE_BALANCE_STATE:
          verifyFields(params, ['tokenAddress', 'multisigAddress'])
          const { tokenAddress } = params
          result = await channel.getFreeBalance(tokenAddress)
          break
        case CFTypes.Node.RpcMethodName.GET_PROPOSED_APP_INSTANCES:
          result = await channel.getProposedAppInstances(params)
          break
        case CFTypes.Node.RpcMethodName.GET_APP_INSTANCE_DETAILS:
          result = await channel.getAppInstanceDetails(params)
          break
        case CFTypes.Node.RpcMethodName.TAKE_ACTION:
          result = await channel.takeAction(params)
          break
        case CFTypes.Node.RpcMethodName.UPDATE_STATE:
          result = await channel.updateState(params)
          break
        case CFTypes.Node.RpcMethodName.PROPOSE_INSTALL:
          result = await channel.proposeInstallApp(params)
          break
        case CFTypes.Node.RpcMethodName.INSTALL_VIRTUAL:
          result = await channel.installVirtualApp(params)
          break
        case CFTypes.Node.RpcMethodName.INSTALL:
          result = await channel.installApp(params)
          break
        case CFTypes.Node.RpcMethodName.UNINSTALL:
          result = await channel.uninstallApp(params)
          break
        case CFTypes.Node.RpcMethodName.UNINSTALL_VIRTUAL:
          result = await channel.uninstallVirtualApp(params)
          break
        case CFTypes.Node.RpcMethodName.REJECT_INSTALL:
          result = await channel.rejectInstallApp(params)
          break
        case CFTypes.Node.RpcMethodName.WITHDRAW:
          result = await channel.providerWithdraw(params)
          break
        case CFTypes.Node.RpcMethodName.WITHDRAW_COMMITMENT:
          result = await channel.withdrawCommitment(params)
          break
        default:
          errorMsg = `ChannelProvider mapping error, unknown method. Payload: ${prettyPrint(payload)}`
          break
      }
    } catch (e) {
      errorMsg = `ChannelProvider error: ${JSON.stringify(e, null, 2)}`
    }

    if (result) {
      channelRpcStream.write({ id, result })
    } else {
      channelRpcStream.write({ id, error: { message: errorMsg || 'ChannelProvider error: Missing error message' } })
      console.error(errorMsg)
    }
  }
}

// util

function prettyPrint(obj) {
  return JSON.stringify(obj, null, 2)
}

export default ChannelController
