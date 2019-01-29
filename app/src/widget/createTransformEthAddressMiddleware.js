function CreateTransformEthAddressMiddleware({ override = true } = {}) {
  return (req, res, next) => {
    console.log(req, res, next)
    next()
  }
}

module.exports = CreateTransformEthAddressMiddleware
