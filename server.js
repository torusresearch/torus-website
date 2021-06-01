/* eslint-disable import/no-extraneous-dependencies */
const express = require('express')
const send = require('send')
const fs = require('fs')
const log = require('loglevel')
const path = require('path')

log.enableAll()
const app = express()

const fileExtensionRegexp = /[^/?]+\\.[^/]+$/

const versionRegex = /^\/v\d+\.\d+\.\d+\//

app.use('*', (req, res) => {
  let finalPath = req.params[0].replace(versionRegex, '')
  log.info('path', finalPath, req.params[0])
  if (!finalPath.match(fileExtensionRegexp)) {
    finalPath = 'index.html'
  }
  log.info('path2', finalPath, req.params[0])
  const dirPath = path.resolve(path.join(__dirname, 'dist', finalPath))
  log.info('dir', dirPath)
  if (!fs.existsSync(dirPath)) return res.status(404).text('not found')
  return send(req, dirPath).pipe(res)
})

app.listen(4050, () => log.info('server running on port 4050'))
