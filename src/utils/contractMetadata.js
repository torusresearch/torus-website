import contracts from '@metamask/contract-metadata'

export default {
  ...contracts,
  '0xC4C2614E694cF534D407Ee49F8E44D125E4681c4': {
    name: 'Chain Games',
    logo: 'chain.png',
    erc20: true,
    symbol: 'CHAIN',
    decimals: 18,
  },
}

export const GNOSIS_CONTRACTS = {
  '0x6810e776880c02933d47db1b9fc05908e5386b96': {
    name: 'Gnosis',
    logo: 'https://docs.gnosischain.com/img/tokens/gno.png',
    erc20: true,
    symbol: 'GNO',
    decimals: 18,
  },
}
