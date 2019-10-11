const baseRoute =
  process.env.VUE_APP_TORUS_BUILD_ENV === 'production'
    ? 'https://app.tor.us/'
    : process.env.VUE_APP_TORUS_BUILD_ENV === 'staging'
    ? 'https://staging.tor.us/'
    : process.env.VUE_APP_TORUS_BUILD_ENV === 'testing'
    ? 'https://testing.tor.us/'
    : process.env.VUE_APP_TORUS_BUILD_ENV === 'bmw'
    ? 'https://testing-bmw.tor.us/'
    : 'https://localhost:3000/'

const redirect_uri = `${baseRoute}redirect`
export default {
  torusNodeEndpoints: [
    'https://localhost:5000',
    'https://localhost:5001',
    'https://localhost:5002',
    'https://localhost:5003',
    'https://localhost:5004'
  ],
  baseRoute: baseRoute,
  torusIndexes: [1, 2, 3, 4, 5],
  supportedCurrencies: ['USD', 'AUD', 'CAD', 'EUR', 'GBP', 'HKD', 'IDR', 'JPY', 'KRW', 'RUB', 'SGD', 'UAH'],
  simplexHost: 'https://simplex-api.tor.us',
  moonpayHost: 'https://buy.moonpay.io?',
  moonpayLiveAPIKEY: 'pk_live_Wg90NLnFst3ms7tiqnMDDO0yjlypMzYK',
  moonpayTestHost: 'https://buy-staging.moonpay.io?',
  moonpayTestAPIKEY: 'pk_test_j6AnwGJD0XTJDg3bTO37OczjFsddYpS',
  coindirectTestHost: 'https://business.sandbox.coindirect.com/buy?',
  coindirectTestMerchantID: '150e5ef3-0c72-4d96-a411-8933eed66612',
  coindirectLiveHost: 'https://business.coindirect.com/buy?',
  coindirectLiveMerchantID: 'b08d7b18-da82-4dfc-990f-313ea26ac66b',
  GOOGLE_CLIENT_ID: '876733105116-i0hj3s53qiio5k95prpfmj0hp0gmgtor.apps.googleusercontent.com',
  FACEBOOK_APP_ID: '2554219104599979',
  TWITCH_CLIENT_ID: 'tfppratfiloo53g1x133ofa4rc29px',
  REDDIT_CLIENT_ID: 'dcQJYPaG481XyQ',
  DISCORD_CLIENT_ID: '630308572013527060',
  BMW_CLIENT_ID: '5f7945da-4031-4b95-ab8d-89aca41f8e77',
  redirect_uri: redirect_uri,
  // api: 'http://localhost:2020'
  api: 'https://api.tor.us'
}
