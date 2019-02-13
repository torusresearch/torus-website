var assert = require('assert')
var sinon = require('sinon')
var utils = require('../../../src/utils/utils')

describe('util', function() {
  beforeEach(function() {
    this.sinon = sinon.createSandbox()
  })

  afterEach(function() {
    this.sinon.restore()
  })

  describe('#hexToText', function() {
    const message = 'hello world'
    const hexEquivalent = '68656c6c6f20776f726c64'
    it('should decode hex to text properly', () => {
      const convertedText = utils.hexToText(hexEquivalent)
      assert.deepStrictEqual(convertedText, message)
    })

    it('should return same string if unable to decode', () => {
      const convertedText = utils.hexToText('test')
      assert.deepStrictEqual(convertedText, 'test')
    })
  })
})
