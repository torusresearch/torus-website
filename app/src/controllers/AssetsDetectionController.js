/**
 * Assets Detection
 * Controller that passively polls on a set interval for assets auto detection
 */

const assetsController = require('./AssetsController')
const utils = require('../utils/httpHelpers')
const log = require('loglevel')
log.setLevel('ERROR')
const ObservableStore = require('obs-store')
const contractMap = require('eth-contract-metadata')
const ethereumjs_util = require('ethereumjs-util')
const { MAINNET_CODE, RINKEYBY_CODE, ROPSTEN_CODE, KOVAN_CODE, ZERO_ADDRESS, MAINNET, KOVAN, RINKEBY, LOCALHOST } = require('../utils/enums')
const DEFAULT_INTERVAL = 180000

export default class AssetsDetectionController {
  constructor(opts) {
    // log.info('AssetDetectionController: initialised', opts)
    const initState = {
      interval: DEFAULT_INTERVAL,
      network: opts.network,
      selectedAddress: '',
      token: []
    }
    this.assetController = opts.assetController
    this.assetContractController = opts.assetContractController
    this.store = new ObservableStore(initState)
  }

  async poll(address2) {
    this.store.updateState({ selectedAddress: address2 })
    log.info('AssetDetectionController: poll', address2)
    await this.detectAssets()
    setTimeout(() => {
      //log.info('AssetDetectionController: poll: setTimeoutCalled')
      this.poll(this.store.getState().selectedAddress)
    }, 10000)
  }

  getOwnerCollectiblesApi(address) {
    return `https://api.opensea.io/api/v1/assets?owner=${address}&limit=300`
  }

  /**
   * In setter when isUnlocked is updated to true, detectNewTokens and restart polling
   * @type {Object}
   */
  startTokenDetection(selectedAddress) {
    log.info('AssetDetectionController: starting token detection', this.store.getState())
    this.store.updateState({ selectedAddress })
    this.detectAssets()
  }

  async getOwnerCollectibles() {
    const { selectedAddress } = this.store.getState()
    const api = this.getOwnerCollectiblesApi(selectedAddress)
    const assetsController = this.assetController
    let response
    try {
      /* istanbul ignore if */
      if (assetsController.openSeaApiKey) {
        response = await utils.promiseRace(api, { headers: { 'X-API-KEY': assetsController.openSeaApiKey } }, 30000)
      } else {
        response = await utils.promiseRace(api, {}, 30000)
      }
      const collectibles = response.assets
      // log.info('AssetDetectionController: getOwnerCollectibles:', collectibles)
      return collectibles
    } catch (e) {
      /* istanbul ignore next */
      log.error(e)
      return []
    }
  }

  /**
   * Checks whether network is mainnet or not
   *
   * @returns - Whether current network is mainnet
   */
  isMainnet() {
    // log.info('AssetDetectionController: isMainnet called', this.store.getState().network.getNetworkNameFromNetworkCode())
    if (this.store.getState().network.getNetworkNameFromNetworkCode() !== MAINNET || this.disabled) {
      //log.info('AssetDetectionController: false')
      return false
    }
    // log.info('AssetDetectionController: true')
    return true
  }
  /**
   * Detect assets owned by current account on mainnet
   */
  async detectAssets() {
    /* istanbul ignore if */
    if (!this.isMainnet()) {
      return
    }
    this.detectTokens()
    this.detectCollectibles()
  }

  /**
   * Triggers asset ERC20 token auto detection for each contract address in contract metadata on mainnet
   */
  async detectTokens() {
    /* istanbul ignore if */
    if (!this.isMainnet()) {
      return
    }
    const tokensAddresses = this.store.getState().token.filter(/* istanbul ignore next*/ token => token.address)
    const tokensToDetect = []
    for (const address in contractMap) {
      const contract = contractMap[address]
      if (contract.erc20 && !(address in tokensAddresses)) {
        tokensToDetect.push(address)
      }
    }

    // log.info('AssetsDetectionController: detectTokens(): tokensTodetect[]:', tokensToDetect)
    const assetsContractController = this.assetContractController
    const { selectedAddress } = this.store.getState().selectedAddress
    /* istanbul ignore else */
    if (!selectedAddress) {
      return
    }
    try {
      const balances = await assetsContractController.getBalancesInSingleCall(selectedAddress, tokensToDetect)
      const assetsController = this.assetContractController
      const { ignoredTokens } = assetsController.state
      for (const tokenAddress in balances) {
        let ignored
        /* istanbul ignore else */
        if (ignoredTokens.length) {
          ignored = ignoredTokens.find(token => token.address === ethereumjs_util.toChecksumAddress(tokenAddress))
        }
        if (!ignored) {
          await assetsController.addToken(tokenAddress, contractMap[tokenAddress].symbol, contractMap[tokenAddress].decimals)
        }
      }
    } catch (err) {
      log.error(err)
    }
  }

  /**
   * Triggers asset ERC721 token auto detection on mainnet
   * adding new collectibles and removing not owned collectibles
   */
  async detectCollectibles() {
    /* istanbul ignore if */
    if (!this.isMainnet()) {
      return
    }
    const selectedAddress = this.store.getState().selectedAddress
    /* istanbul ignore else */
    if (!selectedAddress) {
      //console.log(selectedAddress)
      return
    }
    var { ignoredCollectibles, collectibles: collectiblesToRemove } = this.assetController.store.getState()
    this.assetController.store.updateState({ selectedAddress: selectedAddress })
    log.info('AssetDetectionController: detectCollectibles: State of AssetController', this.assetController.store.getState())
    const apiCollectibles = await this.getOwnerCollectibles()
    const addCollectiblesPromises = apiCollectibles.map(async collectible => {
      const {
        token_id,
        image_original_url,
        name,
        description,
        asset_contract: { address }
      } = collectible

      let ignored
      /* istanbul ignore else */
      if (ignoredCollectibles.length) {
        ignored = ignoredCollectibles.find(c => {
          /* istanbul ignore next */
          return c.address === ethereumjs_util.toChecksumAddress(address) && c.tokenId === Number(token_id)
        })
      }
      /* istanbul ignore else */
      if (!ignored) {
        await this.assetController.addCollectible(
          address,
          Number(token_id),
          {
            description,
            image: image_original_url,
            name
          },
          true
        )
        // log.info('AssetDetectionController: Collectible added')
      }
      collectiblesToRemove = collectiblesToRemove.filter(c => {
        return !(c.tokenId === Number(token_id) && c.address === ethereumjs_util.toChecksumAddress(address))
      })
    })
    await Promise.all(addCollectiblesPromises)
    // log.info('AssetDetectionController: CollectiblesToRemove', collectiblesToRemove, this.assetController.store.getState())

    collectiblesToRemove.forEach(({ address, tokenId }) => {
      this.assetController.removeCollectible(address, tokenId)
    })
  }
}
