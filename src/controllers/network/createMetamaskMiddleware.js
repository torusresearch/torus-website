import { createAsyncMiddleware, createScaffoldMiddleware, mergeMiddleware } from '@toruslabs/openlogin-jrpc'
import { createWalletMiddleware } from 'eth-json-rpc-middleware'

import { TRANSACTION_ENVELOPE_TYPES } from '../../utils/enums'

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
  processEncryptionPublicKey,
  processDecryptMessage,
  processWatchAsset,
}) {
  const metamaskMiddleware = mergeMiddleware([
    createScaffoldMiddleware({
      // staticSubprovider
      eth_syncing: false,
      web3_clientVersion: `Torus/v${version}`,
    }),
    createWalletMiddleware({
      getAccounts,
      processTransaction,
      processEthSignMessage,
      processTypedMessage,
      processTypedMessageV3,
      processTypedMessageV4,
      processPersonalMessage,
      processEncryptionPublicKey,
      processDecryptMessage,
    }),
    createWatchTokenMiddleware({ processWatchAsset }),
    createRequestAccountsMiddleware({ getAccounts }),
    createPendingNonceMiddleware({ getPendingNonce }),
    createPendingTxMiddleware({ getPendingTransactionByHash }),
  ])
  return metamaskMiddleware
}

export function createWatchTokenMiddleware({ processWatchAsset }) {
  return createAsyncMiddleware(async (request, response, next) => {
    if (request.method !== 'wallet_watchAsset') return next()
    const type = request.params[0]
    const options = request.params[1]
    /**
     * {
          type: 'ERC20',
          options: {
            address: '0xb60e8dd61c5d32be8058bb8eb970870f07233155',
            symbol: 'FOO',
            decimals: 18,
            image: 'https://foo.io/token-image.svg',
          }
       }
     */
    const tokenDataParams = {
      type,
      options,
    }
    response.result = await processWatchAsset(tokenDataParams)
    return undefined
  })
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

export function formatTxMetaForRpcResult(txMeta) {
  const { r, s, v, hash, txReceipt, txParams } = txMeta
  const { to, data, nonce, gas, from, value, gasPrice, accessList, maxFeePerGas, maxPriorityFeePerGas } = txParams

  const formattedTxMeta = {
    v,
    r,
    s,
    to,
    gas,
    from,
    hash,
    nonce,
    input: data || '0x',
    value: value || '0x0',
    accessList: accessList || null,
    blockHash: txReceipt?.blockHash || null,
    blockNumber: txReceipt?.blockNumber || null,
    transactionIndex: txReceipt?.transactionIndex || null,
  }

  if (maxFeePerGas && maxPriorityFeePerGas) {
    formattedTxMeta.maxFeePerGas = maxFeePerGas
    formattedTxMeta.maxPriorityFeePerGas = maxPriorityFeePerGas
    formattedTxMeta.type = TRANSACTION_ENVELOPE_TYPES.FEE_MARKET
  } else {
    formattedTxMeta.gasPrice = gasPrice
    formattedTxMeta.type = TRANSACTION_ENVELOPE_TYPES.LEGACY
  }

  return formattedTxMeta
}
