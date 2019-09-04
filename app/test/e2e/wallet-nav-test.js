const puppeteer = require('puppeteer')
const assert = require('assert')

const config = require('./lib/config')

const loadUrl = require('./lib/helpers').loadUrl
const click = require('./lib/helpers').click
const typeText = require('./lib/helpers').typeText
const waitForText = require('./lib/helpers').waitForText
const shouldExist = require('./lib/helpers').shouldExist
const selectItem = require('./lib/helpers').selectItem

describe('Tests Account Menu', () => {
  let browser
  let page

  before(async function() {
    browser = await puppeteer.launch({
      headless: config.isHeadless,
      slowMo: config.slowMo,
      devtools: config.isDevTools,
      timeout: config.launchTimeout,
      ignoreHTTPSErrors: config.ignoreHTTPSErrors,
      args: ['--start-fullscreen', '--no-sandbox', '--disable-setuid-sandbox']
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
    await typeText(loginPage, config.testAccountName, '#identifierId')
    await click(loginPage, '#identifierNext')
    await typeText(loginPage, config.testAccountPassword, 'input[type="password"]')
    await click(loginPage, '#passwordNext')

    await waitForText(page, '.wallet-home .headline', 'My Wallet')
  })

  it('Should show account menu', async () => {
    if (config.isMobile) {
      await click(page, '#menu-dropdown-mobile-btn')
    } else {
      await click(page, '#menu-dropdown-btn')
    }
    await shouldExist(page, '.account-menu')

    // Check if google info is showing
    const accountName = await page.$eval('#account-name', el => el.textContent)
    assert.notEqual(accountName, '')
  })

  it('Should be able to show public address', async () => {
    await page.waitFor(200)
    await click(page, '#show-address-btn')
    await shouldExist(page, '.public-address-container')
  })

  it('Should show import account', async () => {
    await click(page, '#import-account-btn')
    await shouldExist(page, '.account-import')
  })
})
