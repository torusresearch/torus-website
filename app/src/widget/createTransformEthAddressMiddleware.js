function CreateTransformEthAddressMiddleware({ override = true } = {}) {
  return (req, res, next) => {
    next(function(done) {
      if (req.method === 'eth_accounts') {
        res.result = res.result.map(addr => addr.toLowerCase())
      }
      done()
    })
  }
}

module.exports = CreateTransformEthAddressMiddleware
