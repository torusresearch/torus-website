/* eslint-disable */
const mockHex = '0xabcdef0123456789'
const mockKey = Buffer.alloc(32)
let cacheValue

module.exports = {
  encrypt(password, dataObject) {
    cacheValue = dataObject
    return Promise.resolve(mockHex)
  },

  decrypt(password, text) {
    return Promise.resolve(cacheValue || {})
  },

  encryptWithKey(key, dataObject) {
    return this.encrypt(key, dataObject)
  },

  decryptWithKey(key, text) {
    return this.decrypt(key, text)
  },

  keyFromPassword(password) {
    return Promise.resolve(mockKey)
  },

  generateSalt() {
    return 'WHADDASALT!'
  },

  getRandomValues() {
    return 'SOO RANDO!!!1'
  },
}
