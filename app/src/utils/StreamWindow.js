import { BroadcastChannel } from 'broadcast-channel'
import log from 'loglevel'
import randomId from '@chaitanyapotti/random-id'
import { broadcastChannelOptions, fakeStream } from './utils'
import torus from '../torus'

const windowStream = (torus.communicationMux && torus.communicationMux.getStream('window')) || fakeStream

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
    return new Promise((resolve, reject) => {
      const bc = new BroadcastChannel(`preopen_channel_${this.preopenInstanceId}`, broadcastChannelOptions)
      log.info('setting up bc', this.preopenInstanceId)
      this.url = url
      bc.onmessage = ev => {
        const { preopenInstanceId: openedId, message } = ev.data
        if (this.preopenInstanceId === openedId && message === 'popup_loaded') {
          this.writeInterval && clearInterval(this.writeInterval)
          log.info(ev.data)
          bc.postMessage({
            data: {
              origin: window.location.ancestorOrigins ? window.location.ancestorOrigins[0] : document.referrer,
              payload: { url: this.url },
              preopenInstanceId: this.preopenInstanceId
            }
          })
            .catch(err => {
              log.error('Failed to communicate via preopen_channel', err)
              reject()
            })
            .finally(() => {
              bc.close()
              resolve()
            })
        }
      }
      this.writeInterval = setInterval(() => {
        bc.postMessage({
          data: {
            preopenInstanceId: this.preopenInstanceId,
            message: 'setup_complete'
          }
        })
      }, 200)
      const preopenHandler = chunk => {
        const { preopenInstanceId, closed } = chunk.data
        if (preopenInstanceId === this.preopenInstanceId && closed) {
          this.closed = true
          windowStream.removeListener('data', preopenHandler)
        }
      }
      windowStream.on('data', preopenHandler)
    })
  }

  close() {
    windowStream.write({
      preopenInstanceId: this.preopenInstanceId,
      close: true
    })
  }
}

export default StreamWindow
