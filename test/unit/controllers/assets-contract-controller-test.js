/* eslint-disable import/no-extraneous-dependencies */
import assert from 'assert'
import HttpProvider from 'web3-providers-http'

import AssetsContractController from '../../../src/controllers/AssetsContractController'
import { CONTRACT_TYPE_ERC721, CONTRACT_TYPE_ERC1155 } from '../../../src/utils/enums'

const MAINNET_PROVIDER = new HttpProvider('https://mainnet.infura.io/v3/341eacb578dd44a1a049cbc5f6fd4035')
const GODSADDRESS = '0x6EbeAf8e8E946F0716E6533A6f2cefc83f60e8Ab'
const CKADDRESS = '0x06012c8cf97BEaD5deAe237070F9587f8E7A266d'
const SAI_ADDRESS = '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359'
const ERC721_ADDRESS = '0x629a673a8242c2ac4b7b8c5d8735fbeac21a6205'
const ERC1155_ADDRESS = '0xd07dc4262bcdbf85190c01c996b4c06a461d2430'
const ERC20_ADDRESS = '0xB8c77482e45F1F44dE1745F52C74426C631bDD52'
describe('AssetsContractController', () => {
  let assetsContract

  beforeEach(() => {
    assetsContract = new AssetsContractController({ provider: MAINNET_PROVIDER })
  })

  it('should determine if contract supports interface correctly', async () => {
    const CKSupportsEnumerable = await assetsContract.contractSupportsEnumerableInterface(CKADDRESS)
    const GODSSupportsEnumerable = await assetsContract.contractSupportsEnumerableInterface(GODSADDRESS)
    assert(CKSupportsEnumerable === false)
    assert(GODSSupportsEnumerable === true)
  })

  it('should determine if erc721 contract supports metadata interface correctly', async () => {
    const erc721SupportsMetdata = await assetsContract.contractSupportsMetadataInterface(ERC721_ADDRESS)
    assert(erc721SupportsMetdata === true)
  })

  it('should determine nft contract standard correctly', async () => {
    const { standard: erc721Interface } = await assetsContract.checkNftStandard(ERC721_ADDRESS)
    const { standard: erc1155Interface } = await assetsContract.checkNftStandard(ERC1155_ADDRESS)
    assert(erc721Interface === CONTRACT_TYPE_ERC721)
    assert(erc1155Interface === CONTRACT_TYPE_ERC1155)
    await assert.rejects(async () => {
      await assetsContract.checkNftStandard(ERC20_ADDRESS)
    })
  })

  it('should get balance of contract correctly', async () => {
    const CKBalance = await assetsContract.getBalanceOf(CKADDRESS, '0xb1690c08e213a35ed9bab7b318de14420fb57d8c')
    const CKNoBalance = await assetsContract.getBalanceOf(CKADDRESS, '0xb1690c08e213a35ed9bab7b318de14420fb57d81')
    assert(CKBalance !== '0')
    assert(CKNoBalance === '0')
  })
  it('should get balance of erc1155 contract correctly', async () => {
    const balance = await assetsContract.getErc1155Balance(ERC1155_ADDRESS, '0xb1690c08e213a35ed9bab7b318de14420fb57d8c', 1)
    assert(balance === '0')
  })

  it('should get collectible tokenId correctly', async () => {
    const tokenId = await assetsContract.getCollectibleTokenId(GODSADDRESS, '0x9a90bd8d1149a88b42a99cf62215ad955d6f498a', 0)
    assert(tokenId !== '0')
  })

  it('should get collectible tokenURI correctly', async () => {
    const tokenId = await assetsContract.getCollectibleTokenURI(GODSADDRESS, 0)
    assert(tokenId === 'https://api.godsunchained.com/card/0')
    const erc1155Id = await assetsContract.getCollectibleTokenURI(ERC1155_ADDRESS, 1, 'erc1155')
    assert(erc1155Id === 'ipfs://ipfs/QmRGb2Kw2RVj3Z5kgyDQP3xuFfzcRKrCqHaUwv8EZjrJ7f')
  })

  it('should get collectible name', async () => {
    const name = await assetsContract.getAssetName(GODSADDRESS)
    assert(name === 'Gods Unchained')
    const erc1155Name = await assetsContract.getAssetName(ERC1155_ADDRESS)
    assert(erc1155Name === 'Rarible')
    const erc20Name = await assetsContract.getAssetName(ERC20_ADDRESS)
    assert(erc20Name === 'BNB')
    const erc721 = await assetsContract.getAssetName(ERC721_ADDRESS)
    assert(erc721 === 'Sorare')
  })
  it('should get collectible symbol', async () => {
    const symbol = await assetsContract.getAssetSymbol(GODSADDRESS)
    assert(symbol === 'GODS')
    const erc20Symbol = await assetsContract.getAssetSymbol(ERC20_ADDRESS)
    const erc1155Symbol = await assetsContract.getAssetSymbol(ERC1155_ADDRESS)
    assert(erc20Symbol === 'BNB')
    assert(erc1155Symbol === 'RARI')
  })

  it('should get token decimals', async () => {
    const symbol = await assetsContract.getTokenDecimals(SAI_ADDRESS)
    assert(Number(symbol) === 18)
  })

  it('should get collectible ownership', async () => {
    const tokenId = await assetsContract.getOwnerOf(GODSADDRESS, 148332)
    assert(tokenId !== '')
  })

  it('should get balances in a single call', async () => {
    const balances = await assetsContract.getBalancesInSingleCall(SAI_ADDRESS, [SAI_ADDRESS])
    assert(balances[SAI_ADDRESS] !== 0)
  })
})
