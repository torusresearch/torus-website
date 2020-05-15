const fs = require('fs')
const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')
const serviceWorkerIntegrityPlugin = require('./serviceWorkerIntegrityPlugin')

const version = `v${JSON.parse(fs.readFileSync(path.resolve('./package.json'))).version}`

module.exports = {
  devServer: {
    https: true,
    host: 'localhost',
    port: 3000, // CHANGE YOUR PORT HERE!
    hotOnly: false,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'max-age=3600',
    },
    historyApiFallback: {
      rewrites: [
        { from: /redirect/, to: '/redirect.html' },
        { from: /./, to: '/index.html' },
      ],
    },
  },
  css: {
    extract: false,
  },
  // Adds support for Edge browser, IE 11 and Safari 9
  transpileDependencies: ['vuetify', 'obs-store'],

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
    }
  },
  chainWebpack: (config) => {
    config.resolve.alias.set('bn.js', 'fork-bn.js')
    if (process.env.NODE_ENV === 'production') {
      config
        .plugin('service-worker-integrity')
        .use(serviceWorkerIntegrityPlugin, ['app.html', 'SERVICE_WORKER_SHA_INTEGRITY', 'service-worker.js'])
        .after('workbox')
    }
    // config.module
    //   .rule('worker')
    //   .test(/\.worker\.js$/)
    //   .use('worker-loader')
    //   .loader('worker-loader')
    //   .tap(options => {
    //     return options
    //   })
  },

  publicPath: process.env.VUE_APP_TORUS_BUILD_ENV === 'production' || process.env.VUE_APP_TORUS_BUILD_ENV === 'staging' ? `/${version}/` : '/',
  integrity: true,
  crossorigin: 'anonymous',
  productionSourceMap: false,
  pwa: {
    name: 'Torus',
    themeColor: '#0364ff',
    msTileColor: '#000000',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black-translucent',
    workboxPluginMode: 'InjectManifest',
    orientation: 'potrait',
    workboxOptions: {
      importWorkboxFrom: 'disabled',
      swSrc: 'sw.js',
      swDest: 'service-worker.js',
      precacheManifestFilename: 'precache-manifest.[manifestHash].js',
      exclude: [/^.*images\/logos\/.*$/],
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
}

function getAndroidIcon(size) {
  return {
    src: getValueForCurrentEnvironment(`img/icons/android-chrome-${size}.png`),
    sizes: size,
    type: 'image/png',
  }
}

function getValueForCurrentEnvironment(value) {
  return process.env.VUE_APP_TORUS_BUILD_ENV === 'production' || process.env.VUE_APP_TORUS_BUILD_ENV === 'staging'
    ? `/${version}/${value}`
    : `/${value}`
}
