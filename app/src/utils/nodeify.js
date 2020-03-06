const promiseToCallback = require('promise-to-callback')

const noop = () => {}

/**
 * A generator that returns a function which, when passed a promise, can treat that promise as a node style callback.
 * The prime advantage being that callbacks are better for error handling.
 *
 * @param {Function} fn The function to handle as a callback
 * @param {Object} context The context in which the fn is to be called, most often a this reference
 *
 */
export default function nodeify(fn, context) {
  return () => {
    // eslint-disable-next-line prefer-rest-params
    const arguments_ = [].slice.call(arguments)
    const lastArgument = arguments_[arguments_.length - 1]
    const lastArgumentIsCallback = typeof lastArgument === 'function'
    let callback
    if (lastArgumentIsCallback) {
      callback = lastArgument
      arguments_.pop()
    } else {
      callback = noop
    }
    promiseToCallback(fn.apply(context, arguments_))(callback)
  }
}
