/**
 * Asset Controller
 *
 * Controller stores the assets and exposes some convienient methods
 */

import { ObservableStore } from '@metamask/obs-store'
import log from 'loglevel'
import { isAddress, toChecksumAddress } from 'web3-utils'

import {
  BSC_MAINNET,
  BSC_MAINNET_CODE,
  CONTRACT_TYPE_ERC721,
  CONTRACT_TYPE_ERC1155,
  MAINNET,
  MAINNET_CODE,
  MATIC,
  MATIC_CODE,
  MUMBAI,
  MUMBAI_CODE,
} from '../utils/enums'
import { get } from '../utils/httpHelpers'

const SUPPORTED_NETWORKS = {
  [MATIC]: MATIC_CODE,
  [MUMBAI]: MUMBAI_CODE,
  [BSC_MAINNET]: BSC_MAINNET_CODE,
  [MAINNET]: MAINNET_CODE,
}
const initStateObject = { allCollectibleContracts: {}, allCollectibles: {}, allTokens: {}, collectibleContracts: [], collectibles: [], tokens: [] }

export default class AssetController {
  constructor(options = {}) {
    this.name = 'AssetsController'
    this.store = new ObservableStore(initStateObject)
    this.network = options.network
    this.assetContractController = options.assetContractController
    this.selectedAddress = options.selectedAddress
    this.getCollectibleMetadata = options.getCollectibleMetadata
    this.initializeNetworkSubscription()
  }

  get state() {
    return this.store.getState()
  }

  initializeNetworkSubscription() {
    this.network.store.subscribe(({ provider }) => {
      const { allCollectibleContracts, allCollectibles, allTokens } = this.state
      const { selectedAddress } = this
      const networkType = provider.type
      this.store.updateState({
        collectibleContracts: (allCollectibleContracts[selectedAddress] && allCollectibleContracts[selectedAddress][networkType]) || [],
        collectibles: (allCollectibles[selectedAddress] && allCollectibles[selectedAddress][networkType]) || [],
        tokens: (allTokens[selectedAddress] && allTokens[selectedAddress][networkType]) || [],
      })
    })
  }

  setSelectedAddress(address) {
    this.selectedAddress = address
    const { allCollectibleContracts, allCollectibles, allTokens } = this.state
    const networkType = this.network.getNetworkNameFromNetworkCode()
    this.store.updateState({
      collectibleContracts: (allCollectibleContracts[address] && allCollectibleContracts[address][networkType]) || [],
      collectibles: (allCollectibles[address] && allCollectibles[address][networkType]) || [],
      tokens: (allTokens[address] && allTokens[address][networkType]) || [],
    })
  }

  getCollectibleApi(contractAddress, tokenId) {
    const networkType = this.network.getNetworkNameFromNetworkCode()
    const chainId = SUPPORTED_NETWORKS[networkType]
    if (chainId) {
      return `https://api.covalenthq.com/v1/${chainId}/tokens/${contractAddress}/nft_metadata/${tokenId}/`
    }
    return ''
  }

  /**
   * Get collectible tokenURI API following ERC721/ERC1155
   *
   * @param contractAddress - ERC721/ERC1155 asset contract address
   * @param tokenId - ERC721/ERC1155 asset identifier
   * @param interfaceStandard - ERC721/ERC1155 standard
   * @returns - Collectible tokenURI
   */
  async getCollectibleTokenURI(contractAddress, tokenId, interfaceStandard) {
    try {
      return this.assetContractController.getCollectibleTokenURI(contractAddress, tokenId, interfaceStandard)
    } catch (error) {
      log.error(error)
    }
    return ''
  }

  /**
   * Request individual collectible information from contracts that follows Metadata Interface
   *
   * @param contractAddress - Hex address of the collectible contract
   * @param tokenId - The collectible identifier
   * @returns - Promise resolving to the current collectible name and image
   */
  async getCollectibleInformationFromTokenURI(contractAddress, tokenId) {
    const interfaceStandard = await this.assetContractController.contractSupportsMetadataInterface(contractAddress)
    /* istanbul ignore if */
    if (!interfaceStandard) {
      return { image: null, name: null, standard: null, description: null }
    }
    const tokenURI = await this.getCollectibleTokenURI(contractAddress, tokenId, interfaceStandard)
    const object = await get(tokenURI)
    const image = Object.prototype.hasOwnProperty.call(object, 'image') ? 'image' : /* istanbul ignore next */ 'image_url'
    const tokenBalance =
      interfaceStandard === CONTRACT_TYPE_ERC721
        ? 1
        : await this.assetContractController.getErc1155Balance(contractAddress, this.selectedAddress, tokenId)
    return { image: object[image], name: object.name, tokenBalance, description: '', standard: interfaceStandard }
  }

  async getCollectibleInfoFromApi(contractAddress, tokenId) {
    const collectibleApi = this.getCollectibleApi(contractAddress, tokenId)
    let collectibleInfo = { name: null, image: null, description: null, tokenBalance: null, standard: null }
    if (!collectibleApi) {
      return collectibleInfo
    }
    const res = await this.getCollectibleMetadata(collectibleApi)
    const contractData = res.data?.data?.items
    if (contractData.length > 0) {
      const { nft_data: nftData } = contractData[0]
      if (nftData.length > 0 && !!nftData[0].external_data) {
        let standard = CONTRACT_TYPE_ERC721
        if (nftData[0].supports_erc.includes(CONTRACT_TYPE_ERC1155)) {
          standard = CONTRACT_TYPE_ERC1155
        }
        const tokenBalance =
          standard === CONTRACT_TYPE_ERC721 ? 1 : await this.assetContractController.getErc1155Balance(contractAddress, this.selectedAddress, tokenId)
        const { name, image, description } = nftData[0].external_data
        collectibleInfo = { name, image, description, tokenBalance, standard }
        return collectibleInfo
      }
    }
    return collectibleInfo
  }

  async getCollectibleInfo(contractAddress, tokenId) {
    let info = await this.getCollectibleInfoFromApi(contractAddress, tokenId)
    if (info.name && info.image) {
      return info
    }
    info = await this.getCollectibleInformationFromTokenURI(contractAddress, tokenId)
    return info
  }

  /**
   * Request collectible contract information from the contract itself
   *
   * @param contractAddress - Hex address of the collectible contract
   * @returns - Promise resolving to the current collectible name and image
   */
  async getCollectibleContractInformationFromContract(contractAddress, standard) {
    const assetsContractController = this.assetContractController
    const name = await assetsContractController.getAssetName(contractAddress, standard)
    const symbol = await assetsContractController.getAssetSymbol(contractAddress, standard)
    return { name, symbol, standard }
  }

  async getCollectibleContractInformationFromApi(contractAddress) {
    // tokenid is required in covalent api, but any random id can be passed
    // it will return correct contract information if contract exist even if
    // token id is incorrect.
    const collectibleContractApi = this.getCollectibleApi(contractAddress, 1)
    const res = await this.getCollectibleMetadata(collectibleContractApi)
    const contractData = res.data?.data?.items
    if (contractData.length > 0) {
      const { contract_name: name, contract_ticker_symbol: symbol, logo_url: image_url } = contractData[0]
      return { name, symbol, image_url }
    }
    return { name: null, symbol: null, image_url: null }
  }

  /**
   * get collectible contract info from blockchain
   *
   * @param contractAddress - Hex address of the collectible contract
   * @returns - Promise resolving to the collectible contract name, image and description
   */
  async getCollectibleContractInformation(contractAddress) {
    try {
      const standard = await this.assetContractController.contractSupportsMetadataInterface(contractAddress)
      let information = await this.getCollectibleContractInformationFromApi(contractAddress)
      if (information.name && information.symbol) {
        return { ...information, standard }
      }
      information = await this.getCollectibleContractInformationFromContract(contractAddress, standard)
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
      let address
      const collectibleOptions = typeof options === 'object' ? options : {}
      if (isAddress(address)) address = toChecksumAddress(address2)
      else address = address2
      const { selectedAddress } = this
      const initState = this.state
      const { allCollectibles, collectibles } = initState
      const networkType = this.network.getNetworkNameFromNetworkCode()
      const existingEntry = collectibles.find((collectible) => collectible.address === address && collectible.tokenId === tokenId)
      if (existingEntry) {
        if (existingEntry.standard === CONTRACT_TYPE_ERC721) {
          return collectibles
        }
        if (collectibleOptions.tokenBalance && existingEntry.tokenBalance !== collectibleOptions.tokenBalance) {
          const newCollectibles = collectibles.map((collectible) => {
            if (collectible.address === address && collectible.tokenId === tokenId) {
              const { tokenBalance } = collectibleOptions
              return { ...collectible, tokenBalance }
            }
            return collectible
          })
          const addressCollectibles = allCollectibles[selectedAddress]
          const newAddressCollectibles = { ...addressCollectibles, ...{ [networkType]: newCollectibles } }
          const newAllCollectibles = { ...allCollectibles, ...{ [selectedAddress]: newAddressCollectibles } }
          this.store.updateState({
            allCollectibles: newAllCollectibles,
            collectibles: newCollectibles,
          })
          return newCollectibles
        }
        return collectibles
      }
      const { name, image, description, standard, tokenBalance } = collectibleOptions
      let newEntry = { address, tokenId, name, image, description, standard, tokenBalance }

      if (!name || !image || !standard) {
        const collectibleInfo = await this.getCollectibleInfo(address, tokenId)
        newEntry = { ...newEntry, ...collectibleInfo }
      }
      if (!newEntry.name || !newEntry.standard || !newEntry.image) {
        return collectibles
      }
      if (!newEntry.tokenBalance) {
        newEntry.tokenBalance =
          standard === CONTRACT_TYPE_ERC721 ? 1 : await this.assetContractController.getErc1155Balance(address, this.selectedAddress, tokenId)
      }
      const newCollectibles = [...collectibles, newEntry]
      const addressCollectibles = allCollectibles[selectedAddress]
      const newAddressCollectibles = { ...addressCollectibles, ...{ [networkType]: newCollectibles } }
      const newAllCollectibles = { ...allCollectibles, ...{ [selectedAddress]: newAddressCollectibles } }
      this.store.updateState({
        allCollectibles: newAllCollectibles,
        collectibles: newCollectibles,
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
   * @param address2 - Hex address of the token contract
   * @param symbol - Symbol of the token
   * @param decimals - Number of decimals the token uses
   * @param image - Image of the token
   * @returns - Current token list
   */
  async addToken(address2, symbol, decimals, image) {
    try {
      let address
      if (isAddress(address)) address = toChecksumAddress(address2)
      else address = address2
      const { selectedAddress } = this
      const { allTokens, tokens } = this.state
      const networkType = this.network.getNetworkNameFromNetworkCode()
      const newEntry = { address, symbol, decimals, image }
      const previousIndex = tokens.findIndex((token) => token.address === address)
      if (previousIndex > -1) {
        tokens[previousIndex] = newEntry
      } else {
        tokens.push(newEntry)
      }
      const addressTokens = allTokens[selectedAddress]
      const newAddressTokens = { ...addressTokens, [networkType]: tokens }
      const newAllTokens = { ...allTokens, [selectedAddress]: newAddressTokens }
      const newTokens = [...tokens]
      this.store.updateState({
        allTokens: newAllTokens,
        tokens: newTokens,
      })
      return newTokens
    } catch (error) {
      log.error(error)
      return {}
    }
  }

  /**
   * Adds a collectible contract to the stored collectible contracts list
   *
   * @param address - Hex address of the collectible contract
   * @param detection? - Whether the collectible is manually added or auto-detected
   * @returns - Promise resolving to the current collectible contracts list
   */
  async addCollectibleContract(address2, detection, options) {
    let address
    if (isAddress(address)) address = toChecksumAddress(address2)
    else address = address2
    const { selectedAddress } = this
    const { allCollectibleContracts, collectibleContracts } = this.state
    const networkType = this.network.getNetworkNameFromNetworkCode()
    const existingEntry = collectibleContracts.find((collectibleContract) => collectibleContract.address === address)
    if (existingEntry) {
      return collectibleContracts
    }
    let contractInformation
    if (options && Object.prototype.hasOwnProperty.call(options, 'contractName')) {
      contractInformation = {
        name: options.contractName,
        symbol: options.contractSymbol,
        image_url: options.contractImage,
        description: options.contractDescription,
        standard: options.standard,
      }
    } else {
      contractInformation = await this.getCollectibleContractInformation(address)
    }
    const interfaceStandard = contractInformation.standard || (await this.assetContractController.contractSupportsMetadataInterface(address))
    const { name, symbol, image_url: imageURL, description } = contractInformation
    // If being auto-detected covalent information is expected
    // Oherwise at least name and symbol from contract is needed
    if ((detection && !imageURL) || Object.keys(contractInformation).length === 0) {
      return collectibleContracts
    }
    const newEntry = {
      standard: interfaceStandard,
      address,
      description: description || options?.contractDescription || '',
      logo: imageURL,
      name,
      symbol,
    }

    const newCollectibleContracts = [...collectibleContracts, newEntry]
    const addressCollectibleContracts = allCollectibleContracts[selectedAddress]
    const newAddressCollectibleContracts = {
      ...addressCollectibleContracts,
      [networkType]: newCollectibleContracts,
    }
    const newAllCollectibleContracts = {
      ...allCollectibleContracts,
      [selectedAddress]: newAddressCollectibleContracts,
    }
    this.store.updateState({
      allCollectibleContracts: newAllCollectibleContracts,
      collectibleContracts: newCollectibleContracts,
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
      let address
      if (isAddress(address)) address = toChecksumAddress(address2)
      else address = address2
      const newCollectibleContracts = await this.addCollectibleContract(address, detection, options)
      // If collectible contract was not added, do not add individual collectible
      const collectibleContract = newCollectibleContracts.find((contract) => contract.address === address)
      const collectibleOptions = { ...options, standard: collectibleContract?.standard }
      // If collectible contract information, add individual collectible
      if (collectibleContract) {
        await this.addIndividualCollectible(address, tokenId, collectibleOptions)
      }
    } catch (error) {
      log.error(error)
    }
  }
}
