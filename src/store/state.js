import clone from 'clone'

import config from '../config'
import {
  BSC_MAINNET,
  BSC_MAINNET_CODE,
  BSC_MAINNET_DISPLAY_NAME,
  LOCALE_EN,
  SUPPORTED_NETWORK_TYPES,
  THEME_DARK_BLACK_NAME,
  USER_INFO_REQUEST_NEW,
} from '../utils/enums'

const initialState = {
  userInfo: {
    name: '', // first + last name
    profileImage: '', // image url
    email: '',
    verifier: '', // enum like GOOGLE
    verifierId: '', // usually email or facebook id
    verifierParams: {}, // general params
    typeOfLogin: '',
  },
  // loaders
  weiBalanceLoaded: false, // Use on showing spinners
  tokenDataLoaded: false, // Use on showing spinners
  isNewUser: false,
  isRehydrationComplete: false,
  // account handled
  jwtToken: {},
  wallet: {}, // Account specific object
  weiBalance: {}, // Account specific object
  networkId: 0,
  networkType: { host: BSC_MAINNET, chainId: BSC_MAINNET_CODE, networkName: BSC_MAINNET_DISPLAY_NAME },
  currencyData: {},
  tokenData: {}, // Account specific object
  assets: {}, // Account specific object
  tokenRates: {},
  transactions: [],
  unapprovedTypedMessages: {},
  unapprovedPersonalMsgs: {},
  unapprovedMsgs: {},
  unapprovedEncryptionPublicKeyMsgs: {},
  unapprovedDecryptMsgs: {},
  // preferences
  tKeyOnboardingComplete: true,
  tKeyExists: false,
  defaultPublicAddress: '',
  selectedAddress: '',
  supportedNetworks: { ...SUPPORTED_NETWORK_TYPES },
  selectedCurrency: 'USD',
  pastTransactions: [],
  paymentTx: [],
  theme: THEME_DARK_BLACK_NAME,
  crashReport: true,
  locale: LOCALE_EN,
  billboard: {},
  contacts: [],
  permissions: [],
  userInfoAccess: USER_INFO_REQUEST_NEW, // deprecate
  errorMsg: '',
  successMsg: '',
  iframeMetadata: { origin: '', name: '', icon: '' },
  embedState: {
    loginConfig: clone(config.loginConfig),
    isOAuthModalVisible: false,
    buttonPosition: 'bottom-left',
    torusWidgetVisibility: true,
    apiKey: 'torus-default',
  },
  whiteLabel: {
    isActive: false,
    theme: {},
    logoDark: '',
    logoLight: '',
    topupHide: config.hideTopup,
    featuredBillboardHide: false,
  },
  etherscanTx: [],
  badgesCompletion: {},
  tKeyStore: {},
  wcConnectorSession: {},
  confirmModals: [],
  postboxKey: {},
  isTkeySeedPhraseInputRequired: false,
  ethTransferOnly: config.ethTransferOnly,
}

export default initialState
