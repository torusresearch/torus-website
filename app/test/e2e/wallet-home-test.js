const puppeteer = require('puppeteer')
const assert = require('assert')

const config = require('./lib/config')

const loadUrl = require('./lib/helpers').loadUrl
const click = require('./lib/helpers').click
const typeText = require('./lib/helpers').typeText
const waitForText = require('./lib/helpers').waitForText
const shouldExist = require('./lib/helpers').shouldExist
const selectItem = require('./lib/helpers').selectItem

describe('Tests Wallet Home', () => {
  let browser
  let page
  let isFreshAccount

  before(async function() {
    browser = await puppeteer.launch({
      headless: config.isHeadless,
      slowMo: config.slowMo,
      devtools: config.isDevTools,
      timeout: config.launchTimeout,
      ignoreHTTPSErrors: config.ignoreHTTPSErrors,
      args: ['--start-fullscreen']
    })

    page = await browser.newPage()
    await page.setDefaultTimeout(config.waitingTimeout)
    await page.setViewport({
      width: config.viewportWidth,
      height: config.viewportHeight
    })
  })

  after(async function() {
    await browser.close()
  })

  it('Should load page', async () => {
    await loadUrl(page, config.baseUrl)

    // Used for getting the newly opened window
    const pageTarget = page.target()

    // Get the loginPage
    await click(page, '#loginBtn')
    const loginPageTarget = await browser.waitForTarget(target => target.opener() === pageTarget)
    const loginPage = await loginPageTarget.page()

    // Login user
    await typeText(loginPage, 'toruspuppeteer@gmail.com', '#identifierId')
    await click(loginPage, '#identifierNext')
    await typeText(loginPage, 'toruse2e', 'input[type="password"]')
    await click(loginPage, '#passwordNext')

    await waitForText(page, '.wallet-home .headline', 'My Wallet')
  })

  it('Should change network to rinkeby', async () => {
    await click(page, '#settings-link')
    await shouldExist(page, '.wallet-settings')
    await click(page, '#network-panel-header')

    const textToSelect = 'Rinkeby Test Network'
    await selectItem(page, '#select-network', '.select-network-container', textToSelect)
    await page.waitFor(100)
    const networkSelected = await page.$eval('.select-network-container .v-select__selection', el => el.textContent)

    // check if textToSelect was selected
    assert.equal(textToSelect, networkSelected)
  })

  it('Should go to wallet home page', async () => {
    await click(page, '#home-link')
    await shouldExist(page, '.wallet-home')
  })

  it('Should go to transfer page is not fresh account', async () => {
    isFreshAccount = (await page.$('.transfer-btn[disabled]')) !== null
    if (!isFreshAccount) {
      await click(page, '.transfer-btn')
      await shouldExist(page, '.wallet-transfer')
      await click(page, '#home-link')
    }
  })

  it('Should go to topup page', async () => {
    await click(page, '.topup-btn')
    await shouldExist(page, '.wallet-topup-view')
    await click(page, '#home-link')
  })

  it('Should show getEth tooltip if fresh account', async () => {
    if (isFreshAccount) {
      await shouldExist(page, '.outline-tooltip')
    }
  })

  it('Should update currency', async () => {
    let currency = 'AUD'
    await selectItem(page, '#currency-selector', '.e2e-currency-selector-container', currency)
    await waitForText(page, '#selected-currency', currency)

    currency = 'USD'
    await selectItem(page, '#currency-selector', '.e2e-currency-selector-container', currency)
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
})
