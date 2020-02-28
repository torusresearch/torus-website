import createAsyncMiddleware from 'json-rpc-engine/src/createAsyncMiddleware'
import { ethErrors } from 'eth-json-rpc-errors'

/**
 * Create middleware for handling certain methods and preprocessing permissions requests.
 */
export default function createMethodMiddleware({ getAccounts, requestAccountsPermission, setSiteMetadata }) {
  return createAsyncMiddleware(async (req, res, next) => {
    if (typeof req.method !== 'string') {
      res.error = ethErrors.rpc.invalidRequest({ data: req })
      return
    }

    switch (req.method) {
      // intercepting eth_accounts requests for backwards compatibility,
      // i.e. return an empty array instead of an error
      // For now, let's not break the flow for login.
      // TODO: refactor later
      case 'eth_accounts':
        return next()
        res.result = await getAccounts()
        return

      case 'eth_requestAccounts':
        return next()
        // first, just try to get accounts
        let accounts = await getAccounts()
        if (accounts.length > 0) {
          res.result = accounts
          return
        }

        // if no accounts, request the accounts permission
        try {
          await requestAccountsPermission()
        } catch (err) {
          res.error = err
          return
        }

        // get the accounts again
        accounts = await getAccounts()
        if (accounts.length > 0) {
          res.result = accounts
        } else {
          // this should never happen
          res.error = ethErrors.rpc.internal('Accounts unexpectedly unavailable. Please report this bug.')
        }

        return

      // custom method for getting metadata from the requesting domain
      case 'wallet_sendDomainMetadata':
        if (req.domainMetadata && typeof req.domainMetadata.name === 'string') {
          setSiteMetadata(req.origin, req.domainMetadata)
        }

        res.result = true
        return

      default:
        break
    }

    next()
  })
}
