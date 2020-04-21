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
  xanpoolHost: 'https://checkout.xanpool.com',
  xanpoolLiveAPIKEY: 'pk_live_Wg90NLnFst3ms7tiqnMDDO0yjlypMzYK',
  xanpoolApiQuoteHost: 'https://xanpool.com/api/transactions/estimate',
  GOOGLE_CLIENT_ID: '876733105116-i0hj3s53qiio5k95prpfmj0hp0gmgtor.apps.googleusercontent.com',
  FACEBOOK_APP_ID: '2554219104599979',
  TWITCH_CLIENT_ID: 'tfppratfiloo53g1x133ofa4rc29px',
  REDDIT_CLIENT_ID: 'dcQJYPaG481XyQ',
  DISCORD_CLIENT_ID: '630308572013527060',
  redirect_uri: redirectURI,
  // api: 'http://localhost:2020'
  api: 'https://api.tor.us',
  supportedCurrencies: ['USD', 'AUD', 'BTC', 'CAD', 'DAI', 'ETC', 'EUR', 'GBP', 'HKD', 'IDR', 'INR', 'JPY', 'PHP', 'RUB', 'SGD', 'UAH'],
  additionalCurrencies: ['ANT', 'BAT', 'DASH', 'DGD', 'GNO', 'LTC', 'QTUM', 'REP', 'SAI', 'XEM', 'XLM', 'XMR', 'XRP', 'ZEC'],
}
