import { SafeEventEmitter } from '@toruslabs/openlogin-jrpc'

export class ObservableStore extends SafeEventEmitter {
  constructor(initState) {
    super()
    if (initState === undefined) {
      this._state = {}
    } else {
      this._state = initState
    }
  }

  getState() {
    return this._getState()
  }

  putState(newState) {
    this._putState(newState)
    this.emit('update', newState)
  }

  updateState(partialState) {
    // if non-null object, merge
    if (partialState && typeof partialState === 'object') {
      const state = this.getState()
      this.putState({ ...state, ...partialState })
      // if not object, use new value
    } else {
      this.putState(partialState)
    }
  }

  subscribe(handler) {
    this.on('update', handler)
  }

  unsubscribe(handler) {
    this.removeListener('update', handler)
  }

  _getState() {
    return this._state
  }

  _putState(newState) {
    this._state = newState
  }
}
