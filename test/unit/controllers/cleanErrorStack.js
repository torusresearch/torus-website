import assert from 'assert'

import cleanErrorStack from '../../../src/controllers/utils/cleanErrorStack'

describe('Clean Error Stack', () => {
  const testMessage = 'Test Message'
  const testError = new Error(testMessage)
  const undefinedErrorName = new Error(testMessage)
  const blankErrorName = new Error(testMessage)
  const blankMessageError = new Error()

  beforeEach(() => {
    undefinedErrorName.name = undefined
    blankErrorName.name = ''
  })

  it('tests error with message', () => {
    assert.strictEqual(cleanErrorStack(testError).toString(), 'Error: Test Message')
  })

  it('tests error with undefined name', () => {
    assert.strictEqual(cleanErrorStack(undefinedErrorName).toString(), 'Error: Test Message')
  })

  it('tests error with blank name', () => {
    assert.strictEqual(cleanErrorStack(blankErrorName).toString(), 'Test Message')
  })

  it('tests error with blank message', () => {
    assert.strictEqual(cleanErrorStack(blankMessageError).toString(), 'Error')
  })
})
