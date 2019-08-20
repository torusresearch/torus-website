var Duplex = require('readable-stream').Duplex
var PassThrough = require('readable-stream').PassThrough
// var Transform = require('readable-stream').Transform

module.exports = function() {
  var sources = []
  var routerMapping = {}
  var output = new PassThrough({
    objectMode: true
  })

  output.setMaxListeners(0)

  output.add = add
  output.isEmpty = isEmpty

  output.on('unpipe', remove)

  var split = new Duplex({
    objectMode: true,
    read: function() {},
    write: function(obj, enc, cb) {
      cb()
      route(obj)
    }
  })

  Array.prototype.slice.call(arguments).forEach(add)

  return { mergeSteam: output, splitStream: split }

  function route(obj) {
    log.info('ROUTING..', obj)
    if (obj.id && routerMapping[obj.id]) {
      log.info('FOUND STREAM:', obj)
      routerMapping[obj.id].write(obj)
      delete routerMapping[obj.id]
    }
  }

  function add(source) {
    if (Array.isArray(source)) {
      source.forEach(add)
      return this
    }
    var mapperPassthrough = new PassThrough({ objectMode: true })
    mapperPassthrough.on('data', function(obj) {
      log.info('MAPPER MAPPING OBJ', obj)
      if (obj.id) {
        routerMapping[obj.id] = source
      }
    })
    sources.push(source)
    source.once('end', remove.bind(null, source))
    source.once('error', output.emit.bind(output, 'error'))
    source.pipe(mapperPassthrough).pipe(
      output,
      { end: false }
    )
    return this
  }

  function isEmpty() {
    return sources.length === 0
  }

  function remove(source) {
    sources = sources.filter(function(it) {
      return it !== source
    })
    if (!sources.length && output.readable) {
      output.end()
    }
  }
}
