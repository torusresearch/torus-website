import {
  APPLE,
  APPLE_VERIFIER,
  DISCORD,
  DISCORD_VERIFIER,
  FACEBOOK,
  FACEBOOK_VERIFIER,
  GITHUB,
  GITHUB_VERIFIER,
  GOOGLE,
  GOOGLE_VERIFIER,
  LINE,
  LINE_VERIFIER,
  LINKEDIN,
  LINKEDIN_VERIFIER,
  REDDIT,
  REDDIT_VERIFIER,
  TWITCH,
  TWITCH_VERIFIER,
  TWITTER,
  TWITTER_VERIFIER,
  // WEIBO,
  // WEIBO_VERIFIER,
} from './utils/enums'

const {
  VUE_APP_BASE_ROUTE,
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
} = process.env

const baseUrl = VUE_APP_BASE_ROUTE || 'https://localhost:3000'

const baseRoute = baseUrl + process.env.BASE_URL

const redirectURI = `${baseUrl}/redirect`

const LOGIN_DOMAIN = VUE_APP_LOGIN_DOMAIN

// In Modal, show 6 by default (view more)
export default {
  baseUrl,
  baseRoute,
  commonApiHost: 'https://common-api.tor.us',

  simplexApiHost: 'https://simplex-api.tor.us',
  moonpayApiHost: 'https://moonpay-api.tor.us',
  wyreApiHost: 'https://wyre-api.tor.us',
  rampApiHost: 'https://ramp-network-api.tor.us',
  xanpoolApiHost: 'https://xanpool-api.tor.us',

  moonpayHost: 'https://buy.moonpay.io',
  moonpayApiQuoteHost: 'https://api.moonpay.io',
  moonpayLiveAPIKEY: 'pk_live_Wg90NLnFst3ms7tiqnMDDO0yjlypMzYK',
  moonpayTestHost: 'https://buy-staging.moonpay.io',
  moonpayTestAPIKEY: 'pk_test_j6AnwGJD0XTJDg3bTO37OczjFsddYpS',

  wyreHost: 'https://pay.sendwyre.com/purchase',
  wyreAccountId: 'AC_RUQMPNP7QQY',

  rampHost: 'https://widget-instant.ramp.network',
  rampApiQuoteHost: 'https://api-instant.ramp.network/api/host-api/assets',
  rampAPIKEY: 'dw9fe8drpzmdfuks79ub5hvmqzuyjbme4kwkwkqf',

  xanpoolHost: 'https://checkout.xanpool.com',
  xanpoolLiveAPIKEY: '778522fccc19a010f100f437c4aca60j',
  xanpoolTestHost: 'https://checkout.sandbox.xanpool.com',
  xanpoolTestAPIKEY: 'sandbox_778522fccc19a010f100f437c4aca60j',
  xanpoolApiQuoteHost: 'https://xanpool.com/api/transactions/estimate',

  // key is the verifier
  loginConfig: {
    [GOOGLE_VERIFIER]: {
      typeOfLogin: GOOGLE,
      description: '',
      clientId: VUE_APP_GOOGLE_CLIENT_ID,
      logoHover: '',
      logoLight: '',
      logoDark: '',
      showOnModal: true,
    },
    [FACEBOOK_VERIFIER]: {
      description: '',
      typeOfLogin: FACEBOOK,
      clientId: VUE_APP_FACEBOOK_CLIENT_ID,
      logoHover: '',
      logoLight: '',
      logoDark: '',
      showOnModal: true,
    },
    [REDDIT_VERIFIER]: {
      description: '',
      typeOfLogin: REDDIT,
      clientId: VUE_APP_REDDIT_CLIENT_ID,
      logoHover: '',
      logoLight: '',
      logoDark: '',
      showOnModal: true,
    },
    [TWITCH_VERIFIER]: {
      description: '',
      typeOfLogin: TWITCH,
      clientId: VUE_APP_TWITCH_CLIENT_ID,
      logoHover: '',
      logoLight: '',
      logoDark: '',
      showOnModal: true,
    },
    [DISCORD_VERIFIER]: {
      description: '',
      typeOfLogin: DISCORD,
      clientId: VUE_APP_DISCORD_CLIENT_ID,
      logoHover: '',
      logoLight: '',
      logoDark: '',
      showOnModal: true,
    },

    [APPLE_VERIFIER]: {
      description: '',
      typeOfLogin: APPLE,
      clientId: VUE_APP_APPLE_CLIENT_ID,
      logoHover: '',
      logoLight: '',
      logoDark: '',
      showOnModal: true,
      jwtParameters: {
        domain: LOGIN_DOMAIN,
        connection: 'apple',
      },
    },
    [GITHUB_VERIFIER]: {
      description: '',
      typeOfLogin: GITHUB,
      clientId: VUE_APP_GITHUB_CLIENT_ID,
      logoHover: '',
      logoLight: '',
      logoDark: '',
      showOnModal: true,
      jwtParameters: {
        domain: LOGIN_DOMAIN,
        connection: 'github',
      },
    },
    [LINKEDIN_VERIFIER]: {
      description: '',
      typeOfLogin: LINKEDIN,
      clientId: VUE_APP_LINKEDIN_CLIENT_ID,
      logoHover: '',
      logoLight: '',
      logoDark: '',
      showOnModal: true,
      jwtParameters: {
        domain: LOGIN_DOMAIN,
        connection: 'linkedin',
      },
    },
    [TWITTER_VERIFIER]: {
      description: '',
      typeOfLogin: TWITTER,
      clientId: VUE_APP_TWITTER_CLIENT_ID,
      logoHover: '',
      logoLight: '',
      logoDark: '',
      showOnModal: true,
      jwtParameters: {
        domain: LOGIN_DOMAIN,
        connection: 'twitter',
      },
    },
    [LINE_VERIFIER]: {
      description: '',
      typeOfLogin: LINE,
      clientId: VUE_APP_LINE_CLIENT_ID,
      logoHover: '',
      logoLight: '',
      logoDark: '',
      showOnModal: true,
      jwtParameters: {
        domain: LOGIN_DOMAIN,
        connection: 'line',
      },
    },
    // [WEIBO_VERIFIER]: {
    //   description: '',
    //   typeOfLogin: WEIBO,
    //   clientId: VUE_APP_WEIBO_CLIENT_ID,
    //   logoHover: '',
    //   logoLight: '',
    //   logoDark: '',
    //   showOnModal: true,
    //   jwtParameters: {
    //     domain: LOGIN_DOMAIN,
    //     connection: 'weibo',
    //   },
    // },
  },

  redirect_uri: redirectURI,
  // api: 'http://localhost:2020',
  api: 'https://api.tor.us',
  supportedCurrencies: ['USD', 'AUD', 'BTC', 'CAD', 'DAI', 'ETC', 'EUR', 'GBP', 'HKD', 'IDR', 'INR', 'JPY', 'PHP', 'RUB', 'SGD', 'UAH'],
  additionalCurrencies: ['ANT', 'BAT', 'DASH', 'DGD', 'GNO', 'LTC', 'QTUM', 'REP', 'SAI', 'XEM', 'XLM', 'XMR', 'XRP', 'ZEC'],
  logosUrl: 'https://images.toruswallet.io',
}
