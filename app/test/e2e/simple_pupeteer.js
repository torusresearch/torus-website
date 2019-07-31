const puppeteer = require('puppeteer')

class TorusUI {
  constructor(page) {
    this.page = page
    this.clickableAnchors = {}
  }

  async goToHomeTab() {
    this.page.evaluate(async () => {
      const href = '/wallet/home'
      document.querySelector(`[href='${href}']`).click()
    })
  }
  async goToHistoryTab() {
    return this.page.evaluate(async () => {
      const href = '/wallet/history'
      document.querySelector(`[href='${href}']`).click()
    })
  }
  async goToSettingsTab() {
    return this.page.evaluate(async () => {
      const href = '/wallet/settings'
      document.querySelector(`[href='${href}']`).click()
    })
  }
  async goToAccountsTab() {
    return this.page.evaluate(async () => {
      const href = '/wallet/accounts'
      document.querySelector(`[href='${href}']`).click()
    })
  }
}

var args = process.argv.slice()

const sleep = milliseconds => {
  return new Promise((resolve, reject) => {
    setTimeout(function() {
      resolve()
    }, milliseconds)
  })
}

/**
 * prepareTorusPuppeteerPage returns either a puppeteer Page object or null.
 *
 * it sets up the torus-wallet website with preconfigured private key and
 * already "logged in" user
 * @param {puppeteer.Browser} browser - Puppeteer Browser object
 * @returns {puppeteer.Page} Puppeteer Page object
 */
const prepareTorusPuppeteerPage = async browser => {
  const page = await browser.newPage()
  const loadedPage = await page.goto('http://localhost:3000')
  await sleep(2000)
  await page.evaluate(async () => {
    const testPrivateKey = '9562c2e50d5035a4eb57c167d495578a7f7ee5472a50205f9548e9d694c394c2'
    const testEthAddress = '0xa23CD8f6e86707972Fe36c5683Fd18e7683C1053'

    let data = {
      privKey: testPrivateKey,
      ethAddress: testEthAddress
    }

    // grabs the vuestore from the first element that has vue attached
    let x = document.getElementsByTagName('button')[0].__vue__.$store
    x.dispatch('addWallet', data)
    x.dispatch('updateSelectedAddress', { selectedAddress: data.ethAddress })
    x.dispatch('subscribeToControllers')
    await x.dispatch('initTorusKeyring', data)
  })

  return page
}

function switchToNetwork(page, network = 'rinkeby') {}

/**
 * runPuppeteer runs the puppeteer end to end tests.
 */
const runPuppeteer = async () => {
  let headless = false

  const browser = await puppeteer.launch({ headless })
  const page = await prepareTorusPuppeteerPage(browser)
  const torusUI = new TorusUI(page)
  await torusUI.goToHistoryTab()
  await sleep(500)
  await torusUI.goToAccountsTab()
  await sleep(500)
  await torusUI.goToSettingsTab()
  await sleep(500)

  await browser.close()
}

runPuppeteer()
