import { BroadcastChannel } from 'broadcast-channel'
import log from 'loglevel'

import { POPUP_LOADED, POPUP_RESULT } from '../../utils/enums'
import { broadcastChannelOptions } from '../../utils/utils'
import PopupHandler from './PopupHandler'

const OPENED = 'OPENED'
const FINISHED = 'FINISHED'

function createPopupManager() {
  let popups = []
  return {
    get availablePopups() {
      return popups.filter((x) => x.status === FINISHED)
    },
    addPopup(id, name, window) {
      popups.push({ id, name, window, status: OPENED, timer: null })
    },
    removePopup(id) {
      popups = popups.filter((x) => x.id === id)
    },
    changeStatus(id, status, timer) {
      const popup = popups.find((x) => x.id === id)
      popup.status = status
      popup.timer = timer
    },
  }
}

const popupManager = createPopupManager()

class PopupWithBcHandler extends PopupHandler {
  constructor({ url, target, features, preopenInstanceId, channelName, channelId }) {
    super({ url, target, features, preopenInstanceId })
    this.bc = new BroadcastChannel(channelName, broadcastChannelOptions)
    this.channelId = channelId
    this.channelName = channelName
  }

  handle(successExtraFn) {
    return new Promise((resolve, reject) => {
      this.once('close', () => {
        this._handlePopupClose(true)
        reject(new Error('user closed popup'))
      })
      this.bc.addEventListener('message', async (ev) => {
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
          this._handlePopupClose(false)
        }
      })
      return this._handlePopupOpen()
    })
  }

  handleWithHandshake({ payload, successExtraFn }) {
    return new Promise((resolve, reject) => {
      this.once('close', () => {
        this._handlePopupClose(true)
        reject(new Error('user closed popup'))
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
            this._handlePopupClose(false)
          }
        } catch (error) {
          reject(error)
          this._handlePopupClose(false)
        }
      })
      return this._handlePopupOpen()
    })
  }

  async _handlePopupOpen() {
    const { availablePopups } = popupManager
    log.info(availablePopups, 'popups available')
    if (availablePopups.length > 0) {
      const latestPopup = availablePopups[availablePopups.length - 1]
      clearTimeout(latestPopup.timer)
      popupManager.removePopup(latestPopup.id)
      const bc = new BroadcastChannel(latestPopup.name, broadcastChannelOptions)
      log.info('redirecint to', this.url)
      await bc.postMessage({
        data: { redirect: this.url },
      })
      log.info('hijacking popups available')
      this.window = latestPopup.window
    } else {
      await this.open()
    }
    popupManager.addPopup(this.channelId, this.channelName, this.window)
  }

  async _handlePopupClose(isClosed) {
    log.info('closing', this.channelId)
    if (isClosed) {
      this.bc.close()
      popupManager.removePopup(this.channelId)
    } else {
      const timer = setTimeout(() => {
        this.close()
        this._handlePopupClose(true)
      }, 2000)
      popupManager.changeStatus(this.channelId, FINISHED, timer)
    }
  }
}
export default PopupWithBcHandler
