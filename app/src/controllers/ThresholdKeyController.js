/* eslint-disable no-await-in-loop */
import TorusStorageLayer from '@tkey/storage-layer-torus'
import { ethErrors } from 'eth-rpc-errors'
import log from 'loglevel'
import ObservableStore from 'obs-store'
import EventEmitter from 'safe-event-emitter'

import config from '../config'
import createTKeyInstance from '../handlers/Tkey/TkeyFactory'
import { calculateSettingsPageData } from '../handlers/Tkey/TkeyUtils'
import {
  CHROME_EXTENSION_STORAGE_MODULE_KEY,
  ERROR_TIME,
  PASSWORD_QUESTION,
  SECURITY_QUESTIONS_MODULE_KEY,
  WEB_STORAGE_MODULE_KEY,
} from '../utils/enums'
import { derivePubKeyXFromPolyID, downloadItem, generateAddressFromPrivateKey } from '../utils/utils'
import { isErrorObject, prettyPrintData } from './utils/permissionUtils'

function beforeUnloadHandler(e) {
  // Cancel the event
  e.preventDefault() // If you prevent default behavior in Mozilla Firefox prompt will always be shown
  // Chrome requires returnValue to be set
  e.returnValue = 'You have unfinished changes'
}

class ThresholdKeyController extends EventEmitter {
  constructor(opts = {}) {
    super()
    this.store = new ObservableStore({})
    this.requestTkeyInput = opts.requestTkeyInput
  }

  async checkIfTKeyExists(postboxKey) {
    const storageLayer = new TorusStorageLayer({ hostUrl: config.metadataHost })
    const metadata = await storageLayer.getMetadata({ privKey: postboxKey })
    return Object.keys(metadata).length > 0
  }

  get state() {
    return this.store.getState()
  }

  async login(postboxKey, tKeyJson) {
    try {
      await this._init(postboxKey, tKeyJson)
      const { keyDetails, tKey, parsedShareDescriptions } = this.state
      log.info(keyDetails)
      const { requiredShares: shareCount } = keyDetails
      let requiredShares = shareCount
      const descriptionBuffer = []
      // const passwordEntered = false
      let currentIndex = 0

      window.addEventListener('beforeunload', beforeUnloadHandler)
      while (requiredShares > 0 && currentIndex < parsedShareDescriptions.length) {
        const currentShare = parsedShareDescriptions[currentIndex]
        currentIndex += 1
        if (currentShare.module === WEB_STORAGE_MODULE_KEY) {
          try {
            await tKey.modules[WEB_STORAGE_MODULE_KEY].inputShareFromWebStorage()
            requiredShares -= 1
          } catch (error) {
            log.warn(error, 'unable to read share from device. Must be on other device')
            descriptionBuffer.push(currentShare)
          }
        } else if (currentShare.module === SECURITY_QUESTIONS_MODULE_KEY) {
          // // default to password for now
          // try {
          //   let password
          //   try {
          //     password = await this.getSecurityQuestionShareFromUserInput(currentShare)
          //   } catch {
          //     log.info('user is not willing to enter password')
          //     // eslint-disable-next-line no-continue
          //     continue
          //   }
          //   await tKey.modules[SECURITY_QUESTIONS_MODULE_KEY].inputShareFromSecurityQuestions(password)
          //   requiredShares -= 1
          //   passwordEntered = true
          // } catch (error) {
          //   currentIndex -= 1 // To Allow multiple entry of incorrect password
          //   log.warn(error, 'Unable to get user share from input')
          //   this.handleError('tkeyNew.errorIncorrectPass')
          // }
          descriptionBuffer.push(currentShare)
        } else if (currentShare.module === CHROME_EXTENSION_STORAGE_MODULE_KEY) {
          // transfer share from other device
          descriptionBuffer.push(currentShare)
        }
      }

      // Need input from UI
      if (requiredShares > 0 && descriptionBuffer.length > 0) {
        const tkeyJsonReturned = await this.tkeyInputFlow()
        await this.rehydrate(postboxKey, tkeyJsonReturned)
      }

      // while (requiredShares > 0 && descriptionBuffer.length > 0) {
      //   try {
      //     const shareStore = await this.getShareFromAnotherDevice(descriptionBuffer)
      //     descriptionBuffer = descriptionBuffer.filter((x) => x.shareIndex.toString('hex') !== shareStore.share.shareIndex.toString('hex'))
      //     requiredShares -= 1
      //   } catch {
      //     log.warn('User declined share transfer')
      //     break
      //   }
      // }

      const { keyDetails: newDetails } = this.state

      if (newDetails.requiredShares > 0) {
        this.handleError('tkeyNew.errorCannotRecover')
        throw new Error('Cannot recover key')
      } else {
        const { tKey: newTKey } = this.state
        const { privKey } = await newTKey.reconstructKey()
        await this.setSettingsPageData()
        log.info(privKey.toString('hex', 64), 'privKey')
        return {
          ethAddress: generateAddressFromPrivateKey(privKey.toString('hex', 64)),
          privKey: privKey.toString('hex', 64),
        }
      }

      // if (requiredShares <= 0) {
      // const { privKey } = await tKey.reconstructKey()
      // if (descriptionBuffer.length > 0 || passwordEntered) {
      //   try {
      //     const response = await this.storeDeviceFlow()
      //     const { isOld, oldIndex } = response
      //     if (!isOld) {
      //       await this.generateAndStoreNewDeviceShare()
      //     } else {
      //       await this.copyShareUsingIndexAndStoreLocally(oldIndex)
      //     }
      //   } catch (error) {
      //     log.error(error)
      //   }
      // }
      // await this.setSettingsPageData()
      // window.removeEventListener('beforeunload', beforeUnloadHandler)
      // log.info(privKey.toString('hex', 64), 'privKey')
      // return {
      //   ethAddress: generateAddressFromPrivateKey(privKey.toString('hex', 64)),
      //   privKey: privKey.toString('hex', 64),
      // }
      // }
      // const { tKey } = this.state
      // log.info(tKey.privKey.toString('hex', 64), 'privKey')
    } finally {
      window.removeEventListener('beforeunload', beforeUnloadHandler)
    }
  }

  handleError(error) {
    if (isErrorObject(error)) {
      this.store.updateState({ error: `Oops, That didn't work. Pls reload and try again. \n${error.message}` })
    } else if (error && typeof error === 'string') {
      this.store.updateState({ error })
    } else if (error && typeof error === 'object') {
      const prettyError = prettyPrintData(error)
      const payloadError = prettyError !== '' ? `Error: ${prettyError}` : 'Something went wrong. Pls try again'
      this.store.updateState({ error: payloadError })
    } else {
      this.store.updateState({ error: error || '' })
    }
    setTimeout(() => this.store.updateState({ error: '' }), ERROR_TIME)
  }

  async changePassword(password) {
    const { tKey } = this.state
    await tKey.modules.securityQuestions.changeSecurityQuestionAndAnswer(password, PASSWORD_QUESTION)
    await this.setSettingsPageData()
  }

  async addPassword(password) {
    const { tKey } = this.state
    await tKey.modules.securityQuestions.generateNewShareWithSecurityQuestions(password, PASSWORD_QUESTION)
    await this.setSettingsPageData()
  }

  async copyShareUsingIndexAndStoreLocally(index) {
    const { tKey } = this.state
    const outputshare = tKey.outputShare(index)
    await tKey.modules[WEB_STORAGE_MODULE_KEY].storeDeviceShare(outputshare)
    await this.setSettingsPageData()
  }

  async generateAndStoreNewDeviceShare() {
    const { tKey } = this.state
    const newShare = await tKey.generateNewShare()
    await tKey.modules[WEB_STORAGE_MODULE_KEY].storeDeviceShare(newShare.newShareStores[newShare.newShareIndex.toString('hex')])
    await this.setSettingsPageData()
  }

  async tkeyInputFlow() {
    return new Promise((resolve, reject) => {
      this.requestTkeyInput(this.state.tKey)
      this.once('input:finished', (data) => {
        switch (data.status) {
          case 'approved':
            return resolve(data.response)
          case 'rejected':
            return reject(ethErrors.provider.userRejectedRequest('Torus User Input: User denied input.'))
          default:
            return reject(new Error(`Torus User Input: Unknown problem: ${JSON.stringify(this.state.tKey)}`))
        }
      })
    })
  }

  async setTkeyInputFlow(payload) {
    const { response, rejected } = payload
    if (rejected) this.emit('input:finished', { status: 'rejected' })
    if (response) this.emit('input:finished', { status: 'approved', response })
  }

  // async storeDeviceFlow() {
  //   const { parsedShareDescriptions } = this.state
  //   return new Promise((resolve, reject) => {
  //     const id = createRandomId()
  //     this.store.updateState({ storeDeviceFlow: { [id]: { status: 'unapproved', parsedShareDescriptions } } })
  //     this.showStoreDeviceFlow({ id, parsedShareDescriptions })
  //     this.once(`${id}:storedevice:finished`, (data) => {
  //       const { storeDeviceFlow } = this.state
  //       this.store.updateState({ storeDeviceFlow: deepmerge(storeDeviceFlow, { [id]: { parsedShareDescriptions, status: data.status } }) })
  //       switch (data.status) {
  //         case 'approved':
  //           return resolve(data.response)
  //         case 'rejected':
  //           return reject(ethErrors.provider.userRejectedRequest('Torus User Input Store device: User denied input.'))
  //         default:
  //           return reject(new Error(`Torus User Input Security Question: Unknown problem: ${JSON.stringify(parsedShareDescriptions)}`))
  //       }
  //     })
  //   })
  // }

  // async setStoreDeviceFlow(id, payload) {
  //   const { response, rejected } = payload
  //   if (rejected) this.emit(`${id}:storedevice:finished`, { status: 'rejected' })
  //   if (response) this.emit(`${id}:storedevice:finished`, { status: 'approved', response })
  // }

  // async getSecurityQuestionShareFromUserInput(share) {
  //   return new Promise((resolve, reject) => {
  //     const id = createRandomId()
  //     this.store.updateState({ securityQuestionShareUserInput: { [id]: { share, status: 'unapproved' } } })
  //     this.requestSecurityQuestionInput({ id, share })
  //     this.once(`${id}:securityquestion:finished`, (data) => {
  //       const { securityQuestionShareUserInput } = this.state
  //       this.store.updateState({
  //         securityQuestionShareUserInput: deepmerge(securityQuestionShareUserInput, { [id]: { share, status: data.status } }),
  //       })
  //       switch (data.status) {
  //         case 'approved':
  //           return resolve(data.password)
  //         case 'rejected':
  //           return reject(ethErrors.provider.userRejectedRequest('Torus User Input Security Question: User denied input.'))
  //         default:
  //           return reject(new Error(`Torus User Input Security Question: Unknown problem: ${JSON.stringify(share)}`))
  //       }
  //     })
  //   })
  // }

  // async setSecurityQuestionShareFromUserInput(id, payload) {
  //   const { password, rejected } = payload
  //   if (rejected) this.emit(`${id}:securityquestion:finished`, { status: 'rejected' })
  //   if (password) this.emit(`${id}:securityquestion:finished`, { status: 'approved', password })
  // }

  // getShareFromAnotherDevice(shareDescriptions) {
  //   const id = createRandomId()
  //   this.store.updateState({ shareTransferInput: { [id]: { shareDescriptions: parseShares(shareDescriptions), status: 'unapproved' } } })
  //   this.requestShareTransferInput({ id, shareDescriptions })
  //   const { tKey } = this.state
  //   return tKey.modules[SHARE_TRANSFER_MODULE_KEY].requestNewShare(window.navigator.userAgent).then((encPubKey) => {
  //     this.once(`${id}:sharetransfer:finished`, (data) => {
  //       const { shareTransferInput } = this.state
  //       this.store.updateState({
  //         shareTransferInput: deepmerge(shareTransferInput, { [id]: { shareDescriptions, status: data.status } }),
  //       })
  //       switch (data.status) {
  //         case 'approved':
  //           return tKey.modules[SHARE_TRANSFER_MODULE_KEY].startRequestStatusCheck(encPubKey, true) // returns share promise
  //         case 'rejected':
  //           return Promise.reject(ethErrors.provider.userRejectedRequest('Torus Share Transfer: User denied transfer.'))
  //         default:
  //           return Promise.reject(new Error(`Torus Share Transfer: Unknown problem: ${JSON.stringify(shareTransferInput)}`))
  //       }
  //     })
  //   })
  // }

  // async setShareTransferStatus(id, payload) {
  //   const { success } = payload
  //   this.emit(`${id}:sharetransfer:finished`, { status: success ? 'approved' : 'rejected' })
  // }

  async createNewTKey({ postboxKey, password, backup }) {
    await this._init(postboxKey)
    const { tKey, settingsPageData = {} } = this.state
    if (password) await tKey.modules[SECURITY_QUESTIONS_MODULE_KEY].generateNewShareWithSecurityQuestions(password, PASSWORD_QUESTION)
    const { privKey } = await tKey.reconstructKey()
    if (backup) {
      try {
        const { deviceShare } = settingsPageData
        if (deviceShare) {
          await tKey.modules[WEB_STORAGE_MODULE_KEY].storeDeviceShareOnFileStorage(deviceShare.share.shareIndex)
        }
      } catch (error) {
        log.error(error)
        this.handleError(error)
      }
    }

    log.info('privKey', privKey.toString('hex', 64))
    await this.setSettingsPageData()
    return {
      ethAddress: generateAddressFromPrivateKey(privKey.toString('hex', 64)),
      privKey: privKey.toString('hex', 64),
    }
  }

  async rehydrate(postboxKey, tKeyJson) {
    await this._init(postboxKey, tKeyJson)
    await this.setSettingsPageData()
  }

  downloadShare(shareIndex) {
    const { tKey } = this.state
    const shareStore = tKey.outputShare(shareIndex)
    const fileName = `${derivePubKeyXFromPolyID(shareStore.polynomialID)}.json`
    const text = JSON.stringify(shareStore, null, 2)
    downloadItem(fileName, text)
  }

  async setSettingsPageData() {
    const { tKey } = this.state
    const { onDeviceShare, allDeviceShares, passwordShare, threshold, parsedShareDescriptions, keyDetails } = await calculateSettingsPageData(tKey)

    this.store.updateState({
      settingsPageData: {
        deviceShare: onDeviceShare,
        allDeviceShares,
        passwordShare,
        threshold,
      },
      parsedShareDescriptions,
      keyDetails,
    })
  }

  async _init(postboxKey, tKeyJson) {
    // const { tKey: stateTKey } = this.state
    // if (stateTKey && stateTKey.privKey) throw new Error('TKey already initialized')
    const tKey = await createTKeyInstance(postboxKey, tKeyJson)
    // await tKey.initializeNewKey({ initializeModules: true })
    // const keyDetails = tKey.getKeyDetails()

    this.store.updateState({ tKey })
    await this.setSettingsPageData()
  }

  clearTkeyError() {
    this.store.updateState({ error: '' })
  }
}

export default ThresholdKeyController
