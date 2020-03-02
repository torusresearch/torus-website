import { BroadcastChannel } from 'broadcast-channel'
import log from 'loglevel'
import { broadcastChannelOptions, getIFrameOriginObj } from './utils'
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

    this.origin = getIFrameOriginObj()

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
        origin: this.origin,
        type: this.txType,
        txParams: this.txParams,
        balance: this.balance,
        selectedCurrency: this.selectedCurrency,
        tokenRates: this.tokenRates,
        jwtToken: this.jwtToken,
        currencyData: this.currencyData,
        network: this.networkType
      }
    })
  }

  sendMessage = async () => {
    await this.bc.postMessage({
      name: 'send-params',
      data: {
        origin: this.origin,
        type: this.txType,
        msgParams: { msgParams: this.msgParams, id: this.id },
        selectedCurrency: this.selectedCurrency,
        tokenRates: this.tokenRates,
        jwtToken: this.jwtToken,
        currencyData: this.currencyData,
        network: this.networkType
      }
    })
  }

  handle = async ev => {
    const { name, data: { id = '', type = '', txType = '' } = {} } = ev
    if (name === 'popup-loaded' && id.toString() === this.id.toString()) {
      if (this.isTx) this.sendTx()
      else this.sendMessage()
    } else if (name === 'tx-result' && this.id.toString() === id.toString()) {
      if (type === 'confirm-transaction') {
        this.handleConfirm(ev)
      } else if (type === 'deny-transaction') {
        this.handleDeny(id, txType)
      }
      this.bc.close()
      this.id = undefined
      this.txType = undefined
      this.confirmWindow.close()
    }
  }
}

export default ConfirmHandler
