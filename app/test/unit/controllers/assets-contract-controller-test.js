/* eslint-disable import/no-extraneous-dependencies */
import assert from 'assert'
import HttpProvider from 'web3-providers-http'

import AssetsContractController from '../../../src/controllers/AssetsContractController'

const MAINNET_PROVIDER = new HttpProvider('https://mainnet.infura.io/v3/341eacb578dd44a1a049cbc5f6fd4035')
const GODSADDRESS = '0x6EbeAf8e8E946F0716E6533A6f2cefc83f60e8Ab'
const CKADDRESS = '0x06012c8cf97BEaD5deAe237070F9587f8E7A266d'
const SAI_ADDRESS = '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359'

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

  it('should get balance of contract correctly', async () => {
    const CKBalance = await assetsContract.getBalanceOf(CKADDRESS, '0xb1690c08e213a35ed9bab7b318de14420fb57d8c')
    const CKNoBalance = await assetsContract.getBalanceOf(CKADDRESS, '0xb1690c08e213a35ed9bab7b318de14420fb57d81')
    assert(CKBalance !== '0')
    assert(CKNoBalance === '0')
  })

  it('should get collectible tokenId correctly', async () => {
    const tokenId = await assetsContract.getCollectibleTokenId(GODSADDRESS, '0x9a90bd8d1149a88b42a99cf62215ad955d6f498a', 0)
    assert(tokenId !== 0)
  })

  it('should get collectible tokenURI correctly', async () => {
    const tokenId = await assetsContract.getCollectibleTokenURI(GODSADDRESS, 0)
    assert(tokenId === 'https://api.godsunchained.com/card/0')
  })

  it('should get collectible name', async () => {
    const name = await assetsContract.getAssetName(GODSADDRESS)
    assert(name === 'Gods Unchained')
  })
  it('should get collectible symbol', async () => {
    const symbol = await assetsContract.getAssetSymbol(GODSADDRESS)
    assert(symbol === 'GODS')
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
