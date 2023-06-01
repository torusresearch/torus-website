import BigNumber from 'bignumber.js'
import { utils } from 'ethers'
// import LogFilter from 'eth-json-rpc-filters/log-filter'
import log from 'loglevel'

import torus from '../torus'
import { TRANSACTION_TYPES } from '../utils/enums'
import { isAddressByChainId, toChecksumAddressByChainId } from '../utils/utils'

const { torusController } = torus || {}
const { prefsController } = torusController || {}

export default {
  setUserBadge(_, payload) {
    prefsController.setUserBadge(payload)
  },
  getTwitterId(_, payload) {
    return prefsController.getTwitterId(payload)
  },
  sendEmail(_, payload) {
    return prefsController.sendEmail(payload)
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
  setCrashReport(context, payload) {
    return prefsController.setCrashReport(payload)
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
  addCustomToken(_, payload) {
    return prefsController.addCustomToken(payload)
  },
  deleteCustomToken(_, payload) {
    return prefsController.deleteCustomToken(payload)
  },
  addCustomNft(_, payload) {
    return prefsController.addCustomNft(payload)
  },
  getEnsOrUnstoppableAddress(_, payload) {
    return prefsController.getEnsOrUnstoppableAddress(payload)
  },
  getTorusLookupAddress(_, payload) {
    return prefsController.getTorusLookupAddress(payload)
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
        if (contractParams.erc1155) {
          ;[, amountTo, amountValue] = methodParams || []

          const { name = '', logo } = contractParams
          // Get asset name of the 721
          const selectedAddressAssets = state.assets[state.selectedAddress]
          if (selectedAddressAssets) {
            const contract = selectedAddressAssets.find((x) => x.address?.toLowerCase() === txParams.to?.toLowerCase()) || {}
            log.info(contract, amountValue)
            if (contract) {
              const { name: foundAssetName } = (contract.assets || []).find((x) => x.tokenId?.toString() === amountValue?.value?.toString()) || {}
              assetName = foundAssetName || ''
              symbol = assetName
              type = 'erc1155'
              typeName = contract.name || name
              typeImageLink = contract.logo || logo
              totalAmount = utils.formatEther(txParams.value || 0)
              finalTo = amountTo && isAddressByChainId(amountTo.value) && toChecksumAddressByChainId(amountTo.value, state.networkId)
            }
          } else {
            tokenRate = 1
            symbol = state.networkType.ticker
            type = 'eth'
            typeName = state.networkType.ticker
            typeImageLink = 'n/a'
            totalAmount = utils.formatEther(txParams.value || 0)
            finalTo = toChecksumAddressByChainId(txParams.to, state.networkId)
          }
        } else if (contractParams.erc721) {
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
            const contract = selectedAddressAssets.find((x) => x.address?.toLowerCase() === txParams.to?.toLowerCase() || '') || {}
            log.info(contract, amountValue)
            if (contract) {
              const { name: foundAssetName } = (contract.assets || []).find((x) => x.tokenId?.toString() === amountValue.value?.toString()) || {}
              assetName = foundAssetName || ''
              symbol = assetName
              type = 'erc721'
              typeName = contract.name || name
              typeImageLink = contract.logo || logo
              totalAmount = utils.formatEther(txParams.value || 0)
              finalTo =
                transactionCategory === TRANSACTION_TYPES.COLLECTIBLE_METHOD_SAFE_TRANSFER_FROM
                  ? amountTo && isAddressByChainId(amountTo.value) && toChecksumAddressByChainId(amountTo.value, state.networkId)
                  : toChecksumAddressByChainId(txParams.to, state.networkId)
            } else {
              // there might be a case when user has the asset but it is not present in state
              // in that case we can record it as a contract interaction transaction.
              tokenRate = 1
              symbol = state.networkType.ticker
              type = 'eth'
              typeName = state.networkType.ticker
              typeImageLink = 'n/a'
              totalAmount = utils.formatEther(txParams.value || 0)
              finalTo = toChecksumAddressByChainId(txParams.to, state.networkId)
            }
          } else {
            tokenRate = 1
            symbol = state.networkType.ticker
            type = 'eth'
            typeName = state.networkType.ticker
            typeImageLink = 'n/a'
            totalAmount = utils.formatEther(txParams.value || 0)
            finalTo = toChecksumAddressByChainId(txParams.to, state.networkId)
          }
        } else if (contractParams.erc20) {
          // ERC20 transfer
          tokenRate = state.tokenRates[txParams.to]
          if (methodParams && Array.isArray(methodParams)) {
            if (
              transactionCategory === TRANSACTION_TYPES.TOKEN_METHOD_TRANSFER_FROM ||
              transactionCategory === TRANSACTION_TYPES.COLLECTIBLE_METHOD_SAFE_TRANSFER_FROM
            ) {
              ;[, amountTo, amountValue] = methodParams || []
            } else {
              ;[amountTo, amountValue] = methodParams || []
            }
          }
          const { symbol: contractSymbol, name, logo, decimals } = contractParams
          symbol = contractSymbol
          type = 'erc20'
          typeName = name || 'ERC20'
          typeImageLink = logo
          const bnAmount = new BigNumber(amountValue && amountValue.value ? amountValue.value : txParams.value || 0)
          totalAmount = bnAmount.div(new BigNumber(10).pow(new BigNumber(decimals || 18))).toString()
          finalTo = amountTo && isAddressByChainId(amountTo.value) && toChecksumAddressByChainId(amountTo.value, state.networkId)
        } else {
          tokenRate = 1
          symbol = state.networkType.ticker
          type = 'eth'
          typeName = state.networkType.ticker
          typeImageLink = 'n/a'
          totalAmount = utils.formatEther(txParams.value || 0)
          finalTo = toChecksumAddressByChainId(txParams.to, state.networkId)
        }
        // Goes to db
        const txObject = {
          created_at: new Date(time),
          from: toChecksumAddressByChainId(txParams.from, state.networkId),
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
          is_cancel: txParams.is_cancel,
        }
        // prefsController.patchNewTx(txObject, toChecksumAddressByChainId(state.selectedAddress, state.networkId))
        prefsController.patchNewTx(txObject, state.selectedAddress)
      }
    }
  },
  hideAnnouncement({ state }, payload) {
    const { announcements } = state
    return prefsController.hideAnnouncement(payload, announcements)
  },
}
