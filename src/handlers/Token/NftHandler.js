import abiERC721 from 'human-standard-collectible-abi'
import tokenAbi from 'human-standard-token-abi'
import { ERC1155 as erc1155abi, ERC1155Metadata as erc1155MetadataAbi } from 'multi-token-standard-abi'

import { CONTRACT_TYPE_ERC721, CONTRACT_TYPE_ERC1155, ERC721_INTERFACE_ID, ERC1155_INTERFACE_ID, OLD_ERC721_LIST } from '../../utils/enums'
import { get } from '../../utils/httpHelpers'
import { sanitizeNftImageUrl, sanitizeNftMetdataUrl } from '../../utils/utils'

const errorsType = {
  UNSUPPORTED_STANDARD: 'unsupported_standard',
  NO_OWNERNSHIP: 'no_ownership',
}
export const getDisplayErrorMsg = (type) => {
  if (errorsType[type] === errorsType.UNSUPPORTED_STANDARD) {
    return 'Contract address does not support any valid nft standard'
  }
  if (errorsType[type] === errorsType.NO_OWNERNSHIP) {
    return 'You don not own nft belonging to provided contract address and token id'
  }
  return null
}
class NftHandler {
  constructor({ userAddress, address, tokenId, nftName, nftImageLink, description, nftStandard, isSpecial, web3 }) {
    if (!userAddress) {
      throw new Error('userAddress is required while initializing NftHandler')
    }
    if (!address) {
      throw new Error('address is required while initializing NftHandler')
    }
    if (tokenId === undefined) {
      throw new Error('tokenId is required while initializing NftHandler')
    }
    if (!web3) {
      throw new Error('web3 is required while initializing NftHandler')
    }
    this.web3 = web3
    this.userAddress = userAddress
    this.address = address
    this.tokenId = tokenId
    this.contract = new web3.eth.Contract(tokenAbi, address)
    this.nftName = nftName
    this.nftImageLink = nftImageLink
    this.decription = description
    this.nftStandard = nftStandard
    this.isSpecial = isSpecial
  }

  async getNftDetails() {
    const { standard, isSpecial } = await this.checkNftStandard()
    const { nftName, nftImageLink, decription } = await this.getNftMetadata(standard, isSpecial)
    if (isSpecial) {
      const { tokenId, address } = this
      return { nftBalance: 1, nftName, tokenId, nftImageLink, decription, nftStandard: standard, address }
    }
    const nftBalance = await this.fetchNftBalance()
    return { nftBalance, nftName, tokenId: this.tokenId, nftImageLink, decription, nftStandard: standard, address: this.address }
  }

  async getNftMetadata(standard, isSpecial) {
    let _standard = standard
    let _isSpecial = isSpecial
    if (!standard) {
      const nftStandard = await this.checkNftStandard()
      _standard = nftStandard.standard
      _isSpecial = nftStandard.isSpecial
    }
    if (_isSpecial) {
      const collectibleDetails = Object.prototype.hasOwnProperty.call(OLD_ERC721_LIST, this.address.toLowerCase())
        ? OLD_ERC721_LIST[this.address.toLowerCase()]
        : {}
      this.nftImageLink = await sanitizeNftImageUrl(collectibleDetails.logo)
      this.nftName = collectibleDetails.name
      this.decription = ''
      const { nftName, nftImageLink, decription } = this
      return { nftName, nftImageLink, decription }
    }
    if (this.nftImageLink && this.nftName) {
      const { nftName, nftImageLink, decription } = this
      return { nftName, nftImageLink, decription }
    }
    const tokenURI = await this.getCollectibleTokenURI(this.address, this.tokenId, _standard)
    const finalTokenMetaUri = await sanitizeNftMetdataUrl(tokenURI)
    const object = await get(finalTokenMetaUri)
    const image = Object.prototype.hasOwnProperty.call(object, 'image') ? 'image' : /* istanbul ignore next */ 'image_url'

    this.nftImageLink = await sanitizeNftImageUrl(object[image])

    this.nftName = await this.getAssetName()
    this.decription = Object.prototype.hasOwnProperty.call(object, 'description') ? object.description : ''
    const { nftName, nftImageLink, decription } = this
    return { nftName, nftImageLink, decription }
  }

  /**
   * Query for name for a given asset
   *
   * @returns - Promise resolving to the 'name'
   */
  getAssetName() {
    const web3Instance = this.web3
    const contract = new web3Instance.eth.Contract(abiERC721, this.address)
    return contract.methods.name().call()
  }

  async fetchNftBalance() {
    const { standard } = await this.checkNftStandard()
    if (standard === CONTRACT_TYPE_ERC1155) {
      const web3Instance = this.web3
      const contract = new web3Instance.eth.Contract(erc1155abi.abi, this.address)
      const balance = await contract.methods.balanceOf(this.userAddress, this.tokenId).call()
      return Number.parseInt(balance, 10)
    }
    const web3Instance = this.web3
    const contract = new web3Instance.eth.Contract(abiERC721, this.address)
    const owner = await contract.methods.ownerOf(this.tokenId).call()
    if (owner.toLowerCase() === this.userAddress.toLowerCase()) {
      return 1
    }
    return 0
  }

  getCollectibleTokenURI(address, tokenId, standard = CONTRACT_TYPE_ERC721) {
    const { abi, method } = standard === CONTRACT_TYPE_ERC721 ? { abi: abiERC721, method: 'tokenURI' } : { abi: erc1155MetadataAbi, method: 'uri' }
    const web3Instance = this.web3
    const contract = new web3Instance.eth.Contract(abi, address)
    return contract.methods[method](tokenId).call()
  }

  contractSupportsInterface(address, interfaceId) {
    const web3Instance = this.web3
    const contract = new web3Instance.eth.Contract(abiERC721, address)
    return contract.methods.supportsInterface(interfaceId).call()
  }

  async checkNftStandard() {
    if (this.isSpecial) {
      return { standard: CONTRACT_TYPE_ERC721, isSpecial: true }
    }
    if (this.nftStandard && this.isSpecial !== undefined) {
      return { standard: this.nftStandard, isSpecial: false }
    }
    // For Cryptokitties
    if (Object.prototype.hasOwnProperty.call(OLD_ERC721_LIST, this.address.toLowerCase())) {
      this.nftStandard = CONTRACT_TYPE_ERC721
      this.isSpecial = true
      return { standard: CONTRACT_TYPE_ERC721, isSpecial: true }
    }
    const isErc721 = this.nftStandard === CONTRACT_TYPE_ERC721 || (await this.contractSupportsInterface(this.address, ERC721_INTERFACE_ID))
    if (isErc721) {
      this.nftStandard = CONTRACT_TYPE_ERC721
      this.isSpecial = false
      return { standard: CONTRACT_TYPE_ERC721, isSpecial: false }
    }
    const isErc1155 = this.nftStandard === CONTRACT_TYPE_ERC1155 || (await this.contractSupportsInterface(this.address, ERC1155_INTERFACE_ID))
    if (isErc1155) {
      this.nftStandard = CONTRACT_TYPE_ERC1155
      this.isSpecial = false
      return { standard: CONTRACT_TYPE_ERC1155, isSpecial: false }
    }

    throw new Error(errorsType.UNSUPPORTED_STANDARD)
  }
}

export default NftHandler
