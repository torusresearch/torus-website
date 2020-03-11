/* eslint-disable */
module.exports = class ServiceWorkerIntegrityPlugin {
  constructor(appPath, stringToReplace, serviceWorkerPath) {
    this.appPath = appPath
    this.stringToReplace = stringToReplace
    this.serviceWorkerPath = serviceWorkerPath
  }

  apply(compiler) {
    const ssri = require('ssri')
    const fs = require('fs')
    const { RawSource } = require('webpack-sources')
    const ID = 'service-worker-integrity-plugin'
    const readFile = compiler.inputFileSystem.readFile.bind(compiler.inputFileSystem)
    const getFileName = function(compilation, partialName) {
      return Object.keys(compilation.assets).find(name => name.includes(partialName))
    }
    compiler.hooks.emit.tap(ID, compilation => {
      try {
        const precacheManifestName = getFileName(compilation, 'precache-manifest.')
        const precacheManifestSource = compilation.assets[precacheManifestName].source()
        const serviceWorkerName = getFileName(compilation, 'service-worker.js')
        const serviceWorkerSource = compilation.assets[serviceWorkerName].source()
        const strippedImportServiceWorkerSource = serviceWorkerSource
          .split('\n')
          .slice(2)
          .join('\n')
        const concatenatedServiceWorkerSource = `${precacheManifestSource.replace(/"/g, `${''}'`)}\n${strippedImportServiceWorkerSource}`
        compilation.assets[serviceWorkerName] = {
          source: () => concatenatedServiceWorkerSource,
          size: () => concatenatedServiceWorkerSource.length
        }
        const swIntegrity = ssri.fromData(compilation.assets[serviceWorkerName].source(), { algorithms: ['sha384'] }).toString()
        const appName = getFileName(compilation, 'js/app.')
        const string = compilation.assets[appName]._value
        compilation.assets['js/app.js'] = new RawSource(string.toString().replace('SERVICE_WORKER_SHA_INTEGRITY', swIntegrity))
        compiler.hooks.done.tap(ID, stats => {
          try {
            const appIntegrity = ssri.fromData(stats.compilation.assets['js/app.js'].source(), { algorithms: ['sha384'] }).toString()
            const appHTMLName = getFileName(stats.compilation, 'index.html')
            const appHTMLPath = stats.compilation.assets[appHTMLName].existsAt
            const appHTMLFile = fs.readFileSync(appHTMLPath, 'utf8')
            const modifiedFile = appHTMLFile
              .toString()
              .replace(/app\.[\da-z]*\.js/, 'app.js')
              .replace(/(\/js\/app.js.*)(integrity=sha384-[\d+/=A-Za-z]*)( *><\/script>)/, `$1integrity="${appIntegrity}"$3`)
            fs.writeFileSync(appHTMLPath, modifiedFile)
          } catch (error) {
            console.error('Could not run service worker integrity plugin on compilation', error)
          }
        })
      } catch (error) {
        console.error('Could not run service worker integrity plugin', error)
      }
    })
  }
}
