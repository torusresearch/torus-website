/**
 * Assets Detection
 * Controller that passively polls on a set interval for assets auto detection
 */

import log from 'loglevel'

import { BSC_MAINNET, CONTRACT_TYPE_ERC721, CONTRACT_TYPE_ERC1155, MAINNET, MATIC, MUMBAI } from '../utils/enums'

const DEFAULT_INTERVAL = 60000
const SUPPORTED_NETWORKS = new Set([MAINNET, MATIC, MUMBAI, BSC_MAINNET])
export default class AssetsDetectionController {
  constructor(options) {
    this.interval = options.interval || DEFAULT_INTERVAL
    this.selectedAddress = options.selectedAddress || ''
    this.network = options.network
    this.assetController = options.assetController
    this.assetContractController = options.assetContractController
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
    if (this.currentNetwork === MAINNET) {
      return `https://api.covalenthq.com/v1/1/address/${address}/balances_v2/?nft=true&no-nft-fetch=false`
    }
    if (this.currentNetwork === MATIC) {
      return `https://api.covalenthq.com/v1/137/address/${address}/balances_v2/?nft=true&no-nft-fetch=false`
    }
    if (this.currentNetwork === MUMBAI) {
      return `https://api.covalenthq.com/v1/80001/address/${address}/balances_v2/?nft=true&no-nft-fetch=false`
    }
    if (this.currentNetwork === BSC_MAINNET) {
      return `https://api.covalenthq.com/v1/56/address/${address}/balances_v2/?nft=true&no-nft-fetch=false`
    }
    return null
  }

  async getOwnerCollectibles() {
    if (!this.collectibleApi) {
      return []
    }
    let response
    try {
      if (SUPPORTED_NETWORKS.has(this.currentNetwork)) {
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
    // this.detectTokens()
    this.detectCollectibles()
  }

  /**
   * Triggers asset ERC721 token auto detection on mainnet
   * adding new collectibles and removing not owned collectibles
   */
  async detectCollectibles() {
    /* istanbul ignore if */
    const currentNetwork = this.network.getNetworkNameFromNetworkCode()
    await this.setNetworkConfig(currentNetwork)
    await this.detectCollectiblesFromCovalent(currentNetwork)
  }

  async setNetworkConfig(network) {
    this.currentNetwork = network
    const { selectedAddress } = this
    this.collectibleApi = this.getOwnerCollectiblesApi(selectedAddress)
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
    for (const item of apiCollectibles) {
      if (item.type === 'nft') {
        let contractName = item.contract_name
        let standard
        const { contract_address: contractAddress, contract_ticker_symbol: contractSymbol, nft_data, supports_erc } = item

        if (supports_erc.includes('erc1155')) {
          contractName = `${contractName} (${protocolPrefix}1155)`
          standard = CONTRACT_TYPE_ERC1155
        } else if (supports_erc.includes('erc721')) {
          contractName = `${contractName} (${protocolPrefix}721)`
          standard = CONTRACT_TYPE_ERC721
        }

        let contractImage
        if (!!nft_data && nft_data.length > 0) {
          for (const nft of nft_data) {
            const { token_id: tokenID, token_balance: tokenBalance, external_data } = nft
            const name = external_data?.name
            const description = external_data?.description
            const imageURL = external_data?.image
            // nft contract images urls are invalid most of the times in covalent
            // so using asset image as contract image
            if (!contractImage) {
              contractImage = imageURL || ''
            }
            // eslint-disable-next-line no-await-in-loop
            await this.assetController.addCollectible(
              contractAddress,
              tokenID.toString(),
              {
                description,
                image: imageURL || '',
                name: name || `${contractName}#${tokenID}`,
                contractAddress,
                contractName,
                contractSymbol,
                contractImage,
                contractSupply: null,
                tokenBalance,
                standard,
                contractDescription: '',
              },
              true
            )
          }
        }
      }
    }
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
