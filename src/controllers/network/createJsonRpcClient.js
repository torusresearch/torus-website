import {
  createBlockCacheMiddleware,
  createBlockRefRewriteMiddleware,
  createBlockTrackerInspectorMiddleware,
  createFetchMiddleware,
  createInflightCacheMiddleware,
} from '@metamask/eth-json-rpc-middleware'
import { providerFromMiddleware } from '@metamask/eth-json-rpc-provider'
import { mergeMiddleware } from '@toruslabs/openlogin-jrpc'
import { PollingBlockTracker } from 'eth-block-tracker'

export function createJsonRpcClient({ rpcUrl, chainId }) {
  const fetchMiddleware = createFetchMiddleware({ rpcUrl })
  const blockProvider = providerFromMiddleware(fetchMiddleware)
  const blockTracker = new PollingBlockTracker({ provider: blockProvider })

  const networkMiddleware = mergeMiddleware([
    createChainIdMiddleware(chainId),
    createBlockRefRewriteMiddleware({ blockTracker }),
    createBlockCacheMiddleware({ blockTracker }),
    createInflightCacheMiddleware(),
    createBlockTrackerInspectorMiddleware({ blockTracker }),
    fetchMiddleware,
  ])
  return { networkMiddleware, blockTracker }
}

export function createChainIdMiddleware(chainId) {
  return (req, res, next, end) => {
    if (req.method === 'eth_chainId') {
      res.result = chainId
      return end()
    }
    return next()
  }
}
