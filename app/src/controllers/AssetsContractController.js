/**
 * Assets Contract
 *
 * Controller that interacts with contracts on mainnet through web3
 * @author Shubham
 */

// const ObservableStore = require('obs-store')
const log = require('loglevel')
const BN = require('ethereumjs-util').BN
const Web3 = require('web3')
const ObservableStore = require('obs-store')
const abiERC20 = require('human-standard-token-abi')
const abiERC721 = require('human-standard-collectible-abi')
const abiSingleCallBalancesContract = require('single-call-balance-checker-abi')
const ERC721METADATA_INTERFACE_ID = '0x5b5e139f'
const ERC721ENUMERABLE_INTERFACE_ID = '0x780e9d63'
const SINGLE_CALL_BALANCES_ADDRESS = '0xb1f8e55c7f64d203c1400b9d8555d050f94adf39'
export default class AssetContractController {
  /**
   * Creates a AssetsContractController instance
   *
   * @typedef {Object} AssetContract
   * @param {Object} opts Initialize various properties of the class.
   */
  constructor(opts) {
    this._provider = opts.provider
    this.web3 = new Web3(this._provider)
    const initState = {
      provider: opts.provider
    }
    this.store = new ObservableStore(initState)
  }

  /**
   *
   * Query if a contract implements an interface
   *
   * @param address - Asset contract address
   * @param interfaceId - Interface identifier
   * @returns - Promise resolving to whether the contract implements `interfaceID`
   */
  contractSupportsInterface(address, interfaceId) {
    const web3Instance = this.web3
    const contract = new web3Instance.eth.Contract(abiERC721, address)
    return new Promise((resolve, reject) => {
      contract.supportsInterface(interfaceId, (error, result) => {
        /* istanbul ignore if */
        if (error) {
          reject(error)
          return
        }
        resolve(result)
      })
    })
  }

  /**
   * Query if contract implements ERC721Metadata interface
   *
   * @param address - ERC721 asset contract address
   * @returns - Promise resolving to whether the contract implements ERC721Metadata interface
   */
  contractSupportsMetadataInterface(address) {
    return this.contractSupportsInterface(address, ERC721METADATA_INTERFACE_ID)
  }

  /**
   * Query if contract implements ERC721Enumerable interface
   *
   * @param address - ERC721 asset contract address
   * @returns - Promise resolving to whether the contract implements ERC721Enumerable interface
   */
  contractSupportsEnumerableInterface(address) {
    return this.contractSupportsInterface(address, ERC721ENUMERABLE_INTERFACE_ID)
  }

  /**
   * Get balance or count for current account on specific asset contract
   *
   * @param address - Asset contract address
   * @param selectedAddress - Current account public address
   * @returns - Promise resolving to BN object containing balance for current account on specific asset contract
   */
  getBalanceOf(address, selectedAddress) {
    const web3Instance = this.web3
    const contract = new web3Instance.eth.contract(abiERC20, address)
    return new Promise((resolve, reject) => {
      contract.balanceOf(selectedAddress, (error, result) => {
        /* istanbul ignore if */
        if (error) {
          reject(error)
          return
        }
        resolve(result)
      })
    })
  }

  /**
   * Enumerate assets assigned to an owner
   *
   * @param address - ERC721 asset contract address
   * @param selectedAddress - Current account public address
   * @param index - A collectible counter less than `balanceOf(selectedAddress)`
   * @returns - Promise resolving to token identifier for the 'index'th asset assigned to 'selectedAddress'
   */
  getCollectibleTokenId(address, selectedAddress, index) {
    const web3Instance = this.web3

    const contract = new web3Instance.eth.contract(abiERC721).at(address)
    return new Promise((resolve, reject) => {
      contract.tokenOfOwnerByIndex(selectedAddress, index, (error, result) => {
        /* istanbul ignore if */
        if (error) {
          reject(error)
          return
        }
        resolve(result.toNumber())
      })
    })
  }

  /**
   * Query for tokenURI for a given asset
   *
   * @param address - ERC721 asset contract address
   * @param tokenId - ERC721 asset identifier
   * @returns - Promise resolving to the 'tokenURI'
   */
  getCollectibleTokenURI(address, tokenId) {
    const web3Instance = this.web3

    const contract = new web3Instance.eth.contract(abiERC721).at(address)
    return new Promise((resolve, reject) => {
      contract.tokenURI(tokenId, (error, result) => {
        /* istanbul ignore if */
        if (error) {
          reject(error)
          return
        }
        resolve(result)
      })
    })
  }
  /**
   * Query for name for a given ERC20 asset
   *
   * @param address - ERC20 asset contract address
   * @returns - Promise resolving to the 'decimals'
   */
  getTokenDecimals(address) {
    const web3Instance = this.web3

    const contract = new web3Instance.eth.contract(abiERC20).at(address)
    return new Promise((resolve, reject) => {
      contract.decimals((error, result) => {
        /* istanbul ignore if */
        if (error) {
          reject(error)
          return
        }
        resolve(result)
      })
    })
  }
  /**
   * Query for name for a given asset
   *
   * @param address - ERC721 or ERC20 asset contract address
   * @returns - Promise resolving to the 'name'
   */
  getAssetName(address) {
    const web3Instance = this.web3

    const contract = new web3Instance.eth.contract(abiERC721).at(address)
    return new Promise((resolve, reject) => {
      contract.name((error, result) => {
        /* istanbul ignore if */
        if (error) {
          reject(error)
          return
        }
        resolve(result)
      })
    })
  }
  /**
   * Query for symbol for a given asset
   *
   * @param address - ERC721 or ERC20 asset contract address
   * @returns - Promise resolving to the 'symbol'
   */
  getAssetSymbol(address) {
    const web3Instance = this.web3

    const contract = new web3Instance.eth.contract(abiERC721).at(address)
    return new Promise((resolve, reject) => {
      contract.symbol((error, result) => {
        /* istanbul ignore if */
        if (error) {
          reject(error)
          return
        }
        resolve(result)
      })
    })
  }
  /**
   * Query for owner for a given ERC721 asset
   *
   * @param address - ERC721 asset contract address
   * @param tokenId - ERC721 asset identifier
   * @returns - Promise resolving to the owner address
   */
  getOwnerOf(address, tokenId) {
    const web3Instance = this.web3

    const contract = new web3Instance.eth.contract(abiERC721).at(address)
    return new Promise((resolve, reject) => {
      contract.ownerOf(tokenId, (error, result) => {
        /* istanbul ignore if */
        if (error) {
          reject(error)
          return
        }
        resolve(result)
      })
    })
  }
  /**
   * Query for balances of all tokens
   *
   * @returns - Promise resolving to array of non-zero balances
   */
  getBalancesInSingleCall(selectedAddress, tokensToDetect) {
    const web3Instance = this.web3

    const contract = new web3Instance.eth.Contract(abiSingleCallBalancesContract).at(SINGLE_CALL_BALANCES_ADDRESS)
    return new Promise((resolve, reject) => {
      contract.balances([selectedAddress], tokensToDetect, (error, result) => {
        /* istanbul ignore if */
        if (error) {
          reject(error)
          return
        }
        const nonZeroBalances = {}
        /* istanbul ignore else */
        if (result.length > 0) {
          tokensToDetect.forEach((tokenAddress, index) => {
            const balance = result[index]
            /* istanbul ignore else */
            if (!balance.isZero()) {
              nonZeroBalances[tokenAddress] = balance
            }
          })
        }
        resolve(nonZeroBalances)
      })
    })
  }
}
