const puppeteer = require('puppeteer')
const assert = require('assert')

const config = require('./lib/config')

const loadUrl = require('./lib/helpers').loadUrl
const click = require('./lib/helpers').click
const typeText = require('./lib/helpers').typeText
const waitForText = require('./lib/helpers').waitForText
const shouldExist = require('./lib/helpers').shouldExist
const selectItem = require('./lib/helpers').selectItem
const navigateTo = require('./lib/helpers').navigateTo

describe('Tests Wallet Topup', () => {
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

  it('Should go to topup page', async () => {
    await navigateTo(page, '#top-up-link', '.wallet-topup-view')
  })

  it('Should show container for for each active provider', async () => {
    const providers = await page.evaluate(() =>
      Array.from(document.querySelectorAll('.topup-provider'), element => ({
        provider: element.dataset.provider,
        isComingSoon: Object.values(element.classList).indexOf('coming-soon') > -1
      }))
    )

    for (let i = 0; i < providers.length; i++) {
      const provider = providers[i]

      if (!provider.isComingSoon) {
        await click(page, `#${provider.provider}-link`)
        await shouldExist(page, `.wallet-topup-${provider.provider}`)
      }
    }
  })

  it('Should update receive field for simplex', async () => {
    await click(page, '#simplex-link')
    await shouldExist(page, '.wallet-topup-simplex')

    await page.waitForResponse(response => response.url() === 'https://simplex-api.tor.us/quote')
    await page.waitFor(100)
    let receiveFirst = await page.$eval('#simplex-receive', el => el.value)

    await typeText(page, '00', '#simplex-you-send')

    await page.waitForResponse(response => response.url() === 'https://simplex-api.tor.us/quote')
    await page.waitFor(300)
    let receiveSecond = await page.$eval('#simplex-receive', el => el.value)

    assert.notEqual(receiveFirst, receiveSecond)
  })

  it('Should load moonpay', async () => {
    await click(page, '#moonpay-link')
    await shouldExist(page, '.wallet-topup-moonpay')
    await page.waitForResponse(response => response.url().indexOf('https://buy.moonpay.io/') >= 0)
  })
})
