/* eslint-disable no-case-declarations */
import { ObservableStore } from '@metamask/obs-store'
import assert from 'assert'
import { ethErrors } from 'eth-rpc-errors'
import { TYPED_MESSAGE_SCHEMA, typedSignatureHash } from 'eth-sig-util'
import EventEmitter from 'events'
import jsonschema from 'jsonschema'
import log from 'loglevel'

/**
 * Represents, and contains data about, an 'eth_signTypedData' type signature request. These are created when a
 * signature for an eth_signTypedData call is requested.
 *
 * @typedef {Object} TypedMessage
 * @property {number} id An id to track and identify the message object
 * @property {Object} msgParams The parameters to pass to the eth_signTypedData method once the signature request is
 * approved.
 * @property {Object} msgParams.metamaskId Added to msgParams for tracking and identification within MetaMask.
 * @property {Object} msgParams.from The address that is making the signature request.
 * @property {string} msgParams.data A hex string conversion of the raw buffer data of the signature request
 * @property {number} time The epoch time at which the this message was created
 * @property {string} status Indicates whether the signature request is 'unapproved', 'approved', 'signed', 'rejected', or 'errored'
 * @property {string} type The json-prc signing method for which a signature request has been made. A 'Message' will
 * always have a 'eth_signTypedData' type.
 *
 */

export default class TypedMessageManager extends EventEmitter {
  /**
   * Controller in charge of managing - storing, adding, removing, updating - TypedMessage.
   */
  constructor({ networkController }) {
    super()
    this.networkController = networkController
    this.store = new ObservableStore({
      unapprovedTypedMessages: {},
      unapprovedTypedMessagesCount: 0,
    })
    this.messages = []
  }

  /**
   * A getter for the number of 'unapproved' TypedMessages in this.messages
   *
   * @returns {number} The number of 'unapproved' TypedMessages in this.messages
   *
   */
  get unapprovedTypedMessagesCount() {
    return Object.keys(this.getUnapprovedMsgs()).length
  }

  /**
   * A getter for the 'unapproved' TypedMessages in this.messages
   *
   * @returns {Object} An index of TypedMessage ids to TypedMessages, for all 'unapproved' TypedMessages in
   * this.messages
   *
   */
  getUnapprovedMsgs() {
    return this.messages
      .filter((message) => message.status === 'unapproved')
      .reduce((result, message) => {
        result[message.id] = message
        return result
      }, {})
  }

  /**
   * Creates a new TypedMessage with an 'unapproved' status using the passed msgParams. this.addMsg is called to add
   * the new TypedMessage to this.messages, and to save the unapproved TypedMessages from that list to
   * this.store. Before any of this is done, msgParams are validated
   *
   * @param {Object} msgParams The params for the eth_sign call to be made after the message is approved.
   * @param {Object} req (optional) The original request object possibly containing the origin
   * @returns {promise} When the message has been signed or rejected
   *
   */
  addUnapprovedMessageAsync(messageParameters, request, version, messageId) {
    return new Promise((resolve, reject) => {
      this.addUnapprovedMessage(messageParameters, request, version, messageId)
      this.once(`${messageId}:finished`, (data) => {
        switch (data.status) {
          case 'signed':
            return resolve(data.rawSig)
          case 'rejected':
            return reject(ethErrors.provider.userRejectedRequest('Torus Message Signature: User denied message signature.'))
          case 'errored':
            return reject(new Error(`Torus Message Signature: ${data.error}`))
          default:
            return reject(new Error(`Torus Message Signature: Unknown problem: ${JSON.stringify(messageParameters)}`))
        }
      })
    })
  }

  /**
   * Creates a new TypedMessage with an 'unapproved' status using the passed msgParams. this.addMsg is called to add
   * the new TypedMessage to this.messages, and to save the unapproved TypedMessages from that list to
   * this.store. Before any of this is done, msgParams are validated
   *
   * @param {Object} msgParams The params for the eth_sign call to be made after the message is approved.
   * @param {Object} req (optional) The original request object possibly containing the origin
   * @returns {number} The id of the newly created TypedMessage.
   *
   */
  addUnapprovedMessage(messageParameters, request, version, messageId) {
    messageParameters.version = version
    this.validateParams(messageParameters)
    // add origin from request
    if (request) messageParameters.origin = request.origin

    log.debug(`TypedMessageManager addUnapprovedMessage: ${JSON.stringify(messageParameters)}`)
    // create txData obj with parameters and meta data
    const time = Date.now()
    const messageData = {
      id: messageId,
      msgParams: messageParameters,
      time,
      status: 'unapproved',
      type: 'eth_signTypedData',
    }
    this.addMsg(messageData)

    // signal update
    this.emit('update')
    return messageId
  }

  /**
   * Helper method for this.addUnapprovedMessage. Validates that the passed params have the required properties.
   *
   * @param {Object} params The params to validate
   *
   */
  validateParams(parameters) {
    switch (parameters.version) {
      case 'V1':
        assert.strictEqual(typeof parameters, 'object', 'Params should ben an object.')
        assert.ok('data' in parameters, 'Params must include a data field.')
        assert.ok('from' in parameters, 'Params must include a from field.')
        assert.ok(Array.isArray(parameters.data), 'Data should be an array.')
        assert.strictEqual(typeof parameters.from, 'string', 'From field must be a string.')
        assert.doesNotThrow(() => {
          typedSignatureHash(parameters.data)
        }, 'Expected EIP712 typed data')
        break
      case 'V3':
      case 'V4':
        let data
        assert.strictEqual(typeof parameters, 'object', 'Params should be an object.')
        assert.ok('data' in parameters, 'Params must include a data field.')
        assert.ok('from' in parameters, 'Params must include a from field.')
        assert.strictEqual(typeof parameters.from, 'string', 'From field must be a string.')
        assert.strictEqual(typeof parameters.data, 'string', 'Data must be passed as a valid JSON string.')
        assert.doesNotThrow(() => {
          data = JSON.parse(parameters.data)
        }, 'Data must be passed as a valid JSON string.')
        const validation = jsonschema.validate(data, TYPED_MESSAGE_SCHEMA)
        assert.ok(data.primaryType in data.types, `Primary type of "${data.primaryType}" has no type definition.`)
        assert.strictEqual(validation.errors.length, 0, 'Data must conform to EIP-712 schema. See https://git.io/fNtcx.')
        const { chainId } = data.domain
        const activeChainId = Number.parseInt(this.networkController.getNetworkState(), 10)
        if (chainId) assert.strictEqual(chainId, activeChainId, `Provided chainId (${chainId}) must match the active chainId (${activeChainId})`)
        break
      default:
        break
    }
  }

  /**
   * Adds a passed TypedMessage to this.messages, and calls this._saveMsgList() to save the unapproved TypedMessages from that
   * list to this.store.
   *
   * @param {Message} msg The TypedMessage to add to this.messages
   *
   */
  addMsg(message) {
    this.messages.push(message)
    this._saveMsgList()
  }

  /**
   * Returns a specified TypedMessage.
   *
   * @param {number} msgId The id of the TypedMessage to get
   * @returns {TypedMessage|undefined} The TypedMessage with the id that matches the passed msgId, or undefined
   * if no TypedMessage has that id.
   *
   */
  getMsg(messageId) {
    return this.messages.find((message) => message.id === messageId)
  }

  /**
   * Approves a TypedMessage. Sets the message status via a call to this.setMsgStatusApproved, and returns a promise
   * with any the message params modified for proper signing.
   *
   * @param {Object} msgParams The msgParams to be used when eth_sign is called, plus data added by MetaMask.
   * @param {Object} msgParams.metamaskId Added to msgParams for tracking and identification within MetaMask.
   * @returns {Promise<object>} Promises the msgParams object with metamaskId removed.
   *
   */
  approveMessage(messageParameters) {
    this.setMsgStatusApproved(messageParameters.metamaskId)
    return this.prepMsgForSigning(messageParameters)
  }

  /**
   * Sets a TypedMessage status to 'approved' via a call to this._setMsgStatus.
   *
   * @param {number} msgId The id of the TypedMessage to approve.
   *
   */
  setMsgStatusApproved(messageId) {
    this._setMsgStatus(messageId, 'approved')
  }

  /**
   * Sets a TypedMessage status to 'signed' via a call to this._setMsgStatus and updates that TypedMessage in
   * this.messages by adding the raw signature data of the signature request to the TypedMessage
   *
   * @param {number} msgId The id of the TypedMessage to sign.
   * @param {buffer} rawSig The raw data of the signature request
   *
   */
  setMsgStatusSigned(messageId, rawSig) {
    const message = this.getMsg(messageId)
    message.rawSig = rawSig
    this._updateMsg(message)
    this._setMsgStatus(messageId, 'signed')
  }

  /**
   * Removes the metamaskId property from passed msgParams and returns a promise which resolves the updated msgParams
   *
   * @param {Object} msgParams The msgParams to modify
   * @returns {Promise<object>} Promises the msgParams with the metamaskId property removed
   *
   */
  prepMsgForSigning(messageParameters) {
    delete messageParameters.metamaskId
    delete messageParameters.version
    return Promise.resolve(messageParameters)
  }

  /**
   * Sets a TypedMessage status to 'rejected' via a call to this._setMsgStatus.
   *
   * @param {number} msgId The id of the TypedMessage to reject.
   *
   */
  rejectMsg(messageId) {
    this._setMsgStatus(messageId, 'rejected')
  }

  /**
   * Sets a TypedMessage status to 'errored' via a call to this._setMsgStatus.
   *
   * @param {number} msgId The id of the TypedMessage to error
   *
   */
  errorMessage(messageId, error) {
    const message = this.getMsg(messageId)
    message.error = error
    this._updateMsg(message)
    this._setMsgStatus(messageId, 'errored')
  }

  //
  // PRIVATE METHODS
  //

  /**
   * Updates the status of a TypedMessage in this.messages via a call to this._updateMsg
   *
   * @private
   * @param {number} msgId The id of the TypedMessage to update.
   * @param {string} status The new status of the TypedMessage.
   * @throws A 'TypedMessageManager - TypedMessage not found for id: "${msgId}".' if there is no TypedMessage
   * in this.messages with an id equal to the passed msgId
   * @fires An event with a name equal to `${msgId}:${status}`. The TypedMessage is also fired.
   * @fires If status is 'rejected' or 'signed', an event with a name equal to `${msgId}:finished` is fired along
   * with the TypedMessage
   *
   */
  _setMsgStatus(messageId, status) {
    const message = this.getMsg(messageId)
    if (!message) throw new Error(`TypedMessageManager - Message not found for id: "${messageId}".`)
    message.status = status
    this._updateMsg(message)
    this.emit(`${messageId}:${status}`, message)
    if (status === 'rejected' || status === 'signed' || status === 'errored') {
      this.emit(`${messageId}:finished`, message)
    }
  }

  /**
   * Sets a TypedMessage in this.messages to the passed TypedMessage if the ids are equal. Then saves the
   * unapprovedTypedMsgs index to storage via this._saveMsgList
   *
   * @private
   * @param {msg} TypedMessage A TypedMessage that will replace an existing TypedMessage (with the same
   * id) in this.messages
   *
   */
  _updateMsg(message_) {
    const index = this.messages.findIndex((message) => message.id === message_.id)
    if (index !== -1) {
      this.messages[index] = message_
    }
    this._saveMsgList()
  }

  /**
   * Saves the unapproved TypedMessages, and their count, to this.store
   *
   * @private
   * @fires 'updateBadge'
   *
   */
  _saveMsgList() {
    const unapprovedTypedMessages = this.getUnapprovedMsgs()
    const unapprovedTypedMessagesCount = Object.keys(unapprovedTypedMessages).length
    this.store.updateState({ unapprovedTypedMessages, unapprovedTypedMessagesCount })
    this.emit('updateBadge')
  }
}
