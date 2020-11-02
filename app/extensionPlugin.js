const { parse } = require('node-html-parser')
/* eslint-disable */
module.exports = class ExtensionPlugin {
  constructor() {}

  apply(compiler) {
    const ID = 'vue-extension'
    const manifestName = 'manifest.json'
    const popupPageName = 'index.html'
    compiler.hooks.emit.tap(ID, (compilation) => {
      try {
        // const manifest = JSON.parse(compilation.assets[manifestName].source())
        const manifest = {}
        manifest.name = 'Torus Extension'
        manifest.manifest_version = 2
        manifest.version = '1.0'
        manifest.description = 'Torus Extension'
        manifest.browser_action = {
          default_popup: 'index.html',
          default_src: 'index.html',
        }
        manifest.permissions = ['activeTab', 'storage']

        // inline scripts in Chrome extensions need SRI in the CSP
        const inlineScriptSHA256Integrities = `'sha256-O1sOOlFv4s/n2Ua1NIIC5/IpFKNPfBU53voHvgjtAJ0=' 'sha256-iPUHWPCQMD2MARNLfjdsfC9KdbMv98FCVtbaZRs0gSs='`

        manifest.content_security_policy = `script-src 'self' ${inlineScriptSHA256Integrities} 'unsafe-eval'; object-src 'self';`
        const newManifestSource = JSON.stringify(manifest)
        compilation.assets[manifestName] = {
          source: () => newManifestSource,
          size: () => newManifestSource.length,
        }
        const popupPage = compilation.assets[popupPageName]
        if (popupPage) {
          const popupPageSource = popupPage.source()
          const root = parse(popupPageSource)
          root.querySelector('html').setAttribute('style', 'width: 500px;')
          const rootSource = root.toString()
          compilation.assets[popupPageName] = {
            source: () => rootSource,
            size: () => rootSource.length,
          }
        }
      } catch (error) {
        console.error('Could not run service worker integrity plugin', error)
      }
    })
  }
}
