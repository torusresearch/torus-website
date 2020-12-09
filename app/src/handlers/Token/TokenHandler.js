import BigNumber from 'bignumber.js'
import tokenAbi from 'human-standard-token-abi'
import log from 'loglevel'

import torus from '../../torus'

class TokenHandler {
  constructor(address) {
    this.address = address
    this.contract = new torus.web3.eth.Contract(tokenAbi, address)
    this.symbol = undefined
    this.decimals = undefined
  }

  async getSymbol() {
    if (!this.symbol) this.symbol = await this.contract.methods.symbol().call()
    return this.symbol
  }

  async getDecimals() {
    if (!this.decimals) this.decimals = await this.contract.methods.decimals().call()
    return this.decimals
  }

  async getName() {
    if (!this.name) this.name = await this.contract.methods.name().call()
    return this.name
  }

  async getUserBalance(userAddress) {
    if (!this.decimals) await this.getDecimals()
    const balance = await this.contract.methods.balanceOf(userAddress).call()
    log.info(balance)
    return new BigNumber(balance).div(new BigNumber(10).pow(new BigNumber(this.decimals))).toString()
  }
}

export default TokenHandler
