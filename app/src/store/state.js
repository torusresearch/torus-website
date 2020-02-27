import { MAINNET, MAINNET_DISPLAY_NAME, MAINNET_CODE, USER_INFO_REQUEST_NEW, THEME_LIGHT_BLUE_NAME, LOCALE_EN } from '../utils/enums'

const initialState = {
  userInfo: {
    name: '', // first + last name
    profileImage: '', // image url
    email: '',
    verifier: '', // enum like GOOGLE
    verifierId: '', // usually email or facebook id
    verifierParams: {} // general params
  },
  // loaders
  loginInProgress: false,
  weiBalanceLoaded: false, // Use on showing spinners
  loadingUserTransactions: true,
  isNewUser: false,
  // account handled
  wallet: {}, // Account specific object
  weiBalance: {}, // Account specific object
  networkId: 0,
  networkType: { host: MAINNET, chainId: MAINNET_CODE, networkName: MAINNET_DISPLAY_NAME },
  currencyData: {},
  tokenData: {}, // Account specific object
  assets: {}, // Account specific object
  tokenRates: {},
  transactions: [],
  unapprovedTypedMessages: {},
  unapprovedPersonalMsgs: {},
  unapprovedMsgs: {},
  // TODO (SHUBHAM): idealy regeneratedSecrets should be ported into wallet when merged with SCWs
  regeneratedSecrets: {}, // priv key thats regenerated from nodes, will be different from priv key in case of torusLogin/encrypted key
  // preferences
  selectedAddress: '',
  jwtToken: '',

  selectedCurrency: 'USD',
  pastTransactions: [],
  paymentTx: [],
  theme: THEME_LIGHT_BLUE_NAME,
  locale: LOCALE_EN,
  billboard: [],
  contacts: [],
  permissions: [],
  userInfoAccess: USER_INFO_REQUEST_NEW, // deprecate
  errorMsg: '',
  successMsg: '',
  iframeMetadata: { origin: '', name: '', icon: '' }
}

export default initialState
