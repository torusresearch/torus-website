import { addHexPrefix } from 'ethereumjs-util'

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
export const OKC_MAINNET = 'okxchain_mainnet'
export const OKC_TESTNET = 'okxchain_testnet'
export const XDAI = 'xdai'
export const RSK_MAINNET = 'rsk_mainnet'
export const RSK_TESTNET = 'rsk_testnet'
export const REEF = 'reef'
export const ARBITRUM_MAINNET = 'arbitrum_mainnet'
export const ARBITRUM_TESTNET = 'arbitrum_testnet'
export const OPTIMISM_MAINNET = 'optimism_mainnet'
export const OPTIMISM_TESTNET = 'optimism_testnet'
export const AVALANCHE_MAINNET = 'avalanche_mainnet'
export const AVALANCHE_TESTNET = 'avalanche_testnet'

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
export const OKC_MAINNET_CODE = 66
export const OKC_TESTNET_CODE = 65
export const XDAI_CODE = 100
export const RSK_MAINNET_CODE = 30
export const RSK_TESTNET_CODE = 31
export const REEF_CODE = 101
export const ARBITRUM_MAINNET_CODE = 42_161
export const ARBITRUM_TESTNET_CODE = 421_611
export const OPTIMISM_MAINNET_CODE = 10
export const OPTIMISM_TESTNET_CODE = 69
export const AVALANCHE_MAINNET_CODE = 43_114
export const AVALANCHE_TESTNET_CODE = 43_113

export const MAINNET_CHAIN_ID = '0x1'
export const ROPSTEN_CHAIN_ID = '0x3'
export const RINKEBY_CHAIN_ID = '0x4'
export const KOVAN_CHAIN_ID = '0x2a'
export const GOERLI_CHAIN_ID = '0x5'
export const MATIC_CHAIN_ID = '0x89'
export const MUMBAI_CHAIN_ID = '0x13881'
export const BSC_MAINNET_CHAIN_ID = '0x38'
export const BSC_TESTNET_CHAIN_ID = '0x61'
export const OKC_MAINNET_CHAIN_ID = '0x42'
export const OKC_TESTNET_CHAIN_ID = '0x41'
export const XDAI_CHAIN_ID = '0x64'
export const REEF_CHAIN_ID = '0x65'
export const RSK_MAINNET_CHAIN_ID = '0x1e'
export const RSK_TESTNET_CHAIN_ID = '0x1f'
export const ARBITRUM_MAINNET_CHAIN_ID = '0xa4b1'
export const ARBITRUM_TESTNET_CHAIN_ID = '0x66eeb'
export const OPTIMISM_MAINNET_CHAIN_ID = '0xa'
export const OPTIMISM_TESTNET_CHAIN_ID = '0x45'
export const AVALANCHE_MAINNET_CHAIN_ID = '0xa86a'
export const AVALANCHE_TESTNET_CHAIN_ID = '0xa869'

export const NFT_SUPPORTED_NETWORKS = {
  [MATIC]: MATIC_CODE,
  [MUMBAI]: MUMBAI_CODE,
  [BSC_MAINNET]: BSC_MAINNET_CODE,
  [MAINNET]: MAINNET_CODE,
}

export const COVALENT_SUPPORTED_CHAIN_IDS = {
  [MATIC_CODE]: MATIC,
  [MUMBAI_CODE]: MUMBAI,
  [BSC_MAINNET_CODE]: BSC_MAINNET,
  [MAINNET_CODE]: MAINNET,
}
export const ETHERSCAN_SUPPORTED_NETWORKS = new Set([MATIC, BSC_MAINNET, MAINNET])
export const INFURA_PROVIDER_TYPES = new Set([ROPSTEN, RINKEBY, KOVAN, MAINNET, GOERLI])

export const ROPSTEN_DISPLAY_NAME = 'Ropsten Test Network'
export const RINKEBY_DISPLAY_NAME = 'Rinkeby Test Network'
export const KOVAN_DISPLAY_NAME = 'Kovan Test Network'
export const MAINNET_DISPLAY_NAME = 'Main Ethereum Network'
export const GOERLI_DISPLAY_NAME = 'Goerli Test Network'
export const RPC_DISPLAY_NAME = 'RPC'
export const LOCALHOST_DISPLAY_NAME = 'https://localhost:8545'
export const MATIC_DISPLAY_NAME = 'Polygon Mainnet'
export const MUMBAI_DISPLAY_NAME = 'Matic Mumbai'
export const BSC_MAINNET_DISPLAY_NAME = 'Binance Smart Chain Mainnet'
export const BSC_TESTNET_DISPLAY_NAME = 'Binance Smart Chain Testnet'
export const OKC_MAINNET_DISPLAY_NAME = 'OKXChain Mainnet'
export const OKC_TESTNET_DISPLAY_NAME = 'OKXChain Testnet'
export const XDAI_DISPLAY_NAME = 'xDai'
export const RSK_MAINNET_DISPLAY_NAME = 'RSK Mainnet'
export const RSK_TESTNET_DISPLAY_NAME = 'RSK Testnet'
export const REEF_DISPLAY_NAME = 'Reef Chain'
export const ARBITRUM_MAINNET_DISPLAY_NAME = 'Arbitrum One'
export const ARBITRUM_TESTNET_DISPLAY_NAME = 'Arbitrum Testnet'
export const OPTIMISM_MAINNET_DISPLAY_NAME = 'Optimism'
export const OPTIMISM_TESTNET_DISPLAY_NAME = 'Optimism Kovan'
export const AVALANCHE_MAINNET_DISPLAY_NAME = 'Avalanche Mainnet C-Chain'
export const AVALANCHE_TESTNET_DISPLAY_NAME = 'Avalanche Testnet C-Chain'

export const MATIC_URL = `https://polygon-mainnet.infura.io/v3/${process.env.VUE_APP_INFURA_KEY}`
export const MATIC_BLOCK_EXPLORER = 'https://polygonscan.com'

export const MUMBAI_URL = `https://polygon-mumbai.infura.io/v3/${process.env.VUE_APP_INFURA_KEY}`
export const MUMBAI_BLOCK_EXPLORER = 'https://mumbai.polygonscan.com'

export const XDAI_URL = 'https://rpc.xdaichain.com'
export const XDAI_BLOCK_EXPLORER = 'https://blockscout.com/poa/xdai'

export const BSC_MAINNET_URL = 'https://bsc-dataseed.binance.org'
export const BSC_MAINNET_BLOCK_EXPLORER = 'https://bscscan.com'

export const BSC_TESTNET_URL = 'https://data-seed-prebsc-2-s3.binance.org:8545'
export const BSC_TESTNET_BLOCK_EXPLORER = 'https://testnet.bscscan.com'

export const OKC_MAINNET_URL = 'https://exchainrpc.okex.org'
export const OKC_MAINNET_BLOCK_EXPLORER = 'https://www.oklink.com/en/oec'

export const OKC_TESTNET_URL = 'https://exchaintestrpc.okex.org'
export const OKC_TESTNET_BLOCK_EXPLORER = 'https://www.oklink.com/en/oec-test'

export const RSK_MAINNET_URL = 'https://public-node.rsk.co'
export const RSK_MAINNET_BLOCK_EXPLORER = 'https://explorer.rsk.co'

export const RSK_TESTNET_URL = 'https://public-node.testnet.rsk.co'
export const RSK_TESTNET_BLOCK_EXPLORER = 'https://explorer.testnet.rsk.co'
export const REEF_URL = 'https://reef.finance/'
export const REEF_BLOCK_EXPLORER = 'https://reefscan.com/'

export const ARBITRUM_MAINNET_URL = `https://arbitrum-mainnet.infura.io/v3/${process.env.VUE_APP_INFURA_KEY}`
export const ARBITRUM_MAINNET_BLOCK_EXPLORER = 'https://arbiscan.io'

export const ARBITRUM_TESTNET_URL = `https://arbitrum-rinkeby.infura.io/v3/${process.env.VUE_APP_INFURA_KEY}`
export const ARBITRUM_TESTNET_BLOCK_EXPLORER = 'https://testnet.arbiscan.io'

export const OPTIMISM_MAINNET_URL = `https://optimism-mainnet.infura.io/v3/${process.env.VUE_APP_INFURA_KEY}`
export const OPTIMISM_MAINNET_BLOCK_EXPLORER = 'https://optimistic.etherscan.io'

export const OPTIMISM_TESTNET_URL = `https://optimism-kovan.infura.io/v3/${process.env.VUE_APP_INFURA_KEY}`
export const OPTIMISM_TESTNET_BLOCK_EXPLORER = 'https://kovan-optimistic.etherscan.io'

export const AVALANCHE_MAINNET_URL = 'https://api.avax.network/ext/bc/C/rpc'
export const AVALANCHE_MAINNET_BLOCK_EXPLORER = 'https://snowtrace.io'

export const AVALANCHE_TESTNET_URL = 'https://api.avax-test.network/ext/bc/C/rpc'
export const AVALANCHE_TESTNET_BLOCK_EXPLORER = 'https://testnet.snowtrace.io'

export const BIT_HOST_URL = 'https://indexer-v1.did.id'

export const MATIC_TICKER = 'MATIC'
export const BSC_TICKER = 'BNB'
export const OKC_TICKER = 'OKT'
export const XDAI_TICKER = 'DAI'
export const RSK_MAINNET_TICKER = 'RBTC'
export const RSK_TESTNET_TICKER = 'RBTC'
export const ARBITRUM_TICKER = 'ETH'
export const OPTIMISM_TICKER = 'ETH'
export const AVALANCHE_TICKER = 'AVAX'

export const MESSAGE_TYPE = {
  ETH_DECRYPT: 'eth_decrypt',
  ETH_GET_ENCRYPTION_PUBLIC_KEY: 'eth_getEncryptionPublicKey',
  ETH_SIGN: 'eth_sign',
  ETH_SIGN_TYPED_DATA: 'eth_signTypedData',
  PERSONAL_SIGN: 'personal_sign',
}

export const TRANSACTION_TYPES = {
  CANCEL: 'cancel',
  RETRY: 'retry',
  TOKEN_METHOD_TRANSFER: 'transfer',
  TOKEN_METHOD_TRANSFER_FROM: 'transferFrom',
  TOKEN_METHOD_APPROVE: 'approve',
  SENT_ETHER: 'sentEther',
  COLLECTIBLE_METHOD_SAFE_TRANSFER_FROM: 'safeTransferFrom',
  CONTRACT_INTERACTION: 'contractInteraction',
  DEPLOY_CONTRACT: 'contractDeployment',
  STANDARD_TRANSACTION: 'transaction',
  SIGN: MESSAGE_TYPE.ETH_SIGN,
  SIGN_TYPED_DATA: MESSAGE_TYPE.ETH_SIGN_TYPED_DATA,
  PERSONAL_SIGN: MESSAGE_TYPE.PERSONAL_SIGN,
  ETH_DECRYPT: MESSAGE_TYPE.ETH_DECRYPT,
  ETH_GET_ENCRYPTION_PUBLIC_KEY: MESSAGE_TYPE.ETH_GET_ENCRYPTION_PUBLIC_KEY,
}

export const TRANSACTION_STATUSES = {
  UNAPPROVED: 'unapproved',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  SIGNED: 'signed',
  SUBMITTED: 'submitted',
  FAILED: 'failed',
  DROPPED: 'dropped',
  CONFIRMED: 'confirmed',
}

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
export const SUPPORTED_NFT_STANDARDS = new Set([CONTRACT_TYPE_ERC1155, CONTRACT_TYPE_ERC721])

export const getInfuraBlockExplorerUrl = (network) => {
  if (network === MAINNET) return 'https://etherscan.io'
  return `https://${network}.etherscan.io`
}
export const NETWORK_TYPE_TO_ID_MAP = {
  [ROPSTEN]: { networkId: ROPSTEN_CODE, chainId: ROPSTEN_CHAIN_ID },
  [RINKEBY]: { networkId: RINKEBY_CODE, chainId: RINKEBY_CHAIN_ID },
  [KOVAN]: { networkId: KOVAN_CODE, chainId: KOVAN_CHAIN_ID },
  [GOERLI]: { networkId: GOERLI_CODE, chainId: GOERLI_CHAIN_ID },
  [MAINNET]: { networkId: MAINNET_CODE, chainId: MAINNET_CHAIN_ID },
}

export const getIpfsEndpoint = (path) => `https://ipfs.infura.io:5001/api/v0/cat?arg=${path}`

export const createNetwork = (host, networkName, chainId, blockExplorer, ticker, tickerName, logo, rpcUrl) => ({
  host,
  networkName,
  chainId,
  blockExplorer,
  ticker,
  logo,
  tickerName,
  rpcUrl,
})

export const CHAIN_ID_TO_TYPE_MAP = {
  [ROPSTEN_CHAIN_ID]: { networkId: ROPSTEN_CODE, name: ROPSTEN },
  [RINKEBY_CHAIN_ID]: { networkId: RINKEBY_CODE, name: RINKEBY },
  [KOVAN_CHAIN_ID]: { networkId: KOVAN_CODE, name: KOVAN },
  [GOERLI_CHAIN_ID]: { networkId: GOERLI_CODE, name: GOERLI },
  [MAINNET_CHAIN_ID]: { networkId: MAINNET_CODE, name: MAINNET },
  [MATIC_CHAIN_ID]: { networkId: MATIC_CODE, name: MATIC },
  [MUMBAI_CHAIN_ID]: { networkId: MUMBAI_CODE, name: MUMBAI },
  [BSC_MAINNET_CHAIN_ID]: { networkId: BSC_MAINNET_CODE, name: BSC_MAINNET },
  [BSC_TESTNET_CHAIN_ID]: { networkId: BSC_TESTNET_CODE, name: BSC_TESTNET },
  [OKC_MAINNET_CHAIN_ID]: { networkId: OKC_MAINNET_CODE, name: OKC_MAINNET },
  [OKC_TESTNET_CHAIN_ID]: { networkId: OKC_TESTNET_CODE, name: OKC_TESTNET },
  [XDAI_CHAIN_ID]: { networkId: XDAI_CODE, name: XDAI },
  [REEF_CHAIN_ID]: { networkId: REEF_CODE, name: REEF },
  [ARBITRUM_MAINNET_CHAIN_ID]: { networkId: ARBITRUM_MAINNET_CODE, name: ARBITRUM_MAINNET },
  [ARBITRUM_TESTNET_CHAIN_ID]: { networkId: ARBITRUM_TESTNET_CODE, name: ARBITRUM_TESTNET },
  [OPTIMISM_MAINNET_CHAIN_ID]: { networkId: OPTIMISM_MAINNET_CODE, name: OPTIMISM_MAINNET },
  [OPTIMISM_TESTNET_CHAIN_ID]: { networkId: OPTIMISM_TESTNET_CODE, name: OPTIMISM_TESTNET },
  [AVALANCHE_MAINNET_CHAIN_ID]: { networkId: AVALANCHE_MAINNET_CODE, name: AVALANCHE_MAINNET },
  [AVALANCHE_TESTNET_CHAIN_ID]: { networkId: AVALANCHE_TESTNET_CODE, name: AVALANCHE_TESTNET },
}

export const SUPPORTED_NETWORK_TYPES = {
  [MAINNET]: createNetwork(MAINNET, MAINNET_DISPLAY_NAME, MAINNET_CODE, getInfuraBlockExplorerUrl(MAINNET), 'ETH', 'Ethereum', 'eth.svg', undefined),
  [RINKEBY]: createNetwork(RINKEBY, RINKEBY_DISPLAY_NAME, RINKEBY_CODE, getInfuraBlockExplorerUrl(RINKEBY), 'ETH', 'Ethereum', 'eth.svg', undefined),
  [KOVAN]: createNetwork(KOVAN, KOVAN_DISPLAY_NAME, KOVAN_CODE, getInfuraBlockExplorerUrl(KOVAN), 'ETH', 'Ethereum', 'eth.svg', undefined),
  [ROPSTEN]: createNetwork(ROPSTEN, ROPSTEN_DISPLAY_NAME, ROPSTEN_CODE, getInfuraBlockExplorerUrl(ROPSTEN), 'ETH', 'Ethereum', 'eth.svg', undefined),
  [GOERLI]: createNetwork(GOERLI, GOERLI_DISPLAY_NAME, GOERLI_CODE, getInfuraBlockExplorerUrl(GOERLI), 'ETH', 'Ethereum', 'eth.svg', undefined),
  [LOCALHOST]: createNetwork(LOCALHOST, LOCALHOST_DISPLAY_NAME, LOCALHOST_CODE, '', 'ETH', 'Ethereum', 'eth.svg', undefined),
  [MATIC]: createNetwork(
    MATIC,
    MATIC_DISPLAY_NAME,
    MATIC_CODE,
    MATIC_BLOCK_EXPLORER,
    MATIC_TICKER,
    'Matic Network Token',
    'matic-network-logo.svg',
    MATIC_URL
  ),
  [MUMBAI]: createNetwork(
    MUMBAI,
    MUMBAI_DISPLAY_NAME,
    MUMBAI_CODE,
    MUMBAI_BLOCK_EXPLORER,
    MATIC_TICKER,
    'Matic Network Token',
    'matic-network-logo.svg',
    MUMBAI_URL
  ),
  [BSC_MAINNET]: createNetwork(
    BSC_MAINNET,
    BSC_MAINNET_DISPLAY_NAME,
    BSC_MAINNET_CODE,
    BSC_MAINNET_BLOCK_EXPLORER,
    BSC_TICKER,
    'Binance Coin',
    'bnb.png',
    BSC_MAINNET_URL
  ),
  [BSC_TESTNET]: createNetwork(
    BSC_TESTNET,
    BSC_TESTNET_DISPLAY_NAME,
    BSC_TESTNET_CODE,
    BSC_TESTNET_BLOCK_EXPLORER,
    BSC_TICKER,
    'Binance Coin',
    'bnb.png',
    BSC_TESTNET_URL
  ),
  [OKC_MAINNET]: createNetwork(
    OKC_MAINNET,
    OKC_MAINNET_DISPLAY_NAME,
    OKC_MAINNET_CODE,
    OKC_MAINNET_BLOCK_EXPLORER,
    OKC_TICKER,
    'OKX Coin',
    'okx.png',
    OKC_MAINNET_URL
  ),
  [OKC_TESTNET]: createNetwork(
    OKC_TESTNET,
    OKC_TESTNET_DISPLAY_NAME,
    OKC_TESTNET_CODE,
    OKC_TESTNET_BLOCK_EXPLORER,
    OKC_TICKER,
    'OKX Coin',
    'okx.png',
    OKC_TESTNET_URL
  ),
  [XDAI]: createNetwork(XDAI, XDAI_DISPLAY_NAME, XDAI_CODE, XDAI_BLOCK_EXPLORER, XDAI_TICKER, 'xDai Network Token', 'xdai.svg', XDAI_URL),
  [RSK_MAINNET]: createNetwork(
    RSK_MAINNET,
    RSK_MAINNET_DISPLAY_NAME,
    RSK_MAINNET_CODE,
    RSK_MAINNET_BLOCK_EXPLORER,
    RSK_MAINNET_TICKER,
    'RSK',
    'rsk.svg',
    RSK_MAINNET_URL
  ),
  [RSK_TESTNET]: createNetwork(
    RSK_TESTNET,
    RSK_TESTNET_DISPLAY_NAME,
    RSK_TESTNET_CODE,
    RSK_TESTNET_BLOCK_EXPLORER,
    RSK_TESTNET_TICKER,
    'RSK Testnet',
    'rsk.svg',
    RSK_TESTNET_URL
  ),
  [REEF]: createNetwork(REEF, REEF_DISPLAY_NAME, REEF_CODE, REEF_BLOCK_EXPLORER, 'REEF', 'Reef', 'eth.svg', undefined),
  [OPTIMISM_MAINNET]: createNetwork(
    OPTIMISM_MAINNET,
    OPTIMISM_MAINNET_DISPLAY_NAME,
    OPTIMISM_MAINNET_CODE,
    OPTIMISM_MAINNET_BLOCK_EXPLORER,
    OPTIMISM_TICKER,
    'Ethereum',
    'eth.svg',
    OPTIMISM_MAINNET_URL
  ),
  [OPTIMISM_TESTNET]: createNetwork(
    OPTIMISM_TESTNET,
    OPTIMISM_TESTNET_DISPLAY_NAME,
    OPTIMISM_TESTNET_CODE,
    OPTIMISM_TESTNET_BLOCK_EXPLORER,
    OPTIMISM_TICKER,
    'Ethereum',
    'eth.svg',
    OPTIMISM_TESTNET_URL
  ),
  [ARBITRUM_MAINNET]: createNetwork(
    ARBITRUM_MAINNET,
    ARBITRUM_MAINNET_DISPLAY_NAME,
    ARBITRUM_MAINNET_CODE,
    ARBITRUM_MAINNET_BLOCK_EXPLORER,
    ARBITRUM_TICKER,
    'Ethereum',
    'eth.svg',
    ARBITRUM_MAINNET_URL
  ),
  [ARBITRUM_TESTNET]: createNetwork(
    ARBITRUM_TESTNET,
    ARBITRUM_TESTNET_DISPLAY_NAME,
    ARBITRUM_TESTNET_CODE,
    ARBITRUM_TESTNET_BLOCK_EXPLORER,
    ARBITRUM_TICKER,
    'Ethereum',
    'eth.svg',
    ARBITRUM_TESTNET_URL
  ),
  [AVALANCHE_MAINNET]: createNetwork(
    AVALANCHE_MAINNET,
    AVALANCHE_MAINNET_DISPLAY_NAME,
    AVALANCHE_MAINNET_CODE,
    AVALANCHE_MAINNET_BLOCK_EXPLORER,
    AVALANCHE_TICKER,
    'Avalanche',
    'avax.svg',
    AVALANCHE_MAINNET_URL
  ),
  [AVALANCHE_TESTNET]: createNetwork(
    AVALANCHE_TESTNET,
    AVALANCHE_TESTNET_DISPLAY_NAME,
    AVALANCHE_TESTNET_CODE,
    AVALANCHE_TESTNET_BLOCK_EXPLORER,
    AVALANCHE_TICKER,
    'Avalanche',
    'avax.svg',
    AVALANCHE_TESTNET_URL
  ),
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
export const ACTIVITY_STATUS_CANCELLED = 'walletActivity.cancelled'
export const ACTIVITY_STATUS_CANCELLING = 'walletActivity.cancelling'

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
export const DOT_STRING = '.'
export const BIT = 'bit'
export const BIT_LABEL = 'walletSettings.bitId'

// Format: [dark/light]-[colorName]
export const THEME_DARK_BLACK_NAME = 'dark-black'
export const THEME_LIGHT_BLUE_NAME = 'light-blue'

export const ACCOUNT_TYPE = {
  NORMAL: 'normal',
  THRESHOLD: 'threshold',
  IMPORTED: 'imported',
  APP_SCOPED: 'app_scoped',
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
    name: BIT_LABEL,
    value: BIT,
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
export const TRANSAK = 'transak'
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
  unlockStateChanged: 'wallet_unlockStateChanged',
  chainChanged: 'wallet_chainChanged',
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

export const TRANSACTION_ENVELOPE_TYPES = {
  LEGACY: '0x0',
  ACCESS_LIST: '0x1',
  FEE_MARKET: '0x2',
}

/**
 * Hardforks are points in the chain where logic is changed significantly
 * enough where there is a fork and the new fork becomes the active chain.
 * These constants are presented in chronological order starting with BERLIN
 * because when we first needed to track the hardfork we had launched support
 * for EIP-2718 (where transactions can have types and different shapes) and
 * EIP-2930 (optional access lists), which were included in BERLIN.
 *
 * BERLIN - forked at block number 12,244,000, included typed transactions and
 *  optional access lists
 * LONDON - future, upcoming fork that introduces the baseFeePerGas, an amount
 *  of the ETH transaction fees that will be burned instead of given to the
 *  miner. This change necessitated the third type of transaction envelope to
 *  specify maxFeePerGas and maxPriorityFeePerGas moving the fee bidding system
 *  to a second price auction model.
 */
export const HARDFORKS = {
  BERLIN: 'berlin',
  LONDON: 'london',
}

export const GAS_ESTIMATE_TYPES = {
  FEE_MARKET: 'fee-market',
  LEGACY: 'legacy',
  ETH_GASPRICE: 'eth_gasPrice',
  NONE: 'none',
}

// https://help.optimism.io/hc/en-us/articles/4411895794715-Transaction-fees
export const CHAIN_ID_TO_GAS_LIMIT_BUFFER_MAP = {
  [OPTIMISM_MAINNET_CHAIN_ID]: 1.5,
  [OPTIMISM_TESTNET_CHAIN_ID]: 1.5,
}

export const TEST_CHAINS = [ROPSTEN_CHAIN_ID, RINKEBY_CHAIN_ID, GOERLI_CHAIN_ID, KOVAN_CHAIN_ID]
export const TEST_CHAINS_NUMERIC_IDS = [ROPSTEN_CODE, RINKEBY_CODE, GOERLI_CODE, KOVAN_CODE]

const TWENTY_ONE_THOUSAND = 21_000
const ONE_HUNDRED_THOUSAND = 100_000

export const GAS_LIMITS = {
  // maximum gasLimit of a simple send
  SIMPLE: addHexPrefix(TWENTY_ONE_THOUSAND.toString(16)),
  // a base estimate for token transfers.
  BASE_TOKEN_ESTIMATE: addHexPrefix(ONE_HUNDRED_THOUSAND.toString(16)),
}

export const TRANSACTION_SPEED = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
}

export const COINGECKO_PLATFORMS_CHAIN_CODE_MAP = {
  [MATIC_CODE]: {
    platform: 'polygon-pos',
    currency: 'matic',
  },
  [BSC_MAINNET_CODE]: {
    platform: 'binance-smart-chain',
    currency: 'bnb',
  },
  [OKC_MAINNET_CODE]: {
    platform: 'oec-token',
    currency: 'okt',
  },
  [MAINNET_CODE]: {
    platform: 'ethereum',
    currency: 'eth',
  },
  [RSK_MAINNET_CODE]: {
    platform: 'rootstock',
    currency: 'rbtc',
  },
  [ARBITRUM_MAINNET_CODE]: {
    platform: 'arbitrum-one',
    currency: 'eth',
  },
  [OPTIMISM_MAINNET_CODE]: {
    platform: 'optimistic-ethereum',
    currency: 'eth',
  },
  [XDAI_CODE]: {
    platform: 'xdai',
    currency: 'xDAI',
  },
  [AVALANCHE_MAINNET_CODE]: {
    platform: 'avalanche',
    currency: 'avax',
  },
}

export const WALLET_OPENLOGIN_VERIFIER_MAP = {
  [GOOGLE_VERIFIER]: GOOGLE_LINKED_VERIFIER,
  [FACEBOOK_VERIFIER]: FACEBOOK_LINKED_VERIFIER,
  [REDDIT_VERIFIER]: REDDIT_LINKED_VERIFIER,
  [DISCORD_VERIFIER]: DISCORD_LINKED_VERIFIER,
  [TWITCH_VERIFIER]: TWITCH_LINKED_VERIFIER,
  [GITHUB_VERIFIER]: GITHUB_LINKED_VERIFIER,
  [KAKAO_VERIFIER]: KAKAO_LINKED_VERIFIER,
  [LINKEDIN_VERIFIER]: LINKEDIN_LINKED_VERIFIER,
  [TWITTER_VERIFIER]: TWITTER_LINKED_VERIFIER,
  [WEIBO_VERIFIER]: WEIBO_LINKED_VERIFIER,
  [WECHAT_VERIFIER]: WEIBO_LINKED_VERIFIER,
  [LINE_VERIFIER]: LINE_LINKED_VERIFIER,
  [APPLE_VERIFIER]: APPLE_LINKED_VERIFIER,
  [HOSTED_EMAIL_PASSWORDLESS_VERIFIER]: HOSTED_EMAIL_PASSWORDLESS_LINKED_VERIFIER,
}

export const COINGECKO_SUPPORTED_CURRENCIES = new Set([
  'btc',
  'eth',
  'ltc',
  'bch',
  'bnb',
  'eos',
  'xrp',
  'xlm',
  'link',
  'dot',
  'yfi',
  'usd',
  'aed',
  'ars',
  'aud',
  'bdt',
  'bhd',
  'bmd',
  'brl',
  'cad',
  'chf',
  'clp',
  'cny',
  'czk',
  'dkk',
  'eur',
  'gbp',
  'hkd',
  'huf',
  'idr',
  'ils',
  'inr',
  'jpy',
  'krw',
  'kwd',
  'lkr',
  'mmk',
  'mxn',
  'myr',
  'ngn',
  'nok',
  'nzd',
  'php',
  'pkr',
  'pln',
  'rub',
  'sar',
  'sek',
  'sgd',
  'thb',
  'try',
  'twd',
  'uah',
  'vef',
  'vnd',
  'zar',
  'xdr',
  'xag',
  'xau',
  'bits',
  'sats',
])

export const WALLET_CONNECT_CARD_DATA = {
  [LOCALE_EN]: {
    title: 'Explore & Connect to dapps via Wallet Connect',
    ctaText: 'Get Started',
    ctaDisconnectText: 'Disconnect',
  },
  [LOCALE_DE]: {
    title: 'Entdecken und verbinden Sie sich mit Dapps über Wallet Connect',
    ctaText: 'Loslegen',
    ctaDisconnectText: 'Trennen',
  },
  [LOCALE_ES]: {
    title: 'Explore y conéctese a dapps a través de Wallet Connect',
    ctaText: 'Empezar',
    ctaDisconnectText: 'Desconectar',
  },
  [LOCALE_JA]: {
    title: 'ウォレット接続を介してdappsを探索して接続します',
    ctaText: '始めましょう',
    ctaDisconnectText: '切断',
  },
  [LOCALE_KO]: {
    title: '지갑 연결을 통해 dapp 탐색 및 연결',
    ctaText: '시작하다',
    ctaDisconnectText: '연결 해제',
  },
  [LOCALE_ZH]: {
    title: '通过 Wallet Connect 探索并连接到 dapp',
    ctaText: '开始使用',
    ctaDisconnectText: '断开连接',
  },
}

export const CHAIN_TO_BIT_NAMESPACE = {
  [MAINNET_CODE]: 'address.eth',
  [MATIC_CODE]: 'address.polygon',
  [BSC_MAINNET_CODE]: 'address.bsc',
  [OKC_MAINNET_CODE]: 'address.okc',
  [XDAI_CODE]: 'address.xdai',
  [RSK_MAINNET_CODE]: 'address.rsk',
  [REEF_CODE]: 'address.reef',
  [ARBITRUM_MAINNET_CODE]: 'address.arbitrum',
  [OPTIMISM_MAINNET_CODE]: 'address.op',
  [AVALANCHE_MAINNET_CODE]: 'address.avalanche',
}
