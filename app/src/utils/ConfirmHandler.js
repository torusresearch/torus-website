import { BroadcastChannel } from 'broadcast-channel'
import log from 'loglevel'

import config from '../config'
import PopupHandler from './PopupHandler'
import { broadcastChannelOptions, getIFrameOriginObject } from './utils'

const { baseRoute } = config

class ConfirmHandler {
  constructor(torusInstanceId) {
    this.id = undefined
    this.txType = undefined
    this.confirmWindow = {}
    this.torusInstanceId = torusInstanceId
    this.bc = new BroadcastChannel(`torus_channel_${torusInstanceId}`, broadcastChannelOptions)
  }

  open(handleConfirm, handleDeny) {
    const finalUrl = `${baseRoute}confirm?instanceId=${this.torusInstanceId}&integrity=true&id=${this.id}`
    this.confirmWindow = new PopupHandler({
      url: finalUrl,
      target: '_blank',
      features: 'directories=0,titlebar=0,toolbar=0,status=0,location=0,menubar=0,height=660,width=500'
    })
    this.confirmWindow.open()

    this.bc.addEventListener('message', this.handle.bind(this))
    this.handleConfirm = handleConfirm
    this.handleDeny = handleDeny

    this.origin = getIFrameOriginObject()

    this.confirmWindow.once('close', () => {
      this.bc.close()
      log.error('user closed popup')
      this.handleDeny(this.id, this.txType)
      this.id = undefined
      this.txType = undefined
    })
  }

  async sendTx() {
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

  async sendMessage() {
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

  async handle(ev) {
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
