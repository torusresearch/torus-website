import bowser from 'bowser'

import {
  CHROME_EXTENSION_STORAGE_MODULE_KEY,
  SECURITY_QUESTIONS_MODULE_KEY,
  SHARE_TRANSFER_MODULE_KEY,
  THRESHOLD_KEY_PRIORITY_ORDER,
  WEB_STORAGE_MODULE_KEY,
} from '../../utils/enums'
import { capitalizeFirstLetter } from '../../utils/utils'

export function parseShares(parsedShareDescriptions) {
  return parsedShareDescriptions.reduce((acc, x) => {
    const browserInfo = bowser.parse(x.userAgent)

    x.browserName = x.module === CHROME_EXTENSION_STORAGE_MODULE_KEY ? 'Chrome Extension' : `${browserInfo.browser.name}`
    x.title = `${x.browserName}${x.module === CHROME_EXTENSION_STORAGE_MODULE_KEY ? '' : ` ${`V${browserInfo.browser.version}`}`}`
    x.dateFormatted = new Date(x.dateAdded).toLocaleString()

    if (acc[x.shareIndex]) {
      acc[x.shareIndex].browsers = [...acc[x.shareIndex].browsers, x]
    } else {
      const deviceType = x.module === CHROME_EXTENSION_STORAGE_MODULE_KEY ? 'Chrome Extension' : capitalizeFirstLetter(browserInfo.platform.type)
      const deviceInfo = `${deviceType} - ${browserInfo.os.name}`
      acc[x.shareIndex] = {
        index: x.shareIndex,
        osName: browserInfo.os.name,
        indexShort: x.shareIndex.slice(0, 4),
        icon: browserInfo.platform.type,
        groupTitle: deviceInfo,
        dateAdded: x.dateAdded,
        module: x.module,
        browsers: [x],
      }
    }

    return acc
  }, {})
}

export async function calculateSettingsPageData(tKey) {
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
  const allDeviceShares = parseShares(
    parsedShareDescriptions.filter((x) => x.module === CHROME_EXTENSION_STORAGE_MODULE_KEY || x.module === WEB_STORAGE_MODULE_KEY)
  )

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
  return { onDeviceShare, allDeviceShares, passwordShare, threshold, parsedShareDescriptions, keyDetails }
}

export async function getPendingShareTransferRequests(tKey) {
  const latestShareTransferStore = await tKey.modules[SHARE_TRANSFER_MODULE_KEY].getShareTransferStore()
  const pendingRequests = Object.keys(latestShareTransferStore).reduce((acc, x) => {
    const browserDetail = bowser.parse(latestShareTransferStore[x].userAgent)
    if (!latestShareTransferStore[x].encShareInTransit) acc.push({ ...latestShareTransferStore[x], browserDetail, encPubKeyX: x })
    return acc
  }, [])
  return pendingRequests
}
