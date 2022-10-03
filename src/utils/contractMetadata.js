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
  '0x9C58BAcC331c9aa871AFD802DB6379a98e80CEdb': {
    name: 'Gnosis Token on xDai',
    logo: 'https://docs.gnosischain.com/img/tokens/gno.png',
    erc20: true,
    symbol: 'GNO',
    decimals: 18,
  },
}
