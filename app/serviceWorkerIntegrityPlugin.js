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
      return Object.keys(compilation.assets).filter(function(name) {
        return name.indexOf(partialName) > -1
      })[0]
    }

    compiler.hooks.emit.tap(ID, compilation => {
      try {
        var precacheManifestName = getFileName(compilation, 'precache-manifest.')
        var precacheManifestSource = compilation.assets[precacheManifestName].source()
        var serviceWorkerName = getFileName(compilation, 'service-worker.js')
        var serviceWorkerSource = compilation.assets[serviceWorkerName].source()
        var strippedImportServiceWorkerSource = serviceWorkerSource
          .split('\n')
          .slice(2)
          .join('\n')
        var concatenatedServiceWorkerSource = precacheManifestSource.replace(/"/g, `${''}'`) + '\n' + strippedImportServiceWorkerSource
        compilation.assets[serviceWorkerName] = {
          source: () => concatenatedServiceWorkerSource,
          size: () => concatenatedServiceWorkerSource.length
        }
        var swIntegrity = ssri.fromData(compilation.assets[serviceWorkerName].source(), { algorithms: ['sha384'] }).toString()
        console.log(compilation.assets[serviceWorkerName].source())
        var appName = getFileName(compilation, 'js/app.')
        var str = compilation.assets[appName]._value
        compilation.assets['js/app.js'] = new RawSource(str.toString().replace('SERVICE_WORKER_SHA_INTEGRITY', swIntegrity))
        var appHTMLName = getFileName(compilation, 'app.html')
        var appHTMLSource = compilation.assets[appHTMLName].source()
        compiler.hooks.done.tap(ID, stats => {
          var appIntegrity = ssri.fromData(stats.compilation.assets['js/app.js'].source(), { algorithms: ['sha384'] }).toString()
          var appHTMLPath = stats.compilation.assets['index.html'].existsAt
          var appHTMLFile = fs.readFileSync(appHTMLPath)
          fs.writeFileSync(
            appHTMLPath,
            appHTMLFile
              .toString()
              .replace(/app\.[0-9a-z]*\.js/, 'app.js')
              .replace(/(\/js\/app.js.*)(integrity="sha384\-[a-zA-Z0-9\/\+\=]*")(><\/script>)/, `$1integrity="${appIntegrity}"$3`)
          )
          console.log('INTEGRITY', appIntegrity, swIntegrity)
        })
      } catch (err) {
        console.error('Could not run service worker integrity plugin ', err)
      }
    })
  }
}
