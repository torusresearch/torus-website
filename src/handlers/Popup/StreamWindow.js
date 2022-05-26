import randomId from '@chaitanyapotti/random-id'
import { BroadcastChannel } from '@toruslabs/broadcast-channel'
import log from 'loglevel'

import torus from '../../torus'
import { broadcastChannelOptions, fakeStream, getIFrameOrigin, waitForMs } from '../../utils/utils'

const windowStream = (torus && torus.communicationMux && torus.communicationMux.getStream('window')) || fakeStream

// Used for windows which are opened by torus-embed
class StreamWindow {
  constructor({ preopenInstanceId, url }) {
    this.preopenInstanceId = preopenInstanceId
    this.closed = false
    if (!preopenInstanceId) {
      this.preopenInstanceId = randomId()
      if (windowStream.on) {
        this.closeHandler = (chunk) => {
          if (chunk.name === 'opened_window' && this.preopenInstanceId === chunk.data.preopenInstanceId) {
            this.open(url)
            if (windowStream.removeListener) windowStream.removeListener('data', this.closeHandler)
          }
        }
        windowStream.on('data', this.closeHandler)
      }
      windowStream.write({
        name: 'create_window',
        data: {
          preopenInstanceId: this.preopenInstanceId,
          url,
        },
      })
    }
  }

  open(url) {
    return new Promise((resolve, reject) => {
      const bc = new BroadcastChannel(`preopen_channel_${this.preopenInstanceId}`, broadcastChannelOptions)
      log.info('setting up bc', this.preopenInstanceId)
      this.url = url
      let popupSuccess = false
      bc.addEventListener('message', (ev) => {
        const { preopenInstanceId: openedId, message } = ev.data
        popupSuccess = true
        if (this.preopenInstanceId === openedId && message === 'popup_loaded') {
          // if (this.writeInterval) clearInterval(this.writeInterval)
          log.info(ev.data, getIFrameOrigin())
          bc.postMessage({
            data: {
              origin: getIFrameOrigin(),
              payload: { url: this.url },
              preopenInstanceId: this.preopenInstanceId,
            },
          })
            .then(() => {
              bc.close()
              resolve()
            })
            .catch((error) => {
              log.error('Failed to communicate via preopen_channel', error)
              bc.close()
              reject(error)
            })
        }
      })

      // We don't know if the other end is ready to receive this msg. So, we keep writing until it receives and sends back something
      // we need backoff strategy
      // we need to wait for first attempt to succeed/fail until the second attempt
      // If we get 429, we need to wait for a while and then try again
      const postMsg = async () => {
        // this never throws
        const localResponse = await bc.postMessage({
          data: {
            preopenInstanceId: this.preopenInstanceId,
            message: 'setup_complete',
          },
        })
        return localResponse
      }

      let currentDelay = bc.type === 'server' ? 1000 : 200

      const recursiveFn = async () => {
        if (!popupSuccess) {
          const localResponse = await postMsg()
          if (bc.type === 'server') {
            const serverResponse = localResponse
            if (serverResponse.status >= 400) {
              // We need to wait for a while and then try again
              currentDelay = Math.round(currentDelay * 1.5)
            }
          }
          await waitForMs(currentDelay)
          await recursiveFn()
        }
      }
      recursiveFn()
      this.preopenHandler = (chunk) => {
        const { preopenInstanceId, closed } = chunk.data
        if (preopenInstanceId === this.preopenInstanceId && closed) {
          this.closed = true
          if (windowStream.removeListener) windowStream.removeListener('data', this.preopenHandler)
        }
      }
      if (windowStream.on) windowStream.on('data', this.preopenHandler)
    })
  }

  close() {
    windowStream.write({
      preopenInstanceId: this.preopenInstanceId,
      close: true,
    })
    if (this.preopenHandler && windowStream.removeListener) windowStream.removeListener('data', this.preopenHandler)
    if (this.closeHandler && windowStream.removeListener) windowStream.removeListener('data', this.closeHandler)
  }
}

export default StreamWindow
