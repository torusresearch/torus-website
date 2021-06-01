/**
 * Assets Detection
 * Controller that passively polls on a set interval for assets auto detection
 */

import log from 'loglevel'

import { BSC_MAINNET, CONTRACT_TYPE_ERC721, CONTRACT_TYPE_ERC1155, MAINNET, NFT_SUPPORTED_NETWORKS } from '../utils/enums'

const DEFAULT_INTERVAL = 60000
export default class AssetsDetectionController {
  constructor(options) {
    this.interval = options.interval || DEFAULT_INTERVAL
    this.selectedAddress = options.selectedAddress || ''
    this.network = options.network
    this.assetController = options.assetController
    this.getCovalentNfts = options.getCovalentNfts
    this.currentNetwork = null
    this.collectibleApi = null
  }

  restartAssetDetection() {
    if (!this.selectedAddress) {
      return
    }
    this.detectAssets()
    this.interval = DEFAULT_INTERVAL
  }

  /**
   * In setter when isUnlocked is updated to true, detectNewTokens and restart polling
   * @type {Object}
   */
  startAssetDetection(selectedAddress) {
    this.selectedAddress = selectedAddress
    this.restartAssetDetection()
  }

  stopAssetDetection() {
    this.selectedAddress = ''
  }

  isMainnet() {
    return this.network.getNetworkNameFromNetworkCode() === MAINNET
  }

  /**
   * @type {Number}
   */
  set interval(interval) {
    if (this._handle) clearInterval(this._handle)
    if (!interval) {
      return
    }
    this._handle = setInterval(() => {
      this.detectAssets()
    }, interval)
  }

  getOwnerCollectiblesApi(address) {
    const chainId = NFT_SUPPORTED_NETWORKS[this.currentNetwork]
    if (chainId) {
      return `https://api.covalenthq.com/v1/${chainId}/address/${address}/balances_v2/?nft=true&no-nft-fetch=false`
    }
    return ''
  }

  async getOwnerCollectibles() {
    if (!this.collectibleApi) {
      return []
    }
    let response
    try {
      if (NFT_SUPPORTED_NETWORKS[this.currentNetwork]) {
        response = await this.getCovalentNfts(this.collectibleApi)
        const collectibles = response.data?.data?.items || []
        return collectibles
      }
      return []
    } catch (error) {
      log.error(error)
      return []
    }
  }

  /**
   * Detect assets owned by current account on mainnet
   */
  async detectAssets() {
    if (NFT_SUPPORTED_NETWORKS[this.network.getNetworkNameFromNetworkCode()]) {
      // this.detectTokens()
      this.detectCollectibles()
    }
  }

  /**
   * Triggers asset ERC721 token auto detection on mainnet
   * adding new collectibles and removing not owned collectibles
   */
  async detectCollectibles() {
    /* istanbul ignore if */
    const currentNetwork = this.network.getNetworkNameFromNetworkCode()
    this.currentNetwork = currentNetwork
    const { selectedAddress } = this
    this.collectibleApi = this.getOwnerCollectiblesApi(selectedAddress)
    await this.detectCollectiblesFromCovalent(currentNetwork)
  }

  async detectCollectiblesFromCovalent(network) {
    const { selectedAddress } = this
    /* istanbul ignore else */
    if (!selectedAddress) {
      return
    }
    let protocolPrefix = 'ERC'
    if (network === BSC_MAINNET) {
      protocolPrefix = 'BEP'
    }
    this.assetController.setSelectedAddress(selectedAddress)
    const apiCollectibles = await this.getOwnerCollectibles()
    const collectibles = []
    for (const item of apiCollectibles) {
      if (item.type === 'nft') {
        let contractName = item.contract_name
        let standard
        const { logo_url, contract_address: contractAddress, contract_ticker_symbol: contractSymbol, nft_data, supports_erc } = item
        if (supports_erc.includes('erc1155')) {
          contractName = `${contractName} (${protocolPrefix}1155)`
          standard = CONTRACT_TYPE_ERC1155
        } else if (supports_erc.includes('erc721')) {
          contractName = `${contractName} (${protocolPrefix}721)`
          standard = CONTRACT_TYPE_ERC721
        }

        const contractImage = logo_url
        let contractFallbackLogo
        if (!!nft_data && nft_data.length > 0) {
          for (const [i, nft] of nft_data.entries()) {
            const { token_id: tokenID, token_balance: tokenBalance, external_data } = nft
            const name = external_data?.name
            const description = external_data?.description
            const imageURL = external_data?.image || '/images/nft-placeholder.svg'
            if (i === 0) {
              contractFallbackLogo = imageURL
            }
            const collectibleDetails = {
              contractAddress,
              tokenID: tokenID.toString(),
              options: {
                contractName,
                contractSymbol,
                contractImage,
                contractFallbackLogo,
                standard,
                contractDescription: '', // covalent api doesn't provide contract description like opensea
                description,
                image: imageURL,
                name: name || `${contractName}#${tokenID}`,
                tokenBalance,
              },
            }
            collectibles.push(collectibleDetails)
          }
        }
      }
    }
    await this.assetController.addCollectibles(collectibles, false)
  }
}

// /**
//  * Triggers asset ERC20 token auto detection for each contract address in contract metadata on mainnet
//  */
// async detectTokens() {
//   /* istanbul ignore if */
//   if (!this.isMainnet()) {
//     return
//   }
//   const tokensAddresses = this.store.getState().token.filter(/* istanbul ignore next*/ token => token.address)
//   const tokensToDetect = []
//   for (const address in contractMap) {
//     const contract = contractMap[address]
//     if (contract.erc20 && !(address in tokensAddresses)) {
//       tokensToDetect.push(address)
//     }
//   }

//   // log.info('AssetsDetectionController: detectTokens(): tokensTodetect[]:', tokensToDetect)
//   const assetsContractController = this.assetContractController
//   const { selectedAddress } = this.store.getState().selectedAddress
//   /* istanbul ignore else */
//   if (!selectedAddress) {
//     return
//   }
//   try {
//     const balances = await assetsContractController.getBalancesInSingleCall(selectedAddress, tokensToDetect)
//     const assetsController = this.assetContractController
//     const { ignoredTokens } = assetsController.state
//     for (const tokenAddress in balances) {
//       let ignored
//       /* istanbul ignore else */
//       if (ignoredTokens.length) {
//         ignored = ignoredTokens.find(token => token.address === ethereumjs_util.toChecksumAddress(tokenAddress))
//       }
//       if (!ignored) {
//         await assetsController.addToken(tokenAddress, contractMap[tokenAddress].symbol, contractMap[tokenAddress].decimals)
//       }
//     }
//   } catch (err) {
//     log.error(err)
//   }
// }
