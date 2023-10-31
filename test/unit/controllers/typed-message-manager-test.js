/* eslint-disable */
import assert from 'assert'

import TypedMessageManager from '../../../src/controllers/TypedMessageManager'
import NetworkController from '../../../src/controllers/network/NetworkController'
import { TRANSACTION_STATUSES } from '../../../src/utils/enums'
describe('Typed Message Manager', () => {
  let typedMessageManager, msgParamsV1, msgParamsV3, typedMsgs, messages, msgId, numberMsgId

  const address = '0xc42edfcc21ed14dda456aa0756c153f7985d8813'
  let networkController

  beforeEach(() => {
    networkController = new NetworkController()
    typedMessageManager = new TypedMessageManager({
      getCurrentChainId: networkController.getCurrentChainId.bind(networkController),
    })

    msgParamsV1 = {
      from: address,
      data: [
        { type: 'string', name: 'unit test', value: 'hello there' },
        {
          type: 'uint32',
          name: 'A number, but not really a number',
          value: '1',
        },
      ],
    }

    msgParamsV3 = {
      from: address,
      data: JSON.stringify({
        types: {
          EIP712Domain: [
            { name: 'name', type: 'string' },
            { name: 'version', type: 'string' },
            { name: 'chainId', type: 'uint256' },
            { name: 'verifyingContract', type: 'address' },
          ],
          Person: [
            { name: 'name', type: 'string' },
            { name: 'wallet', type: 'address' },
          ],
          Mail: [
            { name: 'from', type: 'Person' },
            { name: 'to', type: 'Person' },
            { name: 'contents', type: 'string' },
          ],
        },
        primaryType: 'Mail',
        domain: {
          name: 'Ether Mail',
          version: '1',
          chainId: 1,
          verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
        },
        message: {
          from: {
            name: 'Cow',
            wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
          },
          to: {
            name: 'Bob',
            wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
          },
          contents: 'Hello, Bob!',
        },
      }),
    }
  })

  describe('#getUnapprovedMsgCount', () => {
    it('should be empty if no unapproved msgs', () => {
      const result = typedMessageManager.unapprovedTypedMessagesCount
      assert.strictEqual(result, 0)
    })

    it('should return number of unapproved msgs', () => {
      typedMessageManager.addUnapprovedMessage(msgParamsV1, null, 'V1')
      const result = typedMessageManager.unapprovedTypedMessagesCount
      assert.strictEqual(result, 1)
    })
  })

  describe('#getMsgList', () => {
    it('when new should return empty array', () => {
      const result = typedMessageManager.messages
      assert.ok(Array.isArray(result))
      assert.strictEqual(result.length, 0)
    })
    it('should also return transactions from local storage if any', () => {})
  })

  describe('#Typed message operations', () => {
    beforeEach(async () => {
      networkController = new NetworkController()
      typedMessageManager = new TypedMessageManager({
        getCurrentChainId: networkController.getCurrentChainId.bind(networkController),
      })
      await typedMessageManager.addUnapprovedMessage(msgParamsV3, null, 'V3', 1)
      typedMsgs = typedMessageManager.getUnapprovedMsgs()
      messages = typedMessageManager.messages
      msgId = Object.keys(typedMsgs)[0]
      messages[0].msgParams.metamaskId = parseInt(msgId, 10)
      numberMsgId = parseInt(msgId, 10)
    })
    it('supports version 1 of signedTypedData', function () {
      typedMessageManager.addUnapprovedMessage(msgParamsV1, null, 'V1')
      assert.equal(messages[messages.length - 1].msgParams.data, msgParamsV1.data)
    })

    it('has params address', function () {
      assert.equal(typedMsgs[msgId].msgParams.from, address)
    })

    it('adds to unapproved messages and sets status to unapproved', function () {
      assert.equal(typedMsgs[msgId].status, TRANSACTION_STATUSES.UNAPPROVED)
    })

    it('validates params', function () {
      assert.doesNotThrow(() => {
        typedMessageManager.validateParams(messages[0].msgParams)
      }, 'Does not throw with valid parameters')
    })

    it('gets unapproved by id', function () {
      const getMsg = typedMessageManager.getMsg(numberMsgId)
      assert.equal(getMsg.id, numberMsgId)
    })

    it('approves messages', async function () {
      const messageMetaMaskId = messages[0].msgParams
      typedMessageManager.approveMessage(messageMetaMaskId)
      assert.equal(messages[0].status, TRANSACTION_STATUSES.APPROVED)
    })

    it('sets msg status to signed and adds a raw sig to message details', function () {
      typedMessageManager.setMsgStatusSigned(numberMsgId, 'raw sig')
      assert.equal(messages[0].status, TRANSACTION_STATUSES.SIGNED)
      assert.equal(messages[0].rawSig, 'raw sig')
    })

    it('rejects message', function () {
      typedMessageManager.rejectMsg(numberMsgId)
      assert.equal(messages[0].status, TRANSACTION_STATUSES.REJECTED)
    })
  })
})
