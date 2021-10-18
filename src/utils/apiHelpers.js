import log from 'loglevel'

import config from '../config'
import { COVALENT_SUPPORTED_CHAIN_IDS, MAINNET_CODE } from './enums'
import { get, patch, post, promiseRace, remove } from './httpHelpers'

export default class ApiHelpers {
  constructor(getDispatch) {
    this.getDispatch = getDispatch
    this.get = this._wrap(get)
    this.patch = this._wrap(patch)
    this.post = this._wrap(post)
    this.remove = this._wrap(remove)
    this.getWithTimeout = this._wrap(promiseRace)
  }

  _wrap(fn) {
    return async (...args) => {
      try {
        const result = await fn(...args)
        return result
      } catch (error) {
        if (error.status === 401) {
          const body = await error.json()
          if (body.error === 'Token expired') {
            log.warn('Token expired')
            await this.logOut()
          }
        }
        throw error
      }
    }
  }

  async getWalletOrders(parameters = {}, headers) {
    const options = {
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...headers,
      },
    }
    const url = new URL(`${config.api}/transaction`)
    Object.keys(parameters).forEach((key) => url.searchParams.append(key, parameters[key]))
    return this.get(url.href, options)
  }

  async getPastOrders(parameters = {}, headers) {
    const options = {
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...headers,
      },
    }
    const url = new URL(`${config.commonApiHost}/transaction`)
    Object.keys(parameters).forEach((key) => url.searchParams.append(key, parameters[key]))
    return this.get(url.href, options)
  }

  async getEtherscanTransactions(parameters = {}, headers) {
    const options = {
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...headers,
      },
    }
    const url = new URL(`${config.api}/etherscan`)
    Object.keys(parameters).forEach((key) => url.searchParams.append(key, parameters[key]))
    return this.get(url.href, options, { useAPIKey: true })
  }

  async getAssetData(parameters = {}, headers, timeout = 0) {
    const { chainId, contract, tokenId } = parameters
    if (!contract || !chainId || !tokenId) {
      throw new Error('Invalid params received while fetching asset data')
    }
    const options = {
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...headers,
      },
    }
    let res = {}
    // for mainnet use opensea.
    if (chainId === MAINNET_CODE) {
      const queryApi = `https://api.opensea.io/api/v1/asset/${contract}/${tokenId}`
      const url = new URL(`${config.api}/opensea`)
      url.searchParams.append('url', queryApi)
      if (timeout > 0) {
        res = await this.getWithTimeout(url.href, options, timeout)
      } else {
        res = await this.get(url.href, options)
      }
      return {
        symbol: res.data?.asset_contract?.symbol,
        logo: res.data?.image_url,
        name: res.data?.name,
        description: res.data?.name,
      }
    }
    if (!COVALENT_SUPPORTED_CHAIN_IDS[chainId]) {
      throw new Error('Nft metadata not found')
    }
    // for all other covalent supported chains except mainnnet.
    const queryApi = `${config.api}/covalent?url=https://api.covalenthq.com/v1/${chainId}/tokens/${contract}/nft_metadata/${tokenId}/`
    if (timeout > 0) {
      res = await this.getWithTimeout(queryApi, options, timeout)
    } else {
      res = await this.get(queryApi, options)
    }
    const contractData = res.data?.data?.items || []
    if (contractData.length > 0) {
      const { nft_data: nftData, contract_ticker_symbol: symbol } = contractData[0]
      if (nftData.length > 0 && !!nftData[0].external_data) {
        const { name, image, description } = nftData[0].external_data
        return {
          name,
          logo: image,
          symbol: symbol || name,
          description,
        }
      }
    }
    throw new Error('Nft metadata not found')
  }

  async getAssetContractData(parameters = {}, headers, timeout = 0) {
    const { chainId, contract } = parameters
    if (!contract || !chainId) {
      throw new Error('Invalid params received while fetching asset data')
    }
    const options = {
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...headers,
      },
    }
    let res = {}
    // for mainnet use opensea.
    if (chainId === MAINNET_CODE) {
      const queryApi = `https://api.opensea.io/api/v1/asset_contract/${contract}`
      const url = new URL(`${config.api}/opensea`)
      url.searchParams.append('url', queryApi)
      if (timeout > 0) {
        res = await this.getWithTimeout(url.href, options, timeout)
      } else {
        res = await this.get(url.href, options)
      }
      return {
        symbol: res.data?.symbol,
        logo: res.data?.image_url,
        name: res.data?.name,
        description: res.data?.name,
        schema_name: res.data?.schema_name?.toLowerCase(),
      }
    }
    if (!COVALENT_SUPPORTED_CHAIN_IDS[chainId]) {
      throw new Error('Nft contract data not found')
    }
    // covalent api requires tokenId to be sent.
    // since we need only contract data which will be same for all nfts of that contract,
    // so here tring to fetch using first potential nft token id.
    const tokenId = 1
    // for all other covalent supported chains except mainnnet.
    const queryApi = `${config.api}/covalent?url=https://api.covalenthq.com/v1/${chainId}/tokens/${contract}/nft_metadata/${tokenId}/`
    if (timeout > 0) {
      res = await this.getWithTimeout(queryApi, options, timeout)
    } else {
      res = await this.get(queryApi, options)
    }
    const contractData = res.data?.data?.items || []
    if (contractData.length > 0) {
      const { contract_ticker_symbol: symbol, contract_name: name, logo_url: logo, supports_erc } = contractData[0]
      let schema_name = 'erc721'
      if (supports_erc.includes('erc1155')) {
        schema_name = 'erc1155'
      }
      return {
        name,
        logo,
        symbol: symbol || name,
        description: '',
        schema_name,
      }
    }
    throw new Error('Nft contract data not found')
  }

  async logOut() {
    return this.getDispatch()('logOut')
  }
}
