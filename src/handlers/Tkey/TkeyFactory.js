import ThresholdKey from '@tkey/core'
import SecurityQuestionsModule from '@tkey/security-questions'
import SeedPhraseModule, { MetamaskSeedPhraseFormat } from '@tkey/seed-phrase'
import ServiceProviderBase from '@tkey/service-provider-base'
import ShareSerialization from '@tkey/share-serialization'
import ShareTransferModule from '@tkey/share-transfer'
import TorusStorageLayer from '@tkey/storage-layer-torus'
import WebStorageModule from '@tkey/web-storage'

import config from '../../config'
import {
  SECURITY_QUESTIONS_MODULE_KEY,
  SEED_PHRASE_MODULE_KEY,
  SHARE_SERIALIZATION_MODULE_KEY,
  SHARE_TRANSFER_MODULE_KEY,
  TKEY_SHARE_TRANSFER_INTERVAL,
  WEB_STORAGE_MODULE_KEY,
} from '../../utils/enums'

export default async function createTKeyInstance({ postboxKey, tKeyJson, provider, share }) {
  if (!postboxKey) throw new Error('Invalid postbox key')
  const modules = {
    [SECURITY_QUESTIONS_MODULE_KEY]: new SecurityQuestionsModule(),
    [WEB_STORAGE_MODULE_KEY]: new WebStorageModule(),
    [SHARE_TRANSFER_MODULE_KEY]: new ShareTransferModule(),
    [SHARE_SERIALIZATION_MODULE_KEY]: new ShareSerialization(),
    [SEED_PHRASE_MODULE_KEY]: new SeedPhraseModule([new MetamaskSeedPhraseFormat(provider)]),
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
    if (share) await tKey.inputShareStoreSafe(share)
  } else {
    tKey = await ThresholdKey.fromJSON(tKeyJson, {
      modules,
      serviceProvider,
      storageLayer,
    })
    if (tKeyJson.modules && tKeyJson.modules[WEB_STORAGE_MODULE_KEY]) {
      tKey.modules[WEB_STORAGE_MODULE_KEY].canUseFileStorage = tKeyJson.modules[WEB_STORAGE_MODULE_KEY].canUseFileStorage
    }
  }
  if (tKey.modules[SHARE_TRANSFER_MODULE_KEY]) tKey.modules[SHARE_TRANSFER_MODULE_KEY].setRequestStatusCheckInterval(TKEY_SHARE_TRANSFER_INTERVAL)
  return tKey
}
