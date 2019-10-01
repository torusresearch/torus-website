/**
 * Asset Controller
 *
 * Controller stores the assets and exposes some convienient methods
 */

const ethereumjs_util = require('ethereumjs-util')
const events = require('events')
const Mutex = require('await-semaphore').Mutex
const random = require('uuid/v1')
const log = require('loglevel')
const ObservableStore = require('obs-store')
const AssetsContractController = require('./AssetsContractController').default
const utils = require('../utils/httpHelpers')

export default class AssetController {
  constructor(opts = {}) {
    const initState = {
      networkType: opts.network,
      selectedAddress: '',
      provider: opts.provider,
      allCollectibleContracts: {},
      allCollectibles: {},
      allTokens: {},
      collectibleContracts: [],
      collectibles: [],
      ignoredCollectibles: [],
      ignoredTokens: [],
      suggestedAssets: [],
      tokens: []
    }
    this.store = new ObservableStore(initState)
    this.hub = new events.EventEmitter()
    this.mutex = new Mutex()
    this.network = opts.network
    this.selectedAddress = opts.selectedAddress
  }
  getCollectibleApi(contractAddress, tokenId) {
    return `https://api.opensea.io/api/v1/asset/${contractAddress}/${tokenId}`
  }
  getCollectibleContractInformationApi(contractAddress) {
    return `https://api.opensea.io/api/v1/asset_contract/${contractAddress}`
  }
  failSuggestedAsset(suggestedAssetMeta, error) {
    suggestedAssetMeta.status = 'failed'
    suggestedAssetMeta.error = {
      message: error.toString(),
      stack: error.stack
    }
    this.hub.emit(`${suggestedAssetMeta.id}:finished`, suggestedAssetMeta)
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
      const assetsContract = AssetsContractController(opts)
      const supportsMetadata = await assetsContract.contractSupportsMetadataInterface(contractAddress)
      /* istanbul ignore if */
      if (!supportsMetadata) {
        return ''
      }
      const tokenURI = await assetsContract.getCollectibleTokenURI(contractAddress, tokenId)
      return tokenURI
    } catch (err) {
      log.error(err)
    }
  }

  /**
   * Request individual collectible information from OpenSea api
   *
   * @param contractAddress - Hex address of the collectible contract
   * @param tokenId - The collectible identifier
   * @returns - Promise resolving to the current collectible name and image
   */
  async getCollectibleInformationFromApi(contractAddress, tokenId) {
    const tokenURI = this.getCollectibleApi(contractAddress, tokenId)
    let collectibleInformation
    /* istanbul ignore if */
    if (this.openSeaApiKey) {
      collectibleInformation = await utils.get(tokenURI, { headers: { 'X-API-KEY': this.openSeaApiKey } })
    } else {
      collectibleInformation = await utils.get(tokenURI)
    }
    const { name, description, image_original_url } = collectibleInformation
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
    const object = await util.get(tokenURI)
    const image = object.hasOwnProperty('image') ? 'image' : /* istanbul ignore next */ 'image_url'
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

      information = await this.getCollectibleInformationFromTokenURI(contractAddress, tokenId)

      if (information) {
        return information
      }

      return {}
    } catch (err) {
      log.error(err)
    }
  }

  /**
   * Request collectible contract information from OpenSea api
   *
   * @param contractAddress - Hex address of the collectible contract
   * @returns - Promise resolving to the current collectible name and image
   */
  async getCollectibleContractInformationFromApi(contractAddress) {
    const api = this.getCollectibleContractInformationApi(contractAddress)
    let collectibleContractObject
    /* istanbul ignore if */
    if (this.openSeaApiKey) {
      collectibleContractObject = await utils.get(api, { headers: { 'X-API-KEY': this.openSeaApiKey } })
    } else {
      collectibleContractObject = await utils.get(api)
    }
    const { name, symbol, image_url, description, total_supply } = collectibleContractObject
    return { name, symbol, image_url, description, total_supply }
  }

  /**
   * Request collectible contract information from the contract itself
   *
   * @param contractAddress - Hex address of the collectible contract
   * @returns - Promise resolving to the current collectible name and image
   */
  async getCollectibleContractInformationFromContract(contractAddress) {
    const assetsContractController = new AssetsContractController()
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
      log.error('getCollectibleContractInformation ', err)
    }
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
  async addIndividualCollectible(address, tokenId, opts) {
    try {
      const releaseLock = await this.mutex.acquire()
      const address2 = ethereumjs_util.toChecksumAddress(address)
      const { allCollectibles, collectibles, selectedAddress } = this.store.getState()
      const networkType = this.network
      const existingEntry = collectibles.find(collectible => collectible.address === address2 && collectible.tokenId === tokenId)
      if (existingEntry) {
        releaseLock()
        return collectibles
      }
      const { name, image, description } = opts ? opts : await this.getCollectibleInformation(address2, tokenId)
      const newEntry = { address2, tokenId, name, image, description }
      const newCollectibles = [...collectibles, newEntry]
      const addressCollectibles = allCollectibles[selectedAddress]
      const newAddressCollectibles = { ...addressCollectibles, ...{ [networkType]: newCollectibles } }
      const newAllCollectibles = { ...allCollectibles, ...{ [selectedAddress]: newAddressCollectibles } }
      this.store.updateState({ allCollectibles: newAllCollectibles, collectibles: newCollectibles })
      releaseLock()
      return newCollectibles
    } catch (err) {
      log.error(err)
    }
  }

  /**
   * Removes an individual collectible from the stored token list and saves it in ignored collectibles list
   *
   * @param address - Hex address of the collectible contract
   * @param tokenId - Token identifier of the collectible
   */
  removeAndIgnoreIndividualCollectible(address2, tokenId) {
    address = ethereumjs_util.toChecksumAddress(address2)
    const { allCollectibles, collectibles, ignoredCollectibles } = this.store.getState()
    const { networkType, selectedAddress } = this.config
    const newIgnoredCollectibles = [...ignoredCollectibles]
    const newCollectibles = collectibles.filter(collectible => {
      if (collectible.address === address && collectible.tokenId === tokenId) {
        const alreadyIgnored = newIgnoredCollectibles.find(c => c.address === address && c.tokenId === tokenId)
        !alreadyIgnored && newIgnoredCollectibles.push(collectible)
        return false
      }
      return true
    })
    const addressCollectibles = allCollectibles[selectedAddress]
    const newAddressCollectibles = Object.assign({}, addressCollectibles, { [networkType]: newCollectibles })
    const newAllCollectibles = Object.assign({}, allCollectibles, { [selectedAddress]: newAddressCollectibles })
    this.update({
      allCollectibles: newAllCollectibles,
      collectibles: newCollectibles,
      ignoredCollectibles: newIgnoredCollectibles
    })
  }

  /**
   * Removes an individual collectible from the stored token list
   *
   * @param address - Hex address of the collectible contract
   * @param tokenId - Token identifier of the collectible
   */
  removeIndividualCollectible(address2, tokenId) {
    address = ethereumjs_util.toChecksumAddress(address2)
    const { allCollectibles, collectibles } = this.store.getState()
    const { networkType, selectedAddress } = this.config
    const newCollectibles = collectibles.filter(collectible => !(collectible.address === address && collectible.tokenId === tokenId))
    const addressCollectibles = allCollectibles[selectedAddress]
    const newAddressCollectibles = Object.assign({}, addressCollectibles, { [networkType]: newCollectibles })
    const newAllCollectibles = Object.assign({}, allCollectibles, { [selectedAddress]: newAddressCollectibles })
    this.update({ allCollectibles: newAllCollectibles, collectibles: newCollectibles })
  }

  /**
   * Removes a collectible contract to the stored collectible contracts list
   *
   * @param address - Hex address of the collectible contract
   * @returns - Promise resolving to the current collectible contracts list
   */
  removeCollectibleContract(address2) {
    address = ethereumjs_util.toChecksumAddress(address2)
    const { allCollectibleContracts, collectibleContracts } = this.store.getState()
    const { networkType, selectedAddress } = this.config
    const newCollectibleContracts = collectibleContracts.filter(collectibleContract => !(collectibleContract.address === address))
    const addressCollectibleContracts = allCollectibleContracts[selectedAddress]
    const newAddressCollectibleContracts = Object.assign({}, addressCollectibleContracts, { [networkType]: newCollectibleContracts })
    const newAllCollectibleContracts = Object.assign({}, allCollectibleContracts, { [selectedAddress]: newAddressCollectibleContracts })
    this.update({
      allCollectibleContracts: newAllCollectibleContracts,
      collectibleContracts: newCollectibleContracts
    })
    return newCollectibleContracts
  }

  setApiKey(openSeaApiKey) {
    this.openSeaApiKey = openSeaApiKey
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
      const releaseLock = await this.mutex.acquire()
      address = toChecksumAddress(address2)
      const { allTokens, tokens } = this.store.getState()
      const { networkType, selectedAddress } = this.config
      const newEntry = { address, symbol, decimals, image }
      const previousEntry = tokens.find(token => token.address === address)
      if (previousEntry) {
        const previousIndex = tokens.indexOf(previousEntry)
        tokens[previousIndex] = newEntry
      } else {
        tokens.push(newEntry)
      }
      const addressTokens = allTokens[selectedAddress]
      const newAddressTokens = Object.assign({}, addressTokens, { [networkType]: tokens })
      const newAllTokens = Object.assign({}, allTokens, { [selectedAddress]: newAddressTokens })
      const newTokens = [...tokens]
      this.update({ allTokens: newAllTokens, tokens: newTokens })
      releaseLock()
      return newTokens
    } catch (error) {
      log.error(err)
    }
  }

  /**
   * Validates a ERC20 token to be added with EIP747.
   *
   * @param token - Token object to validate
   */
  validateTokenToWatch(token) {
    const { address, symbol, decimals } = token
    if (!address || !symbol || typeof decimals === 'undefined') {
      throw new Error('Cannot suggest token without address, symbol, and decimals')
    }
    if (!(symbol.length < 7)) {
      throw new Error(`Invalid symbol ${symbol} more than six characters`)
    }
    if (isNaN(decimals) || decimals > 36 || decimals < 0) {
      throw new Error(`Invalid decimals ${decimals} must be at least 0, and not over 36`)
    }
    if (!isValidAddress(address)) {
      throw new Error(`Invalid address ${address}`)
    }
  }

  /**
   * Adds a new suggestedAsset to state. Parameters will be validated according to
   * asset type being watched. A `<suggestedAssetMeta.id>:pending` hub event will be emitted once added.
   *
   * @param asset - Asset to be watched. For now only ERC20 tokens are accepted.
   * @param type - Asset type
   * @returns - Object containing a promise resolving to the suggestedAsset address if accepted
   */
  watchAsset(asset, type) {
    try {
      const suggestedAssetMeta = {
        asset,
        id: random(),
        status: 'pending',
        time: Date.now(),
        type
      }
      try {
        switch (type) {
          case 'ERC20':
            this.validateTokenToWatch(asset)
            break
          default:
            throw new Error(`Asset of type ${type} not supported`)
        }
      } catch (error) {
        this.failSuggestedAsset(suggestedAssetMeta, error)
        return Promise.reject(error)
      }
      const result = new Promise((resolve, reject) => {
        this.hub.once(`${suggestedAssetMeta.id}:finished`, meta => {
          switch (meta.status) {
            case 'accepted':
              return resolve(meta.asset.address)
            case 'rejected':
              return reject(new Error('User rejected to watch the asset.'))
            case 'failed':
              return reject(new Error(meta.error.message))
          }
        })
      })
      const { suggestedAssets } = this.store.getState()
      suggestedAssets.push(suggestedAssetMeta)
      this.update({ suggestedAssets: [...suggestedAssets] })
      this.hub.emit('pendingSuggestedAsset', suggestedAssetMeta)
      return { result, suggestedAssetMeta }
    } catch (error) {
      log.error(err)
    }
  }

  /**
   * Accepts to watch an asset and updates it's status and deletes the suggestedAsset from state,
   * adding the asset to corresponding asset state. In this case ERC20 tokens.
   * A `<suggestedAssetMeta.id>:finished` hub event is fired after accepted or failure.
   *
   * @param suggestedAssetID - ID of the suggestedAsset to accept
   * @returns - Promise resolving when this operation completes
   */
  async acceptWatchAsset(suggestedAssetID) {
    const { suggestedAssets } = this.store.getState()
    const index = suggestedAssets.findIndex(({ id }) => suggestedAssetID === id)
    const suggestedAssetMeta = suggestedAssets[index]
    try {
      switch (suggestedAssetMeta.type) {
        case 'ERC20':
          const { address, symbol, decimals, image } = suggestedAssetMeta.asset
          await this.addToken(address, symbol, decimals, image)
          suggestedAssetMeta.status = 'accepted'
          this.hub.emit(`${suggestedAssetMeta.id}:finished`, suggestedAssetMeta)
          break
        default:
          throw new Error(`Asset of type ${suggestedAssetMeta.type} not supported`)
      }
    } catch (error) {
      this.failSuggestedAsset(suggestedAssetMeta, error)
    }
    const newSuggestedAssets = suggestedAssets.filter(({ id }) => id !== suggestedAssetID)
    this.update({ suggestedAssets: [...newSuggestedAssets] })
  }

  /**
   * Rejects a watchAsset request based on its ID by setting its status to "rejected"
   * and emitting a `<suggestedAssetMeta.id>:finished` hub event.
   *
   * @param suggestedAssetID - ID of the suggestedAsset to accept
   */
  rejectWatchAsset(suggestedAssetID) {
    const { suggestedAssets } = this.store.getState()
    const index = suggestedAssets.findIndex(({ id }) => suggestedAssetID === id)
    const suggestedAssetMeta = suggestedAssets[index]
    if (!suggestedAssetMeta) {
      return
    }
    suggestedAssetMeta.status = 'rejected'
    this.hub.emit(`${suggestedAssetMeta.id}:finished`, suggestedAssetMeta)
    const newSuggestedAssets = suggestedAssets.filter(({ id }) => id !== suggestedAssetID)
    this.update({ suggestedAssets: [...newSuggestedAssets] })
  }

  /**
   * Adds a collectible contract to the stored collectible contracts list
   *
   * @param address - Hex address of the collectible contract
   * @param detection? - Whether the collectible is manually added or auto-detected
   * @returns - Promise resolving to the current collectible contracts list
   */
  async addCollectibleContract(address2, detection) {
    const releaseLock = await this.mutex.acquire()
    const address = ethereumjs_util.toChecksumAddress(address2)
    const { allCollectibleContracts, collectibleContracts, networkType, selectedAddress } = this.store.getState()
    const existingEntry = collectibleContracts.find(collectibleContract => collectibleContract.address === address)
    if (existingEntry) {
      releaseLock()
      return collectibleContracts
    }
    const contractInformation = await this.getCollectibleContractInformation(address)
    const { name, symbol, image_url, description, total_supply } = contractInformation
    // If being auto-detected opensea information is expected
    // Oherwise at least name and symbol from contract is needed
    if ((detection && !image_url) || Object.keys(contractInformation).length === 0) {
      releaseLock()
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
      ...{ [networkType]: newCollectibleContracts }
    }
    const newAllCollectibleContracts = {
      ...allCollectibleContracts,
      ...{ [selectedAddress]: newAddressCollectibleContracts }
    }
    this.store.updateState({
      allCollectibleContracts: newAllCollectibleContracts,
      collectibleContracts: newCollectibleContracts
    })
    releaseLock()
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
  async addCollectible(address2, tokenId, opts, detection) {
    try {
      const address = ethereumjs_util.toChecksumAddress(address2)
      const newCollectibleContracts = await this.addCollectibleContract(address, detection)
      log.info('AssetController: addCollectible(): newCollectionContracts are', newCollectibleContracts)

      // If collectible contract was not added, do not add individual collectible
      const collectibleContract = newCollectibleContracts.find(contract => contract.address === address)

      // If collectible contract information, add individual collectible
      if (collectibleContract) {
        await this.addIndividualCollectible(address, tokenId, opts)
      }
    } catch (error) {
      log.error(error)
    }
  }

  /**
   * Removes a token from the stored token list and saves it in ignored tokens list
   *
   * @param address2 - Hex address of the token contract
   */
  removeAndIgnoreToken(address2) {
    address = ethereumjs_util.toChecksumAddress(address2)
    const { allTokens, tokens, ignoredTokens } = this.store.getState()
    const { networkType, selectedAddress } = this.config
    const newIgnoredTokens = [...ignoredTokens]
    const newTokens = tokens.filter(token => {
      if (token.address === address) {
        const alreadyIgnored = newIgnoredTokens.find(t => t.address === address)
        !alreadyIgnored && newIgnoredTokens.push(token)
        return false
      }
      return true
    })
    const addressTokens = allTokens[selectedAddress]
    const newAddressTokens = Object.assign({}, addressTokens, { [networkType]: newTokens })
    const newAllTokens = Object.assign({}, allTokens, { [selectedAddress]: newAddressTokens })
    this.update({ allTokens: newAllTokens, tokens: newTokens, ignoredTokens: newIgnoredTokens })
  }

  /**
   * Removes a token from the stored token list
   *
   * @param address2 - Hex address of the token contract
   */
  removeToken(address2) {
    address = ethereumjs_util.toChecksumAddress(address2)
    const { allTokens, tokens } = this.store.getState()
    const { networkType, selectedAddress } = this.config
    const newTokens = tokens.filter(token => token.address !== address)
    const addressTokens = allTokens[selectedAddress]
    const newAddressTokens = Object.assign({}, addressTokens, { [networkType]: newTokens })
    const newAllTokens = Object.assign({}, allTokens, { [selectedAddress]: newAddressTokens })
    this.update({ allTokens: newAllTokens, tokens: newTokens })
  }

  /**
   * Removes a collectible from the stored token list
   *
   * @param address2 - Hex address of the collectible contract
   * @param tokenId - Token identifier of the collectible
   */
  removeCollectible(address2, tokenId) {
    address = ethereumjs_util.toChecksumAddress(address2)
    this.removeIndividualCollectible(address, tokenId)
    const { collectibles } = this.store.getState()
    const remainingCollectible = collectibles.find(collectible => collectible.address === address)
    if (!remainingCollectible) {
      this.removeCollectibleContract(address)
    }
  }

  /**
   * Removes a collectible from the stored token list and saves it in ignored collectibles list
   *
   * @param address2 - Hex address of the collectible contract
   * @param tokenId - Token identifier of the collectible
   */
  removeAndIgnoreCollectible(address2, tokenId) {
    address = ethereumjs_util.toChecksumAddress(address2)
    this.removeAndIgnoreIndividualCollectible(address, tokenId)
    const { collectibles } = this.store.getState()
    const remainingCollectible = collectibles.find(collectible => collectible.address === address)
    if (!remainingCollectible) {
      this.removeCollectibleContract(address)
    }
  }

  /**
   * Extension point called if and when this controller is composed
   * with other controllers using a ComposableController
   *
   * CURRENTLY USELESS BECAUSE THIS CLASS DOESN'T HAVE ANY SUPER
   */
  onComposed() {
    super.onComposed()
    const preferences = this.context.PreferencesController
    const network = this.context.NetworkController
    preferences.subscribe(({ selectedAddress }) => {
      const { allCollectibleContracts, allCollectibles, allTokens } = this.store.getState()
      const { networkType } = this.config
      this.configure({ selectedAddress })
      this.update({
        collectibleContracts: (allCollectibleContracts[selectedAddress] && allCollectibleContracts[selectedAddress][networkType]) || [],
        collectibles: (allCollectibles[selectedAddress] && allCollectibles[selectedAddress][networkType]) || [],
        tokens: (allTokens[selectedAddress] && allTokens[selectedAddress][networkType]) || []
      })
    })
    network.subscribe(({ provider }) => {
      const { allCollectibleContracts, allCollectibles, allTokens } = this.store.getState()
      const { selectedAddress } = this.config
      const networkType = provider.type
      this.configure({ networkType })
      this.update({
        collectibleContracts: (allCollectibleContracts[selectedAddress] && allCollectibleContracts[selectedAddress][networkType]) || [],
        collectibles: (allCollectibles[selectedAddress] && allCollectibles[selectedAddress][networkType]) || [],
        tokens: (allTokens[selectedAddress] && allTokens[selectedAddress][networkType]) || []
      })
    })
  }
}
