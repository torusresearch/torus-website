import { BroadcastChannel } from 'broadcast-channel'
import log from 'loglevel'
import { broadcastChannelOptions } from './utils'
import torus from '../torus'
import PopupHandler from './PopupHandler'
import config from '../config'

const baseRoute = config.baseRoute

class ConfirmHandler {
  constructor() {
    this.id = undefined
    this.txType = undefined
    this.confirmWindow = {}
    this.bc = new BroadcastChannel(`torus_channel_${torus.instanceId}`, broadcastChannelOptions)
  }

  open = (handleConfirm, handleDeny) => {
    const finalUrl = `${baseRoute}confirm?instanceId=${torus.instanceId}&integrity=true&id=${this.id}`
    this.confirmWindow = new PopupHandler({
      url: finalUrl,
      target: '_blank',
      features: 'directories=0,titlebar=0,toolbar=0,status=0,location=0,menubar=0,height=660,width=500'
    })
    this.confirmWindow.open()

    this.bc.onmessage = this.handle
    this.handleConfirm = handleConfirm
    this.handleDeny = handleDeny

    this.confirmWindow.once('close', () => {
      this.bc.close()
      log.error('user closed popup')
      this.handleDeny(this.id, this.txType)
      this.id = undefined
      this.txType = undefined
    })
  }

  sendTx = async () => {
    await this.bc.postMessage({
      name: 'send-params',
      data: {
        origin: window.location.ancestorOrigins ? window.location.ancestorOrigins[0] : document.referrer,
        type: this.txType,
        txParams: { ...this.txParams, network: this.host },
        balance: this.balance
      }
    })
  }

  sendMessage = async () => {
    await this.bc.postMessage({
      name: 'send-params',
      data: {
        origin: window.location.ancestorOrigins ? window.location.ancestorOrigins[0] : document.referrer,
        type: this.txType,
        msgParams: { msgParams: this.msgParams, id: this.id }
      }
    })
  }

  handle = async ev => {
    if (ev.name === 'popup-loaded' && ev.data.id.toString() === this.id.toString()) {
      if (this.isTx) this.sendTx()
      else this.sendMessage()
    } else if (ev.name === 'tx-result' && this.id.toString() === ev.data.id.toString()) {
      if (ev.data.type === 'confirm-transaction') {
        this.handleConfirm(ev)
      } else if (ev.data.type === 'deny-transaction') {
        this.handleDeny(ev.data.id, ev.data.txType)
      }
      this.bc.close()
      this.id = undefined
      this.txType = undefined
      this.confirmWindow.close()
    }
  }
}

export default ConfirmHandler
