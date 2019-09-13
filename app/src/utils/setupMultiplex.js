import log from 'loglevel'
const ObjectMultiplex = require('obj-multiplex')
const pump = require('pump')

function setupMultiplex(connectionStream) {
  const mux = new ObjectMultiplex()
  pump(connectionStream, mux, connectionStream, err => {
    if (err) log.error(err)
  })
  // bind helper method to get previously created streams
  mux.getStream = function(name) {
    if (this._substreams[name]) {
      return this._substreams[name]
    } else {
      return this.createStream(name)
    }
  }
  return mux
}

export default setupMultiplex
