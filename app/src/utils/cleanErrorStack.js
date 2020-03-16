/**
 * Returns error without stack trace for better UI display
 * @param {Error} err - error
 * @returns {Error} Error with clean stack trace.
 */
function cleanErrorStack(error) {
  let { name } = error
  name = name === undefined ? 'Error' : String(name)

  let { message } = error
  message = message === undefined ? '' : String(message)

  if (name === '') {
    error.stack = error.message
  } else if (message === '') {
    error.stack = error.name
  } else {
    error.stack = `${error.name}: ${error.message}`
  }

  return error
}

export default cleanErrorStack
