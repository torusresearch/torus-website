import { cloneDeep } from 'lodash'

import config from '../config'
import { LOCALE_EN, THEME_LIGHT_BLUE_NAME } from '../utils/enums'
import { getDefaultNetwork } from '../utils/utils'

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
  networkType: cloneDeep(getDefaultNetwork()),
  networkDetails: {},
  gasFees: {},
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
  unApprovedAssets: {},
  unapprovedAddChainRequests: {},
  unapprovedSwitchChainRequests: {},
  // preferences
  defaultPublicAddress: '',
  selectedAddress: '',
  customNetworks: {},
  selectedCurrency: 'USD',
  customCurrency: '',
  pastTransactions: [],
  paymentTx: [],
  theme: THEME_LIGHT_BLUE_NAME,
  crashReport: true,
  locale: LOCALE_EN,
  billboard: {},
  announcements: {},
  contacts: [],
  permissions: [],
  errorMsg: '',
  successMsg: '',
  iframeMetadata: { origin: '', name: '', icon: '' },
  embedState: {
    loginConfig: cloneDeep(config.loginConfig),
    isOAuthModalVisible: false,
    buttonPosition: 'bottom-left',
    buttonSize: 56,
    torusWidgetVisibility: true,
    apiKey: 'torus-default',
    mfaLevel: 'default',
    loginInProgress: false,
    showWalletConnect: false,
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
  wcConnectorSession: {},
  confirmModals: [],
  postboxKey: {},
  ethTransferOnly: config.ethTransferOnly,
  lastLoginInfo: {},
  userDapps: {},
}

export default initialState
