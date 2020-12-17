/**
 * Assets Contract
 *
 * Controller that interacts with contracts on mainnet through web3
 * @author Shubham, Chaitanya
 */
import abiERC721 from 'human-standard-collectible-abi'
import abiERC20 from 'human-standard-token-abi'
import abiSingleCallBalancesContract from 'single-call-balance-checker-abi'
import Web3 from 'web3'

import { ERC721ENUMERABLE_INTERFACE_ID, ERC721METADATA_INTERFACE_ID, SINGLE_CALL_BALANCES_ADDRESS } from '../utils/enums'

export default class AssetContractController {
  /**
   * Creates a AssetsContractController instance
   *
   * @typedef {Object} AssetContract
   * @param {Object} opts Initialize various properties of the class.
   */
  constructor(options) {
    this._provider = options.provider
    this.web3 = new Web3(this._provider)
    this.name = 'AssetsContractController'
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
    return contract.methods.supportsInterface(interfaceId).call()
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
    const contract = new web3Instance.eth.Contract(abiERC20, address)
    return contract.methods.balanceOf(selectedAddress).call()
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
    const contract = new web3Instance.eth.Contract(abiERC721, address)
    return contract.methods.tokenOfOwnerByIndex(selectedAddress, index)
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
    const contract = new web3Instance.eth.Contract(abiERC721, address)
    return contract.methods.tokenURI(tokenId).call()
  }

  /**
   * Query for name for a given ERC20 asset
   *
   * @param address - ERC20 asset contract address
   * @returns - Promise resolving to the 'decimals'
   */
  getTokenDecimals(address) {
    const web3Instance = this.web3
    const contract = new web3Instance.eth.Contract(abiERC20, address)
    return contract.methods.decimals().call()
  }

  /**
   * Query for name for a given asset
   *
   * @param address - ERC721 or ERC20 asset contract address
   * @returns - Promise resolving to the 'name'
   */
  getAssetName(address) {
    const web3Instance = this.web3
    const contract = new web3Instance.eth.Contract(abiERC721, address)
    return contract.methods.name().call()
  }

  /**
   * Query for symbol for a given asset
   *
   * @param address - ERC721 or ERC20 asset contract address
   * @returns - Promise resolving to the 'symbol'
   */
  getAssetSymbol(address) {
    const web3Instance = this.web3
    const contract = new web3Instance.eth.Contract(abiERC721, address)
    return contract.methods.symbol().call()
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
    const contract = new web3Instance.eth.Contract(abiERC721, address)
    return contract.methods.ownerOf(tokenId).call()
  }

  /**
   * Query for balances of all tokens
   *
   * @returns - Promise resolving to array of non-zero balances
   */
  getBalancesInSingleCall(selectedAddress, tokensToDetect) {
    const web3Instance = this.web3
    const contract = new web3Instance.eth.Contract(abiSingleCallBalancesContract, SINGLE_CALL_BALANCES_ADDRESS)
    return new Promise((resolve, reject) => {
      contract.methods
        .balances([selectedAddress], tokensToDetect)
        .call()
        .then((result) => {
          const nonZeroBalances = {}
          /* istanbul ignore else */
          if (result.length > 0) {
            tokensToDetect.forEach((tokenAddress, index) => {
              const balance = this.web3.utils.toHex(result[index])
              /* istanbul ignore else */
              if (balance && balance !== '0x0') {
                nonZeroBalances[tokenAddress] = balance
              }
            })
          }
          resolve(nonZeroBalances)
        })
        .catch((error) => reject(error))
    })
  }
}
