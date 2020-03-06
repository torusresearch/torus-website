const log = require('loglevel')

module.exports = createLoggerMiddleware

/**
 * Returns a middleware that logs RPC activity
 * @param {{ origin: string }} opts - The middleware options
 * @returns {Function}
 */
function createLoggerMiddleware(options) {
  return function loggerMiddleware(/** @type {any} */ request, /** @type {any} */ res, /** @type {Function} */ next) {
    next(callback => {
      if (res.error) {
        log.error('Error in RPC response:\n', res)
      }
      if (request.isMetamaskInternal) return
      log.info(`RPC (${options.origin}):`, request, '->', res)
      callback()
    })
  }
}
