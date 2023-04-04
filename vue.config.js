const fs = require('fs')
const path = require('path')
const { IgnorePlugin, ProvidePlugin, DefinePlugin } = require('webpack')
// const serviceWorkerIntegrityPlugin = require('./serviceWorkerIntegrityPlugin')

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
  // css: {
  //   extract: false,
  // },
  // Adds support for Edge browser, IE 11 and Safari 9
  transpileDependencies: ['vuetify', 'fast-json-patch'],

  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      // Get the current options from the Terser Plugin instance that vue-cli-service added:
      const terserPlugin = config.optimization.minimizer[0]
      // Set the options you want to set
      terserPlugin.options.minimizer.options.keep_fnames = true
      terserPlugin.options.minimizer.options.mangle.keep_fnames = true
      terserPlugin.options.minimizer.options.compress.keep_fnames = true
      // create a fresh plugin instance with the new options and
      // replace the current one with it
      // config.optimization.minimizer[0] = new TerserPlugin(options)
    } else {
      config.devtool = 'eval-source-map'
    }

    config.resolve.alias = {
      ...config.resolve.alias,
      'bn.js': path.resolve(__dirname, 'node_modules/bn.js'),
      'js-sha3': path.resolve(__dirname, 'node_modules/js-sha3'),
      '#': path.resolve(__dirname, 'src/'),
      'web3-providers-ipc': path.resolve(__dirname, 'node_modules/empty-module'),
      'web3-providers-ws': path.resolve(__dirname, 'node_modules/empty-module'),
      // 'web3-eth-ens': path.resolve(__dirname, 'node_modules/empty-module'),
      lodash: path.resolve(__dirname, 'node_modules/lodash-es'),
      wasmcurves: path.resolve(__dirname, 'node_modules/empty-module'),
    }
    config.plugins.push(new IgnorePlugin({ resourceRegExp: /^\.\/wordlists\/(?!english)/, contextRegExp: /bip39\/src$/ }))
    config.plugins.push(
      new ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      })
    )
    config.plugins.push(
      new ProvidePlugin({
        process: 'process/browser',
      })
    )
    config.plugins.push(
      new IgnorePlugin({
        resourceRegExp: /genesisStates\/[a-z]*\.json$/,
        contextRegExp: /@ethereumjs\/common/,
      })
    )
    config.plugins.push(
      new DefinePlugin({
        __SENTRY_DEBUG__: false,
      })
    )
    config.resolve.fallback = {
      ...(config.resolve.fallback || {}),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      os: require.resolve('os-browserify/browser'),
      crypto: require.resolve('crypto-browserify'),
      assert: require.resolve('assert/'),
      stream: require.resolve('stream-browserify'),
      url: require.resolve('url/'),
    }
  },
  // chainWebpack: (config) => {
  //   if (process.env.NODE_ENV === 'production') {
  //     config
  //       .plugin('service-worker-integrity')
  //       .use(serviceWorkerIntegrityPlugin, ['index.html', 'SERVICE_WORKER_SHA_INTEGRITY', 'service-worker.js'])
  //       .after('workbox')
  //   }
  // },

  publicPath: process.env.VUE_APP_TORUS_BUILD_ENV === 'production' || process.env.VUE_APP_TORUS_BUILD_ENV === 'binance' ? `/${version}/` : '/',
  integrity: process.env.VUE_APP_TORUS_BUILD_ENV === 'production' || process.env.VUE_APP_TORUS_BUILD_ENV === 'binance',
  crossorigin: 'anonymous',
  productionSourceMap: true,
  pwa: {
    name: 'USFL',
    themeColor: '#ce0e2d',
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
      appleTouchIcon: 'img/icons/apple-touch-icon-64x64.png',
      maskIcon: 'img/icons/safari-pinned-tab.svg',
      msTileImage: 'img/icons/msapplication-icon-144x144.png',
    },
    mainfestPath: getValueForCurrentEnvironment('manifest.json'),
    manifestOptions: {
      name: 'Torus',
      short_name: 'Torus',
      start_url: getValueForCurrentEnvironment('index.html'),
      display: 'standalone',
      theme_color: '#ce0e2d',
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
