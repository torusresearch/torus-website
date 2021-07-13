export const ETH = 'eth'

export const PLATFORM_BRAVE = 'Brave'
export const PLATFORM_CHROME = 'Chrome'
export const PLATFORM_EDGE = 'Edge'
export const PLATFORM_FIREFOX = 'Firefox'
export const PLATFORM_OPERA = 'Opera'

export const ENVIRONMENT_TYPE_POPUP = 'popup'
export const ENVIRONMENT_TYPE_NOTIFICATION = 'notification'
export const ENVIRONMENT_TYPE_FULLSCREEN = 'fullscreen'
export const ENVIRONMENT_TYPE_BACKGROUND = 'background'

export const ROPSTEN = 'ropsten'
export const RINKEBY = 'rinkeby'
export const KOVAN = 'kovan'
export const MAINNET = 'mainnet'
export const LOCALHOST = 'localhost'
export const GOERLI = 'goerli'
export const RPC = 'rpc'
export const MATIC = 'matic'
export const MUMBAI = 'mumbai'
export const BSC_MAINNET = 'bsc_mainnet'
export const BSC_TESTNET = 'bsc_testnet'
export const XDAI = 'xdai'

export const MAINNET_CODE = 1
export const ROPSTEN_CODE = 3
export const RINKEBY_CODE = 4
export const KOVAN_CODE = 42
export const GOERLI_CODE = 5
export const MATIC_CODE = 137
export const MUMBAI_CODE = 80_001
export const LOCALHOST_CODE = 5777
export const BSC_MAINNET_CODE = 56
export const BSC_TESTNET_CODE = 97
export const XDAI_CODE = 100

export const MAINNET_CHAIN_ID = '0x1'
export const ROPSTEN_CHAIN_ID = '0x3'
export const RINKEBY_CHAIN_ID = '0x4'
export const KOVAN_CHAIN_ID = '0x2a'
export const GOERLI_CHAIN_ID = '0x5'
export const MATIC_CHAIN_ID = '0x89'
export const MUMBAI_CHAIN_ID = '0x13881'
export const BSC_MAINNET_CHAIN_ID = '0x38'
export const BSC_TESTNET_CHAIN_ID = '0x61'
export const XDAI_CHAIN_ID = '0x64'
export const NFT_SUPPORTED_NETWORKS = {
  [MATIC]: MATIC_CODE,
  [MUMBAI]: MUMBAI_CODE,
  [BSC_MAINNET]: BSC_MAINNET_CODE,
  [MAINNET]: MAINNET_CODE,
}
export const ETHERSCAN_SUPPORTED_NETWORKS = new Set([MATIC, BSC_MAINNET, MAINNET])
export const ROPSTEN_DISPLAY_NAME = 'Ropsten Test Network'
export const RINKEBY_DISPLAY_NAME = 'Rinkeby Test Network'
export const KOVAN_DISPLAY_NAME = 'Kovan Test Network'
export const MAINNET_DISPLAY_NAME = 'Main Ethereum Network'
export const GOERLI_DISPLAY_NAME = 'Goerli Test Network'
export const RPC_DISPLAY_NAME = 'RPC'
export const LOCALHOST_DISPLAY_NAME = 'https://localhost:8545'
export const MATIC_DISPLAY_NAME = 'Matic Network'
export const MUMBAI_DISPLAY_NAME = 'Mumbai Matic-Testnet'
export const BSC_MAINNET_DISPLAY_NAME = 'Binance Smart Chain Mainnet'
export const BSC_TESTNET_DISPLAY_NAME = 'Binance Smart Chain Testnet'
export const XDAI_DISPLAY_NAME = 'xDai'

export const MATIC_URL = 'https://rpc-mainnet.maticvigil.com'
export const MATIC_BLOCK_EXPLORER = 'https://explorer-mainnet.maticvigil.com'

export const MUMBAI_URL = 'https://rpc-mumbai.maticvigil.com'
export const MUMBAI_BLOCK_EXPLORER = 'https://mumbai-explorer.matic.today'

export const XDAI_URL = 'https://rpc.xdaichain.com'
export const XDAI_BLOCK_EXPLORER = 'https://blockscout.com/poa/xdai'

export const BSC_MAINNET_URL = 'https://bsc-dataseed.binance.org'
export const BSC_MAINNET_BLOCK_EXPLORER = 'https://bscscan.com'

export const BSC_TESTNET_URL = 'https://data-seed-prebsc-1-s1.binance.org:8545'
export const BSC_TESTNET_BLOCK_EXPLORER = 'https://testnet.bscscan.com'

export const MATIC_TICKER = 'MATIC'
export const BSC_TICKER = 'BNB'
export const XDAI_TICKER = 'DAI'

export const TX_MESSAGE = 'message'
export const TX_PERSONAL_MESSAGE = 'personal_message'
export const TX_TYPED_MESSAGE = 'typed_message'
export const TX_TRANSACTION = 'transaction'
export const TX_GET_ENCRYPTION_KEY = 'get_encryption'
export const TX_ETH_DECRYPT = 'eth_decrypt'

export const TRANSACTION_TYPE_CANCEL = 'cancel'
export const TRANSACTION_TYPE_RETRY = 'retry'
export const TRANSACTION_TYPE_STANDARD = 'standard'

export const TRANSACTION_STATUS_APPROVED = 'approved'
export const TRANSACTION_STATUS_CONFIRMED = 'confirmed'

export const TOKEN_METHOD_TRANSFER = 'transfer'
export const TOKEN_METHOD_APPROVE = 'approve'
export const TOKEN_METHOD_TRANSFER_FROM = 'transferFrom'

export const COLLECTIBLE_METHOD_SAFE_TRANSFER_FROM = 'safeTransferFrom'

export const SEND_ETHER_ACTION_KEY = 'sentEther'
export const DEPLOY_CONTRACT_ACTION_KEY = 'contractDeployment'
export const CONTRACT_INTERACTION_KEY = 'contractInteraction'

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
export const ERC1155_INTERFACE_ID = '0xd9b67a26'
export const ERC721_INTERFACE_ID = '0x80ac58cd'
export const ERC1155METADATA_INTERFACE_ID = '0x0e89341c'
export const ERC721METADATA_INTERFACE_ID = '0x5b5e139f'
export const ERC721ENUMERABLE_INTERFACE_ID = '0x780e9d63'
export const SINGLE_CALL_BALANCES_ADDRESS = '0xb1f8e55c7f64d203c1400b9d8555d050f94adf39'

export const ACTIVE = 'active'
export const INACTIVE = 'inactive'

export const USER_INFO_REQUEST_APPROVED = 'user_info_request_approved'
export const USER_INFO_REQUEST_REJECTED = 'user_info_request_rejected'
export const USER_INFO_REQUEST_NEW = 'user_info_request_new'

export const CONTRACT_TYPE_ETH = 'eth'
export const CONTRACT_TYPE_ERC20 = 'erc20'
export const CONTRACT_TYPE_ERC721 = 'erc721'
export const CONTRACT_TYPE_ERC1155 = 'erc1155'

export const getInfuraBlockExplorerUrl = (network) => {
  if (network === MAINNET) return 'https://etherscan.io'
  return `https://${network}.etherscan.io`
}

export const createNetwork = (host, networkName, chainId, blockExplorer, ticker, tickerName, logo) => ({
  host,
  networkName,
  chainId,
  blockExplorer,
  ticker,
  logo,
  tickerName,
})

export const SUPPORTED_NETWORK_TYPES = {
  [MAINNET]: createNetwork(MAINNET, MAINNET_DISPLAY_NAME, MAINNET_CODE, getInfuraBlockExplorerUrl(MAINNET), 'ETH', 'Ethereum', 'eth.svg'),
  [RINKEBY]: createNetwork(RINKEBY, RINKEBY_DISPLAY_NAME, RINKEBY_CODE, getInfuraBlockExplorerUrl(RINKEBY), 'ETH', 'Ethereum', 'eth.svg'),
  [KOVAN]: createNetwork(KOVAN, KOVAN_DISPLAY_NAME, KOVAN_CODE, getInfuraBlockExplorerUrl(KOVAN), 'ETH', 'Ethereum', 'eth.svg'),
  [ROPSTEN]: createNetwork(ROPSTEN, ROPSTEN_DISPLAY_NAME, ROPSTEN_CODE, getInfuraBlockExplorerUrl(ROPSTEN), 'ETH', 'Ethereum', 'eth.svg'),
  [GOERLI]: createNetwork(GOERLI, GOERLI_DISPLAY_NAME, GOERLI_CODE, getInfuraBlockExplorerUrl(GOERLI), 'ETH', 'Ethereum', 'eth.svg'),
  [LOCALHOST]: createNetwork(LOCALHOST, LOCALHOST_DISPLAY_NAME, LOCALHOST_CODE, '', 'ETH', 'Ethereum', 'eth.svg'),
  [MATIC]: createNetwork(MATIC, MATIC_DISPLAY_NAME, MATIC_CODE, MATIC_BLOCK_EXPLORER, MATIC_TICKER, 'Matic Network Token', 'matic-network-logo.svg'),
  [MUMBAI]: createNetwork(
    MUMBAI,
    MUMBAI_DISPLAY_NAME,
    MUMBAI_CODE,
    MUMBAI_BLOCK_EXPLORER,
    MATIC_TICKER,
    'Matic Network Token',
    'matic-network-logo.svg'
  ),
  [BSC_MAINNET]: createNetwork(
    BSC_MAINNET,
    BSC_MAINNET_DISPLAY_NAME,
    BSC_MAINNET_CODE,
    BSC_MAINNET_BLOCK_EXPLORER,
    BSC_TICKER,
    'Binance Coin',
    'bnb.png'
  ),
  [BSC_TESTNET]: createNetwork(
    BSC_TESTNET,
    BSC_TESTNET_DISPLAY_NAME,
    BSC_TESTNET_CODE,
    BSC_TESTNET_BLOCK_EXPLORER,
    BSC_TICKER,
    'Binance Coin',
    'bnb.png'
  ),
  [XDAI]: createNetwork(XDAI, XDAI_DISPLAY_NAME, XDAI_CODE, XDAI_BLOCK_EXPLORER, XDAI_TICKER, 'xDai Network Token', 'xdai.svg'),
}

export const WALLET_HEADERS_HOME = 'My Wallet'
export const WALLET_HEADERS_TRANSFER = 'Transfer Details'
export const WALLET_HEADERS_ACTIVITY = 'Transaction Activities'
export const WALLET_HEADERS_CONFIRM = 'Confirm your Transfer'

export const ACTIVITY_ACTION_ALL = 'walletActivity.allTransactions'
export const ACTIVITY_ACTION_SEND = 'walletActivity.send'
export const ACTIVITY_ACTION_RECEIVE = 'walletActivity.receive'
export const ACTIVITY_ACTION_TOPUP = 'walletActivity.topup'

export const ACTIVITY_PERIOD_ALL = 'walletActivity.all'
export const ACTIVITY_PERIOD_WEEK_ONE = 'walletActivity.lastOneWeek'
export const ACTIVITY_PERIOD_MONTH_ONE = 'walletActivity.lastOneMonth'
export const ACTIVITY_PERIOD_MONTH_SIX = 'walletActivity.lastSixMonts'

export const ACTIVITY_STATUS_SUCCESSFUL = 'walletActivity.successful'
export const ACTIVITY_STATUS_UNSUCCESSFUL = 'walletActivity.unsuccessful'
export const ACTIVITY_STATUS_PENDING = 'walletActivity.pending'

export const GOOGLE = 'google'
export const FACEBOOK = 'facebook'
export const REDDIT = 'reddit'
export const DISCORD = 'discord'
export const TWITCH = 'twitch'
export const APPLE = 'apple'
export const LINE = 'line'
export const GITHUB = 'github'
export const KAKAO = 'kakao'
export const LINKEDIN = 'linkedin'
export const TWITTER = 'twitter'
export const WEIBO = 'weibo'
export const WECHAT = 'wechat'
export const EMAIL_PASSWORD = 'email_password'
export const PASSWORDLESS = 'passwordless'
export const JWT = 'jwt'

export const GOOGLE_VERIFIER = process.env.VUE_APP_GOOGLE_VERIFIER
export const FACEBOOK_VERIFIER = process.env.VUE_APP_FACEBOOK_VERIFIER
export const REDDIT_VERIFIER = process.env.VUE_APP_REDDIT_VERIFIER
export const DISCORD_VERIFIER = process.env.VUE_APP_DISCORD_VERIFIER
export const TWITCH_VERIFIER = process.env.VUE_APP_TWITCH_VERIFIER
export const GITHUB_VERIFIER = process.env.VUE_APP_GITHUB_VERIFIER
export const KAKAO_VERIFIER = process.env.VUE_APP_KAKAO_VERIFIER
export const LINKEDIN_VERIFIER = process.env.VUE_APP_LINKEDIN_VERIFIER
export const TWITTER_VERIFIER = process.env.VUE_APP_TWITTER_VERIFIER
export const WEIBO_VERIFIER = process.env.VUE_APP_WEIBO_VERIFIER
export const WECHAT_VERIFIER = process.env.VUE_APP_WECHAT_VERIFIER
export const LINE_VERIFIER = process.env.VUE_APP_LINE_VERIFIER
export const APPLE_VERIFIER = process.env.VUE_APP_APPLE_VERIFIER
export const HOSTED_EMAIL_PASSWORDLESS_VERIFIER = process.env.VUE_APP_HOSTED_EMAIL_PASSWORDLESS_VERIFIER

export const GOOGLE_LINKED_VERIFIER = process.env.VUE_APP_GOOGLE_LINKED_VERIFIER
export const FACEBOOK_LINKED_VERIFIER = process.env.VUE_APP_FACEBOOK_LINKED_VERIFIER
export const REDDIT_LINKED_VERIFIER = process.env.VUE_APP_REDDIT_LINKED_VERIFIER
export const DISCORD_LINKED_VERIFIER = process.env.VUE_APP_DISCORD_LINKED_VERIFIER
export const TWITCH_LINKED_VERIFIER = process.env.VUE_APP_TWITCH_LINKED_VERIFIER
export const GITHUB_LINKED_VERIFIER = process.env.VUE_APP_GITHUB_LINKED_VERIFIER
export const KAKAO_LINKED_VERIFIER = process.env.VUE_APP_KAKAO_LINKED_VERIFIER
export const LINKEDIN_LINKED_VERIFIER = process.env.VUE_APP_LINKEDIN_LINKED_VERIFIER
export const TWITTER_LINKED_VERIFIER = process.env.VUE_APP_TWITTER_LINKED_VERIFIER
export const WEIBO_LINKED_VERIFIER = process.env.VUE_APP_WEIBO_LINKED_VERIFIER
export const WECHAT_LINKED_VERIFIER = process.env.VUE_APP_WECHAT_LINKED_VERIFIER
export const LINE_LINKED_VERIFIER = process.env.VUE_APP_LINE_LINKED_VERIFIER
export const APPLE_LINKED_VERIFIER = process.env.VUE_APP_APPLE_LINKED_VERIFIER
export const HOSTED_EMAIL_PASSWORDLESS_LINKED_VERIFIER = process.env.VUE_APP_HOSTED_EMAIL_PASSWORDLESS_LINKED_VERIFIER

export const GOOGLE_LOGIN_PROVIDER = 'google'
export const FACEBOOK_LOGIN_PROVIDER = 'facebook'
export const REDDIT_LOGIN_PROVIDER = 'reddit'
export const DISCORD_LOGIN_PROVIDER = 'discord'
export const TWITCH_LOGIN_PROVIDER = 'twitch'
export const APPLE_LOGIN_PROVIDER = 'apple'
export const LINE_LOGIN_PROVIDER = 'line'
export const GITHUB_LOGIN_PROVIDER = 'github'
export const KAKAO_LOGIN_PROVIDER = 'kakao'
export const LINKEDIN_LOGIN_PROVIDER = 'linkedin'
export const TWITTER_LOGIN_PROVIDER = 'twitter'
export const WEIBO_LOGIN_PROVIDER = 'weibo'
export const WECHAT_LOGIN_PROVIDER = 'wechat'
export const EMAIL_PASSWORDLESS_LOGIN_PROVIDER = 'email_passwordless'

export const LINKED_VERIFIER_SUBIDENTIFIER = process.env.VUE_APP_LINKED_VERIFIER_SUBIDENTIFIER

export const ENS = 'ENS'
export const UNSTOPPABLE_DOMAINS = 'Unstoppable_Domains'
export const ETH_LABEL = 'walletSettings.ethAddress'
export const GOOGLE_LABEL = 'walletSettings.googleId'
export const FACEBOOK_LABEL = 'walletSettings.facebookId'
export const REDDIT_LABEL = 'walletSettings.redditId'
export const DISCORD_LABEL = 'walletSettings.discordId'
export const TWITCH_LABEL = 'walletSettings.twitchId'
export const ENS_LABEL = 'walletSettings.ensId'
export const UNSTOPPABLE_DOMAINS_LABEL = 'walletSettings.unstoppableDomainsId'
export const TWITTER_LABEL = 'walletSettings.twitterId'
export const GITHUB_LABEL = 'walletSettings.githubId'

// Format: [dark/light]-[colorName]
export const THEME_DARK_BLACK_NAME = 'dark-black'
export const THEME_LIGHT_BLUE_NAME = 'light-blue'

export const ACCOUNT_TYPE = {
  NORMAL: 'normal',
  THRESHOLD: 'threshold',
  IMPORTED: 'imported',
}

export const OLD_ERC721_LIST = {
  '0x06012c8cf97bead5deae237070f9587f8e7a266d': {
    name: 'Cryptokitties',
    logo: 'dapp-cryptokitty.svg',
    erc20: true,
    symbol: 'CK',
    decimals: 0,
  },
}

export const ALLOWED_VERIFIERS = [
  {
    name: ETH_LABEL,
    value: ETH,
  },
  {
    name: GOOGLE_LABEL,
    value: GOOGLE,
  },
  {
    name: REDDIT_LABEL,
    value: REDDIT,
  },
  {
    name: DISCORD_LABEL,
    value: DISCORD,
  },
  {
    name: ENS_LABEL,
    value: ENS,
  },
  {
    name: TWITTER_LABEL,
    value: TWITTER,
  },
  {
    name: GITHUB_LABEL,
    value: GITHUB,
  },
  {
    name: UNSTOPPABLE_DOMAINS_LABEL,
    value: UNSTOPPABLE_DOMAINS,
  },
]

export const XANPOOL = 'xanpool'
export const RAMPNETWORK = 'rampnetwork'
export const SIMPLEX = 'simplex'
export const MOONPAY = 'moonpay'
export const WYRE = 'wyre'
export const CRYPTO = 'crypto'
export const MERCURYO = 'mercuryo'
export const PNG = 'png'
export const SVG = 'svg'

export const LOCALE_EN = 'en'
export const LOCALE_DE = 'de'
export const LOCALE_JA = 'ja'
export const LOCALE_KO = 'ko'
export const LOCALE_ZH = 'zh'
export const LOCALE_ES = 'es'
export const LOCALE_EN_LABEL = 'English'
export const LOCALE_DE_LABEL = 'German (Deutsch)'
export const LOCALE_JA_LABEL = 'Japanese (日本語)'
export const LOCALE_KO_LABEL = 'Korean (한국어)'
export const LOCALE_ZH_LABEL = 'Mandarin (中文)'
export const LOCALE_ES_LABEL = 'Spanish (Español)'

export const LOCALES = [
  {
    name: LOCALE_EN_LABEL,
    value: LOCALE_EN,
  },
  {
    name: LOCALE_DE_LABEL,
    value: LOCALE_DE,
  },
  {
    name: LOCALE_JA_LABEL,
    value: LOCALE_JA,
  },
  {
    name: LOCALE_KO_LABEL,
    value: LOCALE_KO,
  },
  {
    name: LOCALE_ZH_LABEL,
    value: LOCALE_ZH,
  },
  {
    name: LOCALE_ES_LABEL,
    value: LOCALE_ES,
  },
]

export const WALLET_METHOD_PREFIX = 'wallet'
export const TORUS_METHOD_PREFIX = 'torus'

export const ERROR_TIME = 5 * 1000
export const SUCCESS_TIME = 5 * 1000

export const MESSAGE_MODAL_TYPE_SUCCESS = 'success'
export const MESSAGE_MODAL_TYPE_FAIL = 'fail'
export const MESSAGE_MODAL_TYPE_PENDING = 'pending'
export const WALLET_PREFIX = 'wallet_'

export const HISTORY_STORE_KEY = 'permissionsHistory'

export const LOG_STORE_KEY = 'permissionsLog'

export const METADATA_STORE_KEY = 'domainMetadata'

export const CAVEAT_NAMES = {
  exposedAccounts: 'exposedAccounts',
}

export const NOTIFICATION_NAMES = {
  accountsChanged: 'wallet_accountsChanged',
}

export const LOG_IGNORE_METHODS = ['wallet_sendDomainMetadata']

export const SAFE_METHODS = [
  'eth_accounts',
  'eth_requestAccounts',
  'web3_sha3',
  'net_listening',
  'net_peerCount',
  'net_version',
  'eth_blockNumber',
  'eth_call',
  'eth_chainId',
  'eth_coinbase',
  'eth_estimateGas',
  'eth_gasPrice',
  'eth_getBalance',
  'eth_getBlockByHash',
  'eth_getBlockByNumber',
  'eth_getBlockTransactionCountByHash',
  'eth_getBlockTransactionCountByNumber',
  'eth_getCode',
  'eth_getFilterChanges',
  'eth_getFilterLogs',
  'eth_getLogs',
  'eth_getStorageAt',
  'eth_getTransactionByBlockHashAndIndex',
  'eth_getTransactionByBlockNumberAndIndex',
  'eth_getTransactionByHash',
  'eth_getTransactionCount',
  'eth_getTransactionReceipt',
  'eth_getUncleByBlockHashAndIndex',
  'eth_getUncleByBlockNumberAndIndex',
  'eth_getUncleCountByBlockHash',
  'eth_getUncleCountByBlockNumber',
  'eth_getWork',
  'eth_hashrate',
  'eth_mining',
  'eth_newBlockFilter',
  'eth_newFilter',
  'eth_newPendingTransactionFilter',
  'eth_protocolVersion',
  'eth_sendRawTransaction',
  'eth_sendTransaction',
  'eth_sign',
  'personal_sign',
  'eth_signTypedData',
  'eth_signTypedData_v1',
  'eth_signTypedData_v3',
  'eth_signTypedData_v4',
  'eth_submitHashrate',
  'eth_submitWork',
  'eth_syncing',
  'eth_uninstallFilter',
  'metamask_watchAsset',
  'wallet_watchAsset',
]

export const BADGES_TOPUP = 'topUp'
export const BADGES_TRANSACTION = 'transaction'
export const BADGES_COLLECTIBLE = 'collectible'

export const POPUP_LOADED = 'popup-loaded'
export const POPUP_RESULT = 'popup_result'
export const FEATURES_PROVIDER_CHANGE_WINDOW = 'directories=0,titlebar=0,toolbar=0,status=0,location=0,menubar=0,height=660,width=375'
export const FEATURES_DEFAULT_WALLET_WINDOW = 'directories=0,titlebar=0,toolbar=0,status=0,location=0,menubar=0,height=740,width=1315'
export const FEATURES_DEFAULT_POPUP_WINDOW = 'directories=0,titlebar=0,toolbar=0,status=0,location=0,menubar=0,height=700,width=1200'
export const FEATURES_CONFIRM_WINDOW = 'directories=0,titlebar=0,toolbar=0,status=0,location=0,menubar=0,height=700,width=450'
