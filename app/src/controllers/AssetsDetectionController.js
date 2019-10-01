/**
 * Assets Detection
 * Controller that passively polls on a set interval for assets auto detection
 */

const assetsController = require('./AssetsController')
const utils = require('../utils/httpHelpers')
const log = require('loglevel')
const ethereumjs_util = require('ethereumjs-util')
const DEFAULT_INTERVAL = 180000

class AssetsDetectionController {
  constructor(opts) {
    this.defaultConfig = {
      interval: DEFAULT_INTERVAL,
      networkType: opts.provider,
      selectedAddress: '',
      tokens: []
    }
  }
  getOwnerCollectiblesApi(address) {
    return `https://api.opensea.io/api/v1/assets?owner=${address}&limit=300`
  }

  async getOwnerCollectibles() {
    const { selectedAddress } = this.config
    const api = this.getOwnerCollectiblesApi(selectedAddress)
    const assetsController = assetsController()
    let response
    try {
      /* istanbul ignore if */
      if (assetsController.openSeaApiKey) {
        response = await utils.promiseRace(api, { headers: { 'X-API-KEY': assetsController.openSeaApiKey } }, 15000)
      } else {
        response = await utils.promiseRace(api, {}, 15000)
      }
      const collectiblesArray = await response.json()
      const collectibles = collectiblesArray.assets
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
    if (this.config.networkType !== MAINNET || this.disabled) {
      return false
    }
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
    const tokensAddresses = this.config.tokens.filter(/* istanbul ignore next*/ token => token.address)
    const tokensToDetect = []
    for (const address in contractMap) {
      const contract = contractMap[address]
      if (contract.erc20 && !(address in tokensAddresses)) {
        tokensToDetect.push(address)
      }
    }

    const assetsContractController = assetsController()
    const { selectedAddress } = this.config
    /* istanbul ignore else */
    if (!selectedAddress) {
      return
    }
    await safelyExecute(async () => {
      const balances = await assetsContractController.getBalancesInSingleCall(selectedAddress, tokensToDetect)
      const assetsController = assetsController()
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
    })
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
    const { selectedAddress } = this.config
    /* istanbul ignore else */
    if (!selectedAddress) {
      return
    }
    const assetsController = assetsController()
    const { ignoredCollectibles } = assetsController.state
    let collectiblesToRemove = assetsController.state.collectibles
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
        await assetsController.addCollectible(
          address,
          Number(token_id),
          {
            description,
            image: image_original_url,
            name
          },
          true
        )
      }
      collectiblesToRemove = collectiblesToRemove.filter(c => {
        return !(c.tokenId === Number(token_id) && c.address === ethereumjs_util.toChecksumAddress(address))
      })
    })
    await Promise.all(addCollectiblesPromises)
    collectiblesToRemove.forEach(({ address, tokenId }) => {
      assetsController.removeCollectible(address, tokenId)
    })
  }
}
