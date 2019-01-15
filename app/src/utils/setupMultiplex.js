const ObjectMultiplex = require('obj-multiplex')
const pump = require('pump')

module.exports = function setupMultiplex (connectionStream) {
  const mux = new ObjectMultiplex()
  pump(
    connectionStream,
    mux,
    connectionStream,
    (err) => {
      if (err) console.error(err)
    }
  )
  // bind helper method to get previously created streams
  mux.getStream = function (name) {
    if (this._substreams[name]) {
      return this._substreams[name]
    } else {
      return this.createStream(name)
    }
  }
  return mux
}
