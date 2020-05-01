const log = require('loglevel')
const ObservableStore = require('obs-store')

const connext = require('@connext/client')

class ChannelController {
  /**
   * @constructor
   * @param {Object} opts
   */
  constructor(options) {
    const initState = { channel: undefined }
    this.store = new ObservableStore(initState)
    this.networkController = options.networkController
    this.keyringController = options.keyringController
  }

  /**
   * Helper method for initializing the connext client.
   *
   * This should be called any time on app startup, or before
   * using any channel methods.
   *
   * @returns Promise<void>
   */
  initChannel() {
    const { VUE_APP_TORUS_BUILD_ENV } = process.env

    const signer = this.keyringController.generatePrivKey()

    const { network } = this.networkController.store.getFlatState()
    if (!['mainnet', 'rinkeby'].includes(network)) {
      log.error(`Channel can't be initialized with network: ${network}`)
      return
    }

    log.debug('Initializing Channel...')
    const logLevel = VUE_APP_TORUS_BUILD_ENV === 'production' ? 1 : 5
    connext
      .connect(network, { signer, logLevel })
      .then((channel) => {
        log.debug('Channel Connected!')
        this.saveChannel(channel)
      })
      .catch((error) => log.error(error))
  }

  // /////////////////////////////////////////
  // // Getters / setters
  saveChannel(channel) {
    return this.store.updateState({ channel })
  }

  getChannel() {
    const { channel } = this.store.getState()
    if (!channel) {
      throw new Error('Channel has not been initialized, call initChannel')
    }
    return channel
  }

  /**
   * A method for serving our channel provider over a given stream.
   * @param {*} channelMux - The stream to provide over.
   */
  setupChannelRpcStream(channelMux) {
    this.channelRpcStream = channelMux.getStream('channel_rpc')

    this.channelRpcStream.on('data', (payload) => this.onPayload(payload))
  }

  async onPayload(payload) {
    const channel = this.getChannel()

    const { params, id, method } = payload

    verifyPayload(payload)

    let errorMessage
    let result

    try {
      result = await channel.channelProvider.send(method, params)
    } catch (error) {
      errorMessage = `ChannelProvider error: ${JSON.stringify(error, null, 2)}`
    }

    if (result) {
      this.channelRpcStream.write({ id, result })
    } else {
      this.channelRpcStream.write({ id, error: { message: errorMessage || 'ChannelProvider error: Missing error message' } })
      log.error(errorMessage)
    }
  }
}

// util

function prettyPrint(object) {
  return JSON.stringify(object, null, 2)
}

function verifyPayload(payload) {
  if (!payload.params || typeof payload.params !== 'object') {
    throw new Error(`Invalid payload params. Payload: ${prettyPrint(payload)}`)
  }

  if (!payload.id) {
    throw new Error(`Invalid payload id. Payload: ${prettyPrint(payload)}`)
  }

  if (!payload.method || typeof payload.method !== 'string') {
    throw new Error(`Invalid payload method. Payload: ${prettyPrint(payload)}`)
  }
}

export default ChannelController
