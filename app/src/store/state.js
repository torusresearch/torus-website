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
  idToken: '',
  userInfoAccess: USER_INFO_REQUEST_NEW,
  wallet: {}, // Account specific object
  weiBalance: {}, // Account specific object
  weiBalanceLoaded: false, // Use on showing spinners
  selectedAddress: '',
  selectedCurrency: 'USD',
  networkId: 0,
  networkType: { host: MAINNET, chainId: MAINNET_CODE, networkName: MAINNET_DISPLAY_NAME },
  currencyData: {},
  tokenData: {}, // Account specific object
  tokenRates: {},
  transactions: [],
  loadingUserTransactions: true,
  unapprovedTypedMessages: {},
  unapprovedPersonalMsgs: {},
  unapprovedMsgs: {},
  loginInProgress: false,
  jwtToken: '',
  pastTransactions: [],
  etherscanTransactions: [],
  isNewUser: false,
  theme: THEME_LIGHT_BLUE_NAME,
  locale: LOCALE_EN,
  assets: {}, // Account specific object
  billboard: [],
  contacts: []
}

export default initialState
