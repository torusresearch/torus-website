import createWalletSubprovider from 'eth-json-rpc-middleware/wallet'
import createAsyncMiddleware from 'json-rpc-engine/src/createAsyncMiddleware'
import createScaffoldMiddleware from 'json-rpc-engine/src/createScaffoldMiddleware'
import mergeMiddleware from 'json-rpc-engine/src/mergeMiddleware'

import { formatTxMetaForRpcResult } from '../../utils/utils'

export default function createMetamaskMiddleware({
  version,
  getAccounts,
  processTransaction,
  processEthSignMessage,
  processTypedMessage,
  processTypedMessageV3,
  processTypedMessageV4,
  processPersonalMessage,
  getPendingNonce,
  getPendingTransactionByHash,
}) {
  const metamaskMiddleware = mergeMiddleware([
    createScaffoldMiddleware({
      // staticSubprovider
      eth_syncing: false,
      web3_clientVersion: `MetaMask/v${version}`,
    }),
    createWalletSubprovider({
      getAccounts,
      processTransaction,
      processEthSignMessage,
      processTypedMessage,
      processTypedMessageV3,
      processTypedMessageV4,
      processPersonalMessage,
    }),
    createRequestAccountsMiddleware({ getAccounts }),
    createPendingNonceMiddleware({ getPendingNonce }),
    createPendingTxMiddleware({ getPendingTransactionByHash }),
  ])
  return metamaskMiddleware
}

export function createPendingNonceMiddleware({ getPendingNonce }) {
  return createAsyncMiddleware(async (request, response, next) => {
    if (request.method !== 'eth_getTransactionCount') return next()
    const address = request.params[0]
    const blockReference = request.params[1]
    if (blockReference !== 'pending') return next()
    response.result = await getPendingNonce(address)
    return undefined
  })
}

export function createPendingTxMiddleware({ getPendingTransactionByHash }) {
  return createAsyncMiddleware(async (request, response, next) => {
    const { method, params } = request
    if (method !== 'eth_getTransactionByHash') return next()

    const [hash] = params
    const txMeta = getPendingTransactionByHash(hash)
    if (!txMeta) {
      return next()
    }
    response.result = formatTxMetaForRpcResult(txMeta)
    return undefined
  })
}

export function createRequestAccountsMiddleware({ getAccounts }) {
  return createAsyncMiddleware(async (request, response, next) => {
    const { method } = request
    if (method !== 'eth_requestAccounts') return next()

    if (!getAccounts) throw new Error('WalletMiddleware - opts.getAccounts not provided')
    const accounts = await getAccounts(request)
    response.result = accounts
    return undefined
  })
}
