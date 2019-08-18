module.exports = {
  loadUrl: async function(page, url) {
    await page.goto(url, { waitUntil: 'networkidle0' })
  },
  click: async function(page, selector) {
    try {
      await page.waitForSelector(selector)
      await page.click(selector)
    } catch (error) {
      throw new Error(`Could not click on selector: ${selector}`)
    }
  },
  typeText: async function(page, text, selector) {
    try {
      await page.waitForSelector(selector, { visible: true })
      await page.type(selector, text)
    } catch (error) {
      throw new Error(`Could not text into selector: ${selector}`)
    }
  },
  waitForText: async function(page, selector, text) {
    try {
      await page.waitForSelector(selector)
      await page.waitForFunction((selector, text) => document.querySelector(selector).innerText.includes(text), {}, selector, text)
    } catch (error) {
      throw new Error(`Text ${text} not found for selector: ${selector}`)
    }
  },
  shouldExist: async function(page, selector) {
    try {
      await page.waitForSelector(selector, { visible: true })
    } catch (error) {
      throw new Error(`Selector ${selector} does not exist`)
    }
  },
  shouldTextNotBeEmpty: async function(page, selector, text) {
    try {
      await page.waitForSelector(selector)
      await page.waitForFunction(selector => document.querySelector(selector).innerText !== '', {}, selector)
    } catch (error) {
      throw new Error(`Text ${text} not found for selector: ${selector}`)
    }
  },
  shouldValueNotBeEmpty: async function(page, selector, text) {
    try {
      await page.waitForSelector(selector)
      await page.waitForFunction(selector => document.querySelector(selector).value !== '', {}, selector)
    } catch (error) {
      throw new Error(`Text ${text} not found for selector: ${selector}`)
    }
  }
}
