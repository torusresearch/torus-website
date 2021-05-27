/* eslint-disable import/no-extraneous-dependencies */

const log = require('loglevel')
const ssri = require('ssri')
const fs = require('fs')
const { RawSource } = require('webpack-sources')

const getFileName = (compilation, partialName) => Object.keys(compilation.assets).find((name) => name.includes(partialName))

class ServiceWorkerIntegrityPlugin {
  constructor(appPath, stringToReplace, serviceWorkerPath) {
    this.appPath = appPath
    this.stringToReplace = stringToReplace
    this.serviceWorkerPath = serviceWorkerPath
  }

  apply(compiler) {
    const ID = 'service-worker-integrity-plugin'

    compiler.hooks.emit.tap(ID, (compilation) => {
      try {
        const serviceWorkerName = getFileName(compilation, 'service-worker.js')
        const swIntegrity = ssri.fromData(compilation.assets[serviceWorkerName].source(), { algorithms: ['sha384'] }).toString()
        const appName = getFileName(compilation, 'js/app.')
        // console.log('%O', compilation.assets[appName].children[0])
        // console.log(appName, 'appname')
        const string = compilation.assets[appName].children[0]._value
        compilation.assets['js/app.js'] = new RawSource(string.toString().replace('SERVICE_WORKER_SHA_INTEGRITY', swIntegrity))
        compiler.hooks.done.tap(ID, (stats) => {
          try {
            const appIntegrity = ssri.fromData(stats.compilation.assets['js/app.js'].source(), { algorithms: ['sha384'] }).toString()
            const appHTMLName = getFileName(stats.compilation, 'index.html')
            const appHTMLPath = stats.compilation.assets[appHTMLName].existsAt
            const appHTMLFile = fs.readFileSync(appHTMLPath, 'utf8')
            const modifiedFile = appHTMLFile
              .toString()
              .replace(/app\.[\da-z]*\.js/, 'app.js')
              .replace(/(\/js\/app.js.*)(integrity="?sha384-[\d+/=A-Za-z]*"?)( *><\/script>)/, `$1integrity="${appIntegrity}"$3`)
            fs.writeFileSync(appHTMLPath, modifiedFile)
          } catch (error) {
            log.error('Could not run service worker integrity plugin on compilation', error)
          }
        })
      } catch (error) {
        log.error('Could not run service worker integrity plugin', error)
      }
    })
  }
}

module.exports = ServiceWorkerIntegrityPlugin
