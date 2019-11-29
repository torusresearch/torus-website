import { EventEmitter } from 'events'
import log from 'loglevel'
import { BroadcastChannel } from 'broadcast-channel'
import { broadcastChannelOptions } from './utils'
import torus from '../torus'

class PopupHandler extends EventEmitter {
  constructor({ url, target, features, preopenInstanceId }) {
    super()
    this.url = url
    this.target = target || '_blank'
    this.features = features || 'directories=0,titlebar=0,toolbar=0,status=0,location=0,menubar=0,height=700,width=1200'
    this.window = undefined
    this.windowTimer = {}
    this.iClosedWindow = false
    this.preopenInstanceId = preopenInstanceId
    if (!preopenInstanceId) this._setupTimer()
  }

  _setupTimer() {
    this.windowTimer = setInterval(() => {
      if (this.window && this.window.closed) {
        clearInterval(this.windowTimer)
        if (!this.iClosedWindow) {
          log.error('user closed popup')
          this.emit('close')
        }
        this.iClosedWindow = false
        this.window = undefined
      }
      if (this.window === undefined) clearInterval(this.windowTimer)
    }, 1000)
  }

  open() {
    if (!this.preopenInstanceId) this.window = window.open(this.url, this.target, this.features)
    else {
      const bc = new BroadcastChannel(`preopen_channel_${this.preopenInstanceId}`, broadcastChannelOptions)
      log.info('setting up bc', this.preopenInstanceId)
      setTimeout(() => {
        bc.postMessage({
          data: {
            origin: window.location.ancestorOrigins ? window.location.ancestorOrigins[0] : document.referrer,
            payload: { url: this.url }
          }
        })
          .then(() => {
            bc.close()
          })
          .catch(err => {
            log.error('Failed to communicate via preopen_channel', err)
            bc.close()
          })
      }, 2000)
      // this.window = new WindowReference(this.preopenInstanceId)
      this.windowStream = torus.communicationMux.getStream('window')
      const preopenHandler = chunk => {
        const { preopenInstanceId, closed } = chunk.data
        if (preopenInstanceId === this.preopenInstanceId && closed) {
          log.error('user closed popup')
          this.emit('close')
          this.windowStream.removeListener('data', preopenHandler)
        }
      }
      this.windowStream.on('data', preopenHandler)
    }
  }

  close() {
    if (!this.preopenInstanceId) {
      this.iClosedWindow = true
      this.window && this.window.close()
    } else {
      this.windowStream.write({
        preopenInstanceId: this.preopenInstanceId,
        close: true
      })
    }
  }
}

export default PopupHandler
