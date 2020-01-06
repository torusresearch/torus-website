<template>
  <v-flex xs12 sm6 mb-3>
    <div class="subtitle-2 mb-1 px-4">
      <span>
        {{ t('walletTransfer.selectSpeed') }}
        <HelpTooltip :title="t('walletTransfer.transferFee')" :description="t('walletTransfer.transferFeeDesc')" />
      </span>
      <TransferAdvanceOption
        v-if="!$vuetify.breakpoint.xsOnly"
        :symbol="symbol"
        :displayAmount="displayAmount"
        :gas="gas"
        :activeGasPrice="activeGasPrice"
        @onSave="onSaveAdvanceOptions"
      />
    </div>
    <v-layout xs12 justify-space-between wrap v-if="!isAdvanceOption">
      <v-flex xs6 px-4 mb-1>
        <v-btn
          id="average-speed-btn"
          block
          large
          outlined
          class="button-speed"
          :class="speedSelected === 'average' ? 'selected' : ''"
          @click="selectSpeed('average', averageGasPrice)"
        >
          <span>~ {{ averageGasPriceSpeed }} Mins</span>
          <span class="font-weight-light body-2">{{ getGasDisplayString(averageGasPrice) }}</span>
        </v-btn>
      </v-flex>
      <v-flex xs6 px-4 mb-1>
        <v-btn
          id="fastest-speed-btn"
          block
          large
          outlined
          class="button-speed"
          :class="speedSelected === 'fastest' ? 'selected' : ''"
          @click="selectSpeed('fastest', fastestGasPrice)"
        >
          <span>~ {{ fastestGasPriceSpeed }} Mins</span>
          <span class="font-weight-light body-2">{{ getGasDisplayString(fastestGasPrice) }}</span>
        </v-btn>
      </v-flex>
    </v-layout>
    <v-layout v-if="isAdvanceOption" align-center>
      <v-flex xs8 px-6 mb-1>
        <div class="subtitle-2 font-weight-bold">
          {{ getEthAmountDisplay(gas, activeGasPrice) }}
          <span class="caption text_2--text">( ~ {{ getGasDisplayString(activeGasPrice) }} )</span>
        </div>
      </v-flex>
      <v-flex xs4 px-4 class="text-right">
        <v-btn id="adv-reset-btn" outlined color="primary" @click="resetAdvanceOption">Reset</v-btn>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex xs12 px-4 class="text-right">
        <TransferAdvanceOption
          v-if="$vuetify.breakpoint.xsOnly"
          :symbol="symbol"
          :displayAmount="displayAmount"
          :gas="gas"
          :activeGasPrice="activeGasPrice"
          @onSave="onSaveAdvanceOptions"
        />
      </v-flex>
    </v-layout>
  </v-flex>
</template>

<script>
import { significantDigits } from '../../../utils/utils'
import TransferAdvanceOption from '../TransferAdvanceOption'
import HelpTooltip from '../HelpTooltip'
import log from 'loglevel'
import BigNumber from 'bignumber.js'

export default {
  components: {
    TransferAdvanceOption,
    HelpTooltip
  },
  props: ['gas', 'displayAmount', 'activeGasPriceConfirm', 'symbol', 'resetSpeed'],
  data() {
    return {
      isAdvanceOption: false,
      speedSelected: '',
      averageGasPrice: new BigNumber('5'),
      fastestGasPrice: new BigNumber('20'),
      activeGasPrice: new BigNumber(''),
      averageGasPriceSpeed: '',
      fastestGasPriceSpeed: ''
    }
  },
  computed: {
    selectedCurrency() {
      return this.$store.state.selectedCurrency
    },
    getCurrencyMultiplier() {
      const { selectedCurrency, currencyData } = this.$store.state || {}
      const currencyMultiplierNum = selectedCurrency !== 'ETH' ? currencyData[selectedCurrency.toLowerCase()] || 1 : 1
      const currencyMultiplier = new BigNumber(currencyMultiplierNum)
      return currencyMultiplier
    }
  },
  methods: {
    onSaveAdvanceOptions(details) {
      this.activeGasPrice = details.advancedActiveGasPrice

      this.isAdvanceOption = true
      this.updateCosts(false, details.advancedGas)
    },
    resetAdvanceOption() {
      if (this.speedSelected === 'fastest') {
        this.activeGasPrice = this.fastestGasPrice
      } else {
        this.activeGasPrice = this.averageGasPrice
        this.speedSelected = 'average'
      }

      this.isAdvanceOption = false
      this.updateCosts(true)
    },
    selectSpeed(targetSpeed, price) {
      if (this.speedSelected !== targetSpeed) {
        this.speedSelected = targetSpeed
        this.activeGasPrice = price
        this.updateCosts()
      }
    },
    getGasDisplayString(gasPrice) {
      const currencyFee = this.getGasAmount(gasPrice)
      return `Pay ${significantDigits(currencyFee.toString())} ${this.selectedCurrency}`
    },
    getGasAmount(gasPrice) {
      const currencyMultiplier = this.getCurrencyMultiplier
      const ethFee = this.getEthAmount(this.gas, gasPrice)
      const currencyFee = ethFee.times(currencyMultiplier)

      return currencyFee
    },
    getEthAmount(gas, gasPrice) {
      return gas.times(gasPrice).div(new BigNumber(10).pow(new BigNumber(9)))
    },
    getEthAmountDisplay(gas, gasPrice) {
      return `${significantDigits(this.getEthAmount(gas, gasPrice).toString())} ETH`
    },
    updateCosts(isReset, updatedGas) {
      const speed = this.speedSelected === 'average' ? this.averageGasPriceSpeed : this.fastestGasPriceSpeed

      this.$emit('onSelectSpeed', {
        speedSelected: this.speedSelected,
        activeGasPrice: this.activeGasPrice,
        speed: speed,
        isReset: !!isReset,
        gas: updatedGas ? updatedGas : this.gas
      })
    },
    setSelectedSpeed() {
      let selectedType = ''
      let selectedGasPrice = new BigNumber('0')

      if (this.fastestGasPrice.eq(this.activeGasPriceConfirm)) {
        selectedType = 'fastest'
        selectedGasPrice = this.fastestGasPrice
      } else if (this.averageGasPrice.eq(this.activeGasPriceConfirm)) {
        selectedType = 'average'
        selectedGasPrice = this.averageGasPrice
      } else {
        selectedGasPrice = this.activeGasPriceConfirm
        this.isAdvanceOption = true
      }

      this.speedSelected = selectedType
      this.activeGasPrice = selectedGasPrice

      if (this.activeGasPriceConfirm) {
        this.updateCosts()
      }
    }
  },
  watch: {
    resetSpeed(value) {
      if (value) {
        this.speedSelected = 'average'
        this.resetAdvanceOption()
      }
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
          fastest: fastestTimes10,
          fastestWait,
          safeLow: safeLowTimes10,
          safeLowWait,
          speed
        }) => {
          this.averageGasPrice = new BigNumber(averageTimes10).div(new BigNumber('10'))
          this.fastestGasPrice = new BigNumber(fastestTimes10).div(new BigNumber('10'))

          this.averageGasPriceSpeed = avgWait
          this.fastestGasPriceSpeed = fastestWait

          // Set selected gas price from confirm
          if (this.activeGasPriceConfirm) {
            this.setSelectedSpeed()
          } else {
            this.selectSpeed('average', this.averageGasPrice)
          }
        }
      )
      .catch(err => {
        log.error(err)
      })
  }
}
</script>

<style lang="scss" scoped>
@import 'TransactionSpeedSelect.scss';
</style>
