import { createWalletMiddleware } from '@metamask/eth-json-rpc-middleware'
import { createAsyncMiddleware, createScaffoldMiddleware, mergeMiddleware } from '@toruslabs/openlogin-jrpc'

import { MESSAGE_TYPE, TRANSACTION_ENVELOPE_TYPES } from '../../utils/enums'

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
  processAddChain,
  processSwitchChain,
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
    createAddChainMiddleware({ processAddChain }),
    createSwitchChainMiddleware({ processSwitchChain }),
    createWatchAssetMiddleware({ processWatchAsset }),
    createRequestAccountsMiddleware({ getAccounts }),
    createPendingNonceMiddleware({ getPendingNonce }),
    createPendingTxMiddleware({ getPendingTransactionByHash }),
  ])
  return metamaskMiddleware
}

export function createAddChainMiddleware({ processAddChain }) {
  return createAsyncMiddleware(async (request, response, next) => {
    if (request.method !== MESSAGE_TYPE.ADD_CHAIN) return next()

    /**
     * request.params interface
     * 
     * interface AddEthereumChainParameter {
        chainId: string; // A 0x-prefixed hexadecimal string
        chainName: string;
        nativeCurrency: {
          name: string;
          symbol: string; // 2-6 characters long
          decimals: 18;
        };
        rpcUrls: string[];
        blockExplorerUrls?: string[];
        iconUrls?: string[]; // Currently ignored.
      }
     */

    let finalObj = {}

    if (Array.isArray(request.params)) finalObj = request.params[0]
    else finalObj = request.params

    const { chainId, rpcUrls, nativeCurrency } = finalObj || {}
    if (!chainId) throw new Error('createAddChainMiddleware - params.chainId not provided')
    if (!rpcUrls || rpcUrls.length === 0) throw new Error('createAddChainMiddleware - params.rpcUrls not provided')
    if (!nativeCurrency) throw new Error('createAddChainMiddleware - params.nativeCurrency not provided')
    const { name, symbol, decimals } = nativeCurrency

    if (!name) throw new Error('createAddChainMiddleware - params.nativeCurrency.name not provided')
    if (!symbol) throw new Error('createAddChainMiddleware - params.nativeCurrency.symbol not provided')
    if (decimals === undefined) throw new Error('createAddChainMiddleware - params.nativeCurrency.decimals not provided')

    response.result = await processAddChain(finalObj, request)
    return undefined
  })
}

export function createSwitchChainMiddleware({ processSwitchChain }) {
  return createAsyncMiddleware(async (request, response, next) => {
    if (request.method !== MESSAGE_TYPE.SWITCH_CHAIN) return next()

    /**
     * request.params interface
     * 
     * interface SwitchEthereumChainParameter {
        chainId: string; // A 0x-prefixed hexadecimal string
      }
     */

    let finalObj = {}

    if (Array.isArray(request.params)) finalObj = request.params[0]
    else finalObj = request.params

    const { chainId } = finalObj || {}
    if (!chainId) throw new Error('createSwitchChainMiddleware - params.chainId not provided')

    response.result = await processSwitchChain(finalObj, request)
    return undefined
  })
}
export function createWatchAssetMiddleware({ processWatchAsset }) {
  return createAsyncMiddleware(async (request, response, next) => {
    if (request.method !== MESSAGE_TYPE.WATCH_ASSET) return next()

    /**
     * request.params
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

    const { type, options = {} } = request.params || {}
    if (!type) throw new Error('createWatchAssetMiddleware - params.type not provided')
    if (!options.address) throw new Error('createWatchAssetMiddleware - params.options.address not provided')

    response.result = await processWatchAsset(request.params, request)
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
