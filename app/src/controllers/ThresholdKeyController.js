/* eslint-disable no-await-in-loop */
import TorusStorageLayer from '@tkey/storage-layer-torus'
import { ethErrors } from 'eth-rpc-errors'
import log from 'loglevel'
import ObservableStore from 'obs-store'
import EventEmitter from 'safe-event-emitter'

import config from '../config'
import createTKeyInstance from '../handlers/Tkey/TkeyFactory'
import { calculateSettingsPageData, getPendingShareTransferRequests } from '../handlers/Tkey/TkeyUtils'
import {
  CHROME_EXTENSION_STORAGE_MODULE_KEY,
  ERROR_TIME,
  PASSWORD_QUESTION,
  SECURITY_QUESTIONS_MODULE_KEY,
  SHARE_TRANSFER_MODULE_KEY,
  TKEY_SHARE_TRANSFER_INTERVAL,
  WEB_STORAGE_MODULE_KEY,
} from '../utils/enums'
import { derivePubKeyXFromPolyID, downloadItem, generateAddressFromPrivateKey, isMain, isPopup } from '../utils/utils'
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
    try {
      if (!postboxKey) return false
      const storageLayer = new TorusStorageLayer({ hostUrl: config.metadataHost })
      const metadata = await storageLayer.getMetadata({ privKey: postboxKey })
      return Object.keys(metadata).length > 0
    } catch (error) {
      log.error('unable to check for tkey', error)
      return false
    }
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
          descriptionBuffer.push(currentShare)
        } else if (currentShare.module === CHROME_EXTENSION_STORAGE_MODULE_KEY) {
          // transfer share from other device
          descriptionBuffer.push(currentShare)
        }
      }

      // Need input from UI
      if (requiredShares > 0 && descriptionBuffer.length > 0) {
        const tkeyJsonReturned = await this.tkeyInputFlow()
        await this._rehydrate(postboxKey, tkeyJsonReturned)
      } else {
        await this.setSettingsPageData()
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
        log.error('cannot recover key')
        this.handleError('tkeyNew.errorCannotRecover')
        throw new Error('Cannot recover key')
      } else {
        const { tKey: newTKey } = this.state
        const { privKey } = await newTKey.reconstructKey()
        await this.setSettingsPageData()
        this.startShareTransferRequestListener()
        log.info(privKey.toString('hex', 64), 'privKey')
        return {
          ethAddress: generateAddressFromPrivateKey(privKey.toString('hex', 64)),
          privKey: privKey.toString('hex', 64),
        }
      }
    } finally {
      window.removeEventListener('beforeunload', beforeUnloadHandler)
    }
  }

  handleError(error) {
    if (isErrorObject(error)) {
      this.store.updateState({ error: 'tkeyNew.oopsDidntWork' })
    } else if (error && typeof error === 'string') {
      this.store.updateState({ error })
    } else if (error && typeof error === 'object') {
      const prettyError = prettyPrintData(error)
      const payloadError = prettyError !== '' ? 'tkeyNew.error' : 'tkeyNew.oopsDidntWork'
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
    const outputshareStore = await tKey.outputShareStore(index)
    await tKey.modules[WEB_STORAGE_MODULE_KEY].storeDeviceShare(outputshareStore)
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

  startShareTransferRequestListener() {
    if (this.requestStatusCheckId) clearInterval(this.requestStatusCheckId)
    const { tKey: initialTkey } = this.state
    if (isMain && !isPopup() && initialTkey.privKey) {
      const checkFn = async () => {
        try {
          const { tKey } = this.state
          const pendingRequests = await getPendingShareTransferRequests(tKey)
          log.info(pendingRequests, 'pending requests')
          this.store.updateState({
            shareTransferRequests: pendingRequests,
          })
          if (Object.keys(pendingRequests).length > 0) {
            clearInterval(this.requestStatusCheckId)
          }
        } catch (error) {
          clearInterval(this.requestStatusCheckId)
          log.error(error)
        }
      }
      checkFn()
      this.requestStatusCheckId = Number(setInterval(checkFn, TKEY_SHARE_TRANSFER_INTERVAL))
    }
  }

  async approveShareTransferRequest(encPubKeyX) {
    try {
      const { tKey } = this.state
      log.info(encPubKeyX, 'approving')
      await tKey.modules[SHARE_TRANSFER_MODULE_KEY].approveRequest(encPubKeyX)
    } catch (error) {
      log.error(error)
    } finally {
      this.startShareTransferRequestListener()
    }
  }

  async denyShareTransferRequest(encPubKeyX) {
    try {
      const { tKey } = this.state
      log.info(encPubKeyX, 'deleting')
      await tKey.modules[SHARE_TRANSFER_MODULE_KEY].deleteShareTransferStore(encPubKeyX)
    } catch (error) {
      log.error(error)
    } finally {
      this.startShareTransferRequestListener()
    }
  }

  async createNewTKey({ postboxKey, password, backup }) {
    await this._init(postboxKey)
    const { tKey, settingsPageData = {} } = this.state
    if (password) await tKey.modules[SECURITY_QUESTIONS_MODULE_KEY].generateNewShareWithSecurityQuestions(password, PASSWORD_QUESTION)
    const { privKey } = await tKey.reconstructKey()
    if (backup) {
      try {
        const { deviceShare } = settingsPageData
        log.info(deviceShare, 'deviceShare')
        if (deviceShare.share) {
          await tKey.modules[WEB_STORAGE_MODULE_KEY].storeDeviceShareOnFileStorage(deviceShare.share.share.shareIndex)
        }
      } catch (error) {
        log.error(error)
      }
    }

    log.info('privKey', privKey.toString('hex', 64))
    await this.setSettingsPageData()
    this.startShareTransferRequestListener()
    return {
      ethAddress: generateAddressFromPrivateKey(privKey.toString('hex', 64)),
      privKey: privKey.toString('hex', 64),
    }
  }

  async rehydrate(postboxKey, tKeyJson) {
    await this._rehydrate(postboxKey, tKeyJson)
    this.startShareTransferRequestListener()
  }

  async _rehydrate(postboxKey, tKeyJson) {
    await this._init(postboxKey, tKeyJson)
    await this.setSettingsPageData()
  }

  async downloadShare(shareIndex) {
    const { tKey } = this.state
    const shareStore = await tKey.outputShareStore(shareIndex)
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

    this.store.updateState({ tKey })
    await this.setSettingsPageData()
  }

  clearTkeyError() {
    this.store.updateState({ error: '' })
  }

  clearTkeySuccess() {
    this.store.updateState({ success: '' })
  }

  setTkeySuccess(message) {
    this.store.updateState({ success: message })
  }

  setTkeyError(message) {
    this.store.updateState({ error: message })
  }
}

export default ThresholdKeyController
