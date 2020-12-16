/* eslint-disable */
const puppeteer = require('puppeteer')
const assert = require('assert')

const config = require('./lib/config')
const { loadUrl, click, login, shouldExist } = require('./lib/helpers')

describe('Tests Account Menu', () => {
  let browser
  let page

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

  it('Should show account menu', async () => {
    if (config.isMobile) {
      await click(page, '#menu-dropdown-mobile-btn')
    } else {
      await click(page, '#menu-dropdown-btn')
    }
    await shouldExist(page, '.account-menu')

    // // Check if google info is showing
    // const accountName = await page.$eval('#account-name', el => el.textContent)
    // assert.strictEqual(accountName, '')
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
