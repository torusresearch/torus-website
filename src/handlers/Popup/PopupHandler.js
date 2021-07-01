// import randomId from '@chaitanyapotti/random-id'
import { EventEmitter } from 'events'

import config from '../../config'
import { FEATURES_DEFAULT_POPUP_WINDOW } from '../../utils/enums'
import StreamWindow from './StreamWindow'

class PopupHandler extends EventEmitter {
  constructor({ url, target, features, preopenInstanceId }) {
    super()
    // this.id = randomId()
    // Add in dapp storage key to all popups as a hash parameter
    const localUrl = url instanceof URL ? url : new URL(url)
    if (config.dappStorageKey) {
      if (localUrl.hash) localUrl.hash += `&dappStorageKey=${config.dappStorageKey}`
      else localUrl.hash = `#dappStorageKey=${config.dappStorageKey}`
    }
    this.url = localUrl.href
    this.target = target || '_blank'
    this.features = features || FEATURES_DEFAULT_POPUP_WINDOW
    this.window = undefined
    this.windowTimer = {}
    this.iClosedWindow = false
    this.preopenInstanceId = preopenInstanceId
    this._setupTimer()
  }

  _setupTimer() {
    this.windowTimer = setInterval(() => {
      if (this.window && this.window.closed) {
        clearInterval(this.windowTimer)
        if (!this.iClosedWindow) {
          this.emit('close')
        }
        this.iClosedWindow = false
        this.window = undefined
      }
      if (this.window === undefined) clearInterval(this.windowTimer)
    }, 500)
  }

  open() {
    // if window is already open
    if (!this.preopenInstanceId) {
      // try to open a window first
      this.window = window.open(this.url, this.target, this.features)
      if (!this.window) {
        // if it's blocked, open streamwindow
        this.window = new StreamWindow({ url: this.url })
      }
      return Promise.resolve()
    }
    this.window = new StreamWindow({ preopenInstanceId: this.preopenInstanceId })
    return this.window.open(this.url)
  }

  close() {
    this.iClosedWindow = true
    if (this.window) this.window.close()
  }
}

export default PopupHandler
