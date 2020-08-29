/* eslint-disable no-await-in-loop */
import bowser from 'bowser'
import log from 'loglevel'
import ObservableStore from 'obs-store'
import ThresholdKey, { SecurityQuestionsModule, ServiceProviderBase, TorusStorageLayer, WebStorageModule } from 'tkey'

import config from '../config'
import {
  CHROME_EXTENSION_STORAGE_MODULE_KEY,
  PASSWORD_QUESTION,
  SECURITY_QUESTIONS_MODULE_KEY,
  STORAGE_MAP,
  THRESHOLD_KEY_PRIORITY_ORDER,
  WEB_STORAGE_MODULE_KEY,
} from '../utils/enums'
import { derivePubKeyXFromPolyID, downloadItem, generateAddressFromPrivateKey } from '../utils/utils'

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

  async login(postboxKey, tKeyJson) {
    await this._init(postboxKey, tKeyJson)
    const { keyDetails, tKey, parsedShareDescriptions } = this.state
    log.info(keyDetails)
    const { requiredShares: shareCount } = keyDetails
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
      await this.setSettingsPageData()
      return {
        ethAddress: generateAddressFromPrivateKey(privKey.toString('hex')),
        privKey: privKey.toString('hex'),
      }
    }
    // TODO: Don't throw but keep this promise in wait and get the other shares
    throw new Error('Requires more shares')
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
    await this._init(postboxKey)
    const { tKey } = this.state
    if (password) await tKey.modules[SECURITY_QUESTIONS_MODULE_KEY].generateNewShareWithSecurityQuestions(password, PASSWORD_QUESTION)
    const privKey = await tKey.reconstructKey()
    if (backup) {
      await tKey.modules[WEB_STORAGE_MODULE_KEY].storeDeviceShareOnFileStorage()
    }

    log.info('privKey', privKey.toString('hex'))
    await this.setSettingsPageData()
    return {
      ethAddress: generateAddressFromPrivateKey(privKey.toString('hex')),
      privKey: privKey.toString('hex'),
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
    const onDeviceShare = {}
    const passwordShare = {}

    const keyDetails = tKey.getKeyDetails()
    const { shareDescriptions, totalShares, threshold: thresholdShares } = keyDetails
    const parsedShareDescriptions = Object.keys(shareDescriptions)
      .map((x) => {
        return shareDescriptions[x].map((y) => {
          return { ...JSON.parse(y), shareIndex: x }
        })
      })
      .flatMap((x) => x)
      .sort((a, b) => {
        return THRESHOLD_KEY_PRIORITY_ORDER.indexOf(a.module) - THRESHOLD_KEY_PRIORITY_ORDER.indexOf(b.module)
      })

    // Total device shares
    const allDeviceShares = parsedShareDescriptions.reduce((acc, x) => {
      if (x.module === CHROME_EXTENSION_STORAGE_MODULE_KEY || x.module === WEB_STORAGE_MODULE_KEY) {
        const browserInfo = bowser.parse(x.userAgent)

        x.title = `${browserInfo.browser.name} ${x.dateAdded}`

        if (acc[x.shareIndex]) {
          acc[x.shareIndex].browsers = [...acc[x.shareIndex].browsers, x]
        } else {
          const deviceInfo = `${STORAGE_MAP[x.module]} - ${browserInfo.os.name} ${browserInfo.browser.name}`
          acc[x.shareIndex] = {
            index: x.shareIndex,
            icon: browserInfo.platform.type,
            groupTitle: deviceInfo,
            browsers: [x],
          }
        }
      }
      return acc
    }, {})

    // For ondevice share
    try {
      const onDeviceLocalShare = await tKey.modules[WEB_STORAGE_MODULE_KEY].getDeviceShare()
      if (onDeviceLocalShare) {
        onDeviceShare.available = true
        onDeviceShare.share = onDeviceLocalShare
      }
    } catch {
      onDeviceShare.available = false
    }

    // password share
    const passwordModules = parsedShareDescriptions.filter((x) => x.module === SECURITY_QUESTIONS_MODULE_KEY)
    passwordShare.available = passwordModules.length > 0

    // Current threshold
    const threshold = `${thresholdShares}/${totalShares}`

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
    const { tKey: stateTKey } = this.state
    if (stateTKey) throw new Error('TKey already initialized')
    const modules = {
      [SECURITY_QUESTIONS_MODULE_KEY]: new SecurityQuestionsModule(),
      [WEB_STORAGE_MODULE_KEY]: new WebStorageModule(),
    }
    const serviceProvider = new ServiceProviderBase({ postboxKey })
    const storageLayer = new TorusStorageLayer({ serviceProvider, hostUrl: config.metadataHost })
    let tKey
    if (!tKeyJson) {
      tKey = new ThresholdKey({
        serviceProvider,
        storageLayer,
        modules,
      })
      await tKey.initialize()
    } else
      tKey = await ThresholdKey.fromJSON(tKeyJson, {
        modules,
        serviceProvider,
        storageLayer,
      })
    // await tKey.initializeNewKey({ initializeModules: true })
    // const keyDetails = tKey.getKeyDetails()

    this.store.updateState({ tKey })
    await this.setSettingsPageData()
  }
}

export default ThresholdKeyController
