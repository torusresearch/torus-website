const isMobile = process.env.MOBILE_ENV || false

module.exports = {
  testAccountName: 'toruspuppeteer@gmail.com',
  testAccountPassword: 'toruse2e',
  testPrivateKey: 'f4695e3f5303a1ca054a5364d5ce6a78b3238c498843eeded473fc544aef018e',
  testEthAddress: '0x312DF873ad20c53F6a9843A67B8304b80c1bF299',
  baseUrl: 'http://localhost:3000', // https://dev.to
  ignoreHTTPSErrors: true,
  isHeadless: true,
  slowMo: 0,
  isDevTools: true,
  launchTimeout: 10000,
  waitingTimeout: 10000,
  isMobile: isMobile,
  viewportWidth: isMobile ? 425 : 1200,
  viewportHeight: isMobile ? 650 : 900
}
