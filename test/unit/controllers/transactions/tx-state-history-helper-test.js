/* eslint-disable */
import assert from 'assert'
import txStateHistoryHelper from '../../../../src/controllers/utils/tx-state-history-helper'
import testVault from '../../../data/v17-long-history.json'

describe('Transaction state history helper', () => {
  describe('#snapshotFromTxMeta', () => {
    it('should clone deep', () => {
      const input = {
        foo: {
          bar: {
            bam: 'baz',
          },
        },
      }
      const output = txStateHistoryHelper.snapshotFromTxMeta(input)
      assert('foo' in output, 'has a foo key')
      assert('bar' in output.foo, 'has a bar key')
      assert('bam' in output.foo.bar, 'has a bar key')
      assert.strictEqual(output.foo.bar.bam, 'baz', 'has a baz value')
    })

    it('should remove the history key', () => {
      const input = { foo: 'bar', history: 'remembered' }
      const output = txStateHistoryHelper.snapshotFromTxMeta(input)
      assert(typeof output.history, 'undefined', 'should remove history')
    })
  })

  describe('#migrateFromSnapshotsToDiffs', () => {
    it('migrates history to diffs and can recover original values', () => {
      testVault.data.TransactionController.transactions.forEach((tx, index) => {
        const newHistory = txStateHistoryHelper.migrateFromSnapshotsToDiffs(tx.history)
        newHistory.forEach((newEntry, index) => {
          if (index === 0) {
            assert.strictEqual(Array.isArray(newEntry), false, 'initial history item IS NOT a json patch obj')
          } else {
            assert.strictEqual(Array.isArray(newEntry), true, 'non-initial history entry IS a json patch obj')
          }
          const oldEntry = tx.history[index]
          const historySubset = newHistory.slice(0, index + 1)
          const reconstructedValue = txStateHistoryHelper.replayHistory(historySubset)
          assert.deepStrictEqual(oldEntry, reconstructedValue, 'was able to reconstruct old entry from diffs')
        })
      })
    })
  })

  describe('#replayHistory', () => {
    it('replaying history does not mutate the original obj', () => {
      const initialState = { test: true, message: 'hello', value: 1 }
      const diff1 = [
        {
          op: 'replace',
          path: '/message',
          value: 'haay',
        },
      ]
      const diff2 = [
        {
          op: 'replace',
          path: '/value',
          value: 2,
        },
      ]
      const history = [initialState, diff1, diff2]

      const beforeStateSnapshot = JSON.stringify(initialState)
      const latestState = txStateHistoryHelper.replayHistory(history)
      const afterStateSnapshot = JSON.stringify(initialState)

      assert.notStrictEqual(initialState, latestState, 'initial state is not the same obj as the latest state')
      assert.strictEqual(beforeStateSnapshot, afterStateSnapshot, 'initial state is not modified during run')
    })
  })

  describe('#generateHistoryEntry', () => {
    function generateHistoryEntryTest(note) {
      const previousState = {
        someValue: 'value 1',
        foo: {
          bar: {
            bam: 'baz',
          },
        },
      }

      const nextState = {
        newPropRoot: 'new property - root',
        someValue: 'value 2',
        foo: {
          newPropFirstLevel: 'new property - first level',
          bar: {
            bam: 'baz',
          },
        },
      }

      const before = Date.now()
      const result = txStateHistoryHelper.generateHistoryEntry(previousState, nextState, note)
      const after = Date.now()

      assert.ok(Array.isArray(result))
      assert.strictEqual(result.length, 3)

      const expectedEntry1 = { op: 'add', path: '/foo/newPropFirstLevel', value: 'new property - first level' }
      assert.strictEqual(result[0].op, expectedEntry1.op)
      assert.strictEqual(result[0].path, expectedEntry1.path)
      assert.strictEqual(result[0].value, expectedEntry1.value)
      assert.strictEqual(result[0].value, expectedEntry1.value)
      if (note) {
        assert.strictEqual(result[0].note, note)
      }

      assert.ok(result[0].timestamp >= before && result[0].timestamp <= after)

      const expectedEntry2 = { op: 'replace', path: '/someValue', value: 'value 2' }
      assert.deepStrictEqual(result[1], expectedEntry2)

      const expectedEntry3 = { op: 'add', path: '/newPropRoot', value: 'new property - root' }
      assert.deepStrictEqual(result[2], expectedEntry3)
    }

    it('should generate history entries', () => {
      generateHistoryEntryTest()
    })

    it('should add note to first entry', () => {
      generateHistoryEntryTest('custom note')
    })
  })
})
