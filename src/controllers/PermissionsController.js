import { ethErrors } from 'eth-rpc-errors'
import { JsonRpcEngine } from 'json-rpc-engine'
import log from 'loglevel'

// import { ObservableStore } from '@metamask/obs-store'
// import { CapabilitiesController as RpcCap } from 'rpc-cap'
// Methods that do not require any permissions to use:
import {
  CAVEAT_NAMES,
  // SAFE_METHODS, // methods that do not require any permissions to use
  WALLET_PREFIX,
} from '../utils/enums'
import createMethodMiddleware from './utils/methodMiddleware'
import getRestrictedMethods from './utils/restrictedMethods'

export default class PermissionsController {
  constructor({ getKeyringAccounts, setSiteMetadata } = {}) {
    this.getKeyringAccounts = getKeyringAccounts
    this.setSiteMetadata = setSiteMetadata
    this._restrictedMethods = getRestrictedMethods(this)
    // this._initializePermissions({})
  }

  createMiddleware({ origin }) {
    const engine = new JsonRpcEngine()

    engine.push(
      createMethodMiddleware({
        getAccounts: this.getAccounts.bind(this, origin),
        requestAccountsPermission: this._requestPermissions.bind(this, origin, { eth_accounts: {} }),
        setSiteMetadata: this.setSiteMetadata.bind(this),
      })
    )

    // engine.push(this.permissions.providerMiddlewareFunction.bind(this.permissions, { origin }))
    return engine.asMiddleware()
  }

  /**
   * Returns the accounts that should be exposed for the given origin domain,
   * if any. This method exists for when a trusted context needs to know
   * which accounts are exposed to a given domain.
   *
   * @param {string} origin - The origin string.
   */
  getAccounts(origin) {
    // eslint-disable-next-line no-unused-vars
    return new Promise((resolve, reject) => {
      const request = { method: 'eth_accounts' }
      const response = {}
      this.permissions.providerMiddlewareFunction({ origin }, request, response, () => {}, _end)

      function _end() {
        if (response.error || !Array.isArray(response.result)) {
          resolve([])
        } else {
          resolve(response.result)
        }
      }
    })
  }

  /**
   * Submits a permissions request to rpc-cap. Internal, background use only.
   *
   * @param {string} origin - The origin string.
   * @param {IRequestedPermissions} permissions - The requested permissions.
   */
  _requestPermissions(origin, permissions) {
    return new Promise((resolve, reject) => {
      const request = { method: 'wallet_requestPermissions', params: [permissions] }
      const response = {}
      this.permissions.providerMiddlewareFunction({ origin }, request, response, () => {}, _end)

      function _end(error) {
        if (error || response.error) {
          reject(error || response.error)
        } else {
          resolve(response.result)
        }
      }
    })
  }

  /**
   * User approval callback. The request can fail if the request is invalid.
   *
   * @param {Object} approved - the approved request object
   * @param {Array} accounts - The accounts to expose, if any
   */
  async approvePermissionsRequest(approved, accounts) {
    const { id } = approved.metadata
    const approval = this.pendingApprovals[id]

    if (!approval) {
      log.warn(`Permissions request with id '${id}' not found`)
      return
    }

    try {
      // attempt to finalize the request and resolve it
      await this.finalizePermissionsRequest(approved.permissions, accounts)
      approval.resolve(approved.permissions)
    } catch (error) {
      // if finalization fails, reject the request
      approval.reject(
        ethErrors.rpc.invalidRequest({
          message: error.message,
          data: error,
        })
      )
    }

    delete this.pendingApprovals[id]
  }

  /**
   * User rejection callback.
   *
   * @param {string} id - the id of the rejected request
   */
  async rejectPermissionsRequest(id) {
    const approval = this.pendingApprovals[id]

    if (!approval) {
      log.warn(`Permissions request with id '${id}' not found`)
      return
    }

    approval.reject(ethErrors.provider.userRejectedRequest('User rejected permissions request'))
    delete this.pendingApprovals[id]
  }

  /**
   * Finalizes a permissions request.
   * Throws if request validation fails.
   *
   * @param {Object} requestedPermissions - The requested permissions.
   * @param {string[]} accounts - The accounts to expose, if any.
   */
  async finalizePermissionsRequest(requestedPermissions, accounts) {
    const { eth_accounts: ethAccounts } = requestedPermissions

    if (ethAccounts) {
      await this.validatePermittedAccounts(accounts)

      if (!ethAccounts.caveats) {
        ethAccounts.caveats = []
      }

      // caveat names are unique, and we will only construct this caveat here
      ethAccounts.caveats = ethAccounts.caveats.filter((c) => c.name !== CAVEAT_NAMES.exposedAccounts)

      ethAccounts.caveats.push({
        type: 'filterResponse',
        value: accounts,
        name: CAVEAT_NAMES.exposedAccounts,
      })
    }
  }

  /**
   * Validate an array of accounts representing accounts to be exposed
   * to a domain. Throws error if validation fails.
   *
   * @param {string[]} accounts - An array of addresses.
   */
  async validatePermittedAccounts(accounts) {
    if (!Array.isArray(accounts) || accounts.length === 0) {
      throw new Error('Must provide non-empty array of account(s).')
    }

    // assert accounts exist
    const allAccounts = await this.getKeyringAccounts()
    accounts.forEach((accumulator) => {
      if (!allAccounts.includes(accumulator)) {
        throw new Error(`Unknown account: ${accumulator}`)
      }
    })
  }

  /**
   * Removes the given permissions for the given domain.
   * @param {Object} domains { origin: [permissions] }
   */
  removePermissionsFor(domains) {
    Object.entries(domains).forEach(([origin, perms]) => {
      this.permissions.removePermissionsFor(
        origin,
        perms.map((methodName) => ({ parentCapability: methodName }))
      )
    })
  }

  /**
   * Removes all known domains and their related permissions.
   */
  clearPermissions() {
    this.permissions.clearDomains()
  }

  /**
   * A convenience method for retrieving a login object
   * or creating a new one if needed.
   *
   * @param {string} origin = The origin string representing the domain.
   */
  // _initializePermissions(restoredState) {
  //   // these permission requests are almost certainly stale
  //   const initState = { ...restoredState, permissionsRequests: [] }

  //   this.pendingApprovals = {}

  //   this.permissions = new RpcCap(
  //     {
  //       // Supports passthrough methods:
  //       safeMethods: SAFE_METHODS,

  //       // optional prefix for internal methods
  //       methodPrefix: WALLET_PREFIX,

  //       restrictedMethods: this._restrictedMethods,

  //       /**
  //        * A promise-returning callback used to determine whether to approve
  //        * permissions requests or not.
  //        *
  //        * Currently only returns a boolean, but eventually should return any
  //        * specific parameters or amendments to the permissions.
  //        *
  //        * @param {string} req - The internal rpc-cap user request object.
  //        */
  //       requestUserApproval: async (request) => {
  //         const {
  //           metadata: { id },
  //         } = request

  //         this._platform.openExtensionInBrowser(`connect/${id}`)

  //         return new Promise((resolve, reject) => {
  //           this.pendingApprovals[id] = { resolve, reject }
  //         })
  //       },
  //     },
  //     initState
  //   )
  // }
}

export function addInternalMethodPrefix(method) {
  return WALLET_PREFIX + method
}
