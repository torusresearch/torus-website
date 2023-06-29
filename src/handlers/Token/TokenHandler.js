import { stripHexPrefix } from '@ethereumjs/util'
import { Contract } from 'ethers'
import log from 'loglevel'

import { ecr20Abi } from '../../utils/abis'

class TokenHandler {
  constructor({ address, symbol, decimals, name, provider }) {
    this.address = address
    this.contract = new Contract(address, ecr20Abi, provider)
    this.symbol = symbol
    this.decimals = decimals
    this.name = name
  }

  async getSymbol() {
    if (!this.symbol || this.symbol === 'ERC20') this.symbol = await this.contract.symbol()
    return this.symbol
  }

  async getDecimals() {
    try {
      if (!this.decimals) this.decimals = await this.contract.decimals()
      return this.decimals.toString()
    } catch (error) {
      log.warn(`Could not get decimals for token ${this.address}`, error)
      return 0
    }
  }

  async getName() {
    if (!this.name) this.name = await this.contract.name()
    return this.name
  }

  async getUserBalance(userAddress) {
    if (!this.decimals) await this.getDecimals()
    const balance = await this.contract.balanceOf(userAddress)
    return stripHexPrefix(balance.toString(16))
  }
}

export default TokenHandler
