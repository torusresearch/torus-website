import { PollingBlockTracker } from 'eth-block-tracker'
import createInfuraMiddleware from 'eth-json-rpc-infura'
import {
  createBlockCacheMiddleware,
  createBlockRefMiddleware,
  createBlockTrackerInspectorMiddleware,
  createInflightCacheMiddleware,
  createRetryOnEmptyMiddleware,
  providerFromMiddleware,
} from 'eth-json-rpc-middleware'
import { createScaffoldMiddleware, mergeMiddleware } from 'json-rpc-engine'

import config from '../../config'
import { standardNetworkId } from '../../utils/utils'

export function createInfuraClient({ network }) {
  const infuraMiddleware = createInfuraMiddleware({ network, projectId: config.infuraKey })
  const infuraProvider = providerFromMiddleware(infuraMiddleware)
  const blockTracker = new PollingBlockTracker({ provider: infuraProvider })

  const networkMiddleware = mergeMiddleware([
    createNetworkAndChainIdMiddleware({ network }),
    createBlockCacheMiddleware({ blockTracker }),
    createInflightCacheMiddleware(),
    createBlockRefMiddleware({ blockTracker, provider: infuraProvider }),
    createRetryOnEmptyMiddleware({ blockTracker, provider: infuraProvider }),
    createBlockTrackerInspectorMiddleware({ blockTracker }),
    infuraMiddleware,
  ])
  return { networkMiddleware, blockTracker }
}

export function createNetworkAndChainIdMiddleware({ network }) {
  if (!standardNetworkId[network.toString()]) {
    throw new Error(`createInfuraClient - unknown network "${network}"`)
  }
  const { chainId, networkId } = standardNetworkId[network.toString()]

  return createScaffoldMiddleware({
    eth_chainId: chainId,
    net_version: networkId,
  })
}
