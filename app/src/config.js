import { DISCORD, EMAIL_PASSWORD, FACEBOOK, GITHUB, GOOGLE, LINKEDIN, PASSWORDLESS, REDDIT, TWITCH, TWITTER, WEIBO } from './utils/enums'

const baseUrl = process.env.VUE_APP_BASE_ROUTE || 'https://localhost:3000'

const baseRoute = baseUrl + process.env.BASE_URL

const redirectURI = `${baseUrl}/redirect`

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

  clientIdMap: {
    [GOOGLE]: '876733105116-i0hj3s53qiio5k95prpfmj0hp0gmgtor.apps.googleusercontent.com',
    [FACEBOOK]: '2554219104599979',
    [TWITCH]: 'tfppratfiloo53g1x133ofa4rc29px',
    [REDDIT]: 'dcQJYPaG481XyQ',
    [DISCORD]: '630308572013527060',
    [EMAIL_PASSWORD]: 'sqKRBVSdwa4WLkaq419U7Bamlh5vK1H7',
    [PASSWORDLESS]: 'P7PJuBCXIHP41lcyty0NEb7Lgf7Zme8Q',
    [GITHUB]: 'PC2a4tfNRvXbT48t89J5am0oFM21Nxff',
    [LINKEDIN]: '59YxSgx79Vl3Wi7tQUBqQTRTxWroTuoc',
    [TWITTER]: 'A7H8kkcmyFRlusJQ9dZiqBLraG2yWIsO',
    [WEIBO]: 'dhFGlWQMoACOI5oS5A1jFglp772OAWr1',
  },
  loginToConnectionMap: {
    [EMAIL_PASSWORD]: { connection: 'Username-Password-Authentication', domain: 'https://torus-test.auth0.com' },
    [PASSWORDLESS]: { connection: 'email', domain: 'https://torus-test.auth0.com' },
    [GITHUB]: { connection: 'github', domain: 'https://torus-test.auth0.com' },
    [LINKEDIN]: { connection: 'linkedin', domain: 'https://torus-test.auth0.com' },
    [TWITTER]: { connection: 'twitter', domain: 'https://torus-test.auth0.com' },
    [WEIBO]: { connection: 'weibo', domain: 'https://torus-test.auth0.com' },
  },
  verifierMap: {
    [GOOGLE]: 'google',
    [FACEBOOK]: 'facebook',
    [TWITCH]: 'twitch',
    [REDDIT]: 'reddit',
    [DISCORD]: 'discord',
    [EMAIL_PASSWORD]: 'torus-auth0',
    [PASSWORDLESS]: 'torus-auth0',
    [GITHUB]: 'torus-auth0',
    [LINKEDIN]: 'torus-auth0',
    [TWITTER]: 'torus-auth0',
    [WEIBO]: 'torus-auth0',
  },

  redirect_uri: redirectURI,
  // api: 'http://localhost:2020',
  api: 'https://api.tor.us',
  supportedCurrencies: ['USD', 'AUD', 'BTC', 'CAD', 'DAI', 'ETC', 'EUR', 'GBP', 'HKD', 'IDR', 'INR', 'JPY', 'PHP', 'RUB', 'SGD', 'UAH'],
  additionalCurrencies: ['ANT', 'BAT', 'DASH', 'DGD', 'GNO', 'LTC', 'QTUM', 'REP', 'SAI', 'XEM', 'XLM', 'XMR', 'XRP', 'ZEC'],
  logosUrl: 'https://images.toruswallet.io',
}
