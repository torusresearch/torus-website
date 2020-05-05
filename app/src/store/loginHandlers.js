import { BroadcastChannel } from 'broadcast-channel'
import log from 'loglevel'

import torus from '../torus'
import { get } from '../utils/httpHelpers'
import PopupHandler from '../utils/PopupHandler'
import { broadcastChannelOptions } from '../utils/utils'

export async function googleHandler(verifierParameters) {
  const { access_token: accessToken, id_token: idToken } = verifierParameters
  const userInfo = await get('https://www.googleapis.com/userinfo/v2/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  const { picture: profileImage, email, name } = userInfo || {}
  return {
    profileImage,
    name,
    email,
    verifierId: email.toString().toLowerCase(),
    verifierParams: { verifier_id: email.toString().toLowerCase() },
    token: idToken,
  }
}

export async function facebookHandler(verifierParameters) {
  const { access_token: accessToken } = verifierParameters
  const userInfo = await get('https://graph.facebook.com/me?fields=name,email,picture.type(large)', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  const { name, id, picture, email } = userInfo || {}
  return {
    profileImage: picture.data.url,
    name,
    email,
    verifierId: id.toString(),
    verifierParams: { verifier_id: id.toString() },
    token: accessToken,
  }
}

export async function twitchHandler(verifierParameters) {
  const { access_token: accessToken } = verifierParameters
  const userInfo = await get('https://api.twitch.tv/helix/users', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  const [{ profile_image_url: profileImage, display_name: name, email, id: verifierId }] = userInfo.data || {}
  return {
    profileImage,
    name,
    email,
    verifierId,
    verifierParams: { verifier_id: verifierId },
    token: accessToken.toString(),
  }
}

export async function redditHandler(verifierParameters) {
  const { access_token: accessToken } = verifierParameters
  const userInfo = await get('https://oauth.reddit.com/api/v1/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  const { icon_img: profileImage, name } = userInfo || {}
  return {
    profileImage: profileImage.split('?').length > 0 ? profileImage.split('?')[0] : profileImage,
    name,
    email: '',
    verifierId: name.toString().toLowerCase(),
    verifierParams: { verifier_id: name.toString().toLowerCase() },
    token: accessToken,
  }
}

export async function discordHandler(verifierParameters) {
  const { access_token: accessToken } = verifierParameters
  const userInfo = await get('https://discordapp.com/api/users/@me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  const { id, avatar, email, username: name, discriminator } = userInfo || {}
  const profileImage =
    avatar === null
      ? `https://cdn.discordapp.com/embed/avatars/${discriminator % 5}.png`
      : `https://cdn.discordapp.com/avatars/${id}/${avatar}.png?size=2048`
  return {
    profileImage,
    name: `${name}#${discriminator}`,
    email,
    verifierId: id.toString(),
    verifierParams: { verifier_id: id.toString() },
    token: accessToken,
  }
}

export const handleLoginWindow = (verifier, url, handler, preopenInstanceId) => {
  return new Promise((resolve, reject) => {
    const verifierWindow = new PopupHandler({ url, preopenInstanceId })
    const bc = new BroadcastChannel(`redirect_channel_${torus.instanceId}`, broadcastChannelOptions)
    bc.addEventListener('message', async (ev) => {
      try {
        log.info(ev, 'event')
        const { instanceParams: { verifier: returnedVerifier } = {}, hashParams: verifierParameters } = ev.data || {}
        if (ev.error && ev.error !== '') {
          reject(ev.error)
          return
        }
        if (ev.data && returnedVerifier === verifier) {
          log.info(ev.data)
          const loginDetails = await handler(verifierParameters)
          resolve(loginDetails)
        }
      } catch (error) {
        reject(error)
      } finally {
        bc.close()
        verifierWindow.close()
      }
    })

    verifierWindow.open()
    verifierWindow.once('close', () => {
      if (bc) bc.close()
      reject(new Error('user closed popup'))
    })
  })
}
