import BigNumber from 'bignumber.js'
import tokenAbi from 'human-standard-token-abi'

class TokenHandler {
  constructor({ address, symbol, decimals, name, web3 }) {
    this.address = address
    this.contract = new web3.eth.Contract(tokenAbi, address)
    this.symbol = symbol
    this.decimals = decimals
    this.name = name
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
    return new BigNumber(balance).toString(16)
  }
}

export default TokenHandler
