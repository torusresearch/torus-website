import { BroadcastChannel } from 'broadcast-channel'

import { broadcastChannelOptions } from '../../utils/utils'
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
        reject(new Error('user closed popup'))
      })
      this.bc.addEventListener('message', async (ev) => {
        try {
          const { error, data } = ev
          if (error) {
            reject(new Error(error))
            return
          }
          await successExtraFn.call(this, data)
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
}
export default PopupWithBcHandler
