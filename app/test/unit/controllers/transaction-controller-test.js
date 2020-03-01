// const assert = require('assert')
// const sinon = require('sinon')
// const nock = require('nock')
// const TransactionController = require('../../../src/controllers/TransactionController').default

// describe('transaction-controller', function() {
//   let transactionController

//   beforeEach(function() {
//     transactionController = new TransactionController({
//       networkStore: {},
//       txStateManager: {}
//     })
//   })

//   describe('should set default state', function() {
//     transactionController = new TransactionController({
//       networkStore: {},
//       txStateManager: {}
//     })
//     console.log(transactionController)
//     assert.equal(transactionController.txStateManager, { methodData: {}, transactions: [] })
//   })

//   it('should set default config', () => {
//     assert.equal(controller.config, {
//       interval: 5000,
//       provider: undefined
//     })
//   })

//   //   it('should wipe transactions', async () => {
//   //     const controller = new TransactionController({ provider: PROVIDER })
//   //     controller.wipeTransactions()
//   //     controller.context = {
//   //       NetworkController: MOCK_NETWORK
//   //     }
//   //     controller.onComposed()
//   //     const from = '0xc38bf1ad06ef69f0c04e29dbeb4152b4175f0a8d'
//   //     await controller.addTransaction({
//   //       from,
//   //       to: from
//   //     })
//   //     controller.wipeTransactions()
//   //     assert(controller.transactions.length, 0)
//   //   })
// })
