/* eslint-disable prefer-regex-literals */
/* eslint-disable import/no-extraneous-dependencies */
const express = require('express')
const send = require('send')
const fs = require('fs')
const log = require('loglevel')
const path = require('path')

log.enableAll()
const app = express()

const versionRegex = /^\/v\d+\.\d+\.\d+\//

app.use('*', (req, res) => {
  const olduri = req.params[0] || ''
  let newuri = ''
  if (new RegExp(/^\/v\d+\.\d+\.\d+\/.+\.(js|css|png|PNG|svg|html|jpg|JPG|jpeg|JPEG|JSON|json|txt|gif)$/).test(olduri)) {
    newuri = olduri.replace(versionRegex, '')
  } else if (new RegExp(/^\/v\d+\.\d+\.\d+\/[^.]*$/).test(olduri)) {
    const secondIndex = olduri.indexOf('/', 1)
    newuri = `${olduri.slice(0, secondIndex)}/index.html`
  } else if (new RegExp(/^\/v\d+\.\d+\.\d+\/?$/).test(olduri)) {
    const secondIndex = olduri.indexOf('/', 1)
    const slicedOrignal = secondIndex === -1 ? olduri : olduri.slice(0, secondIndex)
    newuri = `${slicedOrignal}/index.html`
  } else if (new RegExp(/^\/.+\.(js|css|png|PNG|svg|html|jpg|JPG|jpeg|JPEG|JSON|json|txt|gif)$/).test(olduri)) {
    newuri = olduri
  } else if (new RegExp(/^\/[^.]*$/).test(olduri)) {
    newuri = '/index.html'
  } else {
    newuri = '/index.html'
  }

  const dirPath = path.resolve(path.join(__dirname, 'dist', newuri))
  log.info('req ->', req.params[0], '->', dirPath)
  if (!fs.existsSync(dirPath)) return res.status(404).send('not found')
  return send(req, dirPath).pipe(res)
})

app.listen(4050, () => log.info('server running on port 4050'))
