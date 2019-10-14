module.exports = class ServiceWorkerIntegrityPlugin {
  constructor(appPath, stringToReplace, serviceWorkerPath) {
    this.appPath = appPath
    this.stringToReplace = stringToReplace
    this.serviceWorkerPath = serviceWorkerPath
  }

  apply(compiler) {
    const ssri = require('ssri')
    const ID = 'service-worker-integrity-plugin'
    compiler.hooks.compilation.tap(ID, compilation => {
      debugger
      compilation.hooks.htmlWebpackPluginAlterAssetTags.tap(ID, data => {
        console.log(data)
      })
    })
  }
}
