/**
 * Assets Detection
 * Controller that passively polls on a set interval for assets auto detection
 */

import { BrowserProvider } from 'ethers'
import { isEqual } from 'lodash'
import log from 'loglevel'

import NftHandler from '../handlers/Token/NftHandler'
import { MAINNET, MATIC, NFT_SUPPORTED_NETWORKS } from '../utils/enums'
import { idleTimeTracker, isMain } from '../utils/utils'

const DEFAULT_INTERVAL = 60_000
export default class AssetsDetectionController {
  constructor(options) {
    this.interval = options.interval || DEFAULT_INTERVAL
    this.selectedAddress = options.selectedAddress || ''
    this.network = options.network
    this.provider = new BrowserProvider(options.provider, 'any')
    this.assetController = options.assetController
    this.getNfts = options.getNfts
    this.currentNetwork = null
    this.preferencesStore = options.preferencesStore
    this.selectedCustomNfts = []
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
    return this.network.getNetworkIdentifier() === MAINNET
  }

  isMatic() {
    return this.network.getNetworkIdentifier() === MATIC
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
        if (!idleTimeTracker.checkIfIdle()) {
          this.detectAssets()
        }
      }, interval)
  }

  async getCustomNfts(customNfts, forceUpdateStore = false) {
    const collectiblesMap = {}
    const userAddress = this.selectedAddress
    if (userAddress === '') return [[], collectiblesMap]

    this.selectedCustomNfts = customNfts.map((x) => x.nft_address)
    const localNetwork = this.network.getNetworkIdentifier()
    const currentNetworkTokens = customNfts.reduce((acc, x) => {
      if (x.network === localNetwork) acc.push(x)
      return acc
    }, [])
    let nonZeroTokens = await Promise.all(
      currentNetworkTokens.map(async (x) => {
        try {
          const tokenInstance = new NftHandler({
            address: x.nft_address,
            tokenId: x.nft_id,
            userAddress: this.selectedAddress,
            nftStandard: x.nft_contract_standard,
            isSpecial: undefined,
            provider: this.provider,
          })
          const balance = await tokenInstance.fetchNftBalance()
          if (balance === 0) {
            throw new Error('Nft not owned by user anymore')
          }
          let { description, nft_image_link, nft_name } = x
          if (!description || !nft_image_link || !nft_name) {
            const nftMetadata = await tokenInstance.getNftMetadata()
            description = nftMetadata.description
            nft_image_link = nftMetadata.nftImageLink
            nft_name = nftMetadata.nftName
          }
          const collectible = {
            contractAddress: x.nft_address,
            tokenID: x.nft_id.toString(),
            options: {
              contractName: nft_name,
              contractSymbol: nft_name,
              contractImage: nft_image_link,
              contractFallbackLogo: nft_image_link, // fallback is handled by nft handler
              standard: x.nft_contract_standard.toLowerCase(),
              contractDescription: description,
              description,
              image: nft_image_link,
              name: `${nft_name}#${x.nft_id}`,
              tokenBalance: balance,
            },
          }
          const collectibleIndex = `${x.nft_address.toLowerCase()}_${x.nft_id.toString()}`
          collectiblesMap[collectibleIndex] = collectible

          return collectible
        } catch (error) {
          log.warn('Invalid contract address while fetching', error)
          return undefined
        }
      })
    )
    nonZeroTokens = nonZeroTokens.filter(Boolean)
    if (forceUpdateStore) await this.assetController.addCollectibles(nonZeroTokens, false)
    return [nonZeroTokens, collectiblesMap]
  }

  /**
   * Detect assets owned by current account on mainnet
   */
  async detectAssets() {
    // this.detectTokens()
    this.detectCollectibles()
  }

  /**
   * Triggers asset ERC721/ERC1155 token auto detection
   * adding new collectibles and removing not owned collectibles
   */
  async detectCollectibles() {
    /* istanbul ignore if */
    const currentNetwork = this.network.getNetworkIdentifier()
    const userAddress = this.selectedAddress

    let nfts = []
    if (NFT_SUPPORTED_NETWORKS[currentNetwork]) {
      try {
        const response = await this.getNfts(userAddress, currentNetwork)
        nfts = response.data || []
      } catch (error) {
        log.error('error while fetching nfts', error)
      }
    }
    await this.assetController.addCollectibles(nfts, false)
  }

  set preferencesStore(preferencesStore) {
    if (!preferencesStore) {
      return
    }
    if (this._preferencesStore) this._preferencesStore.unsubscribe()

    this._preferencesStore = preferencesStore
    // set default maybe
    preferencesStore.subscribe(async (state) => {
      const { selectedAddress } = state
      if (!selectedAddress) return
      const { customNfts = [] } = state[selectedAddress] || {}
      if (
        !isEqual(
          this.selectedCustomNfts,
          customNfts.map((x) => x.nft_address)
        )
      ) {
        this.getCustomNfts(customNfts, true)
      }
    })
  }
}
