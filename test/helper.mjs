/* eslint-disable no-console */
import Register from '@babel/register'
import Ganache from 'ganache'
import JSDOM from 'jsdom-global'
import log from 'loglevel'
import nock from 'nock'
import fetch, { Headers, Request, Response } from 'node-fetch'

console.log('requiring helpers for tests in mocha')
const allowedHosts = ['localhost', 'mainnet.infura.io:443']

const isNetConnectAllowed = (host) => {
  const found = allowedHosts.find((validHost) => host.includes(validHost))
  return !!found
}
nock.disableNetConnect()
nock.enableNetConnect((host) => isNetConnectAllowed(host))

// catch rejections that are still unhandled when tests exit
const unhandledRejections = new Map()
process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled rejection:', reason)
  unhandledRejections.set(promise, reason)
})
process.on('rejectionHandled', (promise) => {
  console.log(`handled: ${unhandledRejections.get(promise)}`)
  unhandledRejections.delete(promise)
})

process.on('exit', () => {
  if (unhandledRejections.size > 0) {
    console.error(`Found ${unhandledRejections.size} unhandled rejections:`)
    for (const reason of unhandledRejections.values()) {
      console.error('Unhandled rejection:', reason)
    }
    process.exit(1)
  }
})

// ganache server
const server = Ganache.server()
server.listen(8545, (err) => {
  if (err) console.error('Failed to start ganache', err)
})

log.setDefaultLevel(5)
globalThis.log = log

//
// polyfills
//

// fetch
globalThis.fetch = fetch
globalThis.Response = Response
globalThis.Headers = Headers
globalThis.Request = Request

// dom
JSDOM('', {
  url: 'http://localhost',
})

globalThis.matchMedia = globalThis.matchMedia || (() => ({ matches: false, addListener: () => {}, removeListener: () => {} }))

const storeFn = {
  getItem(key) {
    return this[key]
  },
  setItem(key, value) {
    this[key] = value
  },
}
globalThis.localStorage = { ...storeFn }
globalThis.sessionStorage = { ...storeFn }

Register({
  extensions: ['.js'],
  rootMode: 'upward',
  ignore: [/(node_module)/],
  presets: [['@vue/cli-plugin-babel/preset', { useBuiltIns: 'entry' }]],
  plugins: ['@babel/plugin-proposal-class-properties'],
})

console.log('finished requiring helpers for tests in mocha')
