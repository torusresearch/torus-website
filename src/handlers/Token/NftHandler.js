import abiERC721 from 'human-standard-collectible-abi'
import { ERC1155 as erc1155abi, ERC1155Metadata as erc1155MetadataAbi } from 'multi-token-standard-abi'

import { CONTRACT_TYPE_ERC721, CONTRACT_TYPE_ERC1155, ERC721_INTERFACE_ID, ERC1155_INTERFACE_ID, OLD_ERC721_LIST } from '../../utils/enums'
import { get } from '../../utils/httpHelpers'
import { sanitizeNftMetdataUrl, validateImageUrl } from '../../utils/utils'

const errorsType = {
  UNSUPPORTED_STANDARD: 'unsupported_standard',
  NO_OWNERNSHIP: 'no_ownership',
  NON_EXISTENT_TOKEN_ID: 'non_existent_token_id',
  NFT_METADATA_FAILED: 'nft_metadata_failed',
}

const abiErc1155 = [...erc1155abi.abi, ...erc1155MetadataAbi.abi]

export const getDisplayErrorMsg = (type) => {
  if (type === errorsType.UNSUPPORTED_STANDARD) {
    return 'homeAssets.unSupportedStandard'
  }
  if (type === errorsType.NO_OWNERNSHIP) {
    return 'homeAssets.noOwnership'
  }
  if (type === errorsType.NON_EXISTENT_TOKEN_ID) {
    return 'homeAssets.nonExistentTokenId'
  }
  if (type === errorsType.NFT_METADATA_FAILED) {
    return 'homeAssets.nftMetadataFailed'
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
    this.nftName = nftName
    this.nftImageLink = nftImageLink
    this.description = description
    this.nftStandard = nftStandard
    this.isSpecial = isSpecial
    this.contract = null
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
      try {
        const sanitizedNftMetdataUrl = sanitizeNftMetdataUrl(collectibleDetails.logo)
        if (await validateImageUrl(sanitizedNftMetdataUrl)) this.nftImageLink = sanitizedNftMetdataUrl
      } catch {}
      this.nftName = collectibleDetails.name
      this.description = ''
      const { nftName, nftImageLink, description, nftStandard } = this
      return { nftName, nftImageLink, description, nftStandard }
    }
    if (this.nftImageLink && this.nftName) {
      const { nftName, nftImageLink, description, nftStandard } = this
      return { nftName, nftImageLink, description, nftStandard }
    }
    const tokenURI = await this.getCollectibleTokenURI(this.tokenId, _standard)
    const finalTokenMetaUri = sanitizeNftMetdataUrl(tokenURI)
    try {
      // this call might fail, if metadata url available in smart contract is not reachable
      const object = await get(finalTokenMetaUri)
      const image = object.image || object.image_url
      const sanitizedNftMetdataUrl = sanitizeNftMetdataUrl(image)
      try {
        if (await validateImageUrl(sanitizedNftMetdataUrl)) this.nftImageLink = sanitizedNftMetdataUrl
      } catch {}
      this.nftName = object.name || (await this.getAssetName())
      this.description = Object.prototype.hasOwnProperty.call(object, 'description') ? object.description : ''
      const { nftName, nftImageLink, description, nftStandard } = this
      return { nftName, nftImageLink, description, nftStandard }
    } catch {
      throw new Error(errorsType.NFT_METADATA_FAILED)
    }
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
      const balance = await this.contract.methods.balanceOf(this.userAddress, this.tokenId).call()
      return Number.parseInt(balance, 10)
    }
    let owner = ''
    try {
      owner = await this.contract.methods.ownerOf(this.tokenId).call()
    } catch {
      throw new Error(errorsType.NON_EXISTENT_TOKEN_ID)
    }
    if (owner.toLowerCase() === this.userAddress.toLowerCase()) {
      return 1
    }
    return 0
  }

  getCollectibleTokenURI(tokenId, standard = CONTRACT_TYPE_ERC721) {
    const method = standard === CONTRACT_TYPE_ERC721 ? 'tokenURI' : 'uri'
    return this.contract.methods[method](tokenId).call()
  }

  contractSupportsInterface(interfaceId) {
    return this.contract.methods.supportsInterface(interfaceId).call()
  }

  async checkNftStandard() {
    if (this.isSpecial) {
      return { standard: CONTRACT_TYPE_ERC721, isSpecial: true }
    }
    if (this.nftStandard && this.isSpecial !== undefined) {
      return { standard: this.nftStandard, isSpecial: false }
    }
    const web3Instance = this.web3
    this.contract = new web3Instance.eth.Contract(abiERC721, this.address)
    // For Cryptokitties
    if (Object.prototype.hasOwnProperty.call(OLD_ERC721_LIST, this.address.toLowerCase())) {
      this.nftStandard = CONTRACT_TYPE_ERC721
      this.isSpecial = true
      return { standard: CONTRACT_TYPE_ERC721, isSpecial: true }
    }
    const isErc721 = this.nftStandard === CONTRACT_TYPE_ERC721 || (await this.contractSupportsInterface(ERC721_INTERFACE_ID))
    if (isErc721) {
      this.nftStandard = CONTRACT_TYPE_ERC721
      this.isSpecial = false
      return { standard: CONTRACT_TYPE_ERC721, isSpecial: false }
    }
    const isErc1155 = this.nftStandard === CONTRACT_TYPE_ERC1155 || (await this.contractSupportsInterface(ERC1155_INTERFACE_ID))
    if (isErc1155) {
      this.nftStandard = CONTRACT_TYPE_ERC1155
      this.isSpecial = false
      this.contract = new web3Instance.eth.Contract(abiErc1155, this.address)
      return { standard: CONTRACT_TYPE_ERC1155, isSpecial: false }
    }

    throw new Error(errorsType.UNSUPPORTED_STANDARD)
  }
}

export default NftHandler
