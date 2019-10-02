function post(url = '', data = {}, opts = {}) {
  const defaultOptions = {
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
    body: JSON.stringify(data)
  }
  const options = {
    ...defaultOptions,
    ...opts,
    ...{ method: 'POST' }
  }
  return fetch(url, options).then(response => {
    if (response.ok) {
      return response.json()
    } else throw new Error('Could not connect', response)
  })
}

function get(url = '', opts = {}) {
  const defaultOptions = {
    mode: 'cors',
    cache: 'no-cache'
  }
  const options = {
    ...defaultOptions,
    ...opts,
    ...{ method: 'GET' }
  }
  return fetch(url, options).then(response => {
    if (response.ok) {
      return response.json()
    } else throw new Error('Could not connect', response)
  })
}

function patch(url = '', data = {}, opts = {}) {
  const defaultOptions = {
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
    body: JSON.stringify(data)
  }
  const options = {
    ...defaultOptions,
    ...opts,
    ...{ method: 'PATCH' }
  }
  return fetch(url, options).then(response => {
    if (response.ok) {
      return response.json()
    } else throw new Error('Could not connect', response)
  })
}

function generateJsonRPCObject(method, params) {
  return {
    jsonrpc: '2.0',
    method: method,
    id: 10,
    params: params
  }
}

function promiseRace(url, options, timeout, counter) {
  // log.info('promise race started', url, options, timeout)
  return Promise.race([
    get(url, options),
    new Promise((resolve, reject) => {
      setTimeout(() => {
        // log.info('Timeout won in promise race', counter)
        reject(new Error('timeout'))
      }, timeout)
    })
  ])
}

export { get, post, patch, generateJsonRPCObject, promiseRace }
