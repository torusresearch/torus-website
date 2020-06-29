/* eslint-disable */
const assert = require('assert')
const sinon = require('sinon')
const utils = require('../../../src/utils/utils')

describe('util', () => {
  beforeEach(function () {
    this.sinon = sinon.createSandbox()
  })

  afterEach(function () {
    this.sinon.restore()
  })

  describe('#hexToText', () => {
    const message = 'hello world'
    const hexEquivalent = '0x68656c6c6f20776f726c64'
    it('should decode hex to text properly', () => {
      const convertedText = utils.hexToText(hexEquivalent)
      assert.deepStrictEqual(convertedText, message)
    })

    it('should return blank string if unable to decode', () => {
      const convertedText = utils.hexToText('test')
      assert.deepStrictEqual(convertedText, '')
    })

    it('should return the same input if error', () => {
      const testObject = { a: 'b' }
      const converted = utils.hexToText(testObject)
      assert.deepStrictEqual(converted, testObject)
    })
  })
})
