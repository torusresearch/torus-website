const assert = require('assert')
const HttpProvider = require('ethjs-provider-http')
const AssetsContractController = require('../../../src/controllers/AssetsContractController').default
const MAINNET_PROVIDER = new HttpProvider('https://mainnet.infura.io/v3/341eacb578dd44a1a049cbc5f6fd4035')

const GODSADDRESS = '0x6EbeAf8e8E946F0716E6533A6f2cefc83f60e8Ab'
const CKADDRESS = '0x06012c8cf97BEaD5deAe237070F9587f8E7A266d'
const SAI_ADDRESS = '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359'

describe('#AssetsContractController', () => {
  let assetsContractController

  beforeEach(() => {
    assetsContractController = new AssetsContractController({
      provider: MAINNET_PROVIDER
    })
  })

  it('should determine if contract supports interface correctly', async () => {
    const CKSupportsEnumerable = await assetsContractController.contractSupportsEnumerableInterface(CKADDRESS)
    const GODSSupportsEnumerable = await assetsContractController.contractSupportsEnumerableInterface(GODSADDRESS)
    assert.equal(CKSupportsEnumerable, false)
    assert.equal(GODSSupportsEnumerable, true)
  })

  it('should get balance of contract correctly', async () => {
    const CKBalance = await assetsContractController.getBalanceOf(CKADDRESS, '0xb1690c08e213a35ed9bab7b318de14420fb57d8c')
    const CKNoBalance = await assetsContractController.getBalanceOf(CKADDRESS, '0xb1690c08e213a35ed9bab7b318de14420fb57d81')
    assert.notEqual(CKBalance, 0)
    assert.equal(CKNoBalance, 0)
  })

  it('should get collectible tokenId correctly', async () => {
    const tokenId = await assetsContractController.getCollectibleTokenId(GODSADDRESS, '0x9a90bd8d1149a88b42a99cf62215ad955d6f498a', 0)
    assert.notEqual(tokenId, 0)
  })

  it('should get collectible tokenURI correctly', async () => {
    const tokenId = await assetsContractController.getCollectibleTokenURI(GODSADDRESS, 0)
    assert.equal(tokenId, 'https://api.godsunchained.com/card/0')
  })

  it('should get collectible name', async () => {
    const name = await assetsContractController.getAssetName(GODSADDRESS)
    assert.equal(name, 'Gods Unchained')
  })
  it('should get collectible symbol', async () => {
    const symbol = await assetsContractController.getAssetSymbol(GODSADDRESS)
    assert.equal(symbol, 'GODS')
  })

  it('should get token decimals', async () => {
    const symbol = await assetsContractController.getTokenDecimals(SAI_ADDRESS)
    assert.equal(Number(symbol), 18)
  })

  it('should get collectible ownership', async () => {
    const tokenId = await assetsContractController.getOwnerOf(GODSADDRESS, 148332)
    assert.notEqual(tokenId, '')
  })
})
