import promiseToCallback from 'promise-to-callback'

const callbackNoop = (error) => {
  if (error) {
    throw error
  }
}

/**
 * A generator that returns a function which, when passed a promise, can treat that promise as a node style callback.
 * The prime advantage being that callbacks are better for error handling.
 *
 * @param {Function} fn - The function to handle as a callback
 * @param {Object} context - The context in which the fn is to be called, most often a this reference
 *
 */
export default function nodeify(fn, context) {
  return (...arguments_) => {
    // parse arguments
    const lastArgument = arguments_[arguments_.length - 1]
    const lastArgumentIsCallback = typeof lastArgument === 'function'
    let callback
    if (lastArgumentIsCallback) {
      callback = lastArgument
      arguments_.pop()
    } else {
      callback = callbackNoop
    }
    // call the provided function and ensure result is a promise
    let result
    try {
      result = Promise.resolve(fn.apply(context, arguments_))
    } catch (error) {
      result = Promise.reject(error)
    }
    // wire up promise resolution to callback
    promiseToCallback(result)(callback)
  }
}
