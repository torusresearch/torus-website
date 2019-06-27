<template>
  <v-layout mt-5 row wrap align-start align-content-start justify-center>
    <v-flex xs12 sm9>
      <span>
        <span class="spanWrapSvgStyle">
          <img :src="require('../../public/images/coins.svg')" alt="Wallet" class="svg-setting-small" />
        </span>
        <span class="headline"> Transaction Request</span>
      </span>
    </v-flex>
    <v-flex xs12 sm9 class="fill-height">
      <v-card flat :color="$vuetify.theme.torus_bcg" class="fill-height" style="width: 100%;">
        <v-form ref="form" v-model="formValid" lazy-validation class="fill-height">
          <v-container fill-height>
            <v-layout row wrap align-center justify-center align-content-start>
              <v-flex xs12 sm6>
                <span class="body-2">Selected Coin </span>
              </v-flex>
              <v-flex xs7 sm4 align-self-center>
                <v-select single-line solo flat :items="finalBalancesArray" :value="selectedItem" label="Coin" @change="selectedItemChanged">
                  <template v-slot:item="props">
                    <v-layout row wrap align-center justify-center>
                      <v-flex xs2>
                        <img
                          :src="require(`../../public/images/logos/${props.item.logo}`)"
                          class="inline-small"
                          onerror="if (this.src != 'eth.svg') this.src = 'images/logos/eth.svg';"
                        />
                      </v-flex>
                      <v-flex xs10 align-self-center> {{ props.item.name }} </v-flex>
                    </v-layout>
                  </template>
                  <template v-slot:selection="props">
                    <v-layout row align-center>
                      <v-flex xs2 mr-2>
                        <img
                          :src="require(`../../public/images/logos/${props.item.logo}`)"
                          class="inline-small"
                          onerror="if (this.src != 'eth.svg') this.src = 'images/logos/eth.svg';"
                        />
                      </v-flex>
                      <v-flex xs10>{{ props.item.name }}</v-flex>
                    </v-layout>
                  </template>
                </v-select>
              </v-flex>
              <v-flex xs5 sm2>
                <span style="margin-left: 5px;">{{ selectedItem && selectedItem.currencyRateText }}</span>
              </v-flex>
              <v-flex xs12 sm6>
                <span class="body-2">Current Balance</span>
              </v-flex>
              <v-flex xs12 sm6>
                <span class="body-2">{{ remainingBalanceString }} </span>
              </v-flex>
              <v-flex xs12 sm6>
                <span class="body-2">Enter To/Wallet Address</span>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field
                  placeholder="Enter address to send coin to"
                  aria-label="To/Wallet Address"
                  v-model="toAddress"
                  solo
                  flat
                  required
                  :rules="[rules.toAddress, rules.required]"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <span class="body-2">Enter Amount To Transfer</span>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field
                  id="amount"
                  placeholder="Enter amount to send"
                  aria-label="quantity"
                  solo
                  flat
                  required
                  v-model="displayAmount"
                  :rules="[rules.required, lesserThan]"
                >
                  <template v-slot:append>
                    <v-btn-toggle v-model="toggle_exclusive" @change="changeSelectedToCurrency" mandatory>
                      <v-btn flat>
                        {{ selectedItem && selectedItem.symbol }}
                      </v-btn>
                      <v-btn flat>
                        {{ selectedCurrency }}
                      </v-btn>
                    </v-btn-toggle>
                  </template>
                </v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <span class="body-2">Transaction Fee</span>
              </v-flex>
              <v-flex xs12 sm6>
                <span class="body-2">
                  <div>{{ gasDisplayString }}</div>
                  <v-checkbox v-model="isFastChecked" :color="$vuetify.theme.torus_blue" :label="fastGasDisplayString"> </v-checkbox>
                </span>
              </v-flex>
              <v-flex xs12>
                <v-layout row wrap>
                  <v-flex class="text-xs-left" id="flexibtn">
                    <v-tooltip bottom :disabled="formValid">
                      <template v-slot:activator="{ on }">
                        <span v-on="on">
                          <v-btn :disabled="!formValid" outline large class="btnStyle" @click="sendCoin">Confirm</v-btn>
                        </span>
                      </template>
                      <span>Resolve the errors</span>
                    </v-tooltip>
                    <v-btn outline large class="btnStyle" @click="goBack">Back</v-btn>
                  </v-flex>
                  <v-flex xs2 align-self-center class="hidden-xs-only">
                    <img :src="require('../../public/images/torus_logo.png')" />
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-container>
        </v-form>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import torus from '../torus'
import { significantDigits } from '../utils/utils'

const transferABI = [
  {
    constant: false,
    inputs: [
      {
        name: '_to',
        type: 'address'
      },
      {
        name: '_value',
        type: 'uint256'
      }
    ],
    name: 'transfer',
    outputs: [
      {
        name: 'success',
        type: 'bool'
      }
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  }
]

const MAX_GAS = 6721975

export default {
  name: 'walletTransfer',
  props: ['address'],
  data() {
    return {
      tokenAddress: '0x',
      amount: 0,
      displayAmount: '',
      toAddress: '',
      formValid: true,
      toggle_exclusive: 0,
      gas: 21000,
      gasPrice: '10', // 10 gwei
      fastGasPrice: '20',
      isFastChecked: false,
      rules: {
        toAddress: value => torus.web3.utils.isAddress(value) || 'Invalid Eth Address',
        required: value => !!value || 'Required'
      }
    }
  },
  computed: {
    selectedCurrency() {
      return this.$store.state.selectedCurrency
    },
    currentEthBalance() {
      return this.$store.state.weiBalance
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
      const ethFee = this.gas * this.gasPrice * 10 ** -9
      const currencyFee = ethFee * currencyMultiplier
      return `${significantDigits(currencyFee)} ${this.selectedCurrency} / ${significantDigits(ethFee)} ETH`
    },
    fastGasDisplayString() {
      const currencyMultiplier = this.getCurrencyMultiplier
      const ethFee = this.gas * this.fastGasPrice * 10 ** -9
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
    sendCoin() {
      const gasPrice = torus.web3.utils.toBN(this.isFastChecked ? (this.fastGasPrice * 10 ** 9).toString() : (this.gasPrice * 10 ** 9).toString())
      const toAddress = torus.web3.utils.toChecksumAddress(this.toAddress)
      const selectedAddress = this.$store.state.selectedAddress
      if (this.$refs.form.validate()) {
        if (this.selectedTokenAddress === '0x')
          torus.web3.eth
            .sendTransaction({
              from: selectedAddress,
              to: toAddress,
              value: torus.web3.utils.toWei(this.amount.toString()),
              gas: this.gas.toString(),
              gasPrice
            })
            .on('transactionHash', () => {
              this.$router.push('/wallet/history')
            })
            .on('error', err => console.log(err))
        else {
          const contractInstance = new torus.web3.eth.Contract(transferABI, this.selectedTokenAddress)
          contractInstance.methods
            .transfer(toAddress, (parseFloat(this.amount) * 10 ** parseFloat(this.selectedItem.decimals)).toString())
            .send({
              from: selectedAddress,
              gas: this.gas.toString(),
              gasPrice
            })
            .on('transactionHash', () => {
              this.$router.push('/wallet/history')
            })
            .on('error', err => console.log(err))
        }
      }
    },
    goBack() {
      this.$router.go(-1)
    }
  },
  created() {
    this.tokenAddress = this.address
    fetch('https://ethgasstation.info/json/ethgasAPI.json', {
      headers: {},
      referrer: 'http://ethgasstation.info/json/',
      referrerPolicy: 'no-referrer-when-downgrade',
      body: null,
      method: 'GET',
      mode: 'cors'
    })
      .then(resp => resp.json())
      .then(
        ({
          average: averageTimes10,
          block_time: blockTime,
          blockNum,
          fast: fastTimes10,
          fastest: fastestTimes10,
          fastestWait,
          fastWait,
          safeLow: safeLowTimes10,
          safeLowWait,
          speed
        }) => {
          const [average, fastest] = [averageTimes10, fastestTimes10].map(price => parseFloat(price) / 10)
          this.gasPrice = average
          this.fastGasPrice = fastest
        }
      )
      .catch(err => {
        console.log(err)
      })
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

/deep/.v-btn--active {
  background: var(--v-torus_blue-base) !important;
  color: #fff !important;
}

/deep/.v-item-group {
  box-shadow: none !important;
}

.inline-small {
  width: 25px;
  height: 25px;
  display: inline-block;
  vertical-align: middle;
}

/deep/.v-text-field--solo .v-input__slot,
.v-text-field--outline .v-input__slot {
  min-height: auto !important;
  display: flex !important;
  align-items: flex-end !important;
  border-radius: 17px !important;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.16) !important;
  margin-top: 20px !important;
  margin-bottom: 0px !important;
}

/deep/.v-text-field.v-text-field--solo .v-input__control {
  min-height: auto !important;
}

/deep/.v-input__slot .v-label {
  margin-bottom: 0px !important;
}
</style>
