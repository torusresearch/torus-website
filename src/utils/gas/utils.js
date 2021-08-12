export const GAS_FORM_ERRORS = {
  MAX_PRIORITY_FEE_TOO_LOW: 'editGasMaxPriorityFeeLow',
  MAX_FEE_TOO_LOW: 'editGasMaxFeeLow',
  MAX_PRIORITY_FEE_BELOW_MINIMUM: 'editGasMaxPriorityFeeBelowMinimum',
  MAX_PRIORITY_FEE_HIGH_WARNING: 'editGasMaxPriorityFeeHigh',
  MAX_FEE_HIGH_WARNING: 'editGasMaxFeeHigh',
  MAX_FEE_IMBALANCE: 'editGasMaxFeeImbalance',
  GAS_PRICE_TOO_LOW: 'editGasPriceTooLow',
}

const messages = {
  editGasMaxFeeHigh: {
    message: 'walletTransfer.fee-error-maxfee-high',
  },
  editGasMaxFeeLow: {
    message: 'walletTransfer.fee-error-maxfee-low',
  },
  editGasMaxFeePriorityImbalance: {
    message: 'walletTransfer.fee-error-maxfee-imbalance',
  },
  editGasMaxFeeTooltip: {
    message: 'walletTransfer.fee-error-maxfee-tooltip',
  },
  editGasMaxPriorityFeeBelowMinimum: {
    message: 'walletTransfer.fee-error-priorityfee-below',
  },
  editGasMaxPriorityFeeHigh: {
    message: 'walletTransfer.fee-error-priorityfee-high',
  },
  editGasMaxPriorityFeeLow: {
    message: 'walletTransfer.fee-error-priorityfee-low',
  },
}
export function getGasFormErrorText(type, t) {
  switch (type) {
    case GAS_FORM_ERRORS.MAX_PRIORITY_FEE_TOO_LOW:
      return t(messages.editGasMaxPriorityFeeLow.message)
    case GAS_FORM_ERRORS.MAX_FEE_TOO_LOW:
      return t(messages.editGasMaxFeeLow.message)
    case GAS_FORM_ERRORS.MAX_PRIORITY_FEE_BELOW_MINIMUM:
      return t(messages.editGasMaxPriorityFeeBelowMinimum.message)
    case GAS_FORM_ERRORS.MAX_PRIORITY_FEE_HIGH_WARNING:
      return t(messages.editGasMaxPriorityFeeHigh.message)
    case GAS_FORM_ERRORS.MAX_FEE_HIGH_WARNING:
      return t(messages.editGasMaxFeeHigh.message)
    case GAS_FORM_ERRORS.MAX_FEE_IMBALANCE:
      return t(messages.editGasMaxFeePriorityImbalance.message)
    case GAS_FORM_ERRORS.GAS_PRICE_TOO_LOW:
      return t(messages.editGasPriceTooLow.message)
    default:
      return ''
  }
}
