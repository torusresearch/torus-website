import { BroadcastChannel } from 'broadcast-channel'
import log from 'loglevel'
import randomId from '@chaitanyapotti/random-id'
import { broadcastChannelOptions } from './utils'
import torus from '../torus'

const windowStream = torus.communicationMux.getStream('window')

class StreamWindow {
  constructor(preopenInstanceId, url) {
    this.preopenInstanceId = preopenInstanceId
    this.closed = false
    if (!preopenInstanceId) {
      this.preopenInstanceId = randomId()
      windowStream.on('data', chunk => {
        if (chunk.name === 'opened_window' && this.preopenInstanceId === chunk.data.preopenInstanceId) {
          this.open(url)
        }
      })
      windowStream.write({
        name: 'create_window',
        data: {
          preopenInstanceId: this.preopenInstanceId
        }
      })
    }
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
    const preopenHandler = chunk => {
      const { preopenInstanceId, closed } = chunk.data
      if (preopenInstanceId === this.preopenInstanceId && closed) {
        this.closed = true
        windowStream.removeListener('data', preopenHandler)
      }
    }
    windowStream.on('data', preopenHandler)
  }

  close() {
    windowStream.write({
      preopenInstanceId: this.preopenInstanceId,
      close: true
    })
  }
}

export default StreamWindow
