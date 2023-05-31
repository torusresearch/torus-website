import { Percent } from '@uniswap/sdk-core'

import { CRYPTO_COMPARE_CURRENCIES } from './supportedCurrencies'
import {
  APPLE,
  APPLE_LINKED_VERIFIER,
  APPLE_LOGIN_PROVIDER,
  APPLE_VERIFIER,
  DISCORD,
  DISCORD_LINKED_VERIFIER,
  DISCORD_LOGIN_PROVIDER,
  DISCORD_VERIFIER,
  EMAIL_PASSWORDLESS_LOGIN_PROVIDER,
  // EMAIL_PASSWORD,
  FACEBOOK,
  FACEBOOK_LINKED_VERIFIER,
  FACEBOOK_LOGIN_PROVIDER,
  FACEBOOK_VERIFIER,
  GITHUB,
  GITHUB_LINKED_VERIFIER,
  GITHUB_LOGIN_PROVIDER,
  GITHUB_VERIFIER,
  GOOGLE,
  GOOGLE_LINKED_VERIFIER,
  GOOGLE_LOGIN_PROVIDER,
  GOOGLE_VERIFIER,
  HOSTED_EMAIL_PASSWORDLESS_LINKED_VERIFIER,
  HOSTED_EMAIL_PASSWORDLESS_VERIFIER,
  JWT,
  // JWT,
  KAKAO,
  KAKAO_LINKED_VERIFIER,
  KAKAO_LOGIN_PROVIDER,
  KAKAO_VERIFIER,
  LINE,
  LINE_LINKED_VERIFIER,
  LINE_LOGIN_PROVIDER,
  LINE_VERIFIER,
  LINKEDIN,
  LINKEDIN_LINKED_VERIFIER,
  LINKEDIN_LOGIN_PROVIDER,
  LINKEDIN_VERIFIER,
  REDDIT,
  REDDIT_LINKED_VERIFIER,
  REDDIT_LOGIN_PROVIDER,
  REDDIT_VERIFIER,
  TWITCH,
  TWITCH_LINKED_VERIFIER,
  TWITCH_LOGIN_PROVIDER,
  TWITCH_VERIFIER,
  TWITTER,
  TWITTER_LINKED_VERIFIER,
  TWITTER_LOGIN_PROVIDER,
  TWITTER_VERIFIER,
  WECHAT,
  WECHAT_LINKED_VERIFIER,
  WECHAT_LOGIN_PROVIDER,
  WECHAT_VERIFIER,
  // WEIBO,
  // WEIBO_VERIFIER,
  // WEIBO_LINKED_VERIFIER,
} from './utils/enums'

const {
  VUE_APP_GOOGLE_CLIENT_ID,
  VUE_APP_APPLE_CLIENT_ID,
  VUE_APP_DISCORD_CLIENT_ID,
  VUE_APP_FACEBOOK_CLIENT_ID,
  VUE_APP_GITHUB_CLIENT_ID,
  VUE_APP_LINE_CLIENT_ID,
  VUE_APP_LINKEDIN_CLIENT_ID,
  VUE_APP_REDDIT_CLIENT_ID,
  VUE_APP_TWITCH_CLIENT_ID,
  VUE_APP_TWITTER_CLIENT_ID,
  VUE_APP_LOGIN_DOMAIN,
  VUE_APP_HOSTED_EMAIL_PASSWORDLESS_CLIENT_ID,
  VUE_APP_WECHAT_CLIENT_ID,
  VUE_APP_KAKAO_CLIENT_ID,
  VUE_APP_HIDE_TOPUP,
  VUE_APP_INFURA_KEY,
  VUE_APP_ETH_TRANSFER_ONLY,
  VUE_APP_OPENLOGIN_ORIGIN_SIGNATURE,
  VUE_APP_PASSWORDLESS_DOMAIN,
  VUE_APP_DEVELOPER_DASHBOARD_URL,
  VUE_APP_PROXY_NETWORK,
  VUE_APP_WALLET_CONNECT_PROJECT_ID,
} = process.env

const baseUrl = window.location.origin

const baseRoute = baseUrl + process.env.BASE_URL

const redirectURI = `${baseUrl}/redirect`

const LOGIN_DOMAIN = VUE_APP_LOGIN_DOMAIN

const appVersion = process.env.VUE_APP_TORUS_BUILD_VERSION

const rampApiKey = 'dw9fe8drpzmdfuks79ub5hvmqzuyjbme4kwkwkqf'

/**
 * Checks whether a storage type is available or not
 * For more info on how this works, please refer to MDN documentation
 * https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API#Feature-detecting_localStorage
 *
 * @method storageAvailable
 * @param {String} type the type of storage ('localStorage', 'sessionStorage')
 * @returns {Boolean} a boolean indicating whether the specified storage is available or not
 */
export function storageAvailable(type) {
  let storage
  try {
    storage = window[type]
    const x = '__storage_test__'
    storage.setItem(x, x)
    storage.removeItem(x)
    return true
  } catch (error) {
    return (
      error &&
      // everything except Firefox
      (error.code === 22 ||
        // Firefox
        error.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        error.name === 'QuotaExceededError' ||
        // Firefox
        error.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length > 0
    )
  }
}

const { hash, search } = window.location
// search also has a ? in the value.
const finalUrl = new URL(`${baseUrl}?${hash.slice(1)}&${search.slice(1)}`)

const isCustomLogin = finalUrl.searchParams.get('isCustomLogin')
const sessionNamespace = finalUrl.searchParams.get('sessionNamespace')

// no reddit for binance.tor.us

// In Modal, show 6 by default (view more)
export default {
  baseUrl,
  baseRoute,
  appVersion,
  commonApiHost: 'https://common-api.tor.us',
  // commonApiHost: 'http://localhost:60000',
  api: 'https://api.tor.us',
  // api: 'http://localhost:2020',
  infuraKey: VUE_APP_INFURA_KEY,
  openLoginClientId: 'BCY9aYsh8iGshQuzNjBbONYE-tKD0JM389l87IiMOVeOU1TBmRaZphKOyphkUpo41fuSMnO6QRlloxCV-3nt8dU',
  torusNetwork: VUE_APP_PROXY_NETWORK || 'mainnet',
  openLoginOriginSig: VUE_APP_OPENLOGIN_ORIGIN_SIGNATURE,
  developerDashboardUrl: VUE_APP_DEVELOPER_DASHBOARD_URL,
  hideTopup: VUE_APP_HIDE_TOPUP === 'true',
  ethTransferOnly: VUE_APP_ETH_TRANSFER_ONLY === 'true',

  storageAvailability: {
    local: storageAvailable('localStorage'),
    session: storageAvailable('sessionStorage'),
  },
  // we do the isCustomDapp check to differentiate b/w app.tor.us and dapps without isCustomLogin flag
  isCustomLogin: isCustomLogin === 'true' || !!sessionNamespace,

  simplexApiHost: 'https://simplex-api.tor.us',
  moonpayApiHost: 'https://moonpay-api.tor.us',
  wyreApiHost: 'https://wyre-api.tor.us',
  rampApiHost: 'https://ramp-network-api.tor.us',
  xanpoolApiHost: 'https://xanpool-api.tor.us',
  mercuryoApiHost: 'https://mercuryo-api.tor.us',
  transakApiHost: 'https://transak-api.tor.us',
  banxaApiHost: 'https://banxa-api.tor.us',

  moonpayHost: 'https://buy.moonpay.io',
  moonpayApiQuoteHost: 'https://api.moonpay.io',
  moonpayLiveAPIKEY: 'pk_live_Wg90NLnFst3ms7tiqnMDDO0yjlypMzYK',
  moonpayTestHost: 'https://buy-staging.moonpay.io',
  moonpayTestAPIKEY: 'pk_test_j6AnwGJD0XTJDg3bTO37OczjFsddYpS',

  wyreHost: 'https://pay.sendwyre.com/purchase',
  wyreAccountId: 'AC_RUQMPNP7QQY',

  rampHost: 'https://widget-instant.ramp.network',
  rampApiQuoteHost: `https://api-instant.ramp.network/api/host-api/quote?hostApiKey=${rampApiKey}`,
  rampAPIKEY: rampApiKey,

  xanpoolHost: 'https://checkout.xanpool.com',
  xanpoolLiveAPIKEY: '778522fccc19a010f100f437c4aca60j',
  xanpoolTestHost: 'https://checkout.sandbox.xanpool.com',
  xanpoolTestAPIKEY: 'sandbox_778522fccc19a010f100f437c4aca60j',
  xanpoolApiQuoteHost: 'https://xanpool.com/api/transactions/estimate',

  mercuryoHost: 'https://exchange.mercuryo.io',
  mercuryoLiveAPIKEY: '8e531c49-2f64-4e7e-b1d4-16aa4958c291',
  mercuryoTestHost: 'https://sandbox-exchange.mrcr.io',
  mercuryoTestAPIKEY: '45fb9cb6-608e-44fe-a1cf-9c59de4a9e8d',

  transakHost: 'https://global.transak.com',
  transakApiQuoteHost: 'https://api.transak.com/api/v2',
  transakLiveAPIKEY: '0ae336e4-1968-4ec3-b817-625f6810a7d2',
  transakTestHost: 'https://staging-global.transak.com',
  transakTestApiQuoteHost: 'https://staging-api.transak.com/api/v2',
  transakTestAPIKEY: 'e5adb5e3-b30c-4fa8-85ea-adcbadc98198',

  redirect_uri: redirectURI,
  supportedCurrencies: CRYPTO_COMPARE_CURRENCIES,
  // TODO clarify what additionalCurrencies is
  // TODO BAT also found on crypto compare list (overlap)
  additionalCurrencies: ['ANT', 'BAT', 'DASH', 'DGD', 'GNO', 'LTC', 'QTUM', 'REP', 'SAI', 'XEM', 'XLM', 'XMR', 'XRP', 'ZEC'],
  logosUrl: 'https://images.toruswallet.io',

  uniswapContractAddress: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
  // Company address
  uniswapFeeRecipient: '0xd4efE698306aBE7bBf4de4bc2C8A29548B0250D4',
  feePercent: new Percent(1, 100),

  // key is the verifier
  loginConfig: {
    ...(GOOGLE_VERIFIER && {
      [GOOGLE_VERIFIER]: {
        typeOfLogin: GOOGLE,
        name: GOOGLE,
        description: 'dappLogin.continue',
        clientId: VUE_APP_GOOGLE_CLIENT_ID,
        linkedVerifier: GOOGLE_LINKED_VERIFIER,
        logoHover: '',
        logoLight: '',
        logoDark: '',
        showOnModal: true,
        mainOption: true,
        showOnDesktop: true,
        showOnMobile: true,
        // For torus only
        loginProvider: GOOGLE_LOGIN_PROVIDER,
      },
    }),
    ...(FACEBOOK_VERIFIER && {
      [FACEBOOK_VERIFIER]: {
        description: '',
        typeOfLogin: FACEBOOK,
        name: FACEBOOK,
        clientId: VUE_APP_FACEBOOK_CLIENT_ID,
        linkedVerifier: FACEBOOK_LINKED_VERIFIER,
        logoHover: '',
        logoLight: '',
        logoDark: '',
        showOnModal: true,
        mainOption: true,
        showOnDesktop: true,
        showOnMobile: true,
        // For torus only
        loginProvider: FACEBOOK_LOGIN_PROVIDER,
      },
    }),
    ...(TWITTER_VERIFIER && {
      [TWITTER_VERIFIER]: {
        description: '',
        typeOfLogin: TWITTER,
        name: TWITTER,
        clientId: VUE_APP_TWITTER_CLIENT_ID,
        linkedVerifier: TWITTER_LINKED_VERIFIER,
        logoHover: '',
        logoLight: '',
        logoDark: '',
        showOnModal: true,
        mainOption: true,
        showOnDesktop: true,
        showOnMobile: true,
        jwtParameters: {
          domain: LOGIN_DOMAIN,
          connection: 'twitter',
          isVerifierIdCaseSensitive: false,
        },
        // For torus only
        loginProvider: TWITTER_LOGIN_PROVIDER,
      },
    }),
    ...(DISCORD_VERIFIER && {
      [DISCORD_VERIFIER]: {
        description: '',
        typeOfLogin: DISCORD,
        name: DISCORD,
        clientId: VUE_APP_DISCORD_CLIENT_ID,
        linkedVerifier: DISCORD_LINKED_VERIFIER,
        logoHover: '',
        logoLight: '',
        logoDark: '',
        showOnModal: true,
        mainOption: true,
        showOnDesktop: true,
        showOnMobile: true,
        // For torus only
        loginProvider: DISCORD_LOGIN_PROVIDER,
      },
    }),
    ...(LINE_VERIFIER && {
      [LINE_VERIFIER]: {
        description: '',
        typeOfLogin: LINE,
        name: 'LINE',
        clientId: VUE_APP_LINE_CLIENT_ID,
        linkedVerifier: LINE_LINKED_VERIFIER,
        logoHover: '',
        logoLight: '',
        logoDark: '',
        showOnModal: true,
        showOnDesktop: true,
        showOnMobile: true,
        jwtParameters: {
          domain: LOGIN_DOMAIN,
          connection: 'line',
        },
        // For torus only
        loginProvider: LINE_LOGIN_PROVIDER,
      },
    }),
    ...(REDDIT_VERIFIER && {
      [REDDIT_VERIFIER]: {
        description: '',
        typeOfLogin: JWT,
        name: REDDIT,
        clientId: VUE_APP_REDDIT_CLIENT_ID,
        linkedVerifier: REDDIT_LINKED_VERIFIER,
        logoHover: '',
        logoLight: '',
        logoDark: '',
        showOnModal: true,
        showOnDesktop: true,
        showOnMobile: true,
        jwtParameters: {
          domain: LOGIN_DOMAIN,
          verifierIdField: 'name',
          connection: 'Reddit',
        },
        // For torus only
        loginProvider: REDDIT_LOGIN_PROVIDER,
      },
    }),
    ...(APPLE_VERIFIER && {
      [APPLE_VERIFIER]: {
        description: '',
        typeOfLogin: APPLE,
        name: APPLE,
        clientId: VUE_APP_APPLE_CLIENT_ID,
        linkedVerifier: APPLE_LINKED_VERIFIER,
        logoHover: '',
        logoLight: '',
        logoDark: '',
        showOnModal: true,
        showOnDesktop: true,
        showOnMobile: true,
        jwtParameters: {
          domain: LOGIN_DOMAIN,
          connection: 'apple',
        },
        // For torus only
        loginProvider: APPLE_LOGIN_PROVIDER,
      },
    }),
    ...(GITHUB_VERIFIER && {
      [GITHUB_VERIFIER]: {
        description: '',
        typeOfLogin: GITHUB,
        name: 'GitHub',
        clientId: VUE_APP_GITHUB_CLIENT_ID,
        linkedVerifier: GITHUB_LINKED_VERIFIER,
        logoHover: '',
        logoLight: '',
        logoDark: '',
        showOnModal: true,
        showOnDesktop: true,
        showOnMobile: true,
        jwtParameters: {
          domain: LOGIN_DOMAIN,
          connection: 'github',
          isVerifierIdCaseSensitive: false,
        },
        // For torus only
        loginProvider: GITHUB_LOGIN_PROVIDER,
      },
    }),
    ...(TWITCH_VERIFIER && {
      [TWITCH_VERIFIER]: {
        description: '',
        typeOfLogin: TWITCH,
        name: TWITCH,
        clientId: VUE_APP_TWITCH_CLIENT_ID,
        linkedVerifier: TWITCH_LINKED_VERIFIER,
        logoHover: '',
        logoLight: '',
        logoDark: '',
        showOnModal: true,
        showOnDesktop: true,
        showOnMobile: true,
        // For torus only
        loginProvider: TWITCH_LOGIN_PROVIDER,
      },
    }),
    ...(LINKEDIN_VERIFIER && {
      [LINKEDIN_VERIFIER]: {
        description: '',
        typeOfLogin: LINKEDIN,
        name: 'LinkedIn',
        clientId: VUE_APP_LINKEDIN_CLIENT_ID,
        linkedVerifier: LINKEDIN_LINKED_VERIFIER,
        logoHover: '',
        logoLight: '',
        logoDark: '',
        showOnModal: true,
        showOnDesktop: true,
        showOnMobile: true,
        jwtParameters: {
          domain: LOGIN_DOMAIN,
          connection: 'linkedin',
        },
        // For torus only
        loginProvider: LINKEDIN_LOGIN_PROVIDER,
      },
    }),
    ...(WECHAT_VERIFIER && {
      [WECHAT_VERIFIER]: {
        description: '',
        typeOfLogin: WECHAT,
        name: 'WeChat',
        clientId: VUE_APP_WECHAT_CLIENT_ID,
        linkedVerifier: WECHAT_LINKED_VERIFIER,
        logoHover: '',
        logoLight: '',
        logoDark: '',
        showOnModal: true,
        showOnDesktop: true,
        showOnMobile: false,
        jwtParameters: {
          domain: LOGIN_DOMAIN,
          connection: 'Wechat',
        },
        // For torus only
        loginProvider: WECHAT_LOGIN_PROVIDER,
      },
    }),
    ...(KAKAO_VERIFIER && {
      [KAKAO_VERIFIER]: {
        description: '',
        typeOfLogin: KAKAO,
        name: 'Kakao',
        clientId: VUE_APP_KAKAO_CLIENT_ID,
        linkedVerifier: KAKAO_LINKED_VERIFIER,
        logoHover: '',
        logoLight: '',
        logoDark: '',
        showOnModal: true,
        showOnDesktop: true,
        showOnMobile: true,
        jwtParameters: {
          domain: LOGIN_DOMAIN,
          connection: 'Kakao',
        },
        // For torus only
        loginProvider: KAKAO_LOGIN_PROVIDER,
      },
    }),
    ...(HOSTED_EMAIL_PASSWORDLESS_VERIFIER && {
      [HOSTED_EMAIL_PASSWORDLESS_VERIFIER]: {
        description: 'dappLogin.continue',
        typeOfLogin: JWT,
        name: 'email',
        clientId: VUE_APP_HOSTED_EMAIL_PASSWORDLESS_CLIENT_ID,
        linkedVerifier: HOSTED_EMAIL_PASSWORDLESS_LINKED_VERIFIER,
        logoHover: '',
        logoLight: '',
        logoDark: '',
        showOnModal: true,
        showOnDesktop: true,
        showOnMobile: true,
        jwtParameters: {
          domain: VUE_APP_PASSWORDLESS_DOMAIN,
          verifierIdField: 'name',
          connection: '',
          isVerifierIdCaseSensitive: false,
        },
        // For torus only
        loginProvider: EMAIL_PASSWORDLESS_LOGIN_PROVIDER,
      },
    }),
    // ...(WEIBO_VERIFIER && {
    //   [WEIBO_VERIFIER]: {
    //     description: '',
    //     typeOfLogin: WEIBO,
    //     clientId: VUE_APP_WEIBO_CLIENT_ID,
    //     linkedVerifier: WEIBO_LINKED_VERIFIER,
    //     logoHover: '',
    //     logoLight: '',
    //     logoDark: '',
    //     showOnModal: true,
    //     jwtParameters: {
    //       domain: LOGIN_DOMAIN,
    //       connection: 'weibo',
    //       isVerifierIdCaseSensitive: false,
    //     },
    //     // For torus only
    //     hasLightLogo: false,
    //   },
    // }),
  },
  sessionNamespace,
  loginsWithLightLogo: [APPLE, GITHUB, JWT],
  walletConnectProjectId: VUE_APP_WALLET_CONNECT_PROJECT_ID,
}
