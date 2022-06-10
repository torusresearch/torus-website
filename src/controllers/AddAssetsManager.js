import { ObservableStore } from '@metamask/obs-store'
import { ethErrors } from 'eth-rpc-errors'
import EventEmitter from 'events'
import log from 'loglevel'
import Web3 from 'web3'

import TokenHandler from '../handlers/Token/TokenHandler'
import { MESSAGE_TYPE } from '../utils/enums'
import { validateContractAddress } from '../utils/utils'

export default class WatchAssetManager extends EventEmitter {
  /**
   * Controller in charge of managing - storing, adding, removing, updating - Asset.
   *
   * @typedef {Object} WatchAssetManager
   * @property {Object} store The observable store where Assets are saved with persistance.
   * @property {Object} store.unApprovedAssets A collection of all assets in the 'unapproved' state
   * @property {number} store.unApprovedAssetsCount The count of all unApprovedAssets in this.store.unApprovedAssets
   * @property {array} assets Holds all assets that have been created by this WatchAssetManager
   *
   */
  constructor(options = {}) {
    super()
    const { network, provider, prefsController } = options

    this.network = network
    this.web3 = new Web3(provider)
    this.prefsController = prefsController

    this.store = new ObservableStore({
      unApprovedAssets: {},
      unApprovedAssetsCount: 0,
    })
    this.assets = []
  }

  /**
   * A getter for the number of 'unapproved' assets in this.assets
   *
   * @returns {number} The number of 'unapproved' assets in this.assets
   *
   */
  get unApprovedAssetsCount() {
    return Object.keys(this.getUnapprovedAssets()).length
  }

  getUnapprovedAssets() {
    return this.assets
      .filter((asset) => asset.status === 'unapproved')
      .reduce((result, asset) => {
        result[asset.id] = asset
        return result
      }, {})
  }

  async addUnapprovedAssetAsync(assetParameters, request, id) {
    await this.validateWatchAssetParams(assetParameters, this.web3)
    const providerConfig = await this.network.getProviderConfig()
    const normalizedAssetParams = await this.normalizeWatchAssetParams(id, assetParameters, providerConfig, this.web3)
    return new Promise((resolve, reject) => {
      this.addUnapprovedAsset(normalizedAssetParams, request, id)
      this.emit('newUnapprovedAsset', normalizedAssetParams, request)
      // await finished
      this.once(`${id}:finished`, (data) => {
        switch (data.status) {
          case 'approved':
            return resolve()
          case 'rejected':
            return reject(ethErrors.provider.userRejectedRequest('Torus Watch Asset: User denied watch asset request.'))
          default:
            return reject(new Error(`Torus Watch Asset: Unknown problem: ${JSON.stringify(normalizedAssetParams)}`))
        }
      })
    })
  }

  addUnapprovedAsset(assetParameters, request, id) {
    // add origin from request
    if (request) assetParameters.origin = request.origin
    const time = Date.now()
    const assetData = {
      id,
      assetParams: assetParameters,
      time,
      status: 'unapproved',
      type: MESSAGE_TYPE.WATCH_ASSET,
    }

    this.addAsset(assetData)

    // signal update
    this.emit('update')
    return id
  }

  async approveAsset(assetId) {
    const assetData = this.getAsset(assetId)
    const { options, metadata } = assetData.assetParams
    const { address, symbol, decimals } = options
    const { network, name } = metadata
    await this.prefsController.addCustomToken({
      token_address: address,
      network,
      token_symbol: symbol,
      token_name: name || symbol,
      decimals,
    })
    this.setAssetStatusApproved(assetId)
  }

  rejectAsset(assetId) {
    this._setAssetStatus(assetId, 'rejected')
  }

  addAsset(asset) {
    this.assets.push(asset)
    this._saveAssetList()
  }

  getAsset(assetId) {
    return this.assets.find((asset) => asset.id === assetId)
  }

  setAssetStatusApproved(assetId) {
    this._setAssetStatus(assetId, 'approved')
  }

  _setAssetStatus(assetId, status) {
    const asset = this.getAsset(assetId)
    if (!asset) {
      throw new Error(`AddAssetsManager - Asset not found for id: "${assetId}".`)
    }
    asset.status = status
    this._updateAsset(asset)
    this.emit(`${assetId}:${status}`, asset)
    if (status === 'rejected' || status === 'approved' || status === 'errored') {
      this.emit(`${assetId}:finished`, asset)
    }
  }

  _updateAsset(existingAsset) {
    const index = this.assets.findIndex((asset) => existingAsset.id === asset.id)
    if (index !== -1) {
      this.assets[index] = existingAsset
    }
    this._saveAssetList()
  }

  _saveAssetList() {
    const unApprovedAssets = this.getUnapprovedAssets()
    const unApprovedAssetsCount = Object.keys(unApprovedAssets).length
    this.store.updateState({ unApprovedAssets, unApprovedAssetsCount })
  }

  async validateWatchAssetParams(assetParams, web3) {
    log.debug('asset params', assetParams)
    if (assetParams.type.toLowerCase() !== 'erc20') {
      throw ethErrors.rpc.invalidParams('Invalid watch asset params: only erc20 asset type is supported.')
    }
    const { address } = assetParams.options || {}
    if (!address) throw ethErrors.rpc.invalidParams('Invalid watch asset params: asset address is required.')
    const chainId = await web3.eth.getChainId()
    const isValidAddress = await validateContractAddress(web3, address, chainId)
    if (!isValidAddress) throw ethErrors.rpc.invalidParams(`Invalid watch asset params: Invalid asset address ${address}`)
  }

  async normalizeWatchAssetParams(assetId, assetParams, providerConfig, web3) {
    const { address, decimals, symbol } = assetParams.options || {}
    if (!address) throw ethErrors.rpc.invalidParams('Invalid watch asset params: asset address is required.')
    const tokenHandler = new TokenHandler({ address: address.toLowerCase(), web3 })
    const options = assetParams.options || {}
    if (!decimals) options.decimals = await tokenHandler.getDecimals()
    if (!symbol) options.symbol = await tokenHandler.getSymbol()
    const name = await tokenHandler.getName()
    const metadata = {
      network: providerConfig.host,
      name,
    }
    const finalParams = {
      id: assetId,
      ...assetParams,
      options: {
        ...assetParams.options,
        ...options,
      },
      metadata,
    }
    return finalParams
  }
}
