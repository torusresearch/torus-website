import { ObservableStore } from '@metamask/obs-store'
import assert from 'assert'

import ComposableObservableStore from '../../../src/controllers/utils/ComposableObservableStore'

describe('ComposableObservableStore', () => {
  it('should register initial state', () => {
    const store = new ComposableObservableStore('state')
    assert.strictEqual(store.getState(), 'state')
  })

  it('should register initial structure', () => {
    const testStore = new ObservableStore()
    const store = new ComposableObservableStore(null, { TestStore: testStore })
    testStore.putState('state')
    assert.deepStrictEqual(store.getState(), { TestStore: 'state' })
  })

  it('should update structure', () => {
    const testStore = new ObservableStore()
    const store = new ComposableObservableStore()
    store.updateStructure({ TestStore: testStore })
    testStore.putState('state')
    assert.deepStrictEqual(store.getState(), { TestStore: 'state' })
  })

  it('should return flattened state', () => {
    const fooStore = new ObservableStore({ foo: 'foo' })
    const barStore = new ObservableStore({ bar: 'bar' })
    const store = new ComposableObservableStore(null, {
      FooStore: fooStore,
      BarStore: barStore,
    })
    assert.deepStrictEqual(store.getFlatState(), { foo: 'foo', bar: 'bar' })
  })
})
