import ThresholdKey from '@tkey/core'
import SecurityQuestionsModule from '@tkey/security-questions'
import ServiceProviderBase from '@tkey/service-provider-base'
import ShareTransferModule from '@tkey/share-transfer'
import TorusStorageLayer from '@tkey/storage-layer-torus'
import WebStorageModule from '@tkey/web-storage'

import config from '../../config'
import { SECURITY_QUESTIONS_MODULE_KEY, SHARE_TRANSFER_MODULE_KEY, TKEY_SHARE_TRANSFER_INTERVAL, WEB_STORAGE_MODULE_KEY } from '../../utils/enums'

export default async function createTKeyInstance(postboxKey, tKeyJson) {
  const modules = {
    [SECURITY_QUESTIONS_MODULE_KEY]: new SecurityQuestionsModule(),
    [WEB_STORAGE_MODULE_KEY]: new WebStorageModule(),
    [SHARE_TRANSFER_MODULE_KEY]: new ShareTransferModule(),
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
  tKey.modules[SHARE_TRANSFER_MODULE_KEY].setRequestStatusCheckInterval(TKEY_SHARE_TRANSFER_INTERVAL)
  return tKey
}
