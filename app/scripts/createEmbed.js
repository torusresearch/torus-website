/* eslint-disable import/no-extraneous-dependencies */
const browserify = require('browserify')
const fs = require('fs')
const envify = require('envify/custom')
const log = require('loglevel')

try {
  const bundler = browserify(require.resolve('@toruslabs/torus-embed/public/index.js'), {
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

  bundler.bundle().pipe(fs.createWriteStream(`${__dirname}/../public/embed.min.js`))
} catch (error) {
  log.error(error)
}
