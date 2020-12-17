const config = require('./config')

const login = async (page) => {
  await page.evaluate(async (configInner) => {
    const data = {
      privKey: configInner.testPrivateKey,
      ethAddress: configInner.testEthAddress,
    }

    // grabs the vuestore from the first element that has vue attached
    const x = document.querySelector('#app').__vue__.$store
    x.dispatch('addWallet', data)
    x.dispatch('updateSelectedAddress', { selectedAddress: data.ethAddress })
    x.dispatch('subscribeToControllers')
    await x.dispatch('initTorusKeyring', data)
  }, config)
}

const click = async (page, selector) => {
  try {
    await page.waitForSelector(selector, { visible: true, timeout: 120000 })
    await page.click(selector)
  } catch {
    throw new Error(`Could not click on selector: ${selector}`)
  }
}

const waitForText = async (page, selector, text, isCaseSensitive = true) => {
  try {
    await page.waitForSelector(selector, { timeout: 120000 })
    await page.waitForFunction(
      (selectorInner, textInner, isCaseSensitiveInner) => {
        let htmlText = document.querySelector(selectorInner).textContent
        let targetText = textInner
        if (!isCaseSensitiveInner) {
          htmlText = htmlText.toLowerCase()
          targetText = targetText.toLowerCase()
        }
        return htmlText.includes(targetText)
      },
      { timeout: 120000 },
      selector,
      text,
      isCaseSensitive
    )
  } catch (error) {
    throw new Error(error, `Text ${text} not found for selector: ${selector}`)
  }
}

const waitForClass = async (page, selector, className) => {
  try {
    await page.waitForSelector(selector, { timeout: 120000 })
    await page.waitForFunction(
      (selectorInner, classNameInner) => document.querySelector(selectorInner).classList.contains(classNameInner),
      { timeout: 120000 },
      selector,
      className
    )
  } catch {
    throw new Error(`Class ${className} not found for selector: ${selector}`)
  }
}

const shouldExist = async (page, selector) => {
  try {
    await page.waitForSelector(selector, { visible: true, timeout: 120000 })
  } catch {
    throw new Error(`Selector ${selector} does not exist`)
  }
}

const navigateTo = async (page, selector, pageContainer) => {
  if (config.isMobile) {
    await click(page, '#menu-dropdown-mobile-btn')
    await page.waitFor(100)
    await click(page, `${selector}-mobile`)
    // wait for animation
    await page.waitFor(100)
    await shouldExist(page, pageContainer)
  } else {
    await click(page, selector)
    await shouldExist(page, pageContainer)
  }
}

const loadUrl = async (page, url) => {
  await page.goto(url, { waitUntil: 'networkidle0' })
}

const typeText = async (page, text, selector) => {
  try {
    await page.waitForSelector(selector, { visible: true, timeout: 120000 })
    await page.type(selector, text)
  } catch {
    throw new Error(`Could not text into selector: ${selector}`)
  }
}

const shouldTextNotBeEmpty = async (page, selector) => {
  try {
    await page.waitForSelector(selector, { timeout: 120000 })
    await page.waitForFunction((selectorInner) => document.querySelector(selectorInner).textContent !== '', { timeout: 120000 }, selector)
  } catch {
    throw new Error(`Inner text empty for selector: ${selector}`)
  }
}

const shouldValueNotBeEmpty = async (page, selector) => {
  try {
    await page.waitForSelector(selector, { timeout: 120000 })
    await page.waitForFunction((selectorInner) => document.querySelector(selectorInner).value !== '', { timeout: 120000 }, selector)
  } catch {
    throw new Error(`Value text empty for for selector: ${selector}`)
  }
}

const selectItem = async (page, selector, selectorContainer, text) => {
  try {
    await click(page, selector)
    await page.evaluate((textInner) => {
      const options = [...document.querySelectorAll('.v-list-item__title')]
      options.forEach((option) => {
        if (option.textContent === textInner) option.click()
      })
    }, text)

    await waitForText(page, `${selectorContainer} .v-select__selection`, text)
  } catch {
    throw new Error(`Option ${text} not found for selector: ${selector}`)
  }
}

module.exports = {
  login,
  click,
  waitForText,
  waitForClass,
  shouldExist,
  navigateTo,
  loadUrl,
  typeText,
  shouldTextNotBeEmpty,
  shouldValueNotBeEmpty,
  selectItem,
}
