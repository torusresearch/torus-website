import log from 'loglevel'

const ObjectMultiplex = require('obj-multiplex')
const pump = require('pump')

function setupMultiplex(connectionStream) {
  const mux = new ObjectMultiplex()
  pump(connectionStream, mux, connectionStream, error => {
    if (error) log.error(error)
  })
  // bind helper method to get previously created streams
  mux.getStream = function(name) {
    if (this._substreams[name]) {
      return this._substreams[name]
    }
    return this.createStream(name)
  }
  return mux
}

export default setupMultiplex
