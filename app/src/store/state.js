import { MAINNET, MAINNET_DISPLAY_NAME, MAINNET_CODE, USER_INFO_REQUEST_NEW } from '../utils/enums'

const initialState = {
  userInfo: {
    email: '',
    name: '',
    profileImage: ''
  },
  userInfoAccess: USER_INFO_REQUEST_NEW,
  idToken: '',
  wallet: {}, // Account specific object
  weiBalance: {}, // Account specific object
  selectedAddress: '',
  selectedCurrency: 'USD',
  networkId: 0,
  networkType: { host: MAINNET, chainId: MAINNET_CODE, networkName: MAINNET_DISPLAY_NAME },
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
  isNewUser: false
}

export default initialState
