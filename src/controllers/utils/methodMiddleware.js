/* eslint-disable no-case-declarations */
/* eslint-disable consistent-return */
/* eslint-disable no-unreachable */
import { ethErrors } from 'eth-rpc-errors'
import { createAsyncMiddleware } from 'json-rpc-engine'

/**
 * Create middleware for handling certain methods and preprocessing permissions requests.
 */
export default function createMethodMiddleware({ getAccounts, requestAccountsPermission, setSiteMetadata }) {
  return createAsyncMiddleware(async (request, res, next) => {
    if (typeof request.method !== 'string') {
      res.error = ethErrors.rpc.invalidRequest({ data: request, message: 'Invalid rpc request' })
      return
    }

    switch (request.method) {
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
        } catch (error) {
          res.error = error
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
        if (request.domainMetadata && typeof request.domainMetadata.name === 'string') {
          setSiteMetadata(request.origin, request.domainMetadata)
        }

        res.result = true
        return
      default:
        break
    }

    next()
  })
}
