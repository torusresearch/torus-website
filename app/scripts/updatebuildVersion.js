const fs = require('fs')
const path = require('path')

fs.readFile(path.resolve('./package.json'), (err, packageFile) => {
  if (err) {
    console.error(err + '\n Unable to read file')
    return
  }
  const packageJSON = JSON.parse(packageFile)
  if (Object.prototype.hasOwnProperty.call(packageJSON, 'buildVersion')) {
    packageJSON.buildVersion = packageJSON.buildVersion.slice(0, 1) + (parseInt(packageJSON.buildVersion.slice(1), 10) + 1).toString()
    fs.writeFile(path.resolve('./package.json'), JSON.stringify(packageJSON, null, 2), 'utf8', (err, resp) => {
      if (err) {
        console.error(err + '\n Unable to write to file')
        return
      }
      console.log('successfully written')
    })
  }
})
