var browserify = require('browserify')
var fs = require('fs')
var envify = require('envify/custom')
try {
var bundler = browserify(__dirname + '/../inpage/embed.js', {
  fullPaths: true,
  noParse: [__dirname + '/../inpage/vendor/web3.js', __dirname + '/../inpage/vendor/web3.min.js'],
})

bundler.transform('uglifyify', { global: true })
bundler.transform(envify({
  NODE_ENV: process.env.NODE_ENV,
}))

bundler.bundle().pipe(fs.createWriteStream(__dirname + '/../public/embed.min.js'))
} catch (e) {
  console.log(e)
}