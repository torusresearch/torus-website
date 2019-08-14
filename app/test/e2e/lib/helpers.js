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
  waitForText: async function(page, selector, text) {
    try {
      await page.waitForSelector(selector)
      await page.waitForFunction((selector, text) => document.querySelector(selector).innerText.includes(text), {}, selector, text)
    } catch (error) {
      throw new Error(`Text ${text} not found for selector: ${selector}`)
    }
  }
}
