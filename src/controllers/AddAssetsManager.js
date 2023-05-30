import { ObservableStore } from '@metamask/obs-store'
import { ethErrors } from 'eth-rpc-errors'
import { JsonRpcProvider } from 'ethers'
import EventEmitter from 'events'
import log from 'loglevel'
import Web3 from 'web3'

import NftHandler from '../handlers/Token/NftHandler'
import TokenHandler from '../handlers/Token/TokenHandler'
import { CONTRACT_TYPE_ERC20, CONTRACT_TYPE_ERC721, CONTRACT_TYPE_ERC1155, MESSAGE_TYPE } from '../utils/enums'
import { getEtherScanAddressLink, validateContractAddress } from '../utils/utils'

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
    this.ethersProvider = new JsonRpcProvider(network.getCurrentNetworkUrl())
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
    const normalizedAssetParams = await this.normalizeWatchAssetParams(id, assetParameters, providerConfig, this.web3, this.ethersProvider)
    return new Promise((resolve, reject) => {
      this.addUnapprovedAsset(normalizedAssetParams, request, id)
      this.emit('newUnapprovedAsset', normalizedAssetParams, request)
      // await finished
      this.once(`${id}:finished`, (data) => {
        const asset = this.getAsset(id)
        switch (data.status) {
          case 'approved':
            return resolve()
          case 'rejected':
            return reject(ethErrors.provider.userRejectedRequest(`Torus Watch Asset: ${asset.errorMsg || 'User denied watch asset request.'}`))
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
    try {
      const assetData = this.getAsset(assetId)
      const { options, metadata, type } = assetData.assetParams
      if (type.toLowerCase() === CONTRACT_TYPE_ERC20) {
        const { address, symbol, decimals } = options
        const { network, name } = metadata
        await this.prefsController.addCustomToken(
          {
            token_address: address,
            network,
            token_symbol: symbol,
            token_name: name || symbol,
            decimals,
          },
          true
        )
      } else {
        const { address, id } = options
        const { network, nftName } = metadata
        await this.prefsController.addCustomNft(
          {
            nft_address: address,
            network,
            nft_name: nftName,
            nft_id: id,
            nft_contract_standard: type,
          },
          true
        )
      }
      this.setAssetStatusApproved(assetId)
    } catch (error) {
      log.error('error while approving asset watch', error)
      this.rejectAsset(assetId, error?.message || 'Something went wrong while watching asset')
      throw error
    }
  }

  rejectAsset(assetId, errorMsg = '') {
    this._setAssetStatus(assetId, 'rejected', errorMsg)
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

  _setAssetStatus(assetId, status, errorMsg = '') {
    const asset = this.getAsset(assetId)
    if (!asset) {
      throw new Error(`AddAssetsManager - Asset not found for id: "${assetId}".`)
    }
    asset.status = status
    if (errorMsg) {
      asset.errorMsg = errorMsg
    }
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
    // log.debug('asset params', assetParams)
    const supported_asset_types = [CONTRACT_TYPE_ERC20, CONTRACT_TYPE_ERC721, CONTRACT_TYPE_ERC1155]
    const nft_contract_standard = [CONTRACT_TYPE_ERC721, CONTRACT_TYPE_ERC1155]

    if (!supported_asset_types.includes(assetParams.type.toLowerCase())) {
      throw ethErrors.rpc.invalidParams('Invalid watch asset params: only erc20/erc721/erc1155 asset types are supported.')
    }
    const { address, id } = assetParams.options || {}
    if (!address) throw ethErrors.rpc.invalidParams('Invalid watch asset params: asset address is required.')
    if (nft_contract_standard.includes(assetParams.type.toLowerCase()) && !id) {
      throw ethErrors.rpc.invalidParams('Invalid watch asset params: asset id is required.')
    }
    const chainId = await web3.eth.getChainId()
    const isValidAddress = await validateContractAddress(web3, address, chainId)
    if (!isValidAddress) throw ethErrors.rpc.invalidParams(`Invalid watch asset params: Invalid asset address ${address}`)
  }

  async normalizeWatchAssetParams(assetId, assetParams, providerConfig, web3, ethersProvider) {
    const nft_contract_standard = [CONTRACT_TYPE_ERC721, CONTRACT_TYPE_ERC1155]
    let finalParams = {}
    if (assetParams.type.toLowerCase() === CONTRACT_TYPE_ERC20) {
      const userAddress = this.prefsController.store.getState().selectedAddress
      const { address, decimals, symbol, balance } = assetParams.options || {}
      if (!address) throw ethErrors.rpc.invalidParams('Invalid watch asset params: asset address is required.')
      const tokenHandler = new TokenHandler({ address: address.toLowerCase(), ethersProvider })
      const options = assetParams.options || {}
      if (!decimals) options.decimals = await tokenHandler.getDecimals()
      if (!symbol) options.symbol = await tokenHandler.getSymbol()
      if (!balance) options.balance = await tokenHandler.getUserBalance(userAddress)
      const name = await tokenHandler.getName()
      const metadata = {
        network: providerConfig.host,
        name,
      }
      finalParams = {
        id: assetId,
        ...assetParams,
        options: {
          ...assetParams.options,
          ...options,
        },
        metadata,
      }
      // return finalParams
    }
    if (nft_contract_standard.includes(assetParams.type.toLowerCase())) {
      const { address, id, balance } = assetParams.options || {}
      const userAddress = this.prefsController.store.getState().selectedAddress
      if (!address) throw ethErrors.rpc.invalidParams('Invalid watch asset params: asset address is required.')
      const explorerLink = getEtherScanAddressLink(address, providerConfig.host)
      const nftHandler = new NftHandler({ userAddress, tokenId: id, address: address.toLowerCase(), web3, prefController: this.prefsController })

      const nftData = await Promise.any([nftHandler.getNftMetadataFromApi(), nftHandler.getNftMetadata()])
      const options = assetParams.options || {}
      if (!balance) options.balance = await nftHandler.fetchNftBalance()
      options.name = nftData.nftName
      options.image = nftData.nftImageLink
      options.description = nftData.description
      const metadata = { name: options.name, network: providerConfig.host }
      finalParams = {
        id: assetId,
        ...assetParams,
        options: {
          ...assetParams.options,
          ...options,
          explorerLink,
        },
        metadata,
      }
    }
    return finalParams
  }
}
