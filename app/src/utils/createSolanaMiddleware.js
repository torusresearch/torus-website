import createAsyncMiddleware from 'json-rpc-engine/src/createAsyncMiddleware'
import mergeMiddleware from 'json-rpc-engine/src/mergeMiddleware'

export default function createSolanaMiddleware({ getAccounts, processTransaction }) {
  const solanaMiddleware = mergeMiddleware([createAccountsMiddleware({ getAccounts }), processTxMiddleware({ processTransaction })])
  return solanaMiddleware
}

export function createAccountsMiddleware({ getAccounts }) {
  return createAsyncMiddleware(async (request, response, next) => {
    const { method } = request
    if (method !== 'solana_accounts') return next()

    if (!getAccounts) throw new Error('WalletMiddleware - opts.getAccounts not provided')
    const accounts = await getAccounts(request)
    response.result = accounts
    return undefined
  })
}

export function processTxMiddleware({ processTransaction }) {
  return createAsyncMiddleware(async (request, response, next) => {
    const { method } = request
    if (method !== 'solana_signTransaction') return next()

    if (!processTransaction) throw new Error('WalletMiddleware - opts.processTransaction not provided')
    const tx = await processTransaction(request)
    response.result = tx
    return undefined
  })
}
