<template>
  <v-layout wrap class="wallet-transfer" :class="$vuetify.breakpoint.xsOnly ? 'mt-2' : 'mt-6'">
    <div class="text-black font-weight-bold headline px-4 mb-4">Transfer Details</div>
    <v-flex xs12 mb-4>
      <v-form ref="form" v-model="formValid" @submit.prevent="sendCoin" lazy-validation>
        <v-layout wrap>
          <v-flex xs12 px-4 mb-5 sm6>
            <span class="subtitle-2">Select your Coin</span>
            <v-select
              prepend-inner-icon="$vuetify.icons.eth"
              append-icon="$vuetify.icons.select"
              hide-details
              :items="finalBalancesArray"
              :value="selectedItem"
              @change="selectedItemChanged"
              item-text="name"
              item-value="tokenAddress"
              outlined
            ></v-select>
          </v-flex>
          <v-flex xs12 sm6 mb-5 px-4 v-if="selectedItem">
            <span class="subtitle-2">Account Balance</span>
            <div>
              <span class="headline mr-1">{{ selectedItem.formattedBalance }}</span>
              <span class="caption torus_text--text text--lighten-4">{{ currencyBalanceDisplay }}</span>
            </div>
            <div class="caption font-weight-regular torus_text--text text--lighten-4">{{ selectedItem.currencyRateText }}</div>
          </v-flex>
        </v-layout>
        <v-layout wrap>
          <v-flex xs12 px-4 sm6>
            <span class="subtitle-2">Recipient Address</span>
            <v-text-field
              v-model="toAddress"
              placeholder="ETH Address / Google Address here"
              required
              :rules="[rules.toAddress, rules.required]"
              outlined
            ></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout wrap>
          <v-flex xs12 px-4 sm6>
            <div>
              <span class="subtitle-2">You send</span>
            </div>
            <v-text-field
              :suffix="selectedItem.symbol"
              :hint="convertedAmount ? `~ ${convertedAmount} ${selectedCurrency}` : ''"
              persistent-hint
              type="number"
              outlined
              required
              v-model="displayAmount"
              :rules="[rules.required, lesserThan]"
            ></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout wrap>
          <TransactionSpeedSelect :symbol="selectedItem.symbol" :gas="gas" :displayAmount="displayAmount" @onSelectSpeed="onSelectSpeed" />
          <v-flex xs12 px-4 sm6>
            <div>
              <span class="subtitle-2">Total Cost</span>
            </div>
            <v-text-field
              :suffix="selectedTokenAddress === '0x' ? selectedItem.symbol : ''"
              :hint="convertedTotalCost ? convertedTotalCostDisplay : ''"
              persistent-hint
              outlined
              readonly
              :value="totalCost"
            ></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout mt-4 pr-2 wrap>
          <v-spacer></v-spacer>
          <v-btn large color="primary" :disabled="!formValid || speedSelected === ''" class="px-6" type="submit">Continue</v-btn>
        </v-layout>

        <v-layout mt-4 pr-2 wrap>
          <v-spacer></v-spacer>
          <v-dialog v-model="showModalMessage" max-width="550" persistent>
            <message-modal
              @onClose="showModalMessage = false"
              :modal-type="modalMessageSuccess"
              :title="modalMessageSuccess ? 'Your transfer is being processed' : 'Your transfer cannot be processed'"
              :detail-text="modalMessageSuccess ? `Your transaction will be completed in approximately ${timeTaken} min` : 'Please try again later'"
            />
          </v-dialog>
        </v-layout>
      </v-form>
    </v-flex>
  </v-layout>
</template>

<script>
import torus from '../torus'
import { significantDigits, getRandomNumber } from '../utils/utils'
import config from '../config'
import TransactionSpeedSelect from '../components/TransactionSpeedSelect'
import MessageModal from '../components/MessageModal'
import { get } from '../utils/httpHelpers'
const { torusNodeEndpoints } = config
const transferABI = require('human-standard-token-abi')

const MAX_GAS = 6721975

export default {
  name: 'walletTransfer',
  props: ['address'],
  components: {
    TransactionSpeedSelect,
    MessageModal
  },
  data() {
    return {
      tokenAddress: '0x',
      amount: 0,
      displayAmount: '',
      convertedAmount: '',
      toAddress: '',
      formValid: false,
      toggle_exclusive: 0,
      gas: 21000,
      activeGasPrice: '',
      isFastChecked: false,
      speedSelected: '',
      totalCost: '',
      timeTaken: '',
      convertedTotalCost: '',
      rules: {
        toAddress: value => torus.web3.utils.isAddress(value) || /\S+@\S+\.\S+/.test(value) || 'Invalid ETH or Email Address',
        required: value => !!value || 'Required'
      },
      showModalMessage: false,
      modalMessageSuccess: null
    }
  },
  computed: {
    selectedCurrency() {
      return this.$store.state.selectedCurrency
    },
    currentEthBalance() {
      return this.$store.state.weiBalance[this.$store.state.selectedAddress]
    },
    finalBalancesArray() {
      return this.$store.getters.tokenBalances.finalBalancesArray || []
    },
    selectedItem() {
      const foundElement = this.finalBalancesArray.find(x => x.tokenAddress === this.selectedTokenAddress)
      return foundElement
    },
    selectedTokenAddress() {
      if (this.tokenAddress === '0x' || !torus.web3.utils.isAddress(this.tokenAddress)) return '0x'
      return torus.web3.utils.toChecksumAddress(this.tokenAddress)
    },
    getCurrencyMultiplier() {
      const { selectedCurrency, currencyData } = this.$store.state || {}
      let currencyMultiplier = 1
      if (selectedCurrency !== 'ETH') currencyMultiplier = currencyData[selectedCurrency.toLowerCase()] || 1
      return currencyMultiplier
    },
    getCurrencyTokenRate() {
      const { tokenRates } = this.$store.state
      const currencyMultiplier = this.getCurrencyMultiplier
      let tokenRateMultiplier = 1
      if (this.selectedTokenAddress !== '0x') tokenRateMultiplier = tokenRates[this.selectedTokenAddress.toLowerCase()] || 0
      return currencyMultiplier * tokenRateMultiplier
    },
    gasDisplayString() {
      const currencyMultiplier = this.getCurrencyMultiplier
      const ethFee = this.gas * this.fastGasPrice * 10 ** -9
      const currencyFee = ethFee * currencyMultiplier
      return `${significantDigits(currencyFee)} ${this.selectedCurrency} / ${significantDigits(ethFee)} ETH`
    },
    fastGasDisplayString() {
      const currencyMultiplier = this.getCurrencyMultiplier
      const ethFee = this.gas * this.fastestGasPrice * 10 ** -9
      const currencyFee = ethFee * currencyMultiplier
      return `Faster with ${significantDigits(currencyFee)} ${this.selectedCurrency} / ${significantDigits(ethFee)} ETH`
    },
    remainingBalanceString() {
      if (this.selectedItem) return `${this.selectedItem.currencyBalance} / ${this.selectedItem.formattedBalance}`
      return ''
    },
    convertedTotalCostDisplay() {
      return `~ ${significantDigits(this.convertedTotalCost)} ${this.selectedCurrency}`
    },
    currencyBalanceDisplay() {
      // = 390.00 USD
      // USD 4,138.16
      const getNumber = this.selectedItem.currencyBalance.split(' ')[1].replace(',', '')
      return `= ${getNumber} ${this.selectedCurrency}`
    }
  },
  watch: {
    toAddress: async function(newValue, oldValue) {
      if (newValue !== oldValue) this.gas = await this.calculateGas(newValue)
    },
    displayAmount: function(newValue, oldValue) {
      if (this.toggle_exclusive === 0) {
        this.amount = this.displayAmount
      } else {
        this.amount = this.displayAmount / this.getCurrencyTokenRate
      }

      this.convertedAmount = significantDigits(this.displayAmount * this.getCurrencyTokenRate)

      this.updateTotalCost()
    }
  },
  methods: {
    lesserThan: function(value) {
      if (this.selectedItem) {
        let amount = value
        if (this.toggle_exclusive === 1) {
          amount = amount / this.getCurrencyTokenRate
        }
        return parseFloat(amount) < this.selectedItem.computedBalance || 'Insufficient balance for transaction'
      }
      return ''
    },
    async calculateGas(toAddress) {
      if (torus.web3.utils.isAddress(toAddress)) {
        return new Promise((resolve, reject) => {
          if (this.selectedTokenAddress === '0x') {
            torus.web3.eth
              .estimateGas({ to: toAddress })
              .then(response => {
                resolve(response)
              })
              .catch(err => {
                console.log(err)
                resolve(MAX_GAS)
              })
          } else {
            const selectedAddress = this.$store.state.selectedAddress
            const contractInstance = new torus.web3.eth.Contract(transferABI, this.selectedTokenAddress)
            contractInstance.methods
              .transfer(toAddress, (parseFloat(this.amount) * 10 ** parseFloat(this.selectedItem.decimals)).toString())
              .estimateGas({ from: selectedAddress })
              .then(response => {
                resolve(response)
              })
              .catch(err => {
                console.log(err)
                resolve(MAX_GAS)
              })
          }
        })
      } else {
        return 21000
      }
    },
    async selectedItemChanged(tokenAddress) {
      this.tokenAddress = tokenAddress
      this.gas = await this.calculateGas(this.toAddress)
      this.updateTotalCost()
    },
    changeSelectedToCurrency(value) {
      const currencyRate = this.getCurrencyTokenRate
      if (value === 0) {
        this.displayAmount = this.displayAmount / currencyRate
      } else if (value === 1) {
        this.displayAmount = this.displayAmount * currencyRate
      }
    },
    async sendCoin() {
      if (this.$refs.form.validate()) {
        const fastGasPrice = torus.web3.utils.toBN((this.activeGasPrice * 10 ** 9).toString())
        let toAddress
        if (torus.web3.utils.isAddress(this.toAddress)) {
          toAddress = torus.web3.utils.toChecksumAddress(this.toAddress)
        } else {
          const endPointNumber = getRandomNumber(torusNodeEndpoints.length)
          try {
            toAddress = await torus.getPubKeyAsync(torusNodeEndpoints[endPointNumber], this.toAddress)
          } catch (err) {
            console.log(err)
            let newEndPointNumber = endPointNumber
            while (newEndPointNumber === endPointNumber) {
              newEndPointNumber = getRandomNumber(torusNodeEndpoints.length)
            }
            toAddress = await torus.getPubKeyAsync(torusNodeEndpoints[newEndPointNumber], this.toAddress)
          }
        }
        // this.gas = await this.calculateGas(toAddress)
        const selectedAddress = this.$store.state.selectedAddress
        if (this.selectedTokenAddress === '0x') {
          console.log("TX SENT: ",             {
              from: selectedAddress,
              to: toAddress,
              value: torus.web3.utils.toWei(this.amount.toString()),
              gas: this.gas.toString(),
              gasPrice: fastGasPrice
            } )
          torus.web3.eth.sendTransaction(
            {
              from: selectedAddress,
              to: toAddress,
              value: torus.web3.utils.toWei(this.amount.toString()),
              gas: this.gas.toString(),
              gasPrice: fastGasPrice
            },
            (err, transactionHash) => {
              if (err) {
                this.showModalMessage = true
                this.modalMessageSuccess = false
                console.log(err)
              } else {
                this.showModalMessage = true
                this.modalMessageSuccess = true
              }
            }
          )
        } else {
          const contractInstance = new torus.web3.eth.Contract(transferABI, this.selectedTokenAddress)
          contractInstance.methods.transfer(toAddress, (parseFloat(this.amount) * 10 ** parseFloat(this.selectedItem.decimals)).toString()).send(
            {
              from: selectedAddress,
              gas: this.gas.toString(),
              fastGasPrice
            },
            (err, transactionHash) => {
              if (err) {
                this.showModalMessage = true
                this.modalMessageSuccess = false
                console.log(err)
              } else {
                this.showModalMessage = true
                this.modalMessageSuccess = true
              }
            }
          )
        }
      }
    },
    getGasDisplayString(fastGasPrice) {
      const currencyFee = this.getGasAmount(fastGasPrice)
      return `${significantDigits(currencyFee)} ${this.selectedCurrency}`
    },
    getGasAmount(fastGasPrice) {
      const currencyMultiplier = this.getCurrencyMultiplier
      const ethFee = this.getEthAmount(this.gas, fastGasPrice)
      const currencyFee = ethFee * currencyMultiplier

      return currencyFee
    },
    getEthAmount(gas, gasPrice) {
      return gas * gasPrice * 10 ** -9
    },
    goBack() {
      this.$router.go(-1)
    },
    getGasSpeed() {
      if (this.speedSelected === 'average') {
        return this.averageGasPriceSpeed
      } else if (this.speedSelected === 'fast') {
        return this.fastGasPriceSpeed
      } else if (this.speedSelected === 'fastest') {
        return this.fastestGasPriceSpeed
      }
    },
    updateTotalCost() {
      if (!this.displayAmount || this.speedSelected === '') {
        this.totalCost = ''
        this.convertedTotalCost = ''
        return
      }

      this.convertedTotalCost = this.convertedAmount + this.getGasAmount(this.activeGasPrice)

      if (this.selectedTokenAddress === '0x') {
        this.totalCost = this.convertedTotalCost / this.getCurrencyTokenRate
      } else {
        this.totalCost = `${this.displayAmount} ${this.selectedItem.symbol} + ${this.getGasAmount(this.activeGasPrice)} ETH`
      }
    },
    onSelectSpeed(data) {
      console.log("SET DATA: ", data)
      this.speedSelected = data.speedSelected
      this.activeGasPrice = data.activeGasPrice
      this.timeTaken = data.speed
      this.gas = data.gas

      if (data.isReset) {
        this.calculateGas()
      }
      this.updateTotalCost()
    }
  },
  created() {
    this.tokenAddress = this.address
  }
}
</script>

<style lang="scss" scoped>
.wallet-transfer {
  ::v-deep .v-messages {
    text-align: right;
    &.error--text {
      text-align: left;
    }
  }
}
</style>
