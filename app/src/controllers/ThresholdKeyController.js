/* eslint-disable no-await-in-loop */
// import ObservableStore from 'obs-store'
import log from 'loglevel'
import ThresholdKey, { SecurityQuestionsModule, ServiceProviderBase, TorusStorageLayer, WebStorageModule } from 'tkey'
import { toChecksumAddress } from 'web3-utils'

import config from '../config'
import {
  CHROME_EXTENSION_STORAGE_MODULE_KEY,
  SECURITY_QUESTIONS_MODULE_KEY,
  THRESHOLD_KEY_PRIORITY_ORDER,
  WEB_STORAGE_MODULE_KEY,
} from '../utils/enums'
import { generateAddressFromPubKey } from '../utils/utils'

class ThresholdKeyController {
  constructor() {
    this.modules = {
      [SECURITY_QUESTIONS_MODULE_KEY]: new SecurityQuestionsModule(),
      [WEB_STORAGE_MODULE_KEY]: new WebStorageModule(),
    }
    this.serviceProvider = null
    this.storageLayer = null
    this.tKey = null
  }

  async checkIfTKeyExists(postboxKey) {
    const storageLayer = new TorusStorageLayer({ hostUrl: config.metadataHost })
    const metadata = await storageLayer.getMetadata(postboxKey)
    return Object.keys(metadata).length > 0
  }

  async init(postboxKey, tKeyJson) {
    this.serviceProvider = new ServiceProviderBase({ postboxKey })
    this.storageLayer = new TorusStorageLayer({ serviceProvider: this.serviceProvider, hostUrl: config.metadataHost })
    if (!tKeyJson)
      this.tKey = new ThresholdKey({
        serviceProvider: this.serviceProvider,
        storageLayer: this.storageLayer,
        modules: this.modules,
      })
    else
      this.tKey = await ThresholdKey.fromJSON(tKeyJson, {
        modules: this.modules,
        serviceProvider: this.serviceProvider,
        storageLayer: this.storageLayer,
      })
    // await this.tKey.initializeNewKey({ initializeModules: true })
    // const keyDetails = this.tKey.getKeyDetails()

    const keyDetails = await this.tKey.initialize()
    log.info(keyDetails)
    const { requiredShares: shareCount, shareDescriptions } = keyDetails
    const parsedShareDescriptions = Object.values(shareDescriptions)
      .flatMap((x) => JSON.parse(x))
      .sort((a, b) => {
        return THRESHOLD_KEY_PRIORITY_ORDER.indexOf(a.module) - THRESHOLD_KEY_PRIORITY_ORDER.indexOf(b.module)
      })
    let requiredShares = shareCount
    const descriptionBuffer = []
    while (requiredShares > 0 && parsedShareDescriptions.length > 0) {
      const currentShare = parsedShareDescriptions.shift()
      if (currentShare.module === WEB_STORAGE_MODULE_KEY) {
        try {
          await this.tKey.modules[WEB_STORAGE_MODULE_KEY].inputShareFromWebStorage()
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
      const privKey = await this.tKey.reconstructKey()
      return {
        ethAddress: toChecksumAddress(generateAddressFromPubKey(keyDetails.pubKey).toString('hex')),
        privKey: privKey.toString('hex'),
      }
    }
    // TODO: Don't throw but keep this promise in wait and get the other shares
    throw new Error('Requires more shares')
  }

  async generateAndStoreNewDeviceShare() {
    const newShare = await this.tKey.generateNewShare()
    this.tKey.modules.webStorage.storeDeviceShare(newShare.newShareStores[newShare.newShareIndex.toString('hex')])
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
}

export default ThresholdKeyController
