/* eslint-disable */
const puppeteer = require('puppeteer')
const assert = require('assert')
const { WALLET_HEADERS_HOME, RINKEBY_DISPLAY_NAME, GOOGLE_LABEL } = require('../../src/utils/enums')

const config = require('./lib/config')
const { login, loadUrl, click, typeText, waitForText, shouldExist, selectItem, navigateTo, waitForClass } = require('./lib/helpers')

describe('Tests Wallet Settings Page', () => {
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

    await waitForText(page, '.wallet-home .headline', WALLET_HEADERS_HOME)
  })

  it('Should go to wallet settings page', async () => {
    await navigateTo(page, '#settings-link', '.wallet-settings')
  })

  it('Should change network to rinkeby', async () => {
    await click(page, '#network-panel-header')

    const textToSelect = RINKEBY_DISPLAY_NAME
    await selectItem(page, '#select-network', '.select-network-container', textToSelect)
    await page.waitFor(100)
    const networkSelected = await page.$eval('.select-network-container .v-select__selection', (element) => element.textContent)

    // check if textToSelect was selected
    assert.strictEqual(textToSelect, networkSelected)
  })

  it('Should show private key popup', async () => {
    await click(page, '#privacy-panel-header')
    await click(page, '#private-key-btn')
    await shouldExist(page, '.private-key-container')
  })

  it('Should show download wallet', async () => {
    await page.waitFor(100)
    await click(page, '#show-download-form-btn')

    // wait for expansion effect
    await page.waitFor(100)
    await shouldExist(page, '.download-form-container')
    await typeText(page, 's@mplePassword', '#json-file-password')
    await click(page, `#${config.isMobile ? 'mobile-' : ''}json-file-confirm-btn`)

    // wait for download wallet to appear
    await page.waitForResponse(
      (response) =>
        response.url().includes('https://rinkeby.infura.io/v3/341eacb578dd44a1a049cbc5f6fd4035') &&
        (response.status() >= 200 || response.status() < 300),
      { timeout: 60000 }
    )

    await page.waitFor(100)
    await shouldExist(page, `#${config.isMobile ? 'mobile-' : ''}json-file-download-btn`)
  })

  it('Should show private-key', async () => {
    await click(page, '#show-private-key-btn')

    // wait for expansion effect
    await page.waitFor(300)
    await shouldExist(page, '#click-to-copy-btn')

    await click(page, '.private-key-container #close-btn')
  })

  it('Should should validate contacts', async () => {
    await page.waitFor(300)
    await click(page, '#contact-list-panel-header')
    await shouldExist(page, '.contact-list-container')

    const textToSelect = GOOGLE_LABEL
    await selectItem(page, '#select-verifier', '.select-verifier-container', textToSelect)
    await page.waitFor(100)
    const verifierSelected = await page.$eval('.select-verifier-container .v-select__selection', (element) => element.textContent)

    // check if textToSelect was selected
    assert.strictEqual(textToSelect, verifierSelected)

    await typeText(page, 'Contact Name', '#contact-name')
    await typeText(page, 'lionell', '#contact-value')
    await waitForClass(page, '#contact-submit-btn', 'v-btn--disabled')

    await typeText(page, '@tor.us', '#contact-value')
    await waitForClass(page, '#contact-submit-btn', 'primary')
  })

  // TODO: after permissions feature are done
  // it('Should show dapp permission popup', async () => {
  //   await page.waitFor(300)
  //   await click(page, '#dapp-permisson-btn')
  //   await shouldExist(page, '.dapp-permisson-container')
  //   await click(page, '.dapp-permisson-container #close-btn')
  // })

  // TODO: after actual themes are done
  // it('Should show display settings', async () => {
  //   await page.waitFor(300)
  //   await click(page, '#display-panel-header')
  //   await click(page, '#default-theme-btn')
  //   await click(page, '#cerulean-theme-btn')
  //   await click(page, '#shuttle-grey-theme-btn')
  //   await click(page, '#default-theme-btn')
  // })
})
