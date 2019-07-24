<template>
  <v-flex xs12 md6>
    <div class="subtitle-2 mb-1 px-3">
      <span>Select your Transaction Speed</span>
      <v-dialog v-model="advanceOptionDialog" persistent>
        <template v-slot:activator="{ on }">
          <span class="right primary--text advance-option" v-on="on">Advance Options</span>
        </template>
        <TransferAdvanceOption
          :dialog="advanceOptionDialog"
          :displayAmount="displayAmount"
          :gas="gas"
          :activeGasPrice="activeGasPrice"
          @onClose="advanceOptionDialog = false"
          @onSave="onSaveAdvanceOptions"
        />
      </v-dialog>
    </div>
    <v-layout xs12 justify-space-between wrap v-if="!isAdvanceOption">
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
    <v-layout v-if="isAdvanceOption" align-center>
      <v-flex xs6 px-4 mb-1>
        <div class="subtitle-2 font-weight-bold">
          {{ getEthAmountDisplay(gas, activeGasPrice) }}
          <span class="caption torus_text--text text--lighten-3">( ~ {{ getGasDisplayString(activeGasPrice) }} )</span>
        </div>
      </v-flex>
      <v-flex xs6 px-3 class="text-xs-right">
        <v-btn outlined color="primary" @click="resetAdvanceOption">Reset</v-btn>
      </v-flex>
    </v-layout>
  </v-flex>
</template>

<script>
import { significantDigits } from '../utils/utils'
import TransferAdvanceOption from './TransferAdvanceOption'

export default {
  components: {
    TransferAdvanceOption
  },
  props: ['gas', 'displayAmount', 'activeGasPriceConfirm'],
  data() {
    return {
      advanceOptionDialog: false,
      isAdvanceOption: false,
      speedSelected: '',
      averageGasPrice: '5',
      fastGasPrice: '10', // 10 gwei
      fastestGasPrice: '20',
      activeGasPrice: '',
      averageGasPriceSpeed: '',
      fastGasPriceSpeed: '',
      fastestGasPriceSpeed: ''
    }
  },
  computed: {
    selectedCurrency() {
      return this.$store.state.selectedCurrency
    },
    getCurrencyMultiplier() {
      const { selectedCurrency, currencyData } = this.$store.state || {}
      let currencyMultiplier = 1
      if (selectedCurrency !== 'ETH') currencyMultiplier = currencyData[selectedCurrency.toLowerCase()] || 1
      return currencyMultiplier
    }
  },
  methods: {
    onSaveAdvanceOptions(details) {
      this.gas = parseFloat(details.advancedGas)
      this.activeGasPrice = parseFloat(details.advancedActiveGasPrice)

      this.isAdvanceOption = true
      this.updateCosts()

      this.advanceOptionDialog = false
    },
    resetAdvanceOption() {
      if (this.speedSelected === 'average') {
        this.activeGasPrice = this.averageGasPrice
      } else if (this.speedSelected === 'fast') {
        this.activeGasPrice = this.fastGasPrice
      } else if (this.speedSelected === 'fastest') {
        this.activeGasPrice = this.fastestGasPrice
      }

      this.isAdvanceOption = false
      this.updateCosts(true)
    },
    selectSpeed(targetSpeed, price) {
      if (this.speedSelected === targetSpeed) {
        this.speedSelected = ''
        this.activeGasPrice = ''
      } else {
        this.speedSelected = targetSpeed
        this.activeGasPrice = price
      }

      this.updateCosts()
    },
    getGasDisplayString(gasPrice) {
      const currencyFee = this.getGasAmount(gasPrice)
      return `${significantDigits(currencyFee)} ${this.selectedCurrency}`
    },
    getGasAmount(gasPrice) {
      const currencyMultiplier = this.getCurrencyMultiplier
      const ethFee = this.getEthAmount(this.gas, gasPrice)
      const currencyFee = ethFee * currencyMultiplier

      return currencyFee
    },
    getEthAmount(gas, gasPrice) {
      return gas * gasPrice * 10 ** -9
    },
    getEthAmountDisplay(gas, gasPrice) {
      return `${significantDigits(this.getEthAmount(gas, gasPrice))} ETH`
    },
    updateCosts(isReset) {
      this.$emit('onSelectSpeed', {
        speedSelected: this.speedSelected,
        activeGasPrice: this.activeGasPrice,
        isReset: !!isReset
      })
    },
    setSelectedSpeed() {
      let selectedType = ''
      let nearest = 1200
      let delta = 0

      this.activeGasPrice = this.activeGasPriceConfirm

      delta = Math.abs(this.fastestGasPrice - this.activeGasPrice)
      if (delta < nearest) {
        nearest = delta
        selectedType = 'fastest'
      }
      delta = Math.abs(this.fastGasPrice - this.activeGasPrice)
      if (delta < nearest) {
        nearest = delta
        selectedType = 'fast'
      }
      delta = Math.abs(this.averageGasPrice - this.activeGasPrice)
      if (delta < nearest) {
        nearest = delta
        selectedType = 'average'
      }

      this.speedSelected = selectedType
    }
  },
  created() {
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

          // Set selected gas price from confirm
          if (this.activeGasPriceConfirm) {
            this.setSelectedSpeed()
          }
        }
      )
      .catch(err => {
        console.log(err)
      })
  }
}
</script>

<style lang="scss" scoped>
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
