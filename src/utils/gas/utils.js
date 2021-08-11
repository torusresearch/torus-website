export const GAS_FORM_ERRORS = {
  MAX_PRIORITY_FEE_TOO_LOW: 'editGasMaxPriorityFeeLow',
  MAX_FEE_TOO_LOW: 'editGasMaxFeeLow',
  MAX_PRIORITY_FEE_BELOW_MINIMUM: 'editGasMaxPriorityFeeBelowMinimum',
  MAX_PRIORITY_FEE_HIGH_WARNING: 'editGasMaxPriorityFeeHigh',
  MAX_FEE_HIGH_WARNING: 'editGasMaxFeeHigh',
  MAX_FEE_IMBALANCE: 'editGasMaxFeeImbalance',
  GAS_PRICE_TOO_LOW: 'editGasPriceTooLow',
}

// todo: add to locales
const messages = {
  editGasMaxFeeHigh: {
    message: 'Max transactionfee fee is higher than necessary',
  },
  editGasMaxFeeLow: {
    message: 'Max transactionfee fee too low for network conditions',
  },
  editGasMaxFeePriorityImbalance: {
    message: 'Max transactionfee cannot be lower than max priority fee',
  },
  editGasMaxFeeTooltip: {
    message: 'The max transactionfee fee is the most you’ll pay (base fee + priority fee).',
  },
  editGasMaxPriorityFeeBelowMinimum: {
    message: 'Max priority fee must be greater than 0 GWEI',
  },
  editGasMaxPriorityFeeHigh: {
    message: 'Max priority fee is higher than necessary. You may pay more than needed.',
  },
  editGasMaxPriorityFeeLow: {
    message: 'Max priority fee extremely low for network conditions',
  },
}
// todo: use translations
// eslint-disable-next-line no-unused-vars
export function getGasFormErrorText(type, t) {
  switch (type) {
    case GAS_FORM_ERRORS.MAX_PRIORITY_FEE_TOO_LOW:
      return messages.editGasMaxPriorityFeeLow.message
    case GAS_FORM_ERRORS.MAX_FEE_TOO_LOW:
      return messages.editGasMaxFeeLow.message
    case GAS_FORM_ERRORS.MAX_PRIORITY_FEE_BELOW_MINIMUM:
      return messages.editGasMaxPriorityFeeBelowMinimum.message
    case GAS_FORM_ERRORS.MAX_PRIORITY_FEE_HIGH_WARNING:
      return messages.editGasMaxPriorityFeeHigh.message
    case GAS_FORM_ERRORS.MAX_FEE_HIGH_WARNING:
      return messages.editGasMaxFeeHigh.message
    case GAS_FORM_ERRORS.MAX_FEE_IMBALANCE:
      return messages.editGasMaxFeePriorityImbalance.message
    case GAS_FORM_ERRORS.GAS_PRICE_TOO_LOW:
      return messages.editGasPriceTooLow.message
    default:
      return ''
  }
}
