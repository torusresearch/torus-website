/* eslint-disable no-await-in-loop */
import log from 'loglevel'
import ObservableStore from 'obs-store'
import ThresholdKey, { SecurityQuestionsModule, ServiceProviderBase, TorusStorageLayer, WebStorageModule } from 'tkey'

import config from '../config'
import {
  CHROME_EXTENSION_STORAGE_MODULE_KEY,
  PASSWORD_QUESTION,
  SECURITY_QUESTIONS_MODULE_KEY,
  THRESHOLD_KEY_PRIORITY_ORDER,
  WEB_STORAGE_MODULE_KEY,
} from '../utils/enums'
import { generateAddressFromPrivateKey } from '../utils/utils'

class ThresholdKeyController {
  constructor() {
    this.store = new ObservableStore({})
  }

  async checkIfTKeyExists(postboxKey) {
    const storageLayer = new TorusStorageLayer({ hostUrl: config.metadataHost })
    const metadata = await storageLayer.getMetadata(postboxKey)
    return Object.keys(metadata).length > 0
  }

  get state() {
    return this.store.getState()
  }

  async init(postboxKey, tKeyJson) {
    await this._init(postboxKey, tKeyJson)
    const { keyDetails, tKey } = this.state
    log.info(keyDetails)
    const { requiredShares: shareCount, shareDescriptions } = keyDetails
    const parsedShareDescriptions = Object.values(shareDescriptions)
      .flatMap((x) => x)
      .map((x) => JSON.parse(x))
      .sort((a, b) => {
        return THRESHOLD_KEY_PRIORITY_ORDER.indexOf(a.module) - THRESHOLD_KEY_PRIORITY_ORDER.indexOf(b.module)
      })
    let requiredShares = shareCount
    const descriptionBuffer = []
    while (requiredShares > 0 && parsedShareDescriptions.length > 0) {
      const currentShare = parsedShareDescriptions.shift()
      if (currentShare.module === WEB_STORAGE_MODULE_KEY) {
        try {
          await tKey.modules[WEB_STORAGE_MODULE_KEY].inputShareFromWebStorage()
          requiredShares -= 1
        } catch (error) {
          log.error(error, 'unable to read share from device. Must be on other device')
          descriptionBuffer.push(currentShare)
        }
      } else if (currentShare.module === SECURITY_QUESTIONS_MODULE_KEY) {
        // default to password for now
        await this.getSecurityQuestionShareFromUserInput()
        requiredShares -= 1
      } else if (currentShare.module === CHROME_EXTENSION_STORAGE_MODULE_KEY) {
        // default to password for now
        await this.getShareFromChromeExtension()
        requiredShares -= 1
      }
      if (parsedShareDescriptions.length === 0 && requiredShares > 0 && descriptionBuffer.length > 0) {
        await this.getShareFromAnotherDevice()
        requiredShares -= 1
      }
      if (parsedShareDescriptions.length === 0 && requiredShares > 0 && descriptionBuffer.length === 0) {
        throw new Error('User lost his key')
      }
    }

    if (requiredShares <= 0) {
      const privKey = await tKey.reconstructKey()
      return {
        ethAddress: generateAddressFromPrivateKey(privKey.toString('hex')),
        privKey: privKey.toString('hex'),
      }
    }
    // TODO: Don't throw but keep this promise in wait and get the other shares
    throw new Error('Requires more shares')
  }

  async generateAndStoreNewDeviceShare() {
    const { tKey } = this.state
    const newShare = await tKey.generateNewShare()
    await tKey.modules.webStorage.storeDeviceShare(newShare.newShareStores[newShare.newShareIndex.toString('hex')])
    // this.store.updateState({ keyDetails: this.tb.getKeyDetails() })
    // await this.setSettingsPageData()
  }

  async getSecurityQuestionShareFromUserInput() {
    throw new TypeError('Not yet implemented')
  }

  async getShareFromChromeExtension() {
    throw new TypeError('Not yet implemented')
  }

  async getShareFromAnotherDevice() {
    throw new TypeError('Not yet implemented')
  }

  async createNewTKey({ postboxKey, password, backup }) {
    const { tKey } = this.state
    if (tKey) throw new Error('TKey already initialized')
    await this._init(postboxKey)
    await tKey.modules[SECURITY_QUESTIONS_MODULE_KEY].generateNewShareWithSecurityQuestions(password, PASSWORD_QUESTION)
    const privKey = await tKey.reconstructKey()
    if (backup) {
      await tKey.modules[WEB_STORAGE_MODULE_KEY].storeDeviceShareOnFileStorage()
    }
    return {
      ethAddress: generateAddressFromPrivateKey(privKey.toString('hex')),
      privKey: privKey.toString('hex'),
    }
  }

  async _init(postboxKey, tKeyJson) {
    const modules = {
      [SECURITY_QUESTIONS_MODULE_KEY]: new SecurityQuestionsModule(),
      [WEB_STORAGE_MODULE_KEY]: new WebStorageModule(),
    }
    const serviceProvider = new ServiceProviderBase({ postboxKey })
    const storageLayer = new TorusStorageLayer({ serviceProvider, hostUrl: config.metadataHost })
    let tKey
    if (!tKeyJson)
      tKey = new ThresholdKey({
        serviceProvider,
        storageLayer,
        modules,
      })
    else
      tKey = await ThresholdKey.fromJSON(tKeyJson, {
        modules,
        serviceProvider,
        storageLayer,
      })
    // await tKey.initializeNewKey({ initializeModules: true })
    // const keyDetails = tKey.getKeyDetails()
    const keyDetails = await tKey.initialize()
    this.store.updateState({ keyDetails, tKey })
  }
}

export default ThresholdKeyController
