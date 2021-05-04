const fs = require('fs')
const path = require('path')
const log = require('loglevel')

try {
  const cfConfig = JSON.parse(fs.readFileSync(path.resolve('./cf_config.json'), 'utf8'))
  if (Object.prototype.hasOwnProperty.call(cfConfig, 'DistributionConfig')) {
    const newConfig = cfConfig.DistributionConfig
    if (newConfig.DefaultCacheBehavior.LambdaFunctionAssociations.Items.length > 0) {
      const requiredAssociation = newConfig.DefaultCacheBehavior.LambdaFunctionAssociations.Items.find((x) => x.EventType === 'origin-request')
      let arn = requiredAssociation.LambdaFunctionARN
      const splits = arn.split(':')
      const newVersion = Number.parseInt(splits[splits.length - 1], 10) + 1
      splits[splits.length - 1] = newVersion
      arn = splits.join(':')
      requiredAssociation.LambdaFunctionARN = arn
    }
    fs.writeFileSync(path.resolve('./updated_cf_config.json'), JSON.stringify(newConfig, null, 2), 'utf8')
  }
} catch (error) {
  log.error(error)
}
