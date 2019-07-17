<template>
  <v-layout mt-4 wrap row>
    <div class="text-black font-weight-bold headline px-3 mb-3">Transfer Details</div>
    <v-flex xs12 mb-3>
      <v-form ref="form" v-model="formValid" @submit.prevent="sendCoin" lazy-validation>
        <v-layout row wrap>
          <v-flex xs12 px-3 sm6>
            <span class="subtitle-2">Select your Coin</span>
            <v-select :items="finalBalancesArray" :value="selectedItem" @change="selectedItemChanged" item-text="name" outlined></v-select>
          </v-flex>
          <v-flex xs12 sm6 px-3 pt-4 v-if="selectedItem">
            <div>
              <span class="headline mr-1">{{ selectedItem.formattedBalance }}</span>
              <span class="caption torus_text--text text--lighten-4">{{ selectedItem.currencyBalance }}</span>
            </div>
            <div class="caption font-weight-regular torus_text--text text--lighten-4">{{ selectedItem.currencyRateText }}</div>
          </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-flex xs12 px-3 sm6>
            <span class="subtitle-2">Recipient Address</span>
            <v-text-field
              v-model="toAddress"
              placeholder="ETH Address here"
              required
              :rules="[rules.toAddress, rules.required]"
              outlined
            ></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-flex xs12 px-3 sm6>
            <div>
              <span class="subtitle-2">You send</span>
              <span v-if="convertedAmount" class="right caption">~{{ convertedAmount }} {{ selectedCurrency }}</span>
            </div>
            <v-text-field type="number" outlined required v-model="displayAmount" :rules="[rules.required, lesserThan]"></v-text-field>
          </v-flex>
          <v-flex xs12 px-3 sm6>
            <div>
              <span class="subtitle-2">Total Cost</span>
              <span v-if="convertedTotalCost" class="right caption">~{{ convertedTotalCost }} {{ selectedCurrency }}</span>
            </div>
            <v-text-field outlined readonly :value="totalCost"></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-flex xs12 sm6>
            <div class="subtitle-2 mb-1 px-3">
              <span>Select your Transaction Speed</span>
              <v-dialog v-model="dialog" persistent>
                <template v-slot:activator="{ on }">
                  <span class="right primary--text advance-option" v-on="on">Advance Options</span>
                </template>
                <TransferAdvanceOption @onClose="dialog = false" />
              </v-dialog>
            </div>
            <v-layout xs12 justify-space-between wrap>
              <v-flex xs12 sm4 px-3 mb-1>
                <v-btn
                  block
                  large
                  outlined
                  class="button-speed"
                  :class="speedSelected === 'average' ? 'primary theme--dark' : ''"
                  @click="selectSpeed('average', averageGasPrice)"
                >
                  <span>~ {{ averageGasPriceSpeed }} Mins</span>
                  <span class="font-weight-light">{{ getGasDisplayString(averageGasPrice) }}</span>
                </v-btn>
              </v-flex>
              <v-flex xs12 sm4 px-3 mb-1>
                <v-btn
                  block
                  large
                  outlined
                  class="button-speed"
                  :class="speedSelected === 'fast' ? 'primary theme--dark' : ''"
                  @click="selectSpeed('fast', fastGasPrice)"
                >
                  <span>~ {{ fastGasPriceSpeed }} Mins</span>
                  <span class="font-weight-light">{{ getGasDisplayString(fastGasPrice) }}</span>
                </v-btn>
              </v-flex>
              <v-flex xs12 sm4 px-3 mb-1>
                <v-btn
                  block
                  large
                  outlined
                  class="button-speed"
                  :class="speedSelected === 'fastest' ? 'primary theme--dark' : ''"
                  @click="selectSpeed('fastest', fastestGasPrice)"
                >
                  <span>~ {{ fastestGasPriceSpeed }} Mins</span>
                  <span class="font-weight-light">{{ getGasDisplayString(fastestGasPrice) }}</span>
                </v-btn>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
        <v-layout mt-3 pr-2 row wrap>
          <v-spacer></v-spacer>
          <v-dialog v-model="confirmDialog" max-width="550" persistent>
            <template v-slot:activator="{ on }">
              <v-btn large color="primary" :disabled="!formValid || speedSelected === ''" class="px-4" v-on="on">Continue</v-btn>
            </template>
            <transfer-confirm
              :toAddress="toAddress"
              :selectedCoin="selectedItem.name"
              :convertedAmount="convertedAmount"
              :displayAmount="displayAmount"
              :speedSelected="getGasSpeed(speedSelected)"
              :activeGasPrice="getGasAmount(activeGasPrice)"
              @onClose="confirmDialog = false"
              @onConfirm="sendCoin"
            ></transfer-confirm>
          </v-dialog>
          <!-- <v-btn large color="primary" :disabled="!formValid || speedSelected === ''" type="submit">Confirm</v-btn> -->
        </v-layout>
      </v-form>
    </v-flex>
  </v-layout>
  <!-- Hide original design for now -->
  <!-- <v-layout mt-5 row wrap align-start align-content-start justify-center v-if="false">
    <v-flex xs12 sm9>
      <span>
        <span class="spanWrapSvgStyle">
          <img :src="require('../../public/images/coins.svg')" alt="Wallet" class="svg-setting-small" />
        </span>
        <span class="headline"> Transaction Request</span>
      </span>
    </v-flex>
    <v-flex xs12 sm9 class="fill-height">
      <v-card text :color="$vuetify.theme.torus_bcg" class="fill-height" style="width: 100%;">
        <v-form ref="form" v-model="formValid" lazy-validation class="fill-height" @submit.prevent="">
          <v-container fill-height pl-0 pr-0>
            <v-layout row wrap align-center justify-center align-content-start>
              <v-flex xs12 sm6>
                <span class="body-2">Selected Coin </span>
              </v-flex>
              <v-flex xs7 sm4 align-self-center>
                <v-select single-line solo text :items="finalBalancesArray" :value="selectedItem" label="Coin" @change="selectedItemChanged">
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
                  text
                  required
                  persistent-hint
                  hint="Please enter an Ethereum address or a valid Google email"
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
                  text
                  required
                  v-model="displayAmount"
                  :rules="[rules.required, lesserThan]"
                  class="remove-padding-right"
                >
                  <template v-slot:append>
                    <v-btn-toggle v-model="toggle_exclusive" @change="changeSelectedToCurrency" mandatory>
                      <v-btn text>
                        {{ selectedItem && selectedItem.symbol }}
                      </v-btn>
                      <v-btn text>
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
                          <v-btn :disabled="!formValid" outlined large class="btnStyle" @click="sendCoin">Confirm</v-btn>
                        </span>
                      </template>
                      <span>Resolve the errors</span>
                    </v-tooltip>
                    <v-btn outlined large class="btnStyle" @click="goBack">Back</v-btn>
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
  </v-layout> -->
</template>

<script>
import torus from '../torus'
import { significantDigits, getRandomNumber } from '../utils/utils'
import config from '../config'
import TransferAdvanceOption from '../components/TransferAdvanceOption'
import TransferConfirm from '../components/TransferConfirm'
const { torusNodeEndpoints } = config
const transferABI = require('human-standard-token-abi')

const MAX_GAS = 6721975

export default {
  name: 'walletTransfer',
  props: ['address'],
  components: {
    TransferAdvanceOption,
    TransferConfirm
  },
  data() {
    return {
      dialog: false,
      confirmDialog: false,
      tokenAddress: '0x',
      amount: 0,
      displayAmount: '',
      convertedAmount: '',
      toAddress: '',
      formValid: true,
      toggle_exclusive: 0,
      gas: 21000,
      averageGasPrice: '5',
      fastGasPrice: '10', // 10 gwei
      fastestGasPrice: '20',
      activeGasPrice: '',
      averageGasPriceSpeed: '',
      fastGasPriceSpeed: '',
      fastestGasPriceSpeed: '',
      isFastChecked: false,
      speedSelected: '',
      totalCost: '',
      convertedTotalCost: '',
      rules: {
        toAddress: value => torus.web3.utils.isAddress(value) || /\S+@\S+\.\S+/.test(value) || 'Invalid eth or email Address',
        required: value => !!value || 'Required'
      }
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
        if (this.selectedTokenAddress === '0x')
          torus.web3.eth
            .sendTransaction({
              from: selectedAddress,
              to: toAddress,
              value: torus.web3.utils.toWei(this.amount.toString()),
              gas: this.gas.toString(),
              gasPrice: fastGasPrice
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
              fastGasPrice
            })
            .on('transactionHash', () => {
              this.$router.push('/wallet/history')
            })
            .on('error', err => console.log(err))
        }
      }
    },
    getGasDisplayString(fastGasPrice) {
      const currencyFee = this.getGasAmount(fastGasPrice)
      return `${significantDigits(currencyFee)} ${this.selectedCurrency}`
    },
    getGasAmount(fastGasPrice) {
      const currencyMultiplier = this.getCurrencyMultiplier
      const ethFee = this.gas * fastGasPrice * 10 ** -9
      const currencyFee = ethFee * currencyMultiplier

      return currencyFee
    },
    goBack() {
      this.$router.go(-1)
    },
    selectSpeed(targetSpeed, price) {
      if (this.speedSelected === targetSpeed) {
        this.speedSelected = ''
        this.activeGasPrice = ''
      } else {
        this.speedSelected = targetSpeed
        this.activeGasPrice = price
      }

      this.updateTotalCost()
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
          avgWait,
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
          const [average, fast, fastest] = [averageTimes10, fastTimes10, fastestTimes10].map(price => parseFloat(price) / 10)
          this.averageGasPrice = average
          this.fastGasPrice = fast
          this.fastestGasPrice = fastest

          this.averageGasPriceSpeed = avgWait
          this.fastGasPriceSpeed = fastWait
          this.fastestGasPriceSpeed = fastestWait
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

::v-deep .button-speed {
  &.v-btn {
    height: inherit;
    border: 1px solid #a7b3bf;
  }
  .v-btn__content {
    flex-direction: column;
    padding: 12px 0;
    line-height: 1em;
  }
}

.advance-option {
  cursor: pointer;
}
</style>
