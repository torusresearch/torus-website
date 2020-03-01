const assert = require('assert')
const MessageManagerController = require('../../../src/controllers/MessageManager').default

describe('#MessageManagerController', async () => {
  let messageManagerController

  beforeEach(() => {
    messageManagerController = new MessageManagerController({})
  })
  it('it should return empty unapproved message count', () => {
    assert.equal(messageManagerController.unapprovedMsgCount, 0)
  })

  it('it should return empty unapproved messages', async () => {
    assert(await messageManagerController.getUnapprovedMsgs(), {})
  })

  it('should add unapproved message', async () => {
    await messageManagerController.addUnapprovedMessage({
      data: '0x123'
    })
    let message = await messageManagerController.getMsg()
    assert.notEqual(message, {})
  })

  // it('should reject message', async () => {
  //   const firstMessage = { from: 'foo', data: '0x123' }
  //   const messageId = await messageManagerController.addUnapprovedMessage(firstMessage)
  //   await messageManagerController.rejectMessage(messageId)
  //   const message = await messageManagerController.getMessage(messageId)
  //   assert(message, undefined)
  //   if (message) {
  //     assert.equal(message.status, 'rejected')
  //   }
  // })

  // it('should set message status signed', async () => {
  //   const firstMessage = { from: 'foo', data: '0x123' }
  //   const rawSig = '0x5f7a0'
  //   const messageId = await messageManagerController.addUnapprovedMessage(firstMessage)

  //   await messageManagerController.setMessageStatusSigned(messageId, rawSig)
  //   const message = await messageManagerController.getMessage(messageId)
  //   assert.notEqual(message, undefined)
  //   if (message) {
  //     assert.equal(message.rawSig, rawSig)
  //     assert.equal(message.status, 'signed')
  //   }
  // })

  // it('should throw when adding invalid message', () => {
  //   const from = 'foo'
  //   const messageData = '0x123'
  //   return new Promise(async resolve => {
  //     try {
  //       await messageManagerController.addUnapprovedMessageAsync({
  //         data: messageData,
  //         from
  //       })
  //     } catch (error) {
  //       assert(error.message, 'Invalid "from" address:')
  //       resolve()
  //     }
  //   })
  // })
})
