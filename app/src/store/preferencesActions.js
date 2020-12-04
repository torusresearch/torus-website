import log from 'loglevel'
import { fromWei, isAddress, toBN, toChecksumAddress } from 'web3-utils'

import torus from '../torus'
import { COLLECTIBLE_METHOD_SAFE_TRANSFER_FROM, TOKEN_METHOD_TRANSFER_FROM } from '../utils/enums'

const { torusController } = torus || {}
const { prefsController } = torusController || {}

export default {
  setTKeyOnboardingStatus({ state }, payload) {
    return prefsController.setTKeyOnboardingStatus(payload, state.selectedAddress)
  },
  setUserBadge(_, payload) {
    prefsController.setUserBadge(payload)
  },
  getTwitterId(_, payload) {
    return prefsController.getTwitterId(payload)
  },
  sendEmail(_, payload) {
    return prefsController.sendEmail(payload)
  },
  getOpenseaCollectibles(_, payload) {
    return prefsController.getOpenSeaCollectibles(payload.tokenURI)
  },
  setSuccessMessage(context, payload) {
    prefsController.handleSuccess(payload)
  },
  setErrorMessage(context, payload) {
    prefsController.handleError(payload)
  },
  setUserTheme(context, payload) {
    return prefsController.setUserTheme(payload)
  },
  setUserLocale(context, payload) {
    prefsController.setUserLocale(payload)
  },
  addContact(_, payload) {
    return prefsController.addContact(payload)
  },
  deleteContact(_, payload) {
    return prefsController.deleteContact(payload)
  },
  async setDefaultPublicAddress({ state, dispatch }, payload) {
    const { wallet } = state
    await Promise.all(Object.keys(wallet).map((x) => prefsController.setDefaultPublicAddress(x, payload)))
    dispatch('updateSelectedAddress', { selectedAddress: payload })
  },
  updateCalculatedTx({ state, getters }, payload) {
    for (const id in payload) {
      const txOld = payload[id]
      if (txOld.metamaskNetworkId.toString() === state.networkId.toString() && id >= 0) {
        const { methodParams, contractParams, txParams, transactionCategory, time, hash, status } = txOld
        let amountTo
        let amountValue
        let assetName
        let totalAmount
        let finalTo
        let tokenRate = 1
        let type
        let typeName
        let typeImageLink
        let symbol

        if (contractParams.erc721) {
          // Handling cryptokitties
          if (contractParams.isSpecial) {
            ;[amountTo, amountValue] = methodParams || []
          } else {
            // Rest of the 721s
            ;[, amountTo, amountValue] = methodParams || []
          }
          const { name = '', logo } = contractParams
          // Get asset name of the 721
          const selectedAddressAssets = state.assets[state.selectedAddress]
          if (selectedAddressAssets) {
            const contract = selectedAddressAssets.find((x) => x.address.toLowerCase() === txParams.to.toLowerCase()) || {}
            log.info(contract, amountValue)
            if (contract) {
              const { name: foundAssetName } = contract.assets.find((x) => x.tokenId.toString() === amountValue.value.toString()) || {}
              assetName = foundAssetName || ''
              symbol = assetName
              type = 'erc721'
              typeName = contract.name || name
              typeImageLink = contract.logo || logo
              totalAmount = fromWei(toBN(txParams.value || 0))
              finalTo = amountTo && isAddress(amountTo.value) && toChecksumAddress(amountTo.value)
            }
          } else {
            tokenRate = 1
            symbol = 'ETH'
            type = 'eth'
            typeName = 'eth'
            typeImageLink = 'n/a'
            totalAmount = fromWei(toBN(txParams.value || 0))
            finalTo = toChecksumAddress(txParams.to)
          }
        } else if (contractParams.erc20) {
          // ERC20 transfer
          tokenRate = state.tokenRates[txParams.to]
          if (methodParams && Array.isArray(methodParams)) {
            if (transactionCategory === TOKEN_METHOD_TRANSFER_FROM || transactionCategory === COLLECTIBLE_METHOD_SAFE_TRANSFER_FROM) {
              ;[, amountTo, amountValue] = methodParams || []
            } else {
              ;[amountTo, amountValue] = methodParams || []
            }
          }
          const { symbol: contractSymbol, name, logo } = contractParams
          symbol = contractSymbol
          type = 'erc20'
          typeName = name || 'ERC20'
          typeImageLink = logo
          totalAmount = fromWei(toBN(amountValue && amountValue.value ? amountValue.value : txParams.value || 0))
          finalTo = amountTo && isAddress(amountTo.value) && toChecksumAddress(amountTo.value)
        } else {
          tokenRate = 1
          symbol = 'ETH'
          type = 'eth'
          typeName = 'eth'
          typeImageLink = 'n/a'
          totalAmount = fromWei(toBN(txParams.value || 0))
          finalTo = toChecksumAddress(txParams.to)
        }
        // Goes to db
        const txObject = {
          created_at: new Date(time),
          from: toChecksumAddress(txParams.from),
          to: finalTo,
          total_amount: totalAmount,
          gas: txParams.gas,
          gasPrice: txParams.gasPrice,
          symbol,
          nonce: txParams.nonce,
          type,
          type_name: typeName,
          type_image_link: typeImageLink,
          currency_amount: (getters.currencyMultiplier * Number.parseFloat(totalAmount) * tokenRate).toString(),
          selected_currency: state.selectedCurrency,
          status,
          network: state.networkType.host,
          transaction_hash: hash,
          transaction_category: transactionCategory,
        }
        prefsController.patchNewTx(txObject, state.selectedAddress)
      }
    }
  },
}
