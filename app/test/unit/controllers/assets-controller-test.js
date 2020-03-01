const assert = require('assert')
const AssetsController = require('../../../src/controllers/AssetsController').default

const ADDRESS = '0x6EbeAf8e8E946F0716E6533A6f2cefc83f60e8Ab'

describe('#AssetsController', () => {
  let assetsController

  beforeEach(() => {
    assetsController = new AssetsController()
  })

  it('should set default state', async () => {
    assert.equal(assetsController.jwtToken, '')
    assert.equal(assetsController.selectedAddress, undefined)
  })

  it('should set selected address', async () => {
    await assetsController.setSelectedAddress(ADDRESS)
    assert.equal(assetsController.selectedAddress, ADDRESS)
  })
})
