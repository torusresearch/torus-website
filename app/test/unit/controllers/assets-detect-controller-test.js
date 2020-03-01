// const assert = require('assert')
// const nock = require('nock')
// const sinon = require('sinon')
// const AssetsDetectionController = require('../../../src/controllers/AssetsDetectionController').default
// const NetworkController = require('../../../src/controllers/NetworkController').default

// const stub = sinon.stub

// describe('#AssetDetectionController', async () => {
//   const sandbox = sinon.createSandbox()
//   let network, assetDetectionController

//   const noop = () => {}

//   const networkControllerProviderConfig = {
//     getAccounts: noop
//   }

//   beforeEach(() => {
//     nock('https://api.infura.io')
//       .get(/.*/)
//       .reply(200)
//       .log(noop)
//     network = new NetworkController()
//     network.initializeProvider(networkControllerProviderConfig)
//     assetDetectionController = new AssetsDetectionController({ network: network })
//   })

//   afterEach(() => {
//     sandbox.restore()
//     nock.cleanAll()
//   })
