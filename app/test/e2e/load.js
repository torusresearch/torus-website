const puppeteer = require('puppeteer')

const config = require('./lib/config')

const loadUrl = require('./lib/helpers').loadUrl
const click = require('./lib/helpers').click
const waitForText = require('./lib/helpers').waitForText

describe('Loads application', () => {
  let browser
  let page
  let count = 0

  before(async function() {
    browser = await puppeteer.launch({
      headless: config.isHeadless,
      slowMo: config.slowMo,
      devtools: config.isDevTools,
      timeout: config.launchTimeout,
      ignoreHTTPSErrors: config.ignoreHTTPSErrors
    })

    page = await browser.newPage()
    await page.setDefaultTimeout(config.waitingTimeout)
  })

  after(async function() {
    await browser.close()
  })

  it('My first test step', async () => {
    await loadUrl(page, config.baseUrl)
    await click(page, '#loginBtn')

    await browser.on('targetcreated', async () => {
      const pageList = await browser.pages()
      const newPage = await pageList[pageList.length - 1]
      const newPageTitle = await newPage.title()

      if (newPageTitle.indexOf('- Google Accounts') >= 0 && count === 0) {
        count = ++count
        await newPage.waitForSelector('#identifierId')
        await newPage.type('#identifierId', 'llenoil@gmail.com')
        await newPage.click('#identifierNext')

        await newPage.waitForSelector('input[type="password"]', { visible: true })
        await newPage.type('input[type="password"]', 'eLen@8892710')

        await newPage.waitForSelector('#passwordNext', { visible: true })
        await newPage.click('#passwordNext')
      }
    })

    await page.waitForSelector('.wallet-home', { visible: true })
    await waitForText(page, '.wallet-home .headline', 'My Wallet')
  })
})
