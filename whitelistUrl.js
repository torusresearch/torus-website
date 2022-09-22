const { whitelistUrl } = require('@toruslabs/openlogin')

const clientId = 'BCY9aYsh8iGshQuzNjBbONYE-tKD0JM389l87IiMOVeOU1TBmRaZphKOyphkUpo41fuSMnO6QRlloxCV-3nt8dU'
const appKey = ''
const origin = 'https://bnb.tor.us'

async function whitelist() {
  const res = await whitelistUrl(clientId, appKey, origin)
  // eslint-disable-next-line no-console
  console.log(res)
}

// eslint-disable-next-line unicorn/prefer-top-level-await
whitelist()
