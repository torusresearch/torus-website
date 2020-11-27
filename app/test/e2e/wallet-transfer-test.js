/* eslint-disable */
const puppeteer = require('puppeteer')
const assert = require('assert')
const { WALLET_HEADERS_HOME, RINKEBY_DISPLAY_NAME, WALLET_HEADERS_CONFIRM, GOOGLE_LABEL } = require('../../src/utils/enums')
const { significantDigits } = require('../../src/utils/utils')

const config = require('./lib/config')
const {
  login,
  loadUrl,
  click,
  typeText,
  waitForText,
  waitForClass,
  shouldExist,
  selectItem,
  shouldValueNotBeEmpty,
  shouldTextNotBeEmpty,
  navigateTo,
} = require('./lib/helpers')

describe('Tests Wallet Transfer Transaction', () => {
  let browser
  let page
  let confirmPage

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

  it('Should go to wallet transfer page', async () => {
    await navigateTo(page, '#transfer-link', '.wallet-transfer')
    // // Wait for the gas transaction amounts
    // await page.waitForResponse(
    //   response => response.url() === 'https://ethgasstation.info/json/ethgasAPI.json' && (response.status() >= 200 || response.status() < 400),
    //   {
    //     timeout: 60000
    //   }
    // )
  })

  it('Should select coin', async () => {
    const textToSelect = 'Ethereum'
    await click(page, '.select-coin')
    await click(page, '.select-coin-eth')
    await page.waitFor(100)
    const coinSelected = await page.$eval('.select-coin .select-coin-name', (element) => element.textContent)

    // check if textToSelect was selected
    assert.strictEqual(textToSelect, coinSelected)
  })

  it('Should error on invalid input', async () => {
    await selectItem(page, '#recipient-verifier', '.recipient-verifier-container', GOOGLE_LABEL)
    await typeText(page, 'lionell', '#recipient-address')
    await waitForClass(page, '.recipient-address', 'error--text')

    await typeText(page, '@tor.us', '#recipient-address')
  })

  it('Should error on invalid you send input', async () => {
    const computedBalance = await page.$eval('.wallet-transfer', (element) => element.__vue__.selectedItem.computedBalance)

    await typeText(page, (computedBalance + 10).toString(), '#you-send')
    await waitForText(page, '.you-send-container .v-messages__message', 'Insufficient balance for transaction')
  })

  it('Should click send all', async () => {
    // Trigger send all
    await click(page, '#send-all-btn')
    await shouldExist(page, '#send-all-reset-btn')

    const isReadOnly = await page.$eval('#you-send', (element) => element.readOnly)
    assert.strictEqual(isReadOnly, true)

    let displayAmount = ''
    const { gas, activeGasPrice, computedBalance, currencyTokenRate, toggleExclusive } = await page.$eval('.wallet-transfer', (element) => ({
      gas: element.__vue__.gas,
      activeGasPrice: element.__vue__.activeGasPrice,
      computedBalance: element.__vue__.selectedItem.computedBalance,
      currencyTokenRate: element.__vue__.getCurrencyTokenRate,
      toggleExclusive: element.__vue__.toggle_exclusive,
    }))

    const currencyBalance = computedBalance * currencyTokenRate
    const ethGasPrice = gas * activeGasPrice * 10 ** -9
    const currencyGasPrice = ethGasPrice * currencyTokenRate

    if (toggleExclusive === 0) {
      displayAmount = computedBalance - ethGasPrice
    } else {
      displayAmount = currencyBalance - currencyGasPrice
    }

    // Get you send amount
    const youSend = await page.$eval('#you-send', (element) => parseFloat(element.value))
    assert.strictEqual(displayAmount, youSend)
  })

  it('Should reset send all', async () => {
    await click(page, '#send-all-reset-btn')
    await shouldExist(page, '#send-all-btn')

    const isReadOnly = await page.$eval('#you-send', (element) => element.readOnly)
    assert.strictEqual(isReadOnly, false)
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

  it('Should update transaction fee', async () => {
    let gasPrice = await page.$eval('#gas-price', (element) => element.value)
    gasPrice = parseFloat(gasPrice) + 4
    await page.waitFor(100)

    // overwrite content
    await page.click('#gas-price', { clickCount: 3 })
    await page.waitFor(100)
    await typeText(page, gasPrice.toString(), '#gas-price')

    const newTransactionFee = config.isMobile
      ? await page.$eval('#transaction-fee-mobile', (element) => element.textContent)
      : await page.$eval('#transaction-fee', (element) => element.value)

    const advancedActiveGasPrice = await page.$eval('#advanced-gas', (element) => element.value)
    const computedTransFee = significantDigits(gasPrice * advancedActiveGasPrice * 10 ** -9)

    assert.strictEqual(computedTransFee, newTransactionFee)
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
    const totalEthCost = await getTotalCost(page)
    const totalCost = await page.$eval('#total-cost', (element) => element.value)

    assert.strictEqual(totalEthCost, totalCost)
  })

  it('Should display currency mode', async () => {
    await click(page, '#currency-mode-btn')

    const totalEthCost = await getTotalCost(page)
    const totalCost = await page.$eval('#total-cost', (element) => element.value)

    assert.strictEqual(totalEthCost, totalCost)
  })

  it('Should update total cost on transaction speed change', async () => {
    await click(page, '#fastest-speed-btn')

    const totalEthCost = await getTotalCost(page)
    const totalCost = await page.$eval('#total-cost', (element) => element.value)
    await page.waitFor(100)

    assert.strictEqual(totalEthCost, totalCost)
  })

  it('Should submit and load confirm', async () => {
    const pageTarget = page.target()

    // Get the confirm page
    await click(page, '#wallet-transfer-submit')
    const confirmPageTarget = await browser.waitForTarget((target) => target.opener() === pageTarget)
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
    await waitForText(confirmPage, '.headline', WALLET_HEADERS_CONFIRM)
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

const getTotalCost = async function (page) {
  const { gas, activeGasPrice, currencyTokenRate, toggleExclusive, amount } = await page.$eval('.wallet-transfer', (element) => ({
    gas: element.__vue__.gas,
    activeGasPrice: element.__vue__.activeGasPrice,
    currencyTokenRate: element.__vue__.getCurrencyTokenRate,
    toggleExclusive: element.__vue__.toggle_exclusive,
    amount: element.__vue__.amount,
  }))

  const gasPriceInEth = gas * activeGasPrice * 10 ** -9
  const gasPriceInCurrency = gasPriceInEth * currencyTokenRate
  const toSend = parseFloat(amount)
  const toSendConverted = toSend * currencyTokenRate

  return toggleExclusive === 0 ? toSend + gasPriceInEth : toSendConverted + gasPriceInCurrency
}
