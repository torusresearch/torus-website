const puppeteer = require('puppeteer')
const assert = require('assert')

const config = require('./lib/config')

const loadUrl = require('./lib/helpers').loadUrl
const click = require('./lib/helpers').click
const typeText = require('./lib/helpers').typeText
const waitForText = require('./lib/helpers').waitForText
const shouldExist = require('./lib/helpers').shouldExist
const selectItem = require('./lib/helpers').selectItem

describe('Tests Wallet Settings Page', () => {
  let browser
  let page

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

  it('Should go to wallet settings page', async () => {
    await click(page, '#settings-link')
    await shouldExist(page, '.wallet-settings')
  })

  it('Should show private key popup', async () => {
    await click(page, '#privacy-panel-header')
    await click(page, '#private-key-btn')
    await shouldExist(page, '.private-key-container')

    await click(page, '.private-key-container #close-btn')
  })

  it('Should show dapp permission popup', async () => {
    await click(page, '#dapp-permisson-btn')
    await shouldExist(page, '.dapp-permisson-container')

    await click(page, '.dapp-permisson-container #close-btn')
    await page.waitFor(300)
  })

  it('Should change network to rinkeby', async () => {
    await click(page, '#network-panel-header')

    const textToSelect = 'Rinkeby Test Network'
    await selectItem(page, '#select-network', '.select-network-container', textToSelect)
    await page.waitFor(100)
    const networkSelected = await page.$eval('.select-network-container .v-select__selection', el => el.textContent)

    // check if textToSelect was selected
    assert.equal(textToSelect, networkSelected)
  })

  it('Should show display settings', async () => {
    await click(page, '#display-panel-header')
    await click(page, '#default-theme-btn')
    await click(page, '#cerulean-theme-btn')
    await click(page, '#shuttle-grey-theme-btn')
    await click(page, '#default-theme-btn')
  })
})
