import { BroadcastChannel } from 'broadcast-channel'
import log from 'loglevel'
import pump from 'pump'
import stream from 'stream'
import torus from '../torus'
import { USER_INFO_REQUEST_APPROVED, USER_INFO_REQUEST_REJECTED, USER_INFO_REQUEST_NEW } from '../utils/enums'
import VuexStore from './store'
import { broadcastChannelOptions } from '../utils/utils'

// setup handlers for communicationStream
var passthroughStream = new stream.PassThrough({ objectMode: true })
passthroughStream.on('data', function() {
  log.info('p data:', arguments)
})

// Oauth section
torus.communicationMux.getStream('oauth').on('data', function(chunk) {
  VuexStore.dispatch('triggerLogin', chunk.data)
})
pump(torus.communicationMux.getStream('oauth'), passthroughStream, err => {
  if (err) log.error(err)
})

//  Show Wallet section
const walletStream = torus.communicationMux.getStream('show_wallet')
walletStream.on('data', function(chunk) {
  if (chunk.name === 'show_wallet') walletStream.write({ name: 'show_wallet_instance', data: { instanceId: torus.instanceId } })
})

// topup section
torus.communicationMux.getStream('topup').on('data', function(chunk) {
  VuexStore.dispatch('initiateTopup', chunk.data)
})

// Provider change section
const providerChangeStream = torus.communicationMux.getStream('provider_change')
providerChangeStream.on('data', function(chunk) {
  if (chunk.name === 'show_provider_change') {
    VuexStore.dispatch('showProviderChangePopup', chunk.data)
  }
})

// Logout section
torus.communicationMux.getStream('logout').on('data', function(chunk) {
  if (chunk.name === 'logOut') VuexStore.dispatch('logOut')
})

var logoutChannel = new BroadcastChannel(`torus_logout_channel_${torus.instanceId}`, broadcastChannelOptions)
logoutChannel.onmessage = function(ev) {
  log.info('received logging message', ev)
  if (ev.data && ev.data.type === 'logout') {
    log.info('Logging Out', ev.data)
    VuexStore.dispatch('logOut')
  }
}

// Userinfo section
const userInfoAccessStream = torus.communicationMux.getStream('user_info_access')
userInfoAccessStream.on('data', function(chunk) {
  if (chunk.name === 'user_info_access_request') {
    switch (VuexStore.state.userInfoAccess) {
      case USER_INFO_REQUEST_APPROVED:
        const payload = { ...VuexStore.state.userInfo }
        delete payload.verifierParams
        userInfoAccessStream.write({ name: 'user_info_access_response', data: { approved: true, payload } })
        break
      case USER_INFO_REQUEST_REJECTED:
        userInfoAccessStream.write({ name: 'user_info_access_response', data: { rejected: true } })
        break
      case USER_INFO_REQUEST_NEW:
      default:
        userInfoAccessStream.write({ name: 'user_info_access_response', data: { newRequest: true } })
        break
    }
  }
})

const userInfoStream = torus.communicationMux.getStream('user_info')
userInfoStream.on('data', function(chunk) {
  if (chunk.name === 'user_info_request') VuexStore.dispatch('showUserInfoRequestPopup', chunk.data)
})

var accountImportChannel = new BroadcastChannel(`account_import_channel_${torus.instanceId}`, broadcastChannelOptions)
accountImportChannel.onmessage = function(ev) {
  if (ev.data && ev.data.name === 'imported_account' && ev.data.payload) {
    log.info('importing user account')
    if (!Object.values(VuexStore.state.wallet).includes(ev.data.payload.privKey)) {
      VuexStore.dispatch('finishImportAccount', ev.data.payload)
    }
  }
}

var selectedAddressChannel = new BroadcastChannel(`selected_address_channel_${torus.instanceId}`, broadcastChannelOptions)
selectedAddressChannel.onmessage = function(ev) {
  if (ev.data && ev.data.name == 'selected_address' && ev.data.payload) {
    log.info('setting selected address')
    if (VuexStore.state.selectedAddress !== ev.data.payload) {
      VuexStore.dispatch('updateSelectedAddress', { selectedAddress: ev.data.payload })
    }
  }
}

export default VuexStore
