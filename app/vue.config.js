const fs = require('fs')
const path = require('path')

module.exports = {
  devServer: {
    open: process.platform === 'darwin',
    host: '0.0.0.0',
    port: 8085, // CHANGE YOUR PORT HERE!
    https: {
      key: fs.readFileSync(path.resolve('../ssl/server.key')),
      cert: fs.readFileSync(path.resolve('../ssl/server.crt'))
    },
    hotOnly: false
  }
}
