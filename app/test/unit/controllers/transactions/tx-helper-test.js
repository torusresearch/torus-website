/* eslint-disable */
import assert from 'assert'
import txHelper from '../../../ui/lib/tx-helper'

describe('txHelper', function () {
  it('always shows the oldest tx first', function () {
    const metamaskNetworkId = 1
    const txs = {
      a: { metamaskNetworkId, time: 3 },
      b: { metamaskNetworkId, time: 1 },
      c: { metamaskNetworkId, time: 2 },
    }

    const sorted = txHelper(txs, null, null, metamaskNetworkId)
    assert.strictEqual(sorted[0].time, 1, 'oldest tx first')
    assert.strictEqual(sorted[2].time, 3, 'newest tx last')
  })
})
