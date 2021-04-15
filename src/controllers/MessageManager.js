import { ObservableStore } from '@metamask/obs-store'
import { ethErrors } from 'eth-rpc-errors'
import { bufferToHex, keccak256 } from 'ethereumjs-util'
import EventEmitter from 'events'

/**
 * Represents, and contains data about, an 'eth_sign' type signature request. These are created when a signature for
 * an eth_sign call is requestednode .
 *
 * @see {@link https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_sign}
 *
 * @typedef {Object} Message
 * @property {number} id An id to track and identify the message object
 * @property {Object} msgParams The parameters to pass to the eth_sign method once the signature request is approved.
 * @property {Object} msgParams.metamaskId Added to msgParams for tracking and identification within MetaMask.
 * @property {string} msgParams.data A hex string conversion of the raw buffer data of the signature request
 * @property {number} time The epoch time at which the this message was created
 * @property {string} status Indicates whether the signature request is 'unapproved', 'approved', 'signed' or 'rejected'
 * @property {string} type The json-prc signing method for which a signature request has been made. A 'Message' with
 * always have a 'eth_sign' type.
 *
 */

export default class MessageManager extends EventEmitter {
  /**
   * Controller in charge of managing - storing, adding, removing, updating - Messages.
   *
   * @typedef {Object} MessageManager
   * @property {Object} store The observable store where Messages are saved.
   * @property {Object} store.unapprovedMsgs A collection of all Messages in the 'unapproved' state
   * @property {number} store.unapprovedMsgCount The count of all Messages in this.store.unapprobedMsgs
   * @property {array} messages Holds all messages that have been created by this MessageManager
   *
   */
  constructor() {
    super()
    this.store = new ObservableStore({
      unapprovedMsgs: {},
      unapprovedMsgCount: 0,
    })
    this.messages = []
  }

  /**
   * A getter for the number of 'unapproved' Messages in this.messages
   *
   * @returns {number} The number of 'unapproved' Messages in this.messages
   *
   */
  get unapprovedMsgCount() {
    return Object.keys(this.getUnapprovedMsgs()).length
  }

  /**
   * A getter for the 'unapproved' Messages in this.messages
   *
   * @returns {Object} An index of Message ids to Messages, for all 'unapproved' Messages in this.messages
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
   * Creates a new Message with an 'unapproved' status using the passed msgParams. this.addMsg is called to add the
   * new Message to this.messages, and to save the unapproved Messages from that list to this.store.
   *
   * @param {Object} msgParams The params for the eth_sign call to be made after the message is approved.
   * @param {Object} req (optional) The original request object possibly containing the origin
   * @returns {promise} after signature has been
   *
   */
  addUnapprovedMessageAsync(messageParameters, request, messageId) {
    return new Promise((resolve, reject) => {
      this.addUnapprovedMessage(messageParameters, request, messageId)
      // await finished
      this.once(`${messageId}:finished`, (data) => {
        switch (data.status) {
          case 'signed':
            return resolve(data.rawSig)
          case 'rejected':
            return reject(ethErrors.provider.userRejectedRequest('Torus Message Signature: User denied message signature.'))
          default:
            return reject(new Error(`Torus Message Signature: Unknown problem: ${JSON.stringify(messageParameters)}`))
        }
      })
    })
  }

  /**
   * Creates a new Message with an 'unapproved' status using the passed msgParams. this.addMsg is called to add the
   * new Message to this.messages, and to save the unapproved Messages from that list to this.store.
   *
   * @param {Object} msgParams The params for the eth_sign call to be made after the message is approved.
   * @param {Object} req (optional) The original request object where the origin may be specificied
   * @returns {number} The id of the newly created message.
   *
   */
  addUnapprovedMessage(messageParameters, request, messageId) {
    // add origin from request
    if (request) messageParameters.origin = request.origin
    messageParameters.data = normalizeMessageData(messageParameters.data)

    // create txData obj with parameters and meta data
    const time = Date.now()
    const messageData = {
      id: messageId,
      msgParams: messageParameters,
      time,
      status: 'unapproved',
      type: 'eth_sign',
    }

    if (messageParameters.customPrefix && messageParameters.customMessage) {
      const hashBuffer = keccak256(
        Buffer.from(
          `${messageParameters.customPrefix}${messageParameters.customMessage.length.toString()}${messageParameters.customMessage}`,
          'utf-8'
        )
      )
      const hash = `0x${hashBuffer.toString('hex').toLowerCase()}`
      if (hash === messageParameters.data.toLowerCase()) {
        messageData.customPrefix = messageParameters.customPrefix
        messageData.customMessage = messageParameters.customMessage
      } else {
        throw new Error(`Message data ${messageParameters.data.toLowerCase()} does not match derived hash ${hash}`)
      }
    }

    this.addMsg(messageData)

    // signal update
    this.emit('update')
    return messageId
  }

  /**
   * Adds a passed Message to this.messages, and calls this._saveMsgList() to save the unapproved Messages from that
   * list to this.store.
   *
   * @param {Message} msg The Message to add to this.messages
   *
   */
  addMsg(message) {
    this.messages.push(message)
    this._saveMsgList()
  }

  /**
   * Returns a specified Message.
   *
   * @param {number} msgId The id of the Message to get
   * @returns {Message|undefined} The Message with the id that matches the passed msgId, or undefined if no Message has that id.
   *
   */
  getMsg(messageId) {
    return this.messages.find((message) => message.id === messageId)
  }

  /**
   * Approves a Message. Sets the message status via a call to this.setMsgStatusApproved, and returns a promise with
   * any the message params modified for proper signing.
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
   * Sets a Message status to 'approved' via a call to this._setMsgStatus.
   *
   * @param {number} msgId The id of the Message to approve.
   *
   */
  setMsgStatusApproved(messageId) {
    this._setMsgStatus(messageId, 'approved')
  }

  /**
   * Sets a Message status to 'signed' via a call to this._setMsgStatus and updates that Message in this.messages by
   * adding the raw signature data of the signature request to the Message
   *
   * @param {number} msgId The id of the Message to sign.
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
    return Promise.resolve(messageParameters)
  }

  /**
   * Sets a Message status to 'rejected' via a call to this._setMsgStatus.
   *
   * @param {number} msgId The id of the Message to reject.
   *
   */
  rejectMsg(messageId) {
    this._setMsgStatus(messageId, 'rejected')
  }

  /**
   * Updates the status of a Message in this.messages via a call to this._updateMsg
   *
   * @private
   * @param {number} msgId The id of the Message to update.
   * @param {string} status The new status of the Message.
   * @throws A 'MessageManager - Message not found for id: "${msgId}".' if there is no Message in this.messages with an
   * id equal to the passed msgId
   * @fires An event with a name equal to `${msgId}:${status}`. The Message is also fired.
   * @fires If status is 'rejected' or 'signed', an event with a name equal to `${msgId}:finished` is fired along with the message
   *
   */
  _setMsgStatus(messageId, status) {
    const message = this.getMsg(messageId)
    if (!message) throw new Error(`MessageManager - Message not found for id: "${messageId}".`)
    message.status = status
    this._updateMsg(message)
    this.emit(`${messageId}:${status}`, message)
    if (status === 'rejected' || status === 'signed') {
      this.emit(`${messageId}:finished`, message)
    }
  }

  /**
   * Sets a Message in this.messages to the passed Message if the ids are equal. Then saves the unapprovedMsg list to
   * storage via this._saveMsgList
   *
   * @private
   * @param {msg} Message A Message that will replace an existing Message (with the same id) in this.messages
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
   * Saves the unapproved messages, and their count, to this.store
   *
   * @private
   * @fires 'updateBadge'
   *
   */
  _saveMsgList() {
    const unapprovedMsgs = this.getUnapprovedMsgs()
    const unapprovedMessageCount = Object.keys(unapprovedMsgs).length
    this.store.updateState({ unapprovedMsgs, unapprovedMsgCount: unapprovedMessageCount })
    this.emit('updateBadge')
  }
}

/**
 * A helper function that converts raw buffer data to a hex, or just returns the data if it is already formatted as a hex.
 *
 * @param {any} data The buffer data to convert to a hex
 * @returns {string} A hex string conversion of the buffer data
 *
 */
function normalizeMessageData(data) {
  if (data.slice(0, 2) === '0x') {
    // data is already hex
    return data
  }
  // data is unicode, convert to hex
  return bufferToHex(Buffer.from(data, 'utf8'))
}
