import {
  // APPLE,
  // APPLE_VERIFIER,
  DISCORD,
  DISCORD_VERIFIER,
  FACEBOOK,
  FACEBOOK_VERIFIER,
  // GITHUB,
  // GITHUB_VERIFIER,
  GOOGLE,
  GOOGLE_VERIFIER,
  // LINE,
  // LINE_VERIFIER,
  // LINKEDIN,
  // LINKEDIN_VERIFIER,
  REDDIT,
  REDDIT_VERIFIER,
  TWITCH,
  TWITCH_VERIFIER,
  // TWITTER,
  // TWITTER_VERIFIER,
  // WEIBO,
  // WEIBO_VERIFIER,
} from './utils/enums'

const baseUrl = process.env.VUE_APP_BASE_ROUTE || 'https://localhost:3000'

const baseRoute = baseUrl + process.env.BASE_URL

const redirectURI = `${baseUrl}/redirect`

// const LOGIN_DOMAIN = 'https://torus-test.auth0.com'

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
      clientId: '876733105116-i0hj3s53qiio5k95prpfmj0hp0gmgtor.apps.googleusercontent.com',
      logoHover: '',
      logoLight: '',
      logoDark: '',
      showOnModal: true,
    },
    [FACEBOOK_VERIFIER]: {
      description: '',
      typeOfLogin: FACEBOOK,
      clientId: '2554219104599979',
      logoHover: '',
      logoLight: '',
      logoDark: '',
      showOnModal: true,
    },
    [REDDIT_VERIFIER]: {
      description: '',
      typeOfLogin: REDDIT,
      clientId: 'dcQJYPaG481XyQ',
      logoHover: '',
      logoLight: '',
      logoDark: '',
      showOnModal: true,
    },
    [TWITCH_VERIFIER]: {
      description: '',
      typeOfLogin: TWITCH,
      clientId: 'tfppratfiloo53g1x133ofa4rc29px',
      logoHover: '',
      logoLight: '',
      logoDark: '',
      showOnModal: true,
    },
    [DISCORD_VERIFIER]: {
      description: '',
      typeOfLogin: DISCORD,
      clientId: '630308572013527060',
      logoHover: '',
      logoLight: '',
      logoDark: '',
      showOnModal: true,
    },
    // [APPLE_VERIFIER]: {
    //   description: '',
    //   typeOfLogin: APPLE,
    //   clientId: 'm1Q0gvDfOyZsJCZ3cucSQEe9XMvl9d9L',
    //   logoHover: '',
    //   logoLight: '',
    //   logoDark: '',
    //   showOnModal: true,
    //   jwtParameters: {
    //     domain: LOGIN_DOMAIN,
    //     connection: 'apple',
    //   },
    // },
    // [GITHUB_VERIFIER]: {
    //   description: '',
    //   typeOfLogin: GITHUB,
    //   clientId: 'PC2a4tfNRvXbT48t89J5am0oFM21Nxff',
    //   logoHover: '',
    //   logoLight: '',
    //   logoDark: '',
    //   showOnModal: true,
    //   jwtParameters: {
    //     domain: LOGIN_DOMAIN,
    //     connection: 'github',
    //   },
    // },
    // [LINKEDIN_VERIFIER]: {
    //   description: '',
    //   typeOfLogin: LINKEDIN,
    //   clientId: '59YxSgx79Vl3Wi7tQUBqQTRTxWroTuoc',
    //   verifier: 'torus-auth0-linkedin',
    //   logoHover: '',
    //   logoLight: '',
    //   logoDark: '',
    //   showOnModal: true,
    //   jwtParameters: {
    //     domain: LOGIN_DOMAIN,
    //     connection: 'linkedin',
    //   },
    // },
    // [TWITTER_VERIFIER]: {
    //   description: '',
    //   typeOfLogin: TWITTER,
    //   clientId: 'A7H8kkcmyFRlusJQ9dZiqBLraG2yWIsO',
    //   verifier: 'torus-auth0-twitter',
    //   logoHover: '',
    //   logoLight: '',
    //   logoDark: '',
    //   showOnModal: true,
    //   jwtParameters: {
    //     domain: LOGIN_DOMAIN,
    //     connection: 'twitter',
    //   },
    // },
    // [WEIBO_VERIFIER]: {
    //   description: '',
    //   typeOfLogin: WEIBO,
    //   clientId: 'dhFGlWQMoACOI5oS5A1jFglp772OAWr1',
    //   verifier: 'torus-auth0-weibo',
    //   logoHover: '',
    //   logoLight: '',
    //   logoDark: '',
    //   showOnModal: true,
    //   jwtParameters: {
    //     domain: LOGIN_DOMAIN,
    //     connection: 'weibo',
    //   },
    // },
    // [LINE_VERIFIER]: {
    //   description: '',
    //   typeOfLogin: LINE,
    //   clientId: 'WN8bOmXKNRH1Gs8k475glfBP5gDZr9H1',
    //   verifier: 'torus-auth0-line',
    //   logoHover: '',
    //   logoLight: '',
    //   logoDark: '',
    //   showOnModal: true,
    //   jwtParameters: {
    //     domain: LOGIN_DOMAIN,
    //     connection: 'line',
    //   },
    // },
  },

  redirect_uri: redirectURI,
  api: 'http://localhost:2020',
  // api: 'https://api.tor.us',
  supportedCurrencies: ['USD', 'AUD', 'BTC', 'CAD', 'DAI', 'ETC', 'EUR', 'GBP', 'HKD', 'IDR', 'INR', 'JPY', 'PHP', 'RUB', 'SGD', 'UAH'],
  additionalCurrencies: ['ANT', 'BAT', 'DASH', 'DGD', 'GNO', 'LTC', 'QTUM', 'REP', 'SAI', 'XEM', 'XLM', 'XMR', 'XRP', 'ZEC'],
  logosUrl: 'https://images.toruswallet.io',
}
