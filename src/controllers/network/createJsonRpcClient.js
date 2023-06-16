import {
  createBlockCacheMiddleware,
  createBlockRefRewriteMiddleware,
  createBlockTrackerInspectorMiddleware,
  createFetchMiddleware,
  createInflightCacheMiddleware,
} from '@metamask/eth-json-rpc-middleware'
import { mergeMiddleware, providerFromMiddleware } from '@toruslabs/openlogin-jrpc'

import EthereumBlockTracker from './EthereumBlockTracker'

export function createJsonRpcClient({ rpcUrl, chainId }) {
  const fetchMiddleware = createFetchMiddleware({ rpcUrl, btoa: globalThis.btoa, fetch: globalThis.fetch })
  const blockProvider = providerFromMiddleware(fetchMiddleware)
  const blockTracker = new EthereumBlockTracker({ provider: blockProvider })

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
