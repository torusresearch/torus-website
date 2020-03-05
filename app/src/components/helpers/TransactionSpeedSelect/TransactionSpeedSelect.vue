<template>
  <v-flex xs12 sm6 mb-3>
    <v-layout px-4>
      <v-flex class="subtitle-2">
        <span>
          {{ t('walletTransfer.selectSpeed') }}
          <HelpTooltip :title="t('walletTransfer.transferFee')" :description="t('walletTransfer.transferFeeDesc')" />
        </span>
        <TransferAdvanceOption
          v-if="!$vuetify.breakpoint.xsOnly"
          :symbol="symbol"
          :display-amount="displayAmount"
          :gas="gas"
          :active-gas-price="activeGasPrice"
          @onSave="onSaveAdvanceOptions"
        />
      </v-flex>
    </v-layout>
    <v-layout v-if="!isAdvanceOption" px-4 mx-n1 xs12>
      <v-flex xs6 px-1 mb-1>
        <v-btn
          id="average-speed-btn"
          block
          large
          outlined
          class="button-speed"
          :class="speedSelected === 'average' ? 'selected' : ''"
          @click="selectSpeed('average', averageGasPrice)"
        >
          <span>~ {{ averageGasPriceSpeed }} {{ t('walletTransfer.minute') }}</span>
          <span class="font-weight-light body-2">{{ getGasDisplayString(averageGasPrice) }}</span>
        </v-btn>
      </v-flex>
      <v-flex xs6 px-1 mb-1>
        <v-btn
          id="fastest-speed-btn"
          block
          large
          outlined
          class="button-speed"
          :class="speedSelected === 'fastest' ? 'selected' : ''"
          @click="selectSpeed('fastest', fastestGasPrice)"
        >
          <span>~ {{ fastestGasPriceSpeed }} {{ t('walletTransfer.minute') }}</span>
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
        <v-btn id="adv-reset-btn" outlined color="primary" @click="resetAdvanceOption">{{ t('walletTransfer.reset') }}</v-btn>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex xs12 px-4 class="text-right">
        <TransferAdvanceOption
          v-if="$vuetify.breakpoint.xsOnly"
          :symbol="symbol"
          :display-amount="displayAmount"
          :gas="gas"
          :active-gas-price="activeGasPrice"
          @onSave="onSaveAdvanceOptions"
        />
      </v-flex>
    </v-layout>
  </v-flex>
</template>

<script>
import BigNumber from 'bignumber.js'
import log from 'loglevel'

import { significantDigits } from '../../../utils/utils'
import HelpTooltip from '../HelpTooltip'
import TransferAdvanceOption from '../TransferAdvanceOption'

export default {
  components: {
    TransferAdvanceOption,
    HelpTooltip
  },
  props: {
    gas: { type: BigNumber, default: new BigNumber('0') },
    displayAmount: { type: BigNumber, default: new BigNumber('0') },
    activeGasPriceConfirm: {
      type: BigNumber,
      default: undefined
    },
    symbol: {
      type: String,
      default: ''
    },
    resetSpeed: {
      type: Boolean
    },
    selectedCurrency: {
      type: String,
      default: 'USD'
    },
    currencyMultiplier: {
      type: BigNumber,
      default: new BigNumber('0')
    }
  },
  data() {
    return {
      isAdvanceOption: false,
      speedSelected: '',
      averageGasPrice: new BigNumber('5'),
      fastestGasPrice: new BigNumber('20'),
      activeGasPrice: new BigNumber('0'),
      averageGasPriceSpeed: '',
      fastestGasPriceSpeed: ''
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
          // block_time: blockTime,
          // blockNum,
          fastest: fastestTimes10,
          fastestWait
          // safeLow: safeLowTimes10,
          // safeLowWait,
          // speed
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
      .catch(error => {
        log.error(error)
      })
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
      return `${this.t('walletTransfer.pay')} ${significantDigits(currencyFee.toString())} ${this.selectedCurrency}`
    },
    getGasAmount(gasPrice) {
      const ethFee = this.getEthAmount(this.gas, gasPrice)
      return ethFee.times(this.currencyMultiplier)
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
        speed,
        isReset: !!isReset,
        gas: updatedGas || this.gas
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
  }
}
</script>

<style lang="scss" scoped>
@import 'TransactionSpeedSelect.scss';
</style>
