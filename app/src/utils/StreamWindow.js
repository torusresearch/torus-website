import { BroadcastChannel } from 'broadcast-channel'
import log from 'loglevel'
import { broadcastChannelOptions } from './utils'
import torus from '../torus'

class StreamWindow {
  constructor(preopenInstanceId) {
    this.preopenInstanceId = preopenInstanceId
    this.closed = false
  }

  open(url) {
    const bc = new BroadcastChannel(`preopen_channel_${this.preopenInstanceId}`, broadcastChannelOptions)
    log.info('setting up bc', this.preopenInstanceId)
    this.url = url
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
    }, 1000)
    this.windowStream = torus.communicationMux.getStream('window')
    const preopenHandler = chunk => {
      const { preopenInstanceId, closed } = chunk.data
      if (preopenInstanceId === this.preopenInstanceId && closed) {
        this.closed = true
        this.windowStream.removeListener('data', preopenHandler)
      }
    }
    this.windowStream.on('data', preopenHandler)
  }

  close() {
    this.windowStream.write({
      preopenInstanceId: this.preopenInstanceId,
      close: true
    })
  }
}

export default StreamWindow
