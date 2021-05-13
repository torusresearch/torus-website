import { BroadcastChannel } from 'broadcast-channel'
import log from 'loglevel'
import pump from 'pump'
import stream from 'stream'

import { injectStore as onloadInjection } from '../onload'
import torus from '../torus'
// import { USER_INFO_REQUEST_APPROVED, USER_INFO_REQUEST_NEW, USER_INFO_REQUEST_REJECTED } from '../utils/enums'
import { broadcastChannelOptions, isMain } from '../utils/utils'
import { injectStore as controllerInjection } from './controllerSubscriptions'
import VuexStore from './store'

onloadInjection(VuexStore)
controllerInjection(VuexStore)

if (!isMain) {
  // setup handlers for communicationStream
  const passthroughStream = new stream.PassThrough({ objectMode: true })
  passthroughStream.on('data', (...arguments_) => {
    log.info('p data:', arguments_)
  })

  // Oauth section
  torus.communicationMux.getStream('oauth').on('data', (chunk) => {
    const { name, data } = chunk
    if (name === 'oauth_modal') {
      // show modal route
      VuexStore.commit('setOAuthModalStatus', true)
    } else if (name === 'oauth') {
      VuexStore.dispatch('triggerLogin', data)
    }
  })
  pump(torus.communicationMux.getStream('oauth'), passthroughStream, (error) => {
    if (error) log.error(error)
  })

  //  Show Wallet section
  const walletStream = torus.communicationMux.getStream('show_wallet')
  walletStream.on('data', (chunk) => {
    if (chunk.name === 'show_wallet') walletStream.write({ name: 'show_wallet_instance', data: { instanceId: torus.instanceId } })
  })

  // topup section
  torus.communicationMux.getStream('topup').on('data', (chunk) => {
    VuexStore.dispatch('initiateTopup', chunk.data)
  })

  const initStream = torus.communicationMux.getStream('init_stream')
  initStream.on('data', (chunk) => {
    const {
      name,
      data: {
        enabledVerifiers = {},
        apiKey = 'torus-default',
        whiteLabel = {},
        buttonPosition = '',
        torusWidgetVisibility = true,
        loginConfig = {},
        skipTKey = false,
      },
    } = chunk
    if (name === 'init_stream') {
      VuexStore.commit('setButtonPosition', buttonPosition)
      VuexStore.commit('setAPIKey', apiKey)
      if (Object.keys(whiteLabel).length > 0) VuexStore.commit('setWhiteLabel', whiteLabel)
      VuexStore.commit('setTorusWidgetVisibility', torusWidgetVisibility)
      VuexStore.commit('setLoginConfig', { enabledVerifiers, loginConfig })
      VuexStore.commit('setSkipTKey', skipTKey)
      const { isRehydrationComplete } = VuexStore.state
      if (isRehydrationComplete) {
        initStream.write({
          name: 'init_complete',
          data: { success: true },
        })
      } else {
        const unWatcher = VuexStore.watch(
          (state) => state.isRehydrationComplete,
          (newValue, oldValue) => {
            if (newValue !== oldValue && newValue === true) {
              initStream.write({
                name: 'init_complete',
                data: { success: true },
              })
              unWatcher()
            }
          }
        )
      }
    }
  })

  const widgetVisibilityStream = torus.communicationMux.getStream('torus-widget-visibility')
  widgetVisibilityStream.on('data', (chunk) => {
    const { data } = chunk
    VuexStore.commit('setTorusWidgetVisibility', data)
  })

  // Provider change section
  const providerChangeStream = torus.communicationMux.getStream('provider_change')
  providerChangeStream.on('data', (chunk) => {
    if (chunk.name === 'show_provider_change') {
      VuexStore.dispatch('showProviderChangePopup', chunk.data)
    }
  })

  // Logout section
  torus.communicationMux.getStream('logout').on('data', (chunk) => {
    if (chunk.name === 'logOut') VuexStore.dispatch('logOut')
  })

  const logoutChannel = new BroadcastChannel(`torus_logout_channel_${torus.instanceId}`, broadcastChannelOptions)
  logoutChannel.addEventListener('message', (ev) => {
    log.info('received logging message', ev)
    if (ev.data && ev.data.type === 'logout') {
      log.info('Logging Out', ev.data)
      VuexStore.dispatch('logOut')
    }
  })

  // Userinfo section
  const userInfoAccessStream = torus.communicationMux.getStream('user_info_access')
  userInfoAccessStream.on('data', (chunk) => {
    const payload = { ...VuexStore.state.userInfo }
    delete payload.verifierParams
    if (chunk.name === 'user_info_access_request') {
      userInfoAccessStream.write({ name: 'user_info_access_response', data: { approved: true, payload } })
      // switch (VuexStore.state.userInfoAccess) {
      //   case USER_INFO_REQUEST_APPROVED:
      //     userInfoAccessStream.write({ name: 'user_info_access_response', data: { approved: true, payload } })
      //     break
      //   case USER_INFO_REQUEST_REJECTED:
      //   case USER_INFO_REQUEST_NEW:
      //   default:
      //     userInfoAccessStream.write({ name: 'user_info_access_response', data: { newRequest: true } })
      //     break
      // }
    }
  })

  const userInfoStream = torus.communicationMux.getStream('user_info')
  userInfoStream.on('data', (chunk) => {
    if (chunk.name === 'user_info_request') VuexStore.dispatch('showUserInfoRequestPopup', chunk.data)
  })

  const accountImportChannel = new BroadcastChannel(`account_import_channel_${torus.instanceId}`, broadcastChannelOptions)
  accountImportChannel.addEventListener('message', (ev) => {
    if (ev.data && ev.data.name === 'imported_account' && ev.data.payload) {
      log.info('importing user account')
      if (
        !Object.values(VuexStore.state.wallet)
          .map((x) => x.privateKey)
          .includes(ev.data.payload.privKey)
      ) {
        VuexStore.dispatch('finishImportAccount', ev.data.payload)
      }
    }
  })

  const selectedAddressChannel = new BroadcastChannel(`selected_address_channel_${torus.instanceId}`, broadcastChannelOptions)
  selectedAddressChannel.addEventListener('message', (ev) => {
    if (ev.data && ev.data.name === 'selected_address' && ev.data.payload) {
      log.info('setting selected address')
      if (VuexStore.state.selectedAddress !== ev.data.payload) {
        VuexStore.dispatch('updateSelectedAddress', { selectedAddress: ev.data.payload })
      }
    }
  })

  // used for communication between popup and iframe
  const providerChangeChannel = new BroadcastChannel(`provider_change_${torus.instanceId}`, broadcastChannelOptions)
  providerChangeChannel.addEventListener('message', (ev) => {
    if (ev.data && ev.data.name === 'provider_change' && ev.data.payload) {
      log.info('setting provider')
      const { network } = ev.data.payload
      if (VuexStore.state.networkType.host !== network.host) {
        VuexStore.dispatch('setProviderType', ev.data.payload)
      }
    }
  })
}

export default VuexStore
