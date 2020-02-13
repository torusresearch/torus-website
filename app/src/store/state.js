import { ROPSTEN, ROPSTEN_DISPLAY_NAME, ROPSTEN_CODE, USER_INFO_REQUEST_NEW, THEME_LIGHT_BLUE_NAME, LOCALE_EN } from '../utils/enums'

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
  weiBalanceLoaded: false, // Use on showing spinners
  selectedEOA: '', // For signing
  selectedAddress: '',
  selectedCurrency: 'USD',
  networkId: 0,
  networkType: { host: ROPSTEN, chainId: ROPSTEN_CODE, networkName: ROPSTEN_DISPLAY_NAME },
  currencyData: {},
  tokenData: {}, // Account specific object
  assets: {}, // Account specific object
  tokenRates: {},
  transactions: [],
  unapprovedTypedMessages: {},
  unapprovedPersonalMsgs: {},
  unapprovedMsgs: {},
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
  successMsg: ''
}

/** new wallet object
wallet: {
  publickey: {privatekey: "sdfjlaskdjfljasdf", type: "EOA"}
  contractAddress: {privatekey: null, type:"SC"}
}
*/
export default initialState
