import assert from 'assert'

import PersonalMessageManager from '../../../src/controllers/PersonalMessageManager'

describe('Personal Message Manager', () => {
  let messageManager

  beforeEach(() => {
    messageManager = new PersonalMessageManager()
  })

  describe('#getMsgList', () => {
    it('when new should return empty array', () => {
      const result = messageManager.messages
      assert.ok(Array.isArray(result))
      assert.strictEqual(result.length, 0)
    })
    it('should also return transactions from local storage if any', () => {})
  })

  describe('#addMsg', () => {
    it('adds a Msg returned in getMsgList', () => {
      const Message = { id: 1, status: 'approved', metamaskNetworkId: 'unit test' }
      messageManager.addMsg(Message)
      const result = messageManager.messages
      assert.ok(Array.isArray(result))
      assert.strictEqual(result.length, 1)
      assert.strictEqual(result[0].id, 1)
    })
  })

  describe('#setMsgStatusApproved', () => {
    it('sets the Msg status to approved', () => {
      const Message = { id: 1, status: 'unapproved', metamaskNetworkId: 'unit test' }
      messageManager.addMsg(Message)
      messageManager.setMsgStatusApproved(1)
      const result = messageManager.messages
      assert.ok(Array.isArray(result))
      assert.strictEqual(result.length, 1)
      assert.strictEqual(result[0].status, 'approved')
    })
  })

  describe('#rejectMsg', () => {
    it('sets the Msg status to rejected', () => {
      const Message = { id: 1, status: 'unapproved', metamaskNetworkId: 'unit test' }
      messageManager.addMsg(Message)
      messageManager.rejectMsg(1)
      const result = messageManager.messages
      assert.ok(Array.isArray(result))
      assert.strictEqual(result.length, 1)
      assert.strictEqual(result[0].status, 'rejected')
    })
  })

  describe('#_updateMsg', () => {
    it('replaces the Msg with the same id', () => {
      messageManager.addMsg({ id: '1', status: 'unapproved', metamaskNetworkId: 'unit test' })
      messageManager.addMsg({ id: '2', status: 'approved', metamaskNetworkId: 'unit test' })
      messageManager._updateMsg({ id: '1', status: 'blah', hash: 'foo', metamaskNetworkId: 'unit test' })
      const result = messageManager.getMsg('1')
      assert.strictEqual(result.hash, 'foo')
    })
  })

  describe('#getUnapprovedMsgs', () => {
    it('returns unapproved Msgs in a hash', () => {
      messageManager.addMsg({ id: '1', status: 'unapproved', metamaskNetworkId: 'unit test' })
      messageManager.addMsg({ id: '2', status: 'approved', metamaskNetworkId: 'unit test' })
      const result = messageManager.getUnapprovedMsgs()
      assert.strictEqual(typeof result, 'object')
      assert.strictEqual(result['1'].status, 'unapproved')
      assert.strictEqual(result['2'], undefined)
    })
  })

  describe('#getMsg', () => {
    it('returns a Msg with the requested id', () => {
      messageManager.addMsg({ id: '1', status: 'unapproved', metamaskNetworkId: 'unit test' })
      messageManager.addMsg({ id: '2', status: 'approved', metamaskNetworkId: 'unit test' })
      assert.strictEqual(messageManager.getMsg('1').status, 'unapproved')
      assert.strictEqual(messageManager.getMsg('2').status, 'approved')
    })
  })

  describe('#normalizeMsgData', () => {
    it('converts text to a utf8 hex string', () => {
      const input = 'hello'
      const output = messageManager.normalizeMsgData(input)
      assert.strictEqual(output, '0x68656c6c6f', 'predictably hex encoded')
    })

    it('tolerates a hex prefix', () => {
      const input = '0x12'
      const output = messageManager.normalizeMsgData(input)
      assert.strictEqual(output, '0x12', 'un modified')
    })

    it('tolerates normal hex', () => {
      const input = '12'
      const output = messageManager.normalizeMsgData(input)
      assert.strictEqual(output, '0x12', 'adds prefix')
    })
  })
})
