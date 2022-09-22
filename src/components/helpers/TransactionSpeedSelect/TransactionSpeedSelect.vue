<template>
  <v-col v-if="isConfirm" cols="12">
    <v-row wrap class="mb-2 align-center">
      <v-col cols="3">
        <span class="caption">{{ $t('walletTransfer.transactionFee') }}</span>
      </v-col>
      <v-col cols="9">
        <v-row v-if="!isAdvanceOption" class="mx-n2" cols="12">
          <v-col v-if="fastestGasPrice.gt('0')" class="px-2 mb-1">
            <div
              class="btn-speed text-center elevation-3"
              :class="[speedSelected === 'average' ? 'selected' : '', isDarkMode ? 'theme--dark' : '', isConfirm ? 'is-confirm' : '']"
              @click="selectSpeed('average', averageGasPrice)"
            >
              <div class="d-flex">
                <img
                  :src="require(`../../../assets/img/icons/speed-bicycle${isDarkMode ? '-dark' : ''}.svg`)"
                  class="mr-2 ml-auto"
                  alt="Average Speed Icon"
                />
                <div class="mr-auto">
                  <div class="btn-speed__speed">~ {{ averageGasPriceSpeed }} {{ $t('walletTransfer.minute') }}</div>
                  <div class="btn-speed__price">{{ getGasDisplayString(averageGasPrice) }}</div>
                </div>
              </div>
            </div>
          </v-col>
          <v-col :cols="fastestGasPrice.gt('0') ? '6' : '12'" class="px-2 mb-1">
            <div
              class="btn-speed text-center elevation-3"
              :class="[speedSelected === 'fastest' ? 'selected' : '', isDarkMode ? 'v-theme--dark' : '', isConfirm ? 'is-confirm' : '']"
              @click="selectSpeed('fastest', fastestGasPrice)"
            >
              <div class="d-flex">
                <img
                  :src="require(`../../../assets/img/icons/speed-car${isDarkMode ? '-dark' : ''}.svg`)"
                  class="mr-2 ml-auto"
                  alt="Fastest Speed Icon"
                />
                <div class="mr-auto">
                  <div class="btn-speed__speed">~ {{ fastestGasPriceSpeed }} {{ $t('walletTransfer.minute') }}</div>
                  <div class="btn-speed__price">{{ getGasDisplayString(fastestGasPrice) }}</div>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
        <v-row v-if="isAdvanceOption" align-center>
          <v-col cols="12">
            <v-text-field :value="getEthAmountDisplay(gas, activeGasPrice)" variant="outlined" readonly hide-details></v-text-field>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" class="text-right">
        <a v-if="isAdvanceOption" class="text-torusBrand1 caption" @click="resetAdvanceOption">
          {{ $t('walletTransfer.reset') }}
        </a>
        <TransferAdvanceOption
          v-else
          :symbol="symbol"
          :display-amount="displayAmount"
          :gas="gas"
          :active-gas-price="activeGasPrice"
          :is-confirm="isConfirm"
          :currency-multiplier="currencyMultiplier"
          :currency-multiplier-eth="currencyMultiplierEth"
          :contract-type="contractType"
          :network-ticker="networkTicker"
          :network-host="networkHost"
          :nonce="nonce"
          @onSave="onSaveAdvanceOptions"
        />
      </v-col>
    </v-row>
  </v-col>
  <v-col v-else cols="12" class="mb-3">
    <v-row>
      <v-col class="body-2 mb-2">
        <span>
          {{ $t('walletTransfer.transferFee') }}
        </span>
        <TransferAdvanceOption
          :symbol="symbol"
          :display-amount="displayAmount"
          :gas="gas"
          :active-gas-price="activeGasPrice"
          :selected-currency="selectedCurrency"
          :currency-multiplier="currencyMultiplier"
          :currency-multiplier-eth="currencyMultiplierEth"
          :contract-type="contractType"
          :network-ticker="networkTicker"
          :nonce="nonce"
          @onSave="onSaveAdvanceOptions"
        />
      </v-col>
    </v-row>
    <v-row v-if="!isAdvanceOption" class="mx-n2" cols="12">
      <v-col v-if="fastestGasPrice.gt('0')" cols="6" class="px-2 mb-1">
        <div
          class="btn-speed text-center elevation-3"
          :class="[speedSelected === 'average' ? 'selected' : '', isDarkMode ? 'v-theme--dark' : '']"
          tabindex="0"
          @click="selectSpeed('average', averageGasPrice)"
        >
          <div class="d-flex">
            <img
              :src="require(`../../../assets/img/icons/speed-bicycle${isDarkMode ? '-dark' : ''}.svg`)"
              class="mr-2 ml-auto"
              alt="Average Speed Icon"
            />
            <div class="mr-auto">
              <div class="btn-speed__speed">~ {{ averageGasPriceSpeed }} {{ $t('walletTransfer.minute') }}</div>
              <div class="btn-speed__price">{{ getGasDisplayString(averageGasPrice) }}</div>
            </div>
          </div>
        </div>
      </v-col>
      <v-col :cols="fastestGasPrice.gt('0') ? '6' : '12'" class="px-2 mb-1">
        <div
          class="btn-speed text-center elevation-3"
          :class="[speedSelected === 'fastest' ? 'selected' : '', isDarkMode ? 'v-theme--dark' : '']"
          tabindex="0"
          @click="selectSpeed('fastest', fastestGasPrice)"
        >
          <div class="d-flex">
            <img
              :src="require(`../../../assets/img/icons/speed-car${isDarkMode ? '-dark' : ''}.svg`)"
              class="mr-2 ml-auto"
              alt="Fastest Speed Icon"
            />
            <div class="mr-auto">
              <div class="btn-speed__speed">~ {{ fastestGasPriceSpeed }} {{ $t('walletTransfer.minute') }}</div>
              <div class="btn-speed__price">{{ getGasDisplayString(fastestGasPrice) }}</div>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
    <v-row v-if="isAdvanceOption" class="align-center">
      <v-col cols="8" class="mb-1">
        <div class="text-subtitle-2 font-weight-bold">
          {{ getEthAmountDisplay(gas, activeGasPrice) }}
          <span class="caption text-text_2">( ~ {{ getGasDisplayString(activeGasPrice) }} )</span>
        </div>
      </v-col>
      <v-col cols="4" class="text-right">
        <v-btn id="adv-reset-btn" outlined color="torusBrand1" @click="resetAdvanceOption">{{ $t('walletTransfer.reset') }}</v-btn>
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
import BigNumber from 'bignumber.js'
import log from 'loglevel'

import torus from '../../../torus'
import { CONTRACT_TYPE_ETH, MAINNET } from '../../../utils/enums'
import { significantDigits } from '../../../utils/utils'
import TransferAdvanceOption from '../TransferAdvanceOption'

export default {
  components: {
    TransferAdvanceOption,
  },
  props: {
    gas: { type: BigNumber, default: new BigNumber('0') },
    displayAmount: { type: BigNumber, default: new BigNumber('0') },
    activeGasPriceConfirm: {
      type: BigNumber,
      default: undefined,
    },
    symbol: {
      type: String,
      default: '',
    },
    resetSpeed: {
      type: Boolean,
    },
    selectedCurrency: {
      type: String,
      default: 'USD',
    },
    currencyMultiplier: {
      type: BigNumber,
      default: new BigNumber('0'),
    },
    currencyMultiplierEth: {
      type: BigNumber,
      default: new BigNumber('0'),
    },
    isConfirm: {
      type: Boolean,
      default: false,
    },
    contractType: {
      type: String,
      default: CONTRACT_TYPE_ETH,
    },
    nonce: {
      type: Number,
      default: 0,
    },
    networkTicker: {
      type: String,
      default: '',
    },
    networkHost: {
      type: String,
      default: MAINNET,
    },
  },
  data() {
    return {
      isAdvanceOption: false,
      speedSelected: '',
      averageGasPrice: new BigNumber('5'),
      fastestGasPrice: new BigNumber('20'),
      activeGasPrice: new BigNumber('5'),
      averageGasPriceSpeed: 3.7,
      fastestGasPriceSpeed: 0.5,
      isUpdating: false,
    }
  },
  computed: {
    isDarkMode() {
      return this.$vuetify.theme.current.dark
    },
  },
  watch: {
    resetSpeed(value) {
      if (value && !this.isUpdating) {
        this.speedSelected = 'average'
        this.resetAdvanceOption()
      }
    },
    networkHost(newValue, oldValue) {
      if (newValue && newValue !== oldValue) {
        this.setGasPrices()
      }
    },
  },
  async mounted() {
    await this.setGasPrices()
  },
  methods: {
    async setGasPrices() {
      try {
        this.isUpdating = true
        log.info('setting gas prices for ', this.networkHost)
        if (this.networkHost === MAINNET) {
          const resp = await fetch('https://ethgasstation.info/json/ethgasAPI.json', {
            headers: {},
            referrer: 'http://ethgasstation.info/json/',
            referrerPolicy: 'no-referrer-when-downgrade',
            body: null,
            method: 'GET',
            mode: 'cors',
          })
          const {
            average: averageTimes10,
            avgWait,
            // block_time: blockTime,
            // blockNum,
            fastest: fastestTimes10,
            fastestWait,
            // safeLow: safeLowTimes10,
            // safeLowWait,
            // speed
          } = await resp.json()

          this.averageGasPrice = new BigNumber(averageTimes10).div(new BigNumber('10'))
          this.fastestGasPrice = new BigNumber(fastestTimes10).div(new BigNumber('10'))
          this.averageGasPriceSpeed = avgWait
          this.fastestGasPriceSpeed = fastestWait
        } else {
          const gasPrice = await torus.web3.eth.getGasPrice()
          log.info(gasPrice)
          this.averageGasPrice = new BigNumber(gasPrice).div(new BigNumber(10).pow(new BigNumber(9)))
          this.fastestGasPrice = this.averageGasPrice.gt(0) ? this.averageGasPrice.plus(new BigNumber('5')) : this.averageGasPrice
        }
        // Set selected gas price from confirm
        if (this.activeGasPriceConfirm) {
          this.setSelectedSpeed()
        } else if (this.fastestGasPrice.eq('0')) {
          this.selectSpeed('fastest', this.fastestGasPrice)
        } else {
          this.selectSpeed('average', this.averageGasPrice)
        }
      } catch (error) {
        log.error(error)
        this.selectSpeed('average', this.averageGasPrice)
      } finally {
        this.isUpdating = false
      }
    },
    onSaveAdvanceOptions(details) {
      this.activeGasPrice = details.advancedActiveGasPrice

      this.isAdvanceOption = true
      this.updateCosts(false, details)
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
      return `${this.$t('walletTransfer.pay')} ${significantDigits(currencyFee.toString())} ${this.selectedCurrency}`
    },
    getGasAmount(gasPrice) {
      const ethFee = this.getEthAmount(this.gas, gasPrice)
      return ethFee.times(this.currencyMultiplierEth)
    },
    getEthAmount(gas, gasPrice) {
      return gas.times(gasPrice).div(new BigNumber(10).pow(new BigNumber(9)))
    },
    getEthAmountDisplay(gas, gasPrice) {
      return `${significantDigits(this.getEthAmount(gas, gasPrice).toString())} ${this.networkTicker}`
    },
    updateCosts(isReset, details) {
      const { advancedGas, nonce } = details || {}
      const speed = this.speedSelected === 'average' ? this.averageGasPriceSpeed : this.fastestGasPriceSpeed
      this.$emit('onSelectSpeed', {
        speedSelected: this.speedSelected,
        activeGasPrice: this.activeGasPrice,
        speed,
        isReset: !!isReset,
        gas: advancedGas || this.gas,
        nonce,
        isAdvanceOption: this.isAdvanceOption,
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
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'TransactionSpeedSelect.scss';
</style>
