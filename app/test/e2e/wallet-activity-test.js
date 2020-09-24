/* eslint-disable */
const puppeteer = require('puppeteer')
const assert = require('assert')
const { RINKEBY_DISPLAY_NAME, ACTIVITY_ACTION_ALL, ACTIVITY_ACTION_SEND, ACTIVITY_PERIOD_WEEK_ONE } = require('../../src/utils/enums')

const config = require('./lib/config')
const { loadUrl, click, login, selectItem, navigateTo } = require('./lib/helpers')

describe('Tests Wallet Activity Page', () => {
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

  it('Should go to wallet activity page', async () => {
    await navigateTo(page, '#activity-link', '.wallet-activity')
  })

  it('Should show correct pagination', async () => {
    if (!config.isMobile) {
      const transactionData = await page.$eval('.activity-table', (element) => ({
        count: parseInt(element.dataset.count),
        perPage: parseInt(element.dataset.perPage),
      }))

      if (transactionData.count > transactionData.perPage) {
        const expectedPages = Math.ceil(transactionData.count / transactionData.perPage)
        const actualPages = await page.$$eval('.activity-pagination .v-pagination__item', (element) => element.length)
        assert.strictEqual(expectedPages, actualPages)
      }
    }
  })

  it('Should filter transaction type correctly', async () => {
    const textToSelect = ACTIVITY_ACTION_SEND
    await selectItem(page, '#transaction-selector', '.nav-selector.transaction', textToSelect)
    await page.waitFor(100)
    const transactionFilter = await page.$eval('.nav-selector.transaction .v-select__selection', (element) => element.textContent)

    // check if textToSelect was selected
    assert.strictEqual(textToSelect, transactionFilter)

    // check if there are rows which is not textToSelect
    const negativeRowsCount = await page.evaluate(
      (textToSelect, config) =>
        [...document.querySelectorAll(`.activity-table${config.isMobile ? '-mobile' : ''} .transaction-action`)].filter(
          (element) => element.textContent !== textToSelect
        ).length,
      textToSelect,
      config
    )
    assert.strictEqual(negativeRowsCount, 0)
  })

  it('Should filter transaction date correctly', async () => {
    // Set transaction type to all
    await selectItem(page, '#transaction-selector', '.nav-selector.transaction', ACTIVITY_ACTION_ALL)
    await page.waitFor(100)

    const textToSelect = ACTIVITY_PERIOD_WEEK_ONE
    await selectItem(page, '#period-selector', '.nav-selector.period', textToSelect)
    await page.waitFor(100)
    const dateFilter = await page.$eval('.nav-selector.period .v-select__selection', (element) => element.textContent)

    // check if textToSelect was selected
    assert.strictEqual(textToSelect, dateFilter)

    // check if there are rows which more than 1 week old
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    const negativeRowsCount = await page.evaluate(
      (oneWeekAgo, config) =>
        [...document.querySelectorAll(`.activity-table${config.isMobile ? '-mobile' : ''} .transaction-date`)].filter(
          (element) => new Date(element.textContent) < new Date(oneWeekAgo)
        ).length,
      oneWeekAgo,
      config
    )
    assert.strictEqual(negativeRowsCount, 0)
  })
})
