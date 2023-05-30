import BigNumber from 'bignumber.js'
import { Contract } from 'ethers'
import tokenAbi from 'human-standard-token-abi'
import log from 'loglevel'

class TokenHandler {
  constructor({ address, symbol, decimals, name, ethersProvider }) {
    this.address = address
    this.contract = new Contract(tokenAbi, address, ethersProvider)
    this.symbol = symbol
    this.decimals = decimals
    this.name = name
  }

  async getSymbol() {
    if (!this.symbol || this.symbol === 'ERC20') this.symbol = await this.contract.methods.symbol().call()
    return this.symbol
  }

  async getDecimals() {
    try {
      if (!this.decimals) this.decimals = await this.contract.decimals()
      return this.decimals
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
    return new BigNumber(balance).toString(16)
  }
}

export default TokenHandler
