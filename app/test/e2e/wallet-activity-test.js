const puppeteer = require('puppeteer')
const assert = require('assert')

const config = require('./lib/config')

const loadUrl = require('./lib/helpers').loadUrl
const click = require('./lib/helpers').click
const typeText = require('./lib/helpers').typeText
const waitForText = require('./lib/helpers').waitForText
const shouldExist = require('./lib/helpers').shouldExist
const selectItem = require('./lib/helpers').selectItem

describe('Tests Wallet Activity Page', () => {
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

  it('Should change network to rinkeby', async () => {
    await click(page, '#settings-link')
    await shouldExist(page, '.wallet-settings')
    await click(page, '#network-panel-header')

    await click(page, '#select-network')
    await page.evaluate(() => {
      let options = [...document.querySelectorAll('.v-list-item__title')]
      options.forEach(function(option) {
        if (option.innerText == 'Rinkeby Test Network') option.click()
      })
    })

    await waitForText(page, '.v-select__selection.v-select__selection--comma', 'Rinkeby Test Network')
  })

  it('Should go to wallet activity page', async () => {
    await click(page, '#activity-link')
    await shouldExist(page, '.wallet-activity')
  })

  it('Should show correct pagination', async () => {
    let transactionData = await page.$eval('.activity-table', el => ({
      count: parseInt(el.dataset.count),
      perPage: parseInt(el.dataset.perPage)
    }))

    if (transactionData.count > transactionData.perPage) {
      const expectedPages = Math.ceil(transactionData.count / transactionData.perPage)
      const actualPages = await page.$$eval('.activity-pagination .v-pagination__item', el => el.length)
      assert.equal(expectedPages, actualPages)
    }
  })

  it('Should filter transaction type correctly', async () => {
    const textToSelect = 'Send'
    await selectItem(page, '#transaction-selector', '.nav-selector.transaction', textToSelect)
    await page.waitFor(100)
    const transactionFilter = await page.$eval('.nav-selector.transaction .v-select__selection', el => el.textContent)

    // check if textToSelect was selected
    assert.equal(textToSelect, transactionFilter)

    // check if there are rows which is not textToSelect
    const negativeRowsCount = await page.evaluate(
      textToSelect => [...document.querySelectorAll('.activity-table .transaction-action')].filter(el => el.textContent !== textToSelect).length,
      textToSelect
    )
    assert.equal(negativeRowsCount, 0)
  })

  it('Should filter transaction date correctly', async () => {
    // Set transaction type to all
    await selectItem(page, '#transaction-selector', '.nav-selector.transaction', 'All Transactions')
    await page.waitFor(100)

    const textToSelect = 'Last 1 Week'
    await selectItem(page, '#period-selector', '.nav-selector.period', textToSelect)
    await page.waitFor(100)
    const dateFilter = await page.$eval('.nav-selector.period .v-select__selection', el => el.textContent)

    // check if textToSelect was selected
    assert.equal(textToSelect, dateFilter)

    // check if there are rows which more than 1 week old
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    const negativeRowsCount = await page.evaluate(
      oneWeekAgo =>
        [...document.querySelectorAll('.activity-table .transaction-date')].filter(el => {
          console.log(new Date(el.textContent), new Date(oneWeekAgo))
          return new Date(el.textContent) < new Date(oneWeekAgo)
        }).length,
      oneWeekAgo
    )
    assert.equal(negativeRowsCount, 0)
  })
})
