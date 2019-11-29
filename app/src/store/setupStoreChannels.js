import { BroadcastChannel } from 'broadcast-channel'
import log from 'loglevel'
import pump from 'pump'
import stream from 'stream'
import torus from '../torus'
import { USER_INFO_REQUEST_APPROVED, USER_INFO_REQUEST_REJECTED, USER_INFO_REQUEST_NEW } from '../utils/enums'
import VuexStore from './store'
import { broadcastChannelOptions } from '../utils/utils'

/* 
Edited to change networkId => network state. Has an implication of changing neworkVersion 
to "loading" at times in the inpage API
 */

torus.torusController.networkController.networkStore.subscribe(function(state) {
  VuexStore.dispatch('updateNetworkId', { networkId: state })
})

// setup handlers for communicationStream
var passthroughStream = new stream.PassThrough({ objectMode: true })
passthroughStream.on('data', function() {
  log.info('p data:', arguments)
})

torus.communicationMux.getStream('oauth').on('data', function(chunk) {
  VuexStore.dispatch('triggerLogin', {
    calledFromEmbed: chunk.data.calledFromEmbed,
    verifier: chunk.data.verifier,
    preopenInstanceId: chunk.data.preopenInstanceId
  })
})

torus.communicationMux.getStream('show_wallet').on('data', function(chunk) {
  VuexStore.dispatch('showWalletPopup', { path: chunk.data.path || '' })
})

torus.communicationMux.getStream('topup').on('data', function(chunk) {
  VuexStore.dispatch('initiateTopup', chunk.data)
})

torus.communicationMux.getStream('show_provider_change').on('data', function(chunk) {
  if (chunk.name === 'show_provider_change') {
    const providerChangeStatus = torus.communicationMux.getStream('provider_change_status')
    if (chunk.data.override) {
      VuexStore.dispatch('setProviderType', chunk.data)
        .then(() => {
          setTimeout(() => {
            providerChangeStatus.write({
              name: 'provider_change_status',
              data: {
                success: true
              }
            })
          }, 100)
        })
        .catch(err => {
          providerChangeStatus.write({
            name: 'provider_change_status',
            data: {
              success: false,
              err: err
            }
          })
        })
    } else {
      VuexStore.dispatch('showProviderChangePopup', { ...chunk.data })
    }
  }
})

torus.communicationMux.getStream('logout').on('data', function(chunk) {
  if (chunk.name === 'logOut') VuexStore.dispatch('logOut')
})

const userInfoStream = torus.communicationMux.getStream('user_info')
userInfoStream.on('data', function(chunk) {
  if (chunk.name === 'user_info_request') {
    const userInfoRequestChannel = new BroadcastChannel(`user_info_request_channel_${torus.instanceId}`, broadcastChannelOptions)
    switch (VuexStore.state.userInfoAccess) {
      case USER_INFO_REQUEST_APPROVED:
        userInfoRequestChannel.postMessage({
          data: { type: 'confirm-user-info-request', approve: true }
        })
        break
      case USER_INFO_REQUEST_REJECTED:
        userInfoRequestChannel.postMessage({ data: { type: 'deny-user-info-request', approve: false } })
        break
      case USER_INFO_REQUEST_NEW:
      default:
        VuexStore.dispatch('showUserInfoRequestPopup', { ...chunk.data })
        break
    }
  }
})

pump(torus.communicationMux.getStream('oauth'), passthroughStream, err => {
  if (err) log.error(err)
})

var providerChangeChannel = new BroadcastChannel(`torus_provider_change_channel_${torus.instanceId}`, broadcastChannelOptions)
providerChangeChannel.onmessage = function(ev) {
  if (ev.data && ev.data.type === 'confirm-provider-change' && ev.data.approve) {
    log.info('Provider change approved', ev.data.payload)
    const providerChangeStatus = torus.communicationMux.getStream('provider_change_status')
    VuexStore.dispatch('setProviderType', ev.data.payload)
      .then(() => {
        setTimeout(() => {
          providerChangeStatus.write({
            name: 'provider_change_status',
            data: {
              success: true
            }
          })
        }, 100)
      })
      .catch(err => {
        providerChangeStatus.write({
          name: 'provider_change_status',
          data: {
            success: false,
            err: err
          }
        })
      })
  } else if (ev.data && ev.data.type === 'deny-provider-change') {
    log.info('Provider change denied')
  }
}

var logoutChannel = new BroadcastChannel(`torus_logout_channel_${torus.instanceId}`, broadcastChannelOptions)
logoutChannel.onmessage = function(ev) {
  log.info('received logging message', ev)
  if (ev.data && ev.data.type === 'logout') {
    log.info('Logging Out', ev.data)
    VuexStore.dispatch('logOut')
  }
}

var userInfoRequestChannel = new BroadcastChannel(`user_info_request_channel_${torus.instanceId}`, broadcastChannelOptions)
userInfoRequestChannel.onmessage = function(ev) {
  if (ev.data && ev.data.type === 'confirm-user-info-request' && ev.data.approve) {
    log.info('User Info Request approved')
    VuexStore.dispatch('updateUserInfoAccess', { approved: true })
    const returnObj = JSON.parse(JSON.stringify(VuexStore.state.userInfo))
    delete returnObj.verifierParams
    userInfoStream.write({ name: 'user_info_response', data: { payload: returnObj, approved: true } })
  } else if (ev.data && ev.data.type === 'deny-user-info-request') {
    log.info('User Info Request denied')
    VuexStore.dispatch('updateUserInfoAccess', { approved: false })
    userInfoStream.write({ name: 'user_info_response', data: { payload: {}, approved: false } })
  }
}

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
