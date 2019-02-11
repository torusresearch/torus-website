const log = require('loglevel')
log.setDefaultLevel('debug')
const runUntilEvaluateEquals = (fn, value, opts = {}) => {
  if (opts.interval === undefined) opts.interval = 500
  if (opts.comparator === undefined) opts.comparator = (a, b) => a === b
  return new Promise((resolve, reject) => {
    ;(function wait() {
      if (!opts.comparator(fn(), value)) {
        setTimeout(wait, opts.interval)
      } else {
        resolve()
      }
    })()
  })
}

const sleep = milliseconds => {
  return new Promise((resolve, reject) => {
    setTimeout(function() {
      resolve()
    }, milliseconds)
  })
}

const timeout = 180000

const puppeteer = require('puppeteer')
;(async () => {
  try {
    setTimeout(function() {
      log.info(`Setting default timeout to ${timeout}ms`)
      throw new Error('Timed out')
    }, timeout)
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    var pageLoading = page.goto('https://www.etheremon.com')
    log.info('Opening Etheremon page')
    var timer = setInterval(async function() {
      log.info('Attemping to inject Torus script')
      try {
        var pageBody = await page.$('body')
        if (pageBody) {
          page.addScriptTag({ url: 'https://localhost:3000/embed.min.js' })
          log.info('Torus script injected into page')
          clearTimeout(timer)
        }
      } catch (e) {
        log.info('Could not retrieve page body...')
      }
    }, 50)
    await pageLoading
    log.info('Etheremon page loaded')
    await page.waitForFunction('(document.querySelector(".navbar__item.username a")||{}).innerText == "sign in"')
    log.info('Etheremon sign in button loaded')
    page.click('.navbar__item.username a')
    await page.waitForFunction('(document.querySelector(".widget__button-new div.content")||{}).innerText == "Unlock Metamask"')
    log.info('Etheremon Unlock Metamask button loaded')
    page.click('.widget__button-new div.content')
    var pageCount = 0
    await runUntilEvaluateEquals(function() {
      ;(async function() {
        pageCount = (await browser.pages()).length
      })()
      return pageCount
    }, 3)
    log.info('Popup opened')
    var browserPages = await browser.pages()
    var googleLoginPopup = browserPages.reduce(function(acc, curr) {
      if (curr.url().indexOf('google') !== -1) {
        return curr
      } else {
        return acc
      }
    })
    await googleLoginPopup.waitForFunction('(document.querySelector("form content div div div div input")||{}).type === "email"')
    log.info('Google login popup email field loaded')
    await sleep(3000)
    await googleLoginPopup.keyboard.type('tro')
    await sleep(100)
    await googleLoginPopup.keyboard.type('nsk')
    await sleep(100)
    await googleLoginPopup.keyboard.type('ytr')
    await sleep(100)
    await googleLoginPopup.keyboard.type('oll')
    await sleep(100)
    await googleLoginPopup.keyboard.press('Enter')
    log.info('Google login popup email entered')
    await googleLoginPopup.waitForFunction('(document.querySelector("form content div div div div input")||{}).type === "password"')
    log.info('Google login popup password field loaded')
    await sleep(3000)
    await googleLoginPopup.keyboard.type('T.T')
    await sleep(100)
    await googleLoginPopup.keyboard.type('r0l')
    await sleep(100)
    await googleLoginPopup.keyboard.type('ling')
    await sleep(100)
    await googleLoginPopup.keyboard.press('Enter')
    log.info('Google login popup password entered')

    await page.waitForFunction('(document.querySelector(".widget__button-new div.content")||{}).innerText == "Sign In"')
    log.info('Etheremon page updated, requesting private key signin')
    await page.click('.widget__button-new div.content')

    pageCount = 0
    await runUntilEvaluateEquals(function() {
      ;(async function() {
        pageCount = (await browser.pages()).length
      })()
      return pageCount
    }, 3)
    log.info('Popup opened')

    browserPages = await browser.pages()
    var torusPopup = browserPages.reduce(function(acc, curr) {
      if (curr.url().indexOf('localhost') !== -1) {
        return curr
      } else {
        return acc
      }
    })
    await torusPopup.waitForFunction(
      // eslint-disable-next-line max-len
      '(document.getElementsByClassName("v-card__actions")[0]||{}).children && document.getElementsByClassName("v-card__actions")[0].children[2] && document.getElementsByClassName("v-card__actions")[0].children[2].innerText === "AGREE"'
    )
    log.info('Torus popup agree button loaded')
    await sleep(1000)
    await torusPopup.keyboard.press('Tab')
    await sleep(100)
    await torusPopup.keyboard.press('Tab')
    await sleep(100)
    try {
      torusPopup.keyboard.press('Enter')
    } catch (e) {
      // fail silently, was throwing errors because window was closed
    }
    log.info('Torus popup agree button pressed')
    await page.waitForFunction('(document.querySelector(".signup__label")||{}).innerText == "Register to start the journey"')
    log.info('E2E test passed')
    process.exit(0)
  } catch (e) {
    log.info(e)
    log.info('E2E test failed')
    process.exit(1)
  }
})()
