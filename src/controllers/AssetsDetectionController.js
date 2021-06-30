/**
 * Assets Detection
 * Controller that passively polls on a set interval for assets auto detection
 */

import deepmerge from 'deepmerge'
import log from 'loglevel'

import { BSC_MAINNET, CONTRACT_TYPE_ERC721, CONTRACT_TYPE_ERC1155, MAINNET, NFT_SUPPORTED_NETWORKS } from '../utils/enums'
import { isMain } from '../utils/utils'

const DEFAULT_INTERVAL = 60_000
export default class AssetsDetectionController {
  constructor(options) {
    this.interval = options.interval || DEFAULT_INTERVAL
    this.selectedAddress = options.selectedAddress || ''
    this.network = options.network
    this.assetController = options.assetController
    this.getCovalentNfts = options.getCovalentNfts
    this.getOpenSeaCollectibles = options.getOpenSeaCollectibles
    this.currentNetwork = null
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
    if (isMain)
      this._handle = setInterval(() => {
        this.detectAssets()
      }, interval)
  }

  getOwnerCollectiblesApi(address, apiType = 'covalent') {
    if (apiType === 'opensea') {
      return `https://api.opensea.io/api/v1/assets?owner=${address}&limit=300`
    }
    const chainId = NFT_SUPPORTED_NETWORKS[this.currentNetwork]
    if (chainId) {
      return `https://api.covalenthq.com/v1/${chainId}/address/${address}/balances_v2/?nft=true&no-nft-fetch=false`
    }
    return ''
  }

  async getOwnerCollectibles(apiType = 'covalent') {
    const { selectedAddress } = this
    const api = this.getOwnerCollectiblesApi(selectedAddress, apiType)
    let response
    try {
      if (apiType === 'covalent') {
        if (NFT_SUPPORTED_NETWORKS[this.currentNetwork]) {
          response = await this.getCovalentNfts(api)
          const collectibles = response.data?.data?.items || []
          return collectibles
        }
        return []
      }
      response = await this.getOpenSeaCollectibles(api)
      const collectibles = response.data.assets
      return collectibles
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
   * Triggers asset ERC721/ERC1155 token auto detection
   * adding new collectibles and removing not owned collectibles
   */
  async detectCollectibles() {
    /* istanbul ignore if */
    const currentNetwork = this.network.getNetworkNameFromNetworkCode()
    this.currentNetwork = currentNetwork
    let finalArr = []

    if (this.isMainnet()) {
      const [openseaAssets, covalentAssets] = await Promise.all([
        this.detectCollectiblesFromOpensea(),
        this.detectCollectiblesFromCovalent(currentNetwork),
      ])
      const [covalentCollectibles, covalentCollectiblesMap] = covalentAssets
      const [, openseaCollectiblesMap] = openseaAssets

      const openseaIndexes = Object.keys(openseaCollectiblesMap)
      if (openseaIndexes.length > 0) {
        Object.keys(openseaCollectiblesMap).forEach((x) => {
          const openseaCollectible = openseaCollectiblesMap[x]
          const covalentCollectible = covalentCollectiblesMap[x]
          if (covalentCollectible) {
            const finalCollectible = deepmerge(covalentCollectible, openseaCollectible)
            finalArr.push(finalCollectible)
          } else {
            finalArr.push(openseaCollectible)
          }
        })
      } else {
        finalArr = covalentCollectibles
      }
    } else {
      const [covalentCollectibles] = await this.detectCollectiblesFromCovalent(currentNetwork)
      finalArr = covalentCollectibles
    }

    await this.assetController.addCollectibles(finalArr, false)
  }

  async detectCollectiblesFromCovalent(network) {
    const { selectedAddress } = this
    const collectibles = []
    const collectiblesMap = {}
    /* istanbul ignore else */
    if (!selectedAddress) {
      return [collectibles, collectiblesMap]
    }
    let protocolPrefix = 'ERC'
    if (network === BSC_MAINNET) {
      protocolPrefix = 'BEP'
    }
    this.assetController.setSelectedAddress(selectedAddress)
    const apiCollectibles = await this.getOwnerCollectibles('covalent')
    for (const item of apiCollectibles) {
      if (item.type === 'nft') {
        let contractName = item.contract_name
        let standard
        const { logo_url, contract_address: contractAddress, contract_ticker_symbol: contractSymbol, nft_data } = item

        const contractImage = logo_url
        let contractFallbackLogo
        if (!!nft_data && nft_data.length > 0) {
          for (const [i, nft] of nft_data.entries()) {
            const { token_id: tokenID, token_balance: tokenBalance, external_data, supports_erc } = nft
            if (supports_erc.includes('erc1155')) {
              contractName = `${contractName} (${protocolPrefix}1155)`
              standard = CONTRACT_TYPE_ERC1155
            } else {
              contractName = `${contractName} (${protocolPrefix}721)`
              standard = CONTRACT_TYPE_ERC721
            }
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
            const collectibleIndex = `${contractAddress.toLowerCase()}_${tokenID.toString()}`
            collectiblesMap[collectibleIndex] = collectibleDetails
          }
        }
      }
    }
    return [collectibles, collectiblesMap]
  }

  /**
   * Triggers asset ERC721 token auto detection on mainnet
   * adding new collectibles and removing not owned collectibles
   */
  async detectCollectiblesFromOpensea() {
    const finalCollectibles = []
    const collectiblesMap = {}
    /* istanbul ignore if */
    if (!this.isMainnet()) {
      return [finalCollectibles, collectiblesMap]
    }
    const { selectedAddress } = this
    /* istanbul ignore else */
    if (!selectedAddress) {
      return [finalCollectibles, collectiblesMap]
    }
    this.assetController.setSelectedAddress(selectedAddress)
    const apiCollectibles = await this.getOwnerCollectibles('opensea')
    for (const {
      token_id: tokenID,
      image_url: imageURL,
      name,
      description,
      asset_contract: {
        schema_name: standard,
        address: contractAddress,
        name: contractName,
        symbol: contractSymbol,
        image_url: contractImage = '',
        total_supply: contractSupply,
        description: contractDescription,
      },
    } of apiCollectibles) {
      const collectible = {
        contractAddress,
        tokenID: tokenID.toString(),
        options: {
          standard: standard?.toLowerCase(),
          description,
          image: imageURL || (contractImage || '').replace('=s60', '=s240'),
          name: name || `${contractName}#${tokenID}`,
          contractAddress,
          contractName,
          contractSymbol,
          contractImage: (contractImage || '').replace('=s60', '=s240') || imageURL,
          contractSupply,
          contractDescription,
        },
      }
      finalCollectibles.push(collectible)
      const collectibleIndex = `${contractAddress.toLowerCase()}_${tokenID.toString()}`
      collectiblesMap[collectibleIndex] = collectible
    }
    return [finalCollectibles, collectiblesMap]
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
