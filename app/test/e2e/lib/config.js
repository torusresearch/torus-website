const isMobile = process.env.MOBILE_ENV || false

module.exports = {
  testAccountName: 'toruspuppeteer@gmail.com',
  testAccountPassword: 'toruse2e',
  testPrivateKey: '7a7c34d65fb8dfae2c2b8668a8443526af8cb8d76efdb9815fa5fece59bb524b',
  testEthAddress: '0x7574d3b436e89B42Fc3418eB188179265CE247AD',
  baseUrl: 'https://localhost:3000', // https://dev.to
  ignoreHTTPSErrors: true,
  isHeadless: false,
  slowMo: 0,
  isDevTools: true,
  launchTimeout: 10000,
  waitingTimeout: 10000,
  isMobile: isMobile,
  viewportWidth: isMobile ? 425 : 1200,
  viewportHeight: isMobile ? 650 : 900
}
