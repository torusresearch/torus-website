/* eslint-disable */
const assert = require('assert')
const txUtils = require('../../../../src/utils/txUtils')

describe('txUtils', () => {
  describe('#validateTxParams', () => {
    it('does not throw for positive values', () => {
      const sample = {
        from: '0x1678a085c290ebd122dc42cba69373b5953b831d',
        value: '0x01'
      }
      txUtils.validateTxParams(sample)
    })

    it('returns error for negative values', () => {
      const sample = {
        from: '0x1678a085c290ebd122dc42cba69373b5953b831d',
        value: '-0x01'
      }
      try {
        txUtils.validateTxParams(sample)
      } catch (error) {
        assert.ok(error, 'error')
      }
    })
  })

  describe('#normalizeTxParams', () => {
    it('should normalize txParams', () => {
      const txParameters = {
        chainId: '0x1',
        from: 'a7df1beDBF813f57096dF77FCd515f0B3900e402',
        to: null,
        data: '68656c6c6f20776f726c64',
        random: 'hello world'
      }

      let normalizedTxParameters = txUtils.normalizeTxParams(txParameters)

      assert(!normalizedTxParameters.chainId, 'their should be no chainId')
      assert(!normalizedTxParameters.to, 'their should be no to address if null')
      assert.strictEqual(normalizedTxParameters.from.slice(0, 2), '0x', 'from should be hexPrefixd')
      assert.strictEqual(normalizedTxParameters.data.slice(0, 2), '0x', 'data should be hexPrefixd')
      assert(!('random' in normalizedTxParameters), 'their should be no random key in normalizedTxParams')

      txParameters.to = 'a7df1beDBF813f57096dF77FCd515f0B3900e402'
      normalizedTxParameters = txUtils.normalizeTxParams(txParameters)
      assert.strictEqual(normalizedTxParameters.to.slice(0, 2), '0x', 'to should be hexPrefixd')
    })
  })

  describe('#validateRecipient', () => {
    it('removes recipient for txParams with 0x when contract data is provided', () => {
      const zeroRecipientandDataTxParameters = {
        from: '0x1678a085c290ebd122dc42cba69373b5953b831d',
        to: '0x',
        data: 'bytecode'
      }
      const sanitizedTxParameters = txUtils.validateRecipient(zeroRecipientandDataTxParameters)
      assert.deepStrictEqual(sanitizedTxParameters, { from: '0x1678a085c290ebd122dc42cba69373b5953b831d', data: 'bytecode' }, 'no recipient with 0x')
    })

    it('should error when recipient is 0x', () => {
      const zeroRecipientTxParameters = {
        from: '0x1678a085c290ebd122dc42cba69373b5953b831d',
        to: '0x'
      }
      assert.throws(
        () => {
          txUtils.validateRecipient(zeroRecipientTxParameters)
        },
        Error,
        'Invalid recipient address'
      )
    })
  })

  describe('#validateFrom', () => {
    it('should error when from is not a hex string', () => {
      // where from is undefined
      const txParameters = {}
      assert.throws(
        () => {
          txUtils.validateFrom(txParameters)
        },
        Error,
        `Invalid from address ${txParameters.from} not a string`
      )

      // where from is array
      txParameters.from = []
      assert.throws(
        () => {
          txUtils.validateFrom(txParameters)
        },
        Error,
        `Invalid from address ${txParameters.from} not a string`
      )

      // where from is a object
      txParameters.from = {}
      assert.throws(
        () => {
          txUtils.validateFrom(txParameters)
        },
        Error,
        `Invalid from address ${txParameters.from} not a string`
      )

      // where from is a invalid address
      txParameters.from = 'im going to fail'
      assert.throws(
        () => {
          txUtils.validateFrom(txParameters)
        },
        Error,
        'Invalid from address'
      )

      // should run
      txParameters.from = '0x1678a085c290ebd122dc42cba69373b5953b831d'
      txUtils.validateFrom(txParameters)
    })
  })
})
