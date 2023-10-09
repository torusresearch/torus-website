import { Contract } from 'ethers'

import { erc721Abi, erc1155Abi } from '../../utils/abis'
import {
  CONTRACT_TYPE_ERC721,
  CONTRACT_TYPE_ERC1155,
  COVALENT_SUPPORTED_CHAIN_IDS,
  ERC721_INTERFACE_ID,
  ERC1155_INTERFACE_ID,
  OLD_ERC721_LIST,
} from '../../utils/enums'
import { get } from '../../utils/httpHelpers'
import { sanitizeNftMetdataUrl, validateImageUrl } from '../../utils/utils'

const errorsType = {
  UNSUPPORTED_STANDARD: 'unsupported_standard',
  NO_OWNERNSHIP: 'no_ownership',
  NON_EXISTENT_TOKEN_ID: 'non_existent_token_id',
  NFT_METADATA_FAILED: 'nft_metadata_failed',
}

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
  constructor({ userAddress, address, tokenId, nftName, nftImageLink, description, nftStandard, isSpecial, provider, prefController }) {
    if (!userAddress) {
      throw new Error('userAddress is required while initializing NftHandler')
    }
    if (!address) {
      throw new Error('address is required while initializing NftHandler')
    }
    if (tokenId === undefined) {
      throw new Error('tokenId is required while initializing NftHandler')
    }
    if (!provider) {
      throw new Error('provider is required while initializing NftHandler')
    }
    this.provider = provider
    this.userAddress = userAddress
    this.address = address
    this.tokenId = tokenId
    this.nftName = nftName
    this.nftImageLink = nftImageLink
    this.description = description
    this.nftStandard = nftStandard
    this.isSpecial = isSpecial
    this.contract = null
    this.prefController = prefController
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

  async getNftMetadataFromApi() {
    const { chainId } = await this.provider.getNetwork()
    if (!COVALENT_SUPPORTED_CHAIN_IDS[chainId]) throw new Error(`ChainId ${chainId} not supported by covalent api`)
    if (!this.prefController) throw new Error('Preferences controller is not initialized')
    const api = `https://api.covalenthq.com/v1/${chainId}/tokens/${this.address}/nft_metadata/${this.tokenId}/`
    const res = await this.prefController.getCovalentNfts(api)
    if (res.success) {
      const item = res?.data?.data?.items[0]
      const { contract_name, logo_url } = item || {}
      const nft = item?.nft_data?.[0]
      const nftData = nft?.external_data
      const nftStandard = nft?.supports_erc && nft?.supports_erc.includes[CONTRACT_TYPE_ERC1155] ? CONTRACT_TYPE_ERC1155 : CONTRACT_TYPE_ERC721
      if (!nftData && !contract_name) {
        throw new Error('Nft data not found')
      }
      return {
        nftName: nftData?.name || `${contract_name}#${this.tokenId}`,
        nftImageLink: nftData?.image || logo_url,
        description: nftData?.description || '',
        video: nftData?.animation_url || null,
        nftStandard,
      }
    }

    throw new Error('Nft data not found')
  }

  /**
   * Query for name for a given asset
   *
   * @returns - Promise resolving to the 'name'
   */
  getAssetName() {
    const contract = new Contract(this.address, erc721Abi, this.provider)
    return contract.name()
  }

  async fetchNftBalance() {
    const { standard } = await this.checkNftStandard()
    if (standard === CONTRACT_TYPE_ERC1155) {
      const balance = await this.contract.balanceOf(this.userAddress, this.tokenId)
      return Number.parseInt(balance, 10)
    }
    let owner = ''
    try {
      owner = await this.contract.ownerOf(this.tokenId)
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
    return this.contract[method](tokenId)
  }

  contractSupportsInterface(interfaceId) {
    return this.contract.supportsInterface(interfaceId)
  }

  async checkNftStandard() {
    if (this.isSpecial) {
      return { standard: CONTRACT_TYPE_ERC721, isSpecial: true }
    }
    if (this.nftStandard && this.isSpecial !== undefined) {
      return { standard: this.nftStandard, isSpecial: false }
    }
    this.contract = new Contract(this.address, erc721Abi, this.provider)
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
      this.contract = new Contract(this.address, erc1155Abi, this.provider)
      return { standard: CONTRACT_TYPE_ERC1155, isSpecial: false }
    }

    throw new Error(errorsType.UNSUPPORTED_STANDARD)
  }
}

export default NftHandler
