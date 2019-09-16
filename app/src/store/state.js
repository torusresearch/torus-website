import { MAINNET, USER_INFO_REQUEST_NEW } from '../utils/enums'

const initialState = {
  verifier: '',
  verifierId: '',
  verifierParams: {},
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
  networkType: localStorage.getItem('torus_network_type') || MAINNET,
  currencyData: {},
  tokenData: {}, // Account specific object
  tokenRates: {},
  transactions: [],
  unapprovedTypedMessages: {},
  unapprovedPersonalMsgs: {},
  unapprovedMsgs: {},
  loginInProgress: false,
  rpcDetails: JSON.parse(localStorage.getItem('torus_custom_rpc')) || {},
  jwtToken: '',
  pastTransactions: [],
  isNewUser: false
}

export default initialState
