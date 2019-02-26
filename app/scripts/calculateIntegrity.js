const fs = require('fs')
const path = require('path')
const sriToolbox = require('sri-toolbox')

const embedPath = path.resolve(__dirname, '../public', 'embed.min.js')
const embedFile = fs.readFileSync(embedPath, 'utf8')

const integrity = sriToolbox.generate(
  {
    algorithms: ['sha384']
  },
  embedFile
)

const filesToReplace = ['../public/embed-local.user.js', '../public/embed.user.js', '../src/components/HomeComponent.vue']

filesToReplace.forEach(filePath => {
  const reqPath = path.resolve(__dirname, filePath)
  fs.readFile(reqPath, 'utf8', (err, data) => {
    if (err) {
      return console.log(err)
    }
    const number = data.substr(data.indexOf('sha384-'), 64 + 7)
    const result = data.replace(number, integrity)

    fs.writeFile(reqPath, result, 'utf8', err => {
      if (err) return console.log(err)
    })
  })
})
