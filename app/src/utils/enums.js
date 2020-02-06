const ETH = 'eth'

const ROPSTEN = 'ropsten'
const RINKEBY = 'rinkeby'
const KOVAN = 'kovan'
const MAINNET = 'mainnet'
const LOCALHOST = 'localhost'
const GOERLI = 'goerli'
const RPC = 'rpc'
const MATIC = 'matic'

const MAINNET_CODE = 1
const ROPSTEN_CODE = 3
const RINKEBY_CODE = 4
const KOVAN_CODE = 42
const GOERLI_CODE = 5
const MATIC_CODE = 4626
const LOCALHOST_CODE = 5777

const ROPSTEN_DISPLAY_NAME = 'Ropsten Test Network'
const RINKEBY_DISPLAY_NAME = 'Rinkeby Test Network'
const KOVAN_DISPLAY_NAME = 'Kovan Test Network'
const MAINNET_DISPLAY_NAME = 'Main Ethereum Network'
const GOERLI_DISPLAY_NAME = 'Goerli Test Network'
const RPC_DISPLAY_NAME = 'RPC'
const LOCALHOST_DISPLAY_NAME = 'https://localhost:8545'
const MATIC_DISPLAY_NAME = 'Matic Alpha-Mainnet'

const MATIC_URL = 'https://alpha.ethereum.matic.network'

const TX_MESSAGE = 'message'
const TX_PERSONAL_MESSAGE = 'personal_message'
const TX_TYPED_MESSAGE = 'typed_message'
const TX_TRANSACTION = 'transaction'

const TRANSACTION_TYPE_CANCEL = 'cancel'
const TRANSACTION_TYPE_RETRY = 'retry'
const TRANSACTION_TYPE_STANDARD = 'standard'

const TRANSACTION_STATUS_APPROVED = 'approved'
const TRANSACTION_STATUS_CONFIRMED = 'confirmed'

const TOKEN_METHOD_TRANSFER = 'transfer'
const TOKEN_METHOD_APPROVE = 'approve'
const TOKEN_METHOD_TRANSFER_FROM = 'transferFrom'

const COLLECTIBLE_METHOD_SAFE_TRANSFER_FROM = 'safeTransferFrom'

const SEND_ETHER_ACTION_KEY = 'sentEther'
const DEPLOY_CONTRACT_ACTION_KEY = 'contractDeployment'
const CONTRACT_INTERACTION_KEY = 'contractInteraction'

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
const ERC721METADATA_INTERFACE_ID = '0x5b5e139f'
const ERC721ENUMERABLE_INTERFACE_ID = '0x780e9d63'
const SINGLE_CALL_BALANCES_ADDRESS = '0xb1f8e55c7f64d203c1400b9d8555d050f94adf39'

const ACTIVE = 'active'
const INACTIVE = 'inactive'

const USER_INFO_REQUEST_APPROVED = 'user_info_request_approved'
const USER_INFO_REQUEST_REJECTED = 'user_info_request_rejected'
const USER_INFO_REQUEST_NEW = 'user_info_request_new'

const CONTRACT_TYPE_ETH = 'eth'
const CONTRACT_TYPE_ERC20 = 'erc20'
const CONTRACT_TYPE_ERC721 = 'erc721'

const createNetwork = (host, networkName, chainId) => {
  return {
    host,
    networkName,
    chainId
  }
}

const SUPPORTED_NETWORK_TYPES = {
  [MAINNET]: createNetwork(MAINNET, MAINNET_DISPLAY_NAME, MAINNET_CODE),
  [RINKEBY]: createNetwork(RINKEBY, RINKEBY_DISPLAY_NAME, RINKEBY_CODE),
  [KOVAN]: createNetwork(KOVAN, KOVAN_DISPLAY_NAME, KOVAN_CODE),
  [ROPSTEN]: createNetwork(ROPSTEN, ROPSTEN_DISPLAY_NAME, ROPSTEN_CODE),
  [GOERLI]: createNetwork(GOERLI, GOERLI_DISPLAY_NAME, GOERLI_CODE),
  [LOCALHOST]: createNetwork(LOCALHOST, LOCALHOST_DISPLAY_NAME, LOCALHOST_CODE),
  [MATIC]: createNetwork(MATIC, MATIC_DISPLAY_NAME, MATIC_CODE)
}
const WALLET_HEADERS_HOME = 'My Wallet'
const WALLET_HEADERS_TRANSFER = 'Transfer Details'
const WALLET_HEADERS_ACTIVITY = 'Transaction Activities'
const WALLET_HEADERS_CONFIRM = 'Confirm your Transfer'

const ACTIVITY_ACTION_ALL = 'walletActivity.allTransactions'
const ACTIVITY_ACTION_SEND = 'walletActivity.send'
const ACTIVITY_ACTION_RECEIVE = 'walletActivity.receive'
const ACTIVITY_ACTION_TOPUP = 'walletActivity.topup'

const ACTIVITY_PERIOD_ALL = 'walletActivity.all'
const ACTIVITY_PERIOD_WEEK_ONE = 'walletActivity.lastOneWeek'
const ACTIVITY_PERIOD_MONTH_ONE = 'walletActivity.lastOneMonth'
const ACTIVITY_PERIOD_MONTH_SIX = 'walletActivity.lastSixMonts'

const ACTIVITY_STATUS_SUCCESSFUL = 'walletActivity.successful'
const ACTIVITY_STATUS_UNSUCCESSFUL = 'walletActivity.unsuccessful'
const ACTIVITY_STATUS_PENDING = 'walletActivity.pending'

const GOOGLE = 'google'
const FACEBOOK = 'facebook'
const REDDIT = 'reddit'
const DISCORD = 'discord'
const TWITCH = 'twitch'
const ENS = 'ENS'
const ETH_LABEL = 'walletSettings.ethAddress'
const GOOGLE_LABEL = 'walletSettings.googleId'
const FACEBOOK_LABEL = 'walletSettings.facebookId'
const REDDIT_LABEL = 'walletSettings.redditId'
const DISCORD_LABEL = 'walletSettings.discordId'
const TWITCH_LABEL = 'walletSettings.twitchId'
const ENS_LABEL = 'walletSettings.ensId'

// Format: [dark/light]-[colorName]
const THEME_DARK_BLACK_NAME = 'dark-black'
const THEME_LIGHT_BLUE_NAME = 'light-blue'

const OLD_ERC721_LIST = {
  '0x06012c8cf97bead5deae237070f9587f8e7a266d': {
    name: 'Cryptokitties',
    logo: 'dapp-cryptokitty.svg',
    erc20: true,
    symbol: 'CK',
    decimals: 0
  }
}

const ALLOWED_VERIFIERS = [
  {
    name: ETH_LABEL,
    value: ETH
  },
  {
    name: GOOGLE_LABEL,
    value: GOOGLE
  },
  {
    name: REDDIT_LABEL,
    value: REDDIT
  },
  {
    name: DISCORD_LABEL,
    value: DISCORD
  },
  {
    name: ENS_LABEL,
    value: ENS
  }
]

const BADGE_ALLOWED_HOSTS = [
  {
    id: '100',
    name: 'localhost',
    value: 'localhost'
  },
  {
    id: '3',
    name: 'augur',
    value: 'augur.net'
  },
  {
    id: '4',
    name: 'totle',
    value: 'swap.totle.com'
  },
  {
    id: '6',
    name: 'ddex',
    value: 'ddex.io'
  }
]

const SIMPLEX = 'simplex'
const MOONPAY = 'moonpay'
const WYRE = 'wyre'
const COINDIRECT = 'coindirect'
const CRYPTO = 'crypto'
const PNG = 'png'
const SVG = 'svg'

const LOCALE_EN = 'en'
const LOCALE_DE = 'de'
const LOCALE_JA = 'ja'
const LOCALE_KO = 'ko'
const LOCALE_ZH = 'zh'
const LOCALE_EN_LABEL = 'English'
const LOCALE_DE_LABEL = 'German (Deutsch)'
const LOCALE_JA_LABEL = 'Japanese (日本語)'
const LOCALE_KO_LABEL = 'Korean (한국어)'
const LOCALE_ZH_LABEL = 'Mandarin (中文)'

const LOCALES = [
  {
    name: LOCALE_EN_LABEL,
    value: LOCALE_EN
  },
  {
    name: LOCALE_DE_LABEL,
    value: LOCALE_DE
  },
  {
    name: LOCALE_JA_LABEL,
    value: LOCALE_JA
  },
  {
    name: LOCALE_KO_LABEL,
    value: LOCALE_KO
  },
  {
    name: LOCALE_ZH_LABEL,
    value: LOCALE_ZH
  }
]

module.exports = {
  ENS,
  ETH,
  ROPSTEN,
  RINKEBY,
  KOVAN,
  MAINNET,
  LOCALHOST,
  GOERLI,
  RPC,
  MAINNET_CODE,
  ROPSTEN_CODE,
  RINKEBY_CODE,
  GOERLI_CODE,
  KOVAN_CODE,
  ROPSTEN_DISPLAY_NAME,
  RINKEBY_DISPLAY_NAME,
  KOVAN_DISPLAY_NAME,
  MAINNET_DISPLAY_NAME,
  GOERLI_DISPLAY_NAME,
  RPC_DISPLAY_NAME,
  LOCALHOST_DISPLAY_NAME,
  TRANSACTION_TYPE_CANCEL,
  TRANSACTION_TYPE_RETRY,
  TRANSACTION_TYPE_STANDARD,
  TRANSACTION_STATUS_APPROVED,
  TRANSACTION_STATUS_CONFIRMED,
  ZERO_ADDRESS,
  TOKEN_METHOD_APPROVE,
  TOKEN_METHOD_TRANSFER,
  TOKEN_METHOD_TRANSFER_FROM,
  SEND_ETHER_ACTION_KEY,
  DEPLOY_CONTRACT_ACTION_KEY,
  CONTRACT_INTERACTION_KEY,
  MATIC_URL,
  MATIC_DISPLAY_NAME,
  MATIC,
  MATIC_CODE,
  ACTIVE,
  INACTIVE,
  USER_INFO_REQUEST_APPROVED,
  USER_INFO_REQUEST_REJECTED,
  USER_INFO_REQUEST_NEW,
  SUPPORTED_NETWORK_TYPES,
  WALLET_HEADERS_HOME,
  WALLET_HEADERS_TRANSFER,
  WALLET_HEADERS_ACTIVITY,
  WALLET_HEADERS_CONFIRM,
  ACTIVITY_ACTION_ALL,
  ACTIVITY_ACTION_SEND,
  ACTIVITY_ACTION_RECEIVE,
  ACTIVITY_ACTION_TOPUP,
  ACTIVITY_PERIOD_ALL,
  ACTIVITY_PERIOD_WEEK_ONE,
  ACTIVITY_PERIOD_MONTH_ONE,
  ACTIVITY_PERIOD_MONTH_SIX,
  ACTIVITY_STATUS_SUCCESSFUL,
  ACTIVITY_STATUS_UNSUCCESSFUL,
  ACTIVITY_STATUS_PENDING,
  GOOGLE,
  FACEBOOK,
  TWITCH,
  REDDIT,
  DISCORD,
  ETH_LABEL,
  GOOGLE_LABEL,
  FACEBOOK_LABEL,
  REDDIT_LABEL,
  DISCORD_LABEL,
  TWITCH_LABEL,
  THEME_DARK_BLACK_NAME,
  THEME_LIGHT_BLUE_NAME,
  ERC721METADATA_INTERFACE_ID,
  ERC721ENUMERABLE_INTERFACE_ID,
  SINGLE_CALL_BALANCES_ADDRESS,
  CONTRACT_TYPE_ETH,
  CONTRACT_TYPE_ERC20,
  CONTRACT_TYPE_ERC721,
  COLLECTIBLE_METHOD_SAFE_TRANSFER_FROM,
  OLD_ERC721_LIST,
  ALLOWED_VERIFIERS,
  SIMPLEX,
  MOONPAY,
  COINDIRECT,
  WYRE,
  CRYPTO,
  PNG,
  SVG,
  TX_MESSAGE,
  TX_TYPED_MESSAGE,
  TX_PERSONAL_MESSAGE,
  TX_TRANSACTION,
  LOCALE_EN,
  LOCALE_DE,
  LOCALE_EN_LABEL,
  LOCALE_DE_LABEL,
  LOCALES,
  BADGE_ALLOWED_HOSTS
}
