const assert = require('assert')
const puppeteer = require('puppeteer')
const path = require('path')

describe('# Web3 Test', () => {
  describe('#constructor', () => {
    it('can construct web3', async () => {
      const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] })
      const page = await browser.newPage()
      await page.addScriptTag({ path: path.resolve(__dirname, '../../public/embed.min.js') })
      try {
        await page.waitForFunction('((window.web3||{}).currentProvider||{}).isTorus === true', { timeout: 30000 })
        assert.ok('Passed')
      } catch (error) {
        assert.fail('Failed: ', error)
      }
    })
  })
})
