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

function generateJsonRPCObject(method, params) {
  return {
    jsonrpc: '2.0',
    method: method,
    id: 10,
    params: params
  }
}

export { get, post, generateJsonRPCObject }
