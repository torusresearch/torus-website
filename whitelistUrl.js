const { whitelistUrl } = require('@toruslabs/openlogin')

const clientId = 'BPmpXn0tNGVz4CzW3SJCYAkrfEa7a4YJ3lkSfyLd-R_QDWRX7SLw7xDy9erezDKpoINZRy9BZ8pIsqj8rNmjYko'
const appKey = ''
const origin = 'https://bnb.tor.us'

async function whitelist() {
  const res = await whitelistUrl(clientId, appKey, origin)
  // eslint-disable-next-line no-console
  console.log(res)
}

// eslint-disable-next-line unicorn/prefer-top-level-await
whitelist()
