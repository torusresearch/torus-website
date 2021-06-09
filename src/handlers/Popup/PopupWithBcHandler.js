import { BroadcastChannel } from 'broadcast-channel'
import log from 'loglevel'

import { POPUP_LOADED, POPUP_RESULT } from '../../utils/enums'
import { broadcastChannelOptions, UserError } from '../../utils/utils'
import PopupHandler from './PopupHandler'

class PopupWithBcHandler extends PopupHandler {
  constructor({ url, target, features, preopenInstanceId, channelName }) {
    super({ url, target, features, preopenInstanceId })
    this.bc = new BroadcastChannel(channelName, broadcastChannelOptions)
  }

  handle(successExtraFn) {
    return new Promise((resolve, reject) => {
      this.once('close', () => {
        this.bc.close()
        reject(new UserError('user closed popup'))
      })
      this.bc.addEventListener('message', async (ev) => {
        log.info(ev, 'receiving')
        try {
          const { error, data } = ev
          if (error) {
            reject(new Error(error))
            return
          }
          if (successExtraFn) await successExtraFn.call(this, data)
          resolve(data)
        } catch (error) {
          reject(error)
        } finally {
          this.bc.close()
          this.close()
        }
      })
      return this.open()
    })
  }

  handleWithHandshake({ payload, successExtraFn }) {
    return new Promise((resolve, reject) => {
      this.once('close', () => {
        this.bc.close()
        reject(new UserError('user closed popup'))
      })
      this.bc.addEventListener('message', async (ev) => {
        try {
          const { error, data } = ev
          if (error) {
            reject(new Error(error))
            return
          }
          const { type = '' } = data || {}
          if (type === POPUP_LOADED) {
            await this.bc.postMessage({
              data: payload,
            })
          } else if (type === POPUP_RESULT) {
            if (successExtraFn) await successExtraFn.call(this, data)
            resolve(data)
            this.bc.close()
            this.close()
          }
        } catch (error) {
          reject(error)
          this.bc.close()
          this.close()
        }
      })
      return this.open()
    })
  }
}
export default PopupWithBcHandler
