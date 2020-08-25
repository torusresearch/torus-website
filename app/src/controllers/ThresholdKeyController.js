// import ObservableStore from 'obs-store'
import Torus from '@toruslabs/torus.js'
import log from 'loglevel'
import ThresholdKey, { SecurityQuestionsModule, ServiceProviderBase, TorusStorageLayer, WebStorageModule } from 'tkey'
import { keccak256, toChecksumAddress } from 'web3-utils'

import config from '../config'

// const PRIORITY_ORDER = ['webStorage', 'securityQuestions', 'chromeExtensionStorage']

function generateAddressFromPubKey(point) {
  const torus = new Torus()
  const key = torus.ec.keyFromPublic({ x: point.x.toString('hex', 64), y: point.y.toString('hex', 64) })
  const publicKey = key.getPublic().encode('hex').slice(2)
  const ethAddressLower = `0x${keccak256(Buffer.from(publicKey, 'hex')).slice(64 - 38)}`
  return toChecksumAddress(ethAddressLower)
}

class ThresholdKeyController {
  constructor() {
    this.modules = {
      securityQuestions: new SecurityQuestionsModule(),
      webStorage: new WebStorageModule(),
    }
    this.serviceProvider = null
    this.storageLayer = null
    this.tKey = null
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
    let keyDetails = await this.tKey.initialize()
    log.info(keyDetails)
    if (keyDetails.requiredShares === 1) {
      await this.tKey.modules.webStorage.inputShareFromWebStorage()
      keyDetails = this.tKey.getKeyDetails()
    }
    if (keyDetails.requiredShares <= 0) {
      const privKey = await this.tKey.reconstructKey()
      return {
        ethAddress: generateAddressFromPubKey(keyDetails.pubKey),
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
}

export default ThresholdKeyController
