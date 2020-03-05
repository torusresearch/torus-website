/**
 * Asset Controller
 *
 * Controller stores the assets and exposes some convienient methods
 */

import log from 'loglevel'
import ObservableStore from 'obs-store'
import { toChecksumAddress } from 'web3-utils'

import config from '../config'
import { get } from '../utils/httpHelpers'

const initStateObject = { allCollectibleContracts: {}, allCollectibles: {}, allTokens: {}, collectibleContracts: [], collectibles: [], tokens: [] }

export default class AssetController {
  constructor(options = {}) {
    const initState = {
      accounts: {}
    }
    this.name = 'AssetsController'
    this.store = new ObservableStore(initState)
    this.network = options.network
    this.assetContractController = options.assetContractController
    this.selectedAddress = options.selectedAddress
    if (this.selectedAddress) this.store.updateState({ accounts: { [this.selectedAddress]: initStateObject } })
    this.jwtToken = ''
  }

  setSelectedAddress(address) {
    this.selectedAddress = address
    this.store.updateState({ accounts: { ...this.store.getState().accounts, [address]: initStateObject } })
  }

  setJwtToken(jwtToken) {
    this.jwtToken = jwtToken
  }

  static getCollectibleApi(contractAddress, tokenId) {
    return `https://api.opensea.io/api/v1/asset/${contractAddress}/${tokenId}`
  }

  static getCollectibleContractInformationApi(contractAddress) {
    return `https://api.opensea.io/api/v1/asset_contract/${contractAddress}`
  }

  /**
   * Get collectible tokenURI API following ERC721
   *
   * @param contractAddress - ERC721 asset contract address
   * @param tokenId - ERC721 asset identifier
   * @returns - Collectible tokenURI
   */
  async getCollectibleTokenURI(contractAddress, tokenId) {
    try {
      const supportsMetadata = await this.assetContractController.contractSupportsMetadataInterface(contractAddress)
      /* istanbul ignore if */
      if (!supportsMetadata) {
        return ''
      }
      return this.assetContractController.getCollectibleTokenURI(contractAddress, tokenId)
    } catch (error) {
      log.error(error)
    }
    return ''
  }

  /**
   * Request individual collectible information from OpenSea api
   *
   * @param contractAddress - Hex address of the collectible contract
   * @param tokenId - The collectible identifier
   * @returns - Promise resolving to the current collectible name and image
   */
  async getCollectibleInformationFromApi(contractAddress, tokenId) {
    const tokenURI = AssetController.getCollectibleApi(contractAddress, tokenId)
    const collectibleInformation = await get(`${config.api}/opensea?url=${encodeURIComponent(tokenURI)}`, {
      headers: {
        Authorization: `Bearer ${this.jwtToken}`
      }
    })

    const { name, description, image_original_url } = collectibleInformation.data
    return { image: image_original_url, name, description }
  }

  /**
   * Request individual collectible information from contracts that follows Metadata Interface
   *
   * @param contractAddress - Hex address of the collectible contract
   * @param tokenId - The collectible identifier
   * @returns - Promise resolving to the current collectible name and image
   */
  async getCollectibleInformationFromTokenURI(contractAddress, tokenId) {
    const tokenURI = await this.getCollectibleTokenURI(contractAddress, tokenId)
    const object = await get(tokenURI)
    const image = Object.prototype.hasOwnProperty.call(object, 'image') ? 'image' : /* istanbul ignore next */ 'image_url'
    return { image: object[image], name: object.name }
  }

  /**
   * Request individual collectible information (name, image url and description)
   *
   * @param contractAddress - Hex address of the collectible contract
   * @param tokenId - The collectible identifier
   * @returns - Promise resolving to the current collectible name and image
   */
  async getCollectibleInformation(contractAddress, tokenId) {
    try {
      let information
      // First try with OpenSea
      information = await this.getCollectibleInformationFromApi(contractAddress, tokenId)

      if (information) {
        return information
      }
      // Then following ERC721 standard
      information = await this.getCollectibleInformationFromTokenURI(contractAddress, tokenId)

      if (information) {
        return information
      }

      return {}
    } catch (error) {
      log.error(error)
    }
    return {}
  }

  /**
   * Request collectible contract information from OpenSea api
   *
   * @param contractAddress - Hex address of the collectible contract
   * @returns - Promise resolving to the current collectible name and image
   */
  async getCollectibleContractInformationFromApi(contractAddress) {
    const api = AssetController.getCollectibleContractInformationApi(contractAddress)
    /* istanbul ignore if */

    const collectibleContractObject = await get(`${config.api}/opensea?url=${encodeURIComponent(api)}`, {
      headers: {
        Authorization: `Bearer ${this.jwtToken}`
      }
    })

    const { name, symbol, image_url, description, total_supply } = collectibleContractObject.data
    return { name, symbol, image_url, description, total_supply }
  }

  /**
   * Request collectible contract information from the contract itself
   *
   * @param contractAddress - Hex address of the collectible contract
   * @returns - Promise resolving to the current collectible name and image
   */
  async getCollectibleContractInformationFromContract(contractAddress) {
    const assetsContractController = this.assetContractController
    const name = await assetsContractController.getAssetName(contractAddress)
    const symbol = await assetsContractController.getAssetSymbol(contractAddress)
    return { name, symbol }
  }

  /**
   * Request collectible contract information from OpenSea api
   *
   * @param contractAddress - Hex address of the collectible contract
   * @returns - Promise resolving to the collectible contract name, image and description
   */
  async getCollectibleContractInformation(contractAddress) {
    try {
      let information

      // First try with OpenSea
      information = await this.getCollectibleContractInformationFromApi(contractAddress)
      if (information) {
        return information
      }

      // Then following ERC721 standard
      information = await this.getCollectibleContractInformationFromContract(contractAddress)
      if (information) {
        return information
      }
      /* istanbul ignore next */
      return {}
    } catch (error) {
      log.error('getCollectibleContractInformation ', error)
    }
    return {}
  }

  /**
   * Adds an individual collectible to the stored collectible list
   *
   * @param address - Hex address of the collectible contract
   * @param tokenId - The collectible identifier
   * @param opts - Collectible optional information (name, image and description)
   * @param detection? - Whether the collectible is manually added or autodetected
   * @returns - Promise resolving to the current collectible list
   */
  async addIndividualCollectible(address2, tokenId, options) {
    try {
      const address = toChecksumAddress(address2)
      const { selectedAddress } = this
      const initState = this.store.getState().accounts[selectedAddress]
      const { allCollectibles, collectibles } = initState
      const networkType = this.network.getNetworkNameFromNetworkCode()
      const existingEntry = collectibles.find(collectible => collectible.address === address && collectible.tokenId === tokenId)
      if (existingEntry) {
        return collectibles
      }
      const { name, image, description } = options || (await this.getCollectibleInformation(address, tokenId))
      const newEntry = { address, tokenId, name, image, description }
      const newCollectibles = [...collectibles, newEntry]
      const addressCollectibles = allCollectibles[selectedAddress]
      const newAddressCollectibles = { ...addressCollectibles, ...{ [networkType]: newCollectibles } }
      const newAllCollectibles = { ...allCollectibles, ...{ [selectedAddress]: newAddressCollectibles } }
      this.store.updateState({
        accounts: {
          ...this.store.getState().accounts,
          [selectedAddress]: { ...initState, allCollectibles: newAllCollectibles, collectibles: newCollectibles }
        }
      })

      return newCollectibles
    } catch (error) {
      log.error(error)
    }
    return {}
  }

  /**
   * Adds a token to the stored token list
   *
   * @param address - Hex address of the token contract
   * @param symbol - Symbol of the token
   * @param decimals - Number of decimals the token uses
   * @param image - Image of the token
   * @returns - Current token list
   */
  async addToken(address2, symbol, decimals, image) {
    try {
      const address = toChecksumAddress(address2)
      const { selectedAddress } = this
      const initState = this.store.getState().accounts[selectedAddress]
      const { allTokens, tokens } = initState
      const { networkType } = this.network.getNetworkNameFromNetworkCode()
      const newEntry = { address, symbol, decimals, image }
      const previousEntry = tokens.find(token => token.address === address)
      if (previousEntry) {
        const previousIndex = tokens.indexOf(previousEntry)
        tokens[previousIndex] = newEntry
      } else {
        tokens.push(newEntry)
      }
      const addressTokens = allTokens[selectedAddress]
      const newAddressTokens = { ...addressTokens, [networkType]: tokens }
      const newAllTokens = { ...allTokens, [selectedAddress]: newAddressTokens }
      const newTokens = [...tokens]
      this.store.updateState({
        accounts: {
          ...this.store.getState().accounts,
          [selectedAddress]: { ...initState, allTokens: newAllTokens, tokens: newTokens }
        }
      })
      return newTokens
    } catch (error) {
      log.error(error)
    }
    return {}
  }

  /**
   * Adds a collectible contract to the stored collectible contracts list
   *
   * @param address - Hex address of the collectible contract
   * @param detection? - Whether the collectible is manually added or auto-detected
   * @returns - Promise resolving to the current collectible contracts list
   */
  async addCollectibleContract(address2, detection, options) {
    const address = toChecksumAddress(address2)
    const { selectedAddress } = this
    const initState = this.store.getState().accounts[selectedAddress]
    const { allCollectibleContracts, collectibleContracts } = initState
    const networkType = this.network.getNetworkNameFromNetworkCode()
    const existingEntry = collectibleContracts.find(collectibleContract => collectibleContract.address === address)
    if (existingEntry) {
      return collectibleContracts
    }
    let contractInformation
    if (options) {
      contractInformation = {
        name: options.contractName,
        symbol: options.contractSymbol,
        image_url: options.contractImage,
        total_supply: options.contractSupply,
        description: options.contractDescription
      }
    } else {
      contractInformation = await this.getCollectibleContractInformation(address)
    }
    const { name, symbol, image_url, description, total_supply } = contractInformation
    // If being auto-detected opensea information is expected
    // Oherwise at least name and symbol from contract is needed
    if ((detection && !image_url) || Object.keys(contractInformation).length === 0) {
      return collectibleContracts
    }
    const newEntry = {
      address,
      description,
      logo: image_url,
      name,
      symbol,
      totalSupply: total_supply
    }
    const newCollectibleContracts = [...collectibleContracts, newEntry]
    const addressCollectibleContracts = allCollectibleContracts[selectedAddress]
    const newAddressCollectibleContracts = {
      ...addressCollectibleContracts,
      [networkType]: newCollectibleContracts
    }
    const newAllCollectibleContracts = {
      ...allCollectibleContracts,
      [selectedAddress]: newAddressCollectibleContracts
    }
    this.store.updateState({
      accounts: {
        ...this.store.getState().accounts,
        [selectedAddress]: { ...initState, allCollectibleContracts: newAllCollectibleContracts, collectibleContracts: newCollectibleContracts }
      }
    })
    return newCollectibleContracts
  }

  /**
   * Adds a collectible and respective collectible contract to the stored collectible and collectible contracts lists
   *
   * @param address2 - Hex address of the collectible contract
   * @param tokenId - The collectible identifier
   * @param opts - Collectible optional information (name, image and description)
   * @param detection? - Whether the collectible is manually added or autodetected
   * @returns - Promise resolving to the current collectible list
   */
  async addCollectible(address2, tokenId, options, detection) {
    try {
      const address = toChecksumAddress(address2)
      const newCollectibleContracts = await this.addCollectibleContract(address, detection, options)
      // If collectible contract was not added, do not add individual collectible
      const collectibleContract = newCollectibleContracts.find(contract => contract.address === address)

      // If collectible contract information, add individual collectible
      if (collectibleContract) {
        // log.info('AssetController: addCollectible(): addingIndividualCollectible')
        await this.addIndividualCollectible(address, tokenId, options)
      }
    } catch (error) {
      log.error(error)
    }
  }
}
