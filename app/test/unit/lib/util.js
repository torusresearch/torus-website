/* eslint-disable */
module.exports = {
  timeout,
  queryAsync,
  findAsync,
  pollUntilTruthy,
}

function timeout(time) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, time || 1500)
  })
}

async function findAsync(container, selector, options) {
  try {
    return await pollUntilTruthy(() => {
      const result = container.find(selector)
      if (result.length > 0) return result
    }, options)
  } catch (error) {
    throw new Error(`Failed to find element within interval: "${selector}"`)
  }
}

async function queryAsync(jQuery, selector, options) {
  try {
    return await pollUntilTruthy(() => {
      const result = jQuery(selector)
      if (result.length > 0) return result
    }, options)
  } catch (error) {
    throw new Error(`Failed to find element within interval: "${selector}"`)
  }
}

async function pollUntilTruthy(fn, options = {}) {
  const pollingInterval = options.pollingInterval || 100
  const timeoutInterval = options.timeoutInterval || 5000
  const start = Date.now()
  let result
  while (!result) {
    // check if timedout
    const now = Date.now()
    if (now - start > timeoutInterval) {
      throw new Error('pollUntilTruthy - failed to return truthy within interval')
    }
    // check for result
    result = fn()
    // run again after timeout
    await timeout(pollingInterval, timeoutInterval)
  }
  return result
}
