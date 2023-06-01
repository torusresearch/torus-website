/* eslint-disable */
const fakeWallet = {
  privKey: '0x123456788890abcdef',
  address: '0xfedcba0987654321',
}
const type = 'Simple Key Pair'

module.exports = class MockSimpleKeychain {
  static type() {
    return type
  }

  constructor(options) {
    this.type = type
    this.opts = options || {}
    this.wallets = []
  }

  serialize() {
    return [fakeWallet.privKey]
  }

  deserialize(data) {
    if (!Array.isArray(data)) {
      throw new TypeError('Simple keychain deserialize requires a privKey array.')
    }
    this.wallets = [fakeWallet]
  }

  addAccounts(n = 1) {
    for (let i = 0; i < n; i++) {
      this.wallets.push(fakeWallet)
    }
  }

  getAccounts() {
    return this.wallets.map((w) => w.address)
  }
}
