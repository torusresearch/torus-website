/**
 * @typedef {Object} FirstTimeState
 * @property {Object} config Initial configuration parameters
 * @property {Object} NetworkController Network controller state
 */

/**
 * @type {FirstTimeState}
 */
const initialState = {
  config: {},
  NetworkController: {
    provider: {
      host: 'mainnet',
      networkName: 'Main Ethereum Network',
      chainId: '0x1',
    },
    networkDetails: {
      EIPS: {
        1559: false,
      },
    },
  },
}

export default initialState
