/**
 * Assets Detection
 * Controller that passively polls on a set interval for assets auto detection
 */

const log = require('loglevel')
const utils = require('../utils/httpHelpers')
const config = require('../config').default
// const contractMap = require('eth-contract-metadata')
const { MAINNET } = require('../utils/enums')
const DEFAULT_INTERVAL = 60000

export default class AssetsDetectionController {
  constructor(opts) {
    this.interval = DEFAULT_INTERVAL
    this.selectedAddress = ''
    this.network = opts.network
    this._provider = opts.provider
    this.assetController = opts.assetController
    this.assetContractController = opts.assetContractController
    this.jwtToken = ''
  }

  setJwtToken(jwtToken) {
    this.jwtToken = jwtToken
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

  /**
   * @type {Number}
   */
  set interval(interval) {
    this._handle && clearInterval(this._handle)
    if (!interval) {
      return
    }
    this._handle = setInterval(() => {
      this.detectAssets()
    }, interval)
  }

  getOwnerCollectiblesApi(address) {
    return `https://api.opensea.io/api/v1/assets?owner=${address}&limit=300`
  }

  async getOwnerCollectibles() {
    const selectedAddress = this.selectedAddress
    const api = this.getOwnerCollectiblesApi(selectedAddress)
    let response
    try {
      response = await utils.get(`${config.api}/opensea?url=${api}`, {
        headers: {
          Authorization: `Bearer ${this.jwtToken}`
        }
      })
      const collectibles = response.data.assets
      return collectibles
    } catch (e) {
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
    return this.network.store.getState().provider.type === MAINNET
  }

  /**
   * Detect assets owned by current account on mainnet
   */
  async detectAssets() {
    /* istanbul ignore if */
    if (!this.isMainnet()) {
      return
    }
    // this.detectTokens()
    this.detectCollectibles()
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
    const selectedAddress = this.selectedAddress
    /* istanbul ignore else */
    if (!selectedAddress) {
      return
    }
    log.info('starting asset detection')
    this.assetController.setSelectedAddress(selectedAddress)
    const apiCollectibles = await this.getOwnerCollectibles()
    for (let index = 0; index < apiCollectibles.length; index++) {
      const {
        token_id,
        image_original_url,
        name,
        description,
        asset_contract: {
          address: contractAddress,
          name: contractName,
          symbol: contractSymbol,
          image_url: contractImage,
          total_supply: contractSupply,
          description: contractDescription
        }
      } = apiCollectibles[index]
      await this.assetController.addCollectible(
        contractAddress,
        Number(token_id),
        {
          description,
          image: image_original_url,
          name,
          contractAddress,
          contractName,
          contractSymbol,
          contractImage: contractImage.replace('=s60', '=s180'),
          contractSupply,
          contractDescription
        },
        true
      )
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
