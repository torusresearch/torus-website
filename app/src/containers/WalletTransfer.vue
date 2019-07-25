<template>
  <v-layout mt-6 wrap>
    <div class="text-black font-weight-bold headline px-4 mb-4">Transfer Details</div>
    <v-flex xs12 mb-4>
      <v-form ref="form" v-model="formValid" @submit.prevent="sendCoin" lazy-validation>
        <v-layout wrap>
          <v-flex xs12 px-4 sm6>
            <span class="subtitle-2">Select your Coin</span>
            <v-select :items="finalBalancesArray" :value="selectedItem" @change="selectedItemChanged" item-text="name" outlined></v-select>
          </v-flex>
          <v-flex xs12 sm6 px-4 pt-6 v-if="selectedItem">
            <div>
              <span class="headline mr-1">{{ selectedItem.formattedBalance }}</span>
              <span class="caption torus_text--text text--lighten-4">{{ selectedItem.currencyBalance }}</span>
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
              <span v-if="convertedAmount" class="float-right caption">~{{ convertedAmount }} {{ selectedCurrency }}</span>
            </div>
            <v-text-field type="number" outlined required v-model="displayAmount" :rules="[rules.required, lesserThan]"></v-text-field>
          </v-flex>
          <v-flex xs12 px-4 sm6>
            <div>
              <span class="subtitle-2">Total Cost</span>
              <span v-if="convertedTotalCost" class="float-right caption">~{{ convertedTotalCost }} {{ selectedCurrency }}</span>
            </div>
            <v-text-field outlined readonly :value="totalCost"></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout wrap>
          <TransactionSpeedSelect :gas="gas" :displayAmount="displayAmount" @onSelectSpeed="onSelectSpeed" />
        </v-layout>
        <v-layout mt-4 pr-2 wrap>
          <v-spacer></v-spacer>
          <v-dialog v-model="confirmDialog" max-width="550" persistent>
            <template v-slot:activator="{ on }">
              <v-btn large color="primary" :disabled="!formValid || speedSelected === ''" class="px-6" v-on="on">Continue</v-btn>
            </template>
            <transfer-confirm
              :toAddress="toAddress"
              :selectedCoin="selectedItem.name"
              :convertedAmount="convertedAmount"
              :displayAmount="displayAmount"
              :speedSelected="getGasSpeed(speedSelected)"
              :activeGasPrice="getGasAmount(activeGasPrice)"
              :selectedCurrency="selectedCurrency"
              @onClose="confirmDialog = false"
              @onConfirm="sendCoin"
            ></transfer-confirm>
          </v-dialog>
          <!-- <v-btn large color="primary" :disabled="!formValid || speedSelected === ''" type="submit">Confirm</v-btn> -->
        </v-layout>

        <v-layout mt-4 pr-2 wrap>
          <v-spacer></v-spacer>
          <v-dialog v-model="showModalMessage" max-width="550" persistent>
            <message-modal
              @onClose="showModalMessage = false"
              :modal-type="modalMessageSuccess"
              :title="modalMessageSuccess ? 'Your transfer is being processed' : 'Your transfer cannot be processed'"
              :detail-text="modalMessageSuccess ? 'Your transaction will be completed in approximately [ time ] min' : 'Please try again later'"
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
import TransferConfirm from '../components/TransferConfirm'
import MessageModal from '../components/MessageModal'
const { torusNodeEndpoints } = config
const transferABI = require('human-standard-token-abi')

const MAX_GAS = 6721975

export default {
  name: 'walletTransfer',
  props: ['address'],
  components: {
    TransactionSpeedSelect,
    TransferConfirm,
    MessageModal
  },
  data() {
    return {
      confirmDialog: false,
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
      convertedTotalCost: '',
      rules: {
        toAddress: value => torus.web3.utils.isAddress(value) || /\S+@\S+\.\S+/.test(value) || 'Invalid eth or email Address',
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
    }
  },
  watch: {
    toAddress: function(newValue, oldValue) {
      this.calculateGas()
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
        return parseFloat(amount) < this.selectedItem.computedBalance || 'Must be lesser than current balance'
      }
      return ''
    },
    calculateGas() {
      if (torus.web3.utils.isAddress(this.toAddress)) {
        if (this.selectedTokenAddress === '0x') {
          torus.web3.eth
            .estimateGas({ to: this.toAddress })
            .then(response => {
              this.gas = response
            })
            .catch(err => {
              console.log(err)
              this.gas = MAX_GAS
            })
        } else {
          const selectedAddress = this.$store.state.selectedAddress
          const contractInstance = new torus.web3.eth.Contract(transferABI, this.selectedTokenAddress)
          contractInstance.methods
            .transfer(this.toAddress, (parseFloat(this.amount) * 10 ** parseFloat(this.selectedItem.decimals)).toString())
            .estimateGas({ from: selectedAddress })
            .then(response => {
              this.gas = response
            })
            .catch(err => {
              console.log(err)
              this.gas = MAX_GAS
            })
        }
      }
    },
    selectedItemChanged(value) {
      this.tokenAddress = value.tokenAddress
      this.calculateGas()
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
        const selectedAddress = this.$store.state.selectedAddress
        if (this.selectedTokenAddress === '0x') {
          torus.web3.eth
            .sendTransaction({
              from: selectedAddress,
              to: toAddress,
              value: torus.web3.utils.toWei(this.amount.toString()),
              gas: this.gas.toString(),
              gasPrice: fastGasPrice
            })
            .on('transactionHash', () => {
              this.showModalMessage = true
              this.modalMessageSuccess = true
              // this.$router.push('/wallet/history')
            })
            .on('error', err => {
              this.showModalMessage = true
              this.modalMessageSuccess = false
              console.log(err)
            })
        } else {
          const contractInstance = new torus.web3.eth.Contract(transferABI, this.selectedTokenAddress)
          contractInstance.methods
            .transfer(toAddress, (parseFloat(this.amount) * 10 ** parseFloat(this.selectedItem.decimals)).toString())
            .send({
              from: selectedAddress,
              gas: this.gas.toString(),
              fastGasPrice
            })
            .on('transactionHash', () => {
              this.showModalMessage = true
              this.modalMessageSuccess = true
              // this.$router.push('/wallet/history')
            })
            .on('error', err => {
              this.showModalMessage = true
              this.modalMessageSuccess = false
              console.log(err)
            })
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
      this.totalCost = this.convertedTotalCost / this.getCurrencyTokenRate
    },
    onSelectSpeed(data) {
      this.speedSelected = data.speedSelected
      this.activeGasPrice = data.activeGasPrice

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
@mixin svg-size($args...) {
  @each $name, $size in keywords($args) {
    .svg-setting-#{$name} {
      width: $size;
      height: $size;
    }
  }
}

@include svg-size($tiny: 18px, $small: 24px, $medium: 38px, $large: 80px);

.spanWrapSvgStyle {
  display: inline-flex;
  @extend %justify-align;
}

%justify-align {
  justify-content: start;
  align-items: center;
}

.text-bluish {
  color: var(--v-torus_blue-base);
}

%rounded {
  border-radius: 45px;
}

#flexibtn .btnStyle {
  width: 141px;
  height: 41px;
  border: #fff;
  background-color: #fff !important;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
  @extend %rounded;
}

::v-deep .v-btn--active {
  background: var(--v-torus_blue-base) !important;
  color: #fff !important;
}

::v-deep .v-item-group {
  box-shadow: none !important;
}

.inline-small {
  width: 25px;
  height: 25px;
  display: inline-block;
  vertical-align: middle;
}

::v-deep .v-text-field--solo .v-input__slot,
.v-text-field--outline .v-input__slot {
  min-height: auto !important;
  display: flex !important;
  align-items: flex-end !important;
  border-radius: 17px !important;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.16) !important;
  margin-top: 20px !important;
  margin-bottom: 0px !important;
}

::v-deep .v-text-field.remove-padding-right .v-input__control > .v-input__slot {
  padding-right: 0;

  .v-btn-toggle {
    border-radius: 0 17px 17px 0;
    .v-btn:first-child {
      border-radius: 17px 0 0 17px;
    }
    .v-btn:last-child {
      border-radius: 0 17px 17px 0;
    }
  }
}

::v-deep .v-text-field.v-text-field--solo .v-input__control {
  min-height: auto !important;
}

::v-deep .v-input__slot .v-label {
  margin-bottom: 0px !important;
}
</style>
