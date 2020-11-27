/* eslint-disable */
const puppeteer = require('puppeteer')
const assert = require('assert')
const { WALLET_HEADERS_HOME, RINKEBY_DISPLAY_NAME } = require('../../src/utils/enums')

const config = require('./lib/config')
const { login, loadUrl, click, typeText, waitForText, shouldExist, selectItem, navigateTo } = require('./lib/helpers')

describe('Tests Wallet Home', () => {
  let browser
  let page
  let isFreshAccount

  before(async () => {
    browser = await puppeteer.launch({
      headless: config.isHeadless,
      slowMo: config.slowMo,
      devtools: config.isDevTools,
      timeout: config.launchTimeout,
      ignoreHTTPSErrors: config.ignoreHTTPSErrors,
      args: ['--ignore-certificate-errors', '--start-fullscreen', '--no-sandbox', '--disable-setuid-sandbox'],
    })

    page = (await browser.pages())[0]
    await page.setDefaultTimeout(config.waitingTimeout)
    await page.setViewport({
      width: config.viewportWidth,
      height: config.viewportHeight,
    })
  })

  after(async () => {
    await browser.close()
  })

  it('Should load page', async () => {
    await loadUrl(page, config.baseUrl)
    await login(page)
  })

  it('Should show main page', async () => {
    await waitForText(page, '.wallet-home .headline', WALLET_HEADERS_HOME)
  })

  it('Should change network to rinkeby', async () => {
    await navigateTo(page, '#settings-link', '.wallet-settings')
    await click(page, '#network-panel-header')

    const textToSelect = RINKEBY_DISPLAY_NAME
    await selectItem(page, '#select-network', '.select-network-container', textToSelect)
    await page.waitFor(100)
    const networkSelected = await page.$eval('.select-network-container .v-select__selection', (element) => element.textContent)

    // check if textToSelect was selected
    assert.strictEqual(textToSelect, networkSelected)
  })

  it('Should go to wallet home page', async () => {
    await click(page, config.isMobile ? '#logo-home-lnk' : '#home-link')
    await shouldExist(page, '.wallet-home')
  })

  it('Should show get eth tooltip if fresh account', async () => {
    if (isFreshAccount) {
      await waitForText(page, '.outline-tooltip', 'Get ETH!')
    }
  })

  it('Should go to transfer page is not fresh account', async () => {
    if (!isFreshAccount) {
      await click(page, `.transfer-btn${config.isMobile ? '-mobile' : ''}`)
      await shouldExist(page, '.wallet-transfer')
      await click(page, config.isMobile ? '#logo-home-lnk' : '#home-link')
    }
  })

  it('Should go to topup page', async () => {
    await click(page, `.topup-btn${config.isMobile ? '-mobile' : ''}`)
    await shouldExist(page, '.wallet-topup-view')
    await click(page, config.isMobile ? '#logo-home-lnk' : '#home-link')
  })

  it('Should update currency', async () => {
    let currency = 'AUD'
    await selectItem(page, '.currency-selector', '.e2e-currency-selector-container', currency)
    await waitForText(page, '#selected-currency', currency)
    currency = 'USD'
    await selectItem(page, '.currency-selector', '.e2e-currency-selector-container', currency)
    await waitForText(page, '#selected-currency', currency)
  })

  it('Should show learn more if fresh account', async () => {
    if (isFreshAccount) {
      await click(page, '#learn-more-btn')
      await shouldExist(page, '.learn-more')

      // Navigate learn more
      await click(page, '#get-started-btn')
      await click(page, '#next-step-btn')

      // Should close learn more
      await click(page, '#next-step-btn')
    }
  })

  it('Should show tokens collectibles table', async () => {
    await click(page, '.home-tab-token')
    await shouldExist(page, '.token-balance-tab-container')
    await click(page, '.home-tab-collectibles')
    await shouldExist(page, '.collectibles-tab-container')
  })
})
