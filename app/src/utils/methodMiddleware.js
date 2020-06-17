/* eslint-disable no-case-declarations */
/* eslint-disable consistent-return */
/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable no-unreachable */
import { ethErrors } from 'eth-json-rpc-errors'
import stringify from 'fast-json-stable-stringify'
import createAsyncMiddleware from 'json-rpc-engine/src/createAsyncMiddleware'

import { evaluatePermissions, permissionsScope } from './permissionUtils'

/**
 * Create middleware for handling certain methods and preprocessing permissions requests.
 */
export default function createMethodMiddleware({ getAccounts, requestAccountsPermission, requestTorusPermission, setSiteMetadata, getPermissions }) {
  return createAsyncMiddleware(async (request, res, next) => {
    if (typeof request.method !== 'string') {
      res.error = ethErrors.rpc.invalidRequest({ data: request })
      return
    }

    switch (request.method) {
      // intercepting eth_accounts requests for backwards compatibility,
      // i.e. return an empty array instead of an error
      // For now, let's not break the flow for login.
      case 'torus_requestPermission':
        let permissions
        let permission
        try {
          ;[permission] = request.params
          if (!permission.permissionDomain) {
            permission.permissionDomain = request.origin
          }
          permissions = getPermissions((p) => stringify(p) === stringify(permission))
          if (permissions.length > 0) {
            ;[res.result] = permissions
            return
          }
          await requestTorusPermission(permission)
        } catch (error) {
          res.error = error
          return
        }
        permissions = getPermissions((p) => stringify(p) === stringify(permission))
        if (permissions.length > 0) {
          ;[res.result] = permissions
          return
        }
        // this should never happen
        res.error = ethErrors.rpc.internal('Permissions unexpectedly unavailable. Please report this bug.')
        return
      case 'eth_sign':
      case 'eth_signTypedData':
      case 'eth_signTypedData_v0':
      case 'eth_signTypedData_v3':
      case 'eth_signTypedData_v4':
      case 'personal_sign':
        if (request._autoApprove !== undefined) {
          res.error = new Error('_autoApprove is an internal field and should not be passed in the rpc.')
          return
        }
        const relevantPermissions = getPermissions((p) => permissionsScope[p.permissionType].includes(request.method))
        try {
          request._autoApprove = evaluatePermissions(request, relevantPermissions)
        } catch (error) {
          res.error = error
          return
        }
        return next()
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
