module.exports = createOriginMiddleware

/**
 * Returns a middleware that appends the DApp origin to request
 * @param {{ origin: string }} opts - The middleware options
 * @returns {Function}
 */
function createOriginMiddleware(options) {
  return function originMiddleware(/** @type {any} */ request, /** @type {any} */ _, /** @type {Function} */ next) {
    request.origin = options.origin
    next()
  }
}
