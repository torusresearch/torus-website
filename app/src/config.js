const baseUrl = process.env.VUE_APP_BASE_ROUTE || 'https://localhost:3000'

const baseRoute = baseUrl + process.env.BASE_URL

const redirect_uri = `${baseUrl}/redirect`

export default {
  baseUrl: baseUrl,
  baseRoute: baseRoute,
  supportedCurrencies: ['USD', 'AUD', 'CAD', 'EUR', 'GBP', 'HKD', 'IDR', 'JPY', 'KRW', 'RUB', 'SGD', 'UAH'],
  commonApiHost: 'https://common-api.tor.us',
  simplexApiHost: 'https://simplex-api.tor.us',
  moonpayApiHost: 'https://moonpay-api.tor.us',
  wyreApiHost: 'https://wyre-api.tor.us',
  cryptoApiHost: 'https://crypto-api.tor.us',
  coindirectApiHost: 'https://coindirect-api.tor.us',
  moonpayHost: 'https://buy.moonpay.io',
  moonpayApiQuoteHost: 'https://api.moonpay.io',
  moonpayLiveAPIKEY: 'pk_live_Wg90NLnFst3ms7tiqnMDDO0yjlypMzYK',
  moonpayTestHost: 'https://buy-staging.moonpay.io',
  moonpayTestAPIKEY: 'pk_test_j6AnwGJD0XTJDg3bTO37OczjFsddYpS',
  wyreHost: 'https://pay.sendwyre.com/purchase',
  wyreAccountId: 'AC_RUQMPNP7QQY',
  coindirectHost: 'https://api.coindirect.com',
  coindirectTestHost: 'https://business.sandbox.coindirect.com/buy',
  coindirectTestMerchantID: 'c21e690c-bb95-42fe-ae17-f962c582b26c',
  coindirectLiveHost: 'https://business.coindirect.com/buy',
  coindirectLiveMerchantID: 'b08d7b18-da82-4dfc-990f-313ea26ac66b',
  GOOGLE_CLIENT_ID: '876733105116-i0hj3s53qiio5k95prpfmj0hp0gmgtor.apps.googleusercontent.com',
  FACEBOOK_APP_ID: '2554219104599979',
  TWITCH_CLIENT_ID: 'tfppratfiloo53g1x133ofa4rc29px',
  REDDIT_CLIENT_ID: 'dcQJYPaG481XyQ',
  DISCORD_CLIENT_ID: '630308572013527060',
  redirect_uri: redirect_uri,
  api: 'https://backend.relayer.dev.tor.us',
  // api: 'https://api.tor.us',
  relayer: 'https://relayer.relayer.dev.tor.us',
  biconomy: 'https://localhost:4000',
  biconomyKey: {
    kovan: 'torus.b0981c34-19b2-4d05-ab15-1ccb49b78c68',
    ropsten: 'torus.c0981c34-19b2-4d05-ab15-1ccb49b78c54',
    matic: 'torus.a0981c34-19b2-4d05-ab15-1ccb49b78cf9'
  },
  eip712SigVersion: '1',
  eip712DomainName: 'Biconomy Meta Transaction',
  eip712VerifyingContract: '0x4f53CA96f0E40FeDc353517177103eCFe03F1317',
  DEFAULT_RELAYER_PAYMENT_TOKEN_ADDRESS: '0x0000000000000000000000000000000000000000',
  DEFAULT_RELAYER_PAYMENT_AMOUNT: 0
}
