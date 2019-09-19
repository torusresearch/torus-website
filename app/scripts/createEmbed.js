var browserify = require('browserify')
var fs = require('fs')
var envify = require('envify/custom')
var log = require('loglevel')

try {
  var bundler = browserify(require.resolve('@toruslabs/torus-embed/public/index.js'), {
    fullPaths: true
  })

  if (process.env.VUE_APP_TORUS_BUILD_ENV !== 'development') {
    bundler.transform('uglifyify', { global: true, keep_fnames: true })
  }
  bundler.transform(
    envify({
      VUE_APP_TORUS_BUILD_ENV: process.env.VUE_APP_TORUS_BUILD_ENV
    })
  )

  bundler.bundle().pipe(fs.createWriteStream(__dirname + '/../public/embed.min.js'))
} catch (e) {
  log.error(e)
}
