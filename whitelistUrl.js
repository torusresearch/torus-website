const { whitelistUrl } = require('@toruslabs/openlogin')

const clientId = 'BLem-1qJ-vE9v4MknOOL9WP8LtFQyvOZRD0qvmB0kauee5zQZGvCsZY0wtIO4HGyxrvGO1_mB2lMuImt9PY_pRU'
const appKey = ''
const origin = 'https://bnb.tor.us'

async function whitelist() {
  const res = await whitelistUrl(clientId, appKey, origin)
  // eslint-disable-next-line no-console
  console.log(res)
}

// eslint-disable-next-line unicorn/prefer-top-level-await
whitelist()
