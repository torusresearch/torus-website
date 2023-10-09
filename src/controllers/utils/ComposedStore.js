import { ObservableStore } from './ObservableStore'

export class ComposedStore extends ObservableStore {
  constructor(children) {
    // Typecast: Preserve existing behavior
    super({})

    // subscribe to children
    this._children = children || {}
    Object.keys(this._children).forEach((childKey) => {
      const child = this._children[childKey]
      this._addChild(childKey, child)
    })
  }

  _addChild(childKey, child) {
    const updateFromChild = (childValue) => {
      const state = this.getState()
      state[childKey] = childValue
      this.putState(state)
    }

    child.subscribe(updateFromChild)
    updateFromChild(child.getState())
  }
}
