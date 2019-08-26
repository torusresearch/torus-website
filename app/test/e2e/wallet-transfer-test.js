const puppeteer = require('puppeteer')
const assert = require('assert')

const config = require('./lib/config')

const loadUrl = require('./lib/helpers').loadUrl
const click = require('./lib/helpers').click
const typeText = require('./lib/helpers').typeText
const waitForText = require('./lib/helpers').waitForText
const shouldExist = require('./lib/helpers').shouldExist
const shouldTextNotBeEmpty = require('./lib/helpers').shouldTextNotBeEmpty
const shouldValueNotBeEmpty = require('./lib/helpers').shouldValueNotBeEmpty

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

  it('Should go to wallet transfer page', async () => {
    await click(page, '#transfer-link')
    await shouldExist(page, '.wallet-transfer')
  })

  it('Should select coin', async () => {
    await click(page, '#select-coin')
    await page.evaluate(() => {
      let options = [...document.querySelectorAll('.v-list-item__title')]
      options.forEach(function(option) {
        if (option.innerText == 'Ethereum') option.click()
      })
    })

    await page.waitFor(500)
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

  it('Should show you send conversion ', async () => {
    const youSendValue = 0.001
    // overwrite content
    await page.click('#you-send', { clickCount: 3 })
    await page.waitFor(500)
    await typeText(page, youSendValue.toString(), '#you-send')
    await shouldValueNotBeEmpty(page, '.you-send-container .v-messages__message')
  })

  it('Should load advanced options', async () => {
    await click(page, '#advance-option-link')
    await waitForText(page, '.advance-option .subtitle-2', 'Customize Gas')
  })

  it('Should updated transaction fee', async () => {
    const transactionFee = await page.$eval('#transaction-fee', el => el.value)
    let gasPrice = await page.$eval('#gas-price', el => el.value)
    gasPrice = parseFloat(gasPrice) + 4
    await page.waitFor(500)

    // overwrite content
    await page.click('#gas-price', { clickCount: 3 })
    await page.waitFor(500)
    await typeText(page, gasPrice.toString(), '#gas-price')
    const newTransactionFee = await page.$eval('#transaction-fee', el => el.value)
    assert.notEqual(transactionFee, newTransactionFee)
  })

  it('Should submit advanced option', async () => {
    await click(page, '#adv-opt-submit-btn')
    await shouldExist(page, '#adv-reset-btn')
    await page.waitFor(500)
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
    await shouldExist(page, '.wallet-activity')
  })
})
