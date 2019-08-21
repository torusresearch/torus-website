import { MAINNET } from '../utils/enums'

const state = {
  userInfo: {
    email: '',
    name: '',
    profileImage: ''
  },
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

export default state
