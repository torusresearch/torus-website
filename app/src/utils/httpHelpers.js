import log from 'loglevel'
import config from '../config'

export const promiseTimeout = (ms, promise) => {
  const timeout = new Promise((resolve, reject) => {
    const id = setTimeout(() => {
      clearTimeout(id)
      reject(new Error('Timed out in ' + ms + 'ms'))
    }, ms)
  })
  return Promise.race([promise, timeout])
}

export const post = (url = '', data = {}, opts = {}) => {
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
  return promiseTimeout(
    30000,
    fetch(url, options).then(response => {
      if (response.ok) return response.json()
      return Promise.reject(response)
    })
  )
}

export const remove = (url = '', data = {}, opts = {}) => {
  const defaultOptions = {
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    }
  }
  const options = {
    ...defaultOptions,
    ...opts,
    ...{ method: 'DELETE' }
  }
  return fetch(url, options).then(response => {
    if (response.ok) return response.json()
    return Promise.reject(response)
  })
}

export const get = (url = '', opts = {}) => {
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
    if (response.ok) return response.json()
    return Promise.reject(response)
  })
}

export const patch = (url = '', data = {}, opts = {}) => {
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
    if (response.ok) return response.json()
    return Promise.reject(response)
  })
}

export const generateJsonRPCObject = (method, params) => {
  return {
    jsonrpc: '2.0',
    method: method,
    id: 10,
    params: params
  }
}

export const getPastOrders = (params = {}, headers) => {
  try {
    const options = {
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...headers
      }
    }
    const url = new URL(`${config.commonApiHost}/transaction`)
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
    return get(url, options)
  } catch (e) {
    log.error(e)
  }
}

export const promiseRace = (url, options, timeout, counter) => {
  return Promise.race([
    get(url, options),
    new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('timeout'))
      }, timeout)
    })
  ])
}
