import { ROPSTEN, ROPSTEN_DISPLAY_NAME, ROPSTEN_CODE, USER_INFO_REQUEST_NEW, THEME_LIGHT_BLUE_NAME } from '../utils/enums'

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
  selectedEOA: '', // For signing
  selectedAddress: '',
  selectedCurrency: 'USD',
  networkId: 0,
  networkType: { host: ROPSTEN, chainId: ROPSTEN_CODE, networkName: ROPSTEN_DISPLAY_NAME },
  currencyData: {},
  tokenData: {}, // Account specific object
  tokenRates: {},
  transactions: [],
  unapprovedTypedMessages: {},
  unapprovedPersonalMsgs: {},
  unapprovedMsgs: {},
  loginInProgress: false,
  jwtToken: '',
  pastTransactions: [],
  isNewUser: false,
  theme: THEME_LIGHT_BLUE_NAME,
  assets: {}, // Account specific object
  billboard: [],
  contacts: []
}

/** new wallet object
wallet: {
  publickey: {privatekey: "sdfjlaskdjfljasdf", type: "EOA"}
  contractAddress: {privatekey: null, type:"SC"}
}
*/
export default initialState
