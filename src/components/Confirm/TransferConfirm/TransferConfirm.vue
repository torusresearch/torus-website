<template>
  <v-card class="confirm-transaction">
    <v-row py-6 class="elevation-1">
      <v-col cols="12" class="text-center">
        <img class="home-link mr-1" alt="Torus Logo" :height="getLogo.isExternal ? 70 : 24" :src="getLogo.logo" />
        <div class="headline">{{ $t('walletTransfer.confirmTransaction') }}</div>
      </v-col>
    </v-row>
    <v-row class="py-3 px-6" wrap>
      <v-col cols="12">
        <div class="d-flex transfer-to-from align-center">
          <div class="d-flex icon-container align-center">
            <div class="icon-box elevation-3" :class="{ isDark: isDarkMode }">
              <v-icon size="20" class="text-torusGray1">
                {{ `$${fromVerifier === ETH ? 'account' : fromVerifier.toLowerCase()}` }}
              </v-icon>
            </div>
          </div>

          <div class="flex-grow-1">
            <v-divider></v-divider>
          </div>

          <div class="d-flex icon-container icon-container--right align-center">
            <div class="icon-box elevation-3" :class="{ isDark: isDarkMode }">
              <div v-if="dappName !== ''" class="v-icon dapp-icon text-torusGray1">DApp</div>

              <v-tooltip v-else location="bottom">
                <template #activator="{ props }">
                  <v-badge color="torusBrand1" offset-x="10" offset-y="20" overlap :value="toVerifier === TWITTER && !checkedTwitter">
                    <template #badge>
                      <span class="font-weight-bold twitter-badge" v-bind="props">?</span>
                    </template>
                    <a icon class="link-box text-torusGray1" :href="toVeriferUrl" target="_blank" @click="checkedTwitter = true">
                      <v-icon size="20" class="text-torusGray1">
                        {{ `$${toVerifier === ETH ? 'account' : toVerifier.toLowerCase()}` }}
                      </v-icon>
                    </a>
                  </v-badge>
                </template>
                <span>
                  <div class="text-text_2 twitter-note">{{ $t('walletTransfer.twitterVerifyNote') }}</div>
                </span>
              </v-tooltip>
            </div>
          </div>
        </div>
      </v-col>
      <v-col cols="12">
        <div class="d-flex transfer-to-from__details">
          <div class="name">
            <div class="text-clamp-one">{{ fromVerifierId }}</div>
            <ShowToolTip :address="fromAddress">
              <div class="name--address">{{ addressSlicer(fromAddress) }}</div>
            </ShowToolTip>
          </div>
          <div class="network-container flex-grow-1" :class="{ isMobile: $vuetify.display.xs }">
            <NetworkDisplay :is-plain="true" :store-network-type="networkType"></NetworkDisplay>
          </div>
          <div class="name name--right">
            <div class="text-clamp-one">{{ dappName === '' ? (toVerifier === ETH ? 'ETH Address' : toVerifierId) : dappName }}</div>
            <ShowToolTip :address="toAddress">
              <div class="name--address">{{ addressSlicer(toAddress) }}</div>
            </ShowToolTip>
          </div>
        </div>
      </v-col>
    </v-row>
    <v-divider class="mx-6 my-3"></v-divider>
    <v-row class="mx-6 py-3" wrap>
      <v-col cols="12">
        <div class="d-flex align-start justify-space-between" :class="isNonFungibleToken ? 'align-center' : 'align-start'">
          <div :style="{ lineHeight: '0px' }">
            <span class="caption">{{ isNonFungibleToken ? $t('walletTransfer.assetToSend') : $t('walletTransfer.amountToSend') }}</span>
          </div>
          <div v-if="isNonFungibleToken" class="ml-auto caption d-flex align-center text-right" :style="{ maxWidth: '200px' }">
            <span class="mr-2">{{ assetSelected.name }}</span>
            <img :src="assetSelected.image" height="30px" :alt="assetSelected.name" />
          </div>
          <div v-else class="ml-auto">
            <div class="caption text-right font-weight-medium">{{ displayAmount }}</div>
            <div class="caption-2 text-right">{{ convertedAmount }}</div>
          </div>
        </div>
      </v-col>
      <v-col cols="12" class="mt-10">
        <div class="d-flex align-start">
          <div :style="{ lineHeight: '0px' }">
            <span class="caption">{{ isEip1559 ? $t('walletTransfer.fee-max-transaction') : $t('walletTransfer.transferFee') }}</span>
          </div>
          <div class="ml-auto">
            <div class="caption text-right font-weight-medium">{{ transactionFeeDisplay }} {{ selectedCurrency }}</div>
            <div class="caption-2 text-right">({{ `${isEip1559 ? londonSpeedTiming : `~ ${speedSelected} ${$t('walletTransfer.minute')}`}` }})</div>
          </div>
        </div>
        <div v-if="gasEstimateFailed" class="caption text-right mt-1">
          <v-icon size="x-small" class="text-error mr-1">alert</v-icon>
          <span class="text-error">{{ $t('walletTransfer.gasEstimateFail') }}</span>
        </div>
      </v-col>
    </v-row>
    <v-divider class="mx-6 my-3"></v-divider>
    <v-row class="mx-6 py-3" wrap>
      <v-col cols="12">
        <div class="d-flex align-start">
          <div :style="{ lineHeight: '0px' }">
            <span class="text-subtitle-2">{{ $t('walletTransfer.totalCost') }}</span>
          </div>
          <div class="ml-auto">
            <div class="text-subtitle-2 text-right">{{ isNonFungibleToken ? `${transactionFeeEthDisplay} ETH` : totalCost }}</div>
            <div class="caption-2 text-right">{{ isNonFungibleToken ? `${transactionFee} ${selectedCurrency}` : totalCostConverted }}</div>
            <div v-if="insufficientFunds" class="caption text-error">{{ $t('walletTransfer.insufficient') }}</div>
          </div>
        </div>
      </v-col>
    </v-row>

    <v-row wrap class="mx-6">
      <v-col cols="12" class="my-10">
        <v-row class="mx-n2">
          <v-col cols="6" class="px-2">
            <v-btn block size="large" variant="text" @click="onCancel">{{ $t('walletTransfer.cancel') }}</v-btn>
          </v-col>
          <v-col cols="6" class="px-2">
            <v-btn
              id="confirm-transfer-btn"
              block
              size="large"
              color="torusBrand1"
              class="text-white"
              type="button"
              :disabled="insufficientFunds"
              @click="onConfirm"
            >
              {{ $t('walletTransfer.confirm') }}
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import BigNumber from 'bignumber.js'
import { mapGetters } from 'vuex'

import { CONTRACT_TYPE_ETH, ETH, GITHUB, MAINNET, REDDIT, TWITTER } from '../../../utils/enums'
import { addressSlicer, significantDigits } from '../../../utils/utils'
import NetworkDisplay from '../../helpers/NetworkDisplay'
import ShowToolTip from '../../helpers/ShowToolTip'

export default {
  components: { NetworkDisplay, ShowToolTip },
  props: {
    convertedVerifierId: {
      type: String,
      default: '',
    },
    toAddress: {
      type: String,
      default: '0x',
    },
    toVerifier: {
      type: String,
      default: 'eth',
    },
    toVerifierId: {
      type: String,
      default: '',
    },
    fromAddress: {
      type: String,
      default: '0x',
    },
    fromVerifier: {
      type: String,
      default: 'eth',
    },
    fromVerifierId: {
      type: String,
      default: '',
    },
    selectedCurrency: {
      type: String,
      default: 'USD',
    },
    convertedAmount: {
      type: String,
      default: '~ 0.00 USD',
    },
    displayAmount: {
      type: String,
      default: '~ 0.00 ETH',
    },
    speedSelected: {
      type: Number,
      default: 0,
    },
    transactionFee: {
      type: BigNumber,
      default: new BigNumber('0'),
    },
    transactionFeeEth: {
      type: BigNumber,
      default: new BigNumber('0'),
    },
    assetSelected: {
      type: Object,
      default() {
        return {
          image: '',
          name: '',
        }
      },
    },
    isNonFungibleToken: Boolean,
    sendEthToContractError: Boolean,
    totalCost: {
      type: String,
      default: '',
    },
    totalCostConverted: {
      type: String,
      default: '',
    },
    networkType: {
      type: Object,
      default() {
        return { host: MAINNET, networkName: '', chainId: '' }
      },
    },
    dappName: {
      type: String,
      default: '',
    },
    itemBalance: {
      type: BigNumber,
      default: new BigNumber('0'),
    },
    ethBalance: {
      type: BigNumber,
      default: new BigNumber('0'),
    },
    totalCostBn: {
      type: BigNumber,
      default: new BigNumber('0'),
    },
    contractType: {
      type: String,
      default: CONTRACT_TYPE_ETH,
    },
    isEip1559: {
      type: Boolean,
      default: false,
    },
    londonSpeedTiming: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      ETH,
      TWITTER,
      checkedTwitter: false,
    }
  },
  computed: {
    ...mapGetters(['getLogo']),
    toVeriferUrl() {
      if (this.toVerifier === TWITTER) {
        return `https://twitter.com/i/user/${this.convertedVerifierId.split('|')[1]}`
      }
      if (this.toVerifier === GITHUB) {
        return `https://github.com/${this.toVerifierId}`
      }
      if (this.toVerifier === REDDIT) {
        return `https://reddit.com/user/${this.toVerifierId}`
      }
      return ''
    },
    insufficientFunds() {
      return this.contractType === CONTRACT_TYPE_ETH ? this.totalCostBn.gt(this.itemBalance) : this.transactionFeeEth.gt(this.ethBalance)
    },
    gasEstimateFailed() {
      return this.transactionFee.isZero()
    },
    transactionFeeEthDisplay() {
      return significantDigits(this.transactionFeeEth, false, 6)
    },
    transactionFeeDisplay() {
      return significantDigits(this.transactionFee)
    },
    isDarkMode() {
      return this.$vuetify.them.name === 'dark'
    },
  },
  methods: {
    onCancel() {
      this.checkedTwitter = false
      this.$emit('onClose')
    },
    onConfirm() {
      this.$emit('onConfirm')
      this.$emit('onClose')
    },
    significantDigits,
    addressSlicer,
  },
}
</script>

<style lang="scss" scoped>
@import 'TransferConfirm.scss';
</style>
