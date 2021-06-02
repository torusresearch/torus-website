const fs = require('fs')
const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')
const { IgnorePlugin } = require('webpack')
const serviceWorkerIntegrityPlugin = require('./serviceWorkerIntegrityPlugin')

const version = `v${JSON.parse(fs.readFileSync(path.resolve('./package.json'))).version}`
process.env.VUE_APP_TORUS_BUILD_VERSION = version

module.exports = {
  devServer: {
    port: 4050, // CHANGE YOUR PORT HERE!
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    // quiet: true
  },
  css: {
    extract: false,
  },
  // Adds support for Edge browser, IE 11 and Safari 9
  transpileDependencies: ['vuetify', 'fast-json-patch'],

  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      // Get the current options from the Terser Plugin instance that vue-cli-service added:
      const { options } = config.optimization.minimizer[0]
      // Set the options you want to set
      options.terserOptions.keep_fnames = true
      options.terserOptions.mangle.keep_fnames = true
      options.terserOptions.compress.keep_fnames = true
      // create a fresh pülugin instance with the new options and
      // replace the current one with it
      config.optimization.minimizer[0] = new TerserPlugin(options)
    } else {
      config.devtool = 'source-map'
    }
  },
  chainWebpack: (config) => {
    config.resolve.alias.set('bn.js', path.resolve(__dirname, 'node_modules/bn.js'))
    config.resolve.alias.set('lodash', path.resolve(__dirname, 'node_modules/lodash'))
    config.resolve.alias.set('#', path.resolve(__dirname, 'src/'))
    config.resolve.extensions.add('.vue')

    config.plugin('ignore').use(IgnorePlugin, [/^\.\/wordlists\/(?!english)/, /bip39\/src$/])

    // new webpack.IgnorePlugin(/^\.\/wordlists\/(?!english)/, /bip39\/src$/)
    if (process.env.NODE_ENV === 'production') {
      config
        .plugin('service-worker-integrity')
        .use(serviceWorkerIntegrityPlugin, ['index.html', 'SERVICE_WORKER_SHA_INTEGRITY', 'service-worker.js'])
        .after('workbox')
    } else {
      config.module.rule('sourcemap').test(/\.js$/).enforce('pre').use('source-map-loader').loader('source-map-loader').end()
    }
  },

  publicPath: process.env.VUE_APP_TORUS_BUILD_ENV === 'production' || process.env.VUE_APP_TORUS_BUILD_ENV === 'binance' ? `/${version}/` : '/',
  integrity: process.env.VUE_APP_TORUS_BUILD_ENV === 'production' || process.env.VUE_APP_TORUS_BUILD_ENV === 'binance',
  crossorigin: 'anonymous',
  productionSourceMap: true,
  pwa: {
    name: 'Torus',
    themeColor: '#0364ff',
    msTileColor: '#000000',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black-translucent',
    workboxPluginMode: 'InjectManifest',
    orientation: 'potrait',
    workboxOptions: {
      swSrc: './src/sw-base.js',
      swDest: 'service-worker.js',
      dontCacheBustURLsMatching: /\.[\da-f]{8}\./,
      exclude: [/\.map$/, /img\/icons\//, /favicon\.ico$/, /^manifest.*\.js?$/, /LICENSE/],
      maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
    },
    iconPaths: {
      favicon32: 'img/icons/favicon-32x32.png',
      favicon16: 'img/icons/favicon-16x16.png',
      appleTouchIcon: 'img/icons/apple-touch-icon-180x180.png',
      maskIcon: 'img/icons/safari-pinned-tab.svg',
      msTileImage: 'img/icons/msapplication-icon-144x144.png',
    },
    mainfestPath: getValueForCurrentEnvironment('manifest.json'),
    manifestOptions: {
      name: 'Torus',
      short_name: 'Torus',
      start_url: getValueForCurrentEnvironment('index.html'),
      display: 'standalone',
      theme_color: '#0364ff',
      icons: [
        getAndroidIcon('72x72'),
        getAndroidIcon('96x96'),
        getAndroidIcon('128x128'),
        getAndroidIcon('144x144'),
        getAndroidIcon('152x152'),
        getAndroidIcon('192x192'),
        getAndroidIcon('384x384'),
        getAndroidIcon('512x512'),
      ],
    },
  },
  parallel: !process.env.CIRCLECI,
  pluginOptions: {
    webpackBundleAnalyzer: {
      openAnalyzer: false,
      analyzerMode: 'disabled',
    },
  },
}

function getAndroidIcon(size) {
  return {
    src: getValueForCurrentEnvironment(`img/icons/android-chrome-${size}.png`),
    sizes: size,
    type: 'image/png',
  }
}

function getValueForCurrentEnvironment(value) {
  return process.env.VUE_APP_TORUS_BUILD_ENV === 'production' || process.env.VUE_APP_TORUS_BUILD_ENV === 'binance'
    ? `/${version}/${value}`
    : `/${value}`
}
