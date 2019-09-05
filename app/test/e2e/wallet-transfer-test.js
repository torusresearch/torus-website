const puppeteer = require('puppeteer')
const assert = require('assert')

const config = require('./lib/config')

const loadUrl = require('./lib/helpers').loadUrl
const click = require('./lib/helpers').click
const typeText = require('./lib/helpers').typeText
const waitForText = require('./lib/helpers').waitForText
const shouldExist = require('./lib/helpers').shouldExist
const selectItem = require('./lib/helpers').selectItem
const shouldValueNotBeEmpty = require('./lib/helpers').shouldValueNotBeEmpty
const shouldTextNotBeEmpty = require('./lib/helpers').shouldTextNotBeEmpty
const navigateTo = require('./lib/helpers').navigateTo

describe('Tests Wallet Transfer Transaction', () => {
  let browser
  let page
  let confirmPage

  before(async function() {
    browser = await puppeteer.launch({
      headless: config.isHeadless,
      slowMo: config.slowMo,
      devtools: config.isDevTools,
      timeout: config.launchTimeout,
      ignoreHTTPSErrors: config.ignoreHTTPSErrors,
      args: ['--start-fullscreen', '--no-sandbox', '--disable-setuid-sandbox']
    })

    page = (await browser.pages())[0]
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

  it('Should load needed api', async () => {
    // Wait for these APIs
    await page.waitForResponse(response => response.url() === 'https://api.tor.us/user', { timeout: 60000 })
  })

  it('Should change network to rinkeby', async () => {
    await navigateTo(page, '#settings-link', '.wallet-settings')
    await click(page, '#network-panel-header')

    const textToSelect = 'Rinkeby Test Network'
    await selectItem(page, '#select-network', '.select-network-container', textToSelect)
    await page.waitFor(100)
    const networkSelected = await page.$eval('.select-network-container .v-select__selection', el => el.textContent)

    // check if textToSelect was selected
    assert.equal(textToSelect, networkSelected)
  })

  it('Should go to wallet transfer page', async () => {
    await navigateTo(page, '#transfer-link', '.wallet-transfer')
  })

  it('Should select coin', async () => {
    const textToSelect = 'Ethereum'
    await selectItem(page, '#select-coin', '.select-coin-container', textToSelect)
    await page.waitFor(100)
    const coinSelected = await page.$eval('.select-coin-container .v-select__selection', el => el.textContent)

    // check if textToSelect was selected
    assert.equal(textToSelect, coinSelected)
  })

  it('Should error on invalid input', async () => {
    await typeText(page, 'lionell', '#recipient-address')
    await waitForText(page, '.recipient-address-container .v-messages__message', 'Invalid ETH or Email Address')

    await typeText(page, '@tor.us', '#recipient-address')
  })

  it('Should error on invalid you send input', async () => {
    let accountBalance = await page.$eval('#account-balance', el => el.textContent)
    accountBalance = parseFloat(accountBalance.split(' ')[1]) + 10
    await typeText(page, accountBalance.toString(), '#you-send')
    await waitForText(page, '.you-send-container .v-messages__message', 'Insufficient balance for transaction')
  })

  it('Should click send all', async () => {
    await click(page, '#send-all-btn')
    await shouldExist(page, '#send-all-reset-btn')

    const isReadOnly = await page.$eval('#you-send', el => el.readOnly)
    assert.equal(isReadOnly, true)
  })

  it('Should reset send all', async () => {
    await click(page, '#send-all-reset-btn')
    await shouldExist(page, '#send-all-btn')

    const isReadOnly = await page.$eval('#you-send', el => el.readOnly)
    assert.equal(isReadOnly, false)
  })

  it('Should show you send conversion ', async () => {
    const youSendValue = 0.001
    // overwrite content
    await page.click('#you-send', { clickCount: 3 })
    await page.waitFor(100)
    await typeText(page, youSendValue.toString(), '#you-send')
    await shouldValueNotBeEmpty(page, '.you-send-container .v-messages__message')
  })

  it('Should load advanced options', async () => {
    await click(page, '#advance-option-link')
    await waitForText(page, '.advance-option .subtitle-2', 'Customize Gas')
  })

  it('Should updated transaction fee', async () => {
    const transactionFee = config.isMobile
      ? await page.$eval('#transaction-fee-mobile', el => el.textContent)
      : await page.$eval('#transaction-fee', el => el.value)

    let gasPrice = await page.$eval('#gas-price', el => el.value)
    gasPrice = parseFloat(gasPrice) + 4
    await page.waitFor(100)

    // overwrite content
    await page.click('#gas-price', { clickCount: 3 })
    await page.waitFor(100)
    await typeText(page, gasPrice.toString(), '#gas-price')

    const newTransactionFee = config.isMobile
      ? await page.$eval('#transaction-fee-mobile', el => el.textContent)
      : await page.$eval('#transaction-fee', el => el.value)

    assert.notEqual(transactionFee, newTransactionFee)
  })

  it('Should submit advanced option', async () => {
    await click(page, '#adv-opt-submit-btn')
    await shouldExist(page, '#adv-reset-btn')
    await page.waitFor(300)
  })

  it('Should reset advanced option', async () => {
    await click(page, '#adv-reset-btn')
    await shouldExist(page, '#average-speed-btn')
  })

  it('Should show total cost', async () => {
    await shouldValueNotBeEmpty(page, '#total-cost')
  })

  it('Should submit and load confirm', async () => {
    const pageTarget = page.target()

    // Get the confirm page
    await click(page, '#wallet-transfer-submit')
    const confirmPageTarget = await browser.waitForTarget(target => target.opener() === pageTarget)
    confirmPage = await confirmPageTarget.page()

    await shouldExist(confirmPage, '.confirm-container')
  })

  it('Should load more details', async () => {
    await click(confirmPage, '#more-details-link')
    await shouldExist(confirmPage, '.more-details-container')

    await shouldTextNotBeEmpty(confirmPage, '.more-details-container #currency-rate')
    await shouldTextNotBeEmpty(confirmPage, '.more-details-container #network')
    await shouldTextNotBeEmpty(confirmPage, '.more-details-container #type')

    await click(confirmPage, '#less-details-link')
  })

  it('Should submit confirm', async () => {
    await click(confirmPage, '#confirm-btn')
    await waitForText(confirmPage, '.headline', 'Confirm your Transfer')
    await click(confirmPage, '#confirm-transfer-btn')
  })

  it('Should show success alert', async () => {
    await shouldExist(page, '.message-modal')
    await click(page, '.message-modal #continue-link')
  })

  it('Should show on wallet activity page', async () => {
    await navigateTo(page, '#activity-link', '.wallet-activity')
  })
})
