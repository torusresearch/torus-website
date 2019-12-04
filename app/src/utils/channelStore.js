const STORE_PREFIX = 'CF_NODE:'

const store = {
  get: path => {
    const raw = localStorage.getItem(`${STORE_PREFIX}${path}`)
    if (raw) {
      try {
        return JSON.parse(raw)
      } catch {
        return raw
      }
    }
    // Handle partial matches so the following line works -.-
    // https://github.com/counterfactual/monorepo/blob/master/packages/node/src/store.ts#L54
    if (path.endsWith('channel') || path.endsWith('appInstanceIdToProposedAppInstance')) {
      const partialMatches = {}
      for (const k of Object.keys(localStorage)) {
        if (k.includes(`${path}/`)) {
          try {
            partialMatches[k.replace(STORE_PREFIX, '').replace(`${path}/`, '')] = JSON.parse(localStorage.getItem(k) || '')
          } catch {
            partialMatches[k.replace(STORE_PREFIX, '').replace(`${path}/`, '')] = localStorage.getItem(k)
          }
        }
      }
      return partialMatches
    }
    return raw
  },
  set: pairs => {
    for (const pair of pairs) {
      localStorage.setItem(`${STORE_PREFIX}${pair.path}`, typeof pair.value === 'string' ? pair.value : JSON.stringify(pair.value))
    }
  },
  reset: () => {
    Object.entries(localStorage).forEach(([key, value]) => {
      if (key.includes(STORE_PREFIX)) {
        localStorage.removeItem(key)
      }
    })
    localStorage.removeItem(`${STORE_PREFIX}:EXTENDED_PRIVATE_KEY`)
  },
  restore: () => {}
}

export default store
