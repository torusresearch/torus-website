const { Duplex } = require('readable-stream')
const { PassThrough } = require('readable-stream')
// var Transform = require('readable-stream').Transform
const log = require('loglevel')

module.exports = (...arguments_) => {
  let sources = []
  const routerMapping = {}
  const output = new PassThrough({
    objectMode: true
  })

  output.setMaxListeners(0)

  output.add = add
  output.isEmpty = isEmpty

  output.on('unpipe', remove)

  const split = new Duplex({
    objectMode: true,
    read() {},
    write(object, enc, callback) {
      route(object)
      callback()
    }
  })

  Array.prototype.slice(...arguments_).forEach(add)

  return { mergeSteam: output, splitStream: split }

  function route(object) {
    log.info('ROUTING..', object)
    if (object.id && routerMapping[object.id]) {
      log.info('FOUND STREAM:', object)
      routerMapping[object.id].write(object)
      delete routerMapping[object.id]
    }
  }

  function add(source) {
    if (Array.isArray(source)) {
      source.forEach(add)
      return this
    }
    const mapperPassthrough = new PassThrough({ objectMode: true })
    mapperPassthrough.on('data', object => {
      log.info('MAPPER MAPPING OBJ', object)
      if (object.id) {
        routerMapping[object.id] = source
      }
    })
    sources.push(source)
    source.once('end', remove.bind(null, source))
    source.once('error', output.emit.bind(output, 'error'))
    source.pipe(mapperPassthrough).pipe(output, { end: false })
    return this
  }

  function isEmpty() {
    return sources.length === 0
  }

  function remove(source) {
    sources = sources.filter(it => it !== source)
    if (sources.length === 0 && output.readable) {
      output.end()
    }
  }
}
