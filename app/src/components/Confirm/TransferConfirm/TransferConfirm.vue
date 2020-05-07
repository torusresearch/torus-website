<template>
  <v-card class="confirm-transaction">
    <v-layout py-6 class="elevation-1">
      <v-flex xs12 text-center>
        <img
          class="home-link mr-1"
          alt="Torus Logo"
          width="135"
          height="30"
          :src="require(`../../../../public/images/torus-logo-${$vuetify.theme.dark ? 'white' : 'blue'}.svg`)"
        />
        <div class="headline">{{ t('walletTransfer.confirmTransaction') }}</div>
      </v-flex>
    </v-layout>
    <v-layout py-3 px-6 wrap>
      <v-flex xs12>
        <div class="d-flex transfer-to-from align-center">
          <div class="d-flex icon-container align-center">
            <div class="icon-box elevation-3" :class="{ isDark: $vuetify.theme.isDark }">
              <v-icon size="20" class="torusGray1--text">
                {{ `$vuetify.icons.${fromVerifier === ETH ? 'account' : fromVerifier.toLowerCase()}` }}
              </v-icon>
            </div>
          </div>

          <div class="flex-grow-1">
            <v-divider></v-divider>
          </div>

          <div class="d-flex icon-container icon-container--right align-center">
            <div class="icon-box elevation-3" :class="{ isDark: $vuetify.theme.isDark }">
              <div v-if="dappName !== ''" class="v-icon dapp-icon torusGray1--text">DApp</div>
              <v-icon v-else size="20" class="torusGray1--text">
                {{ `$vuetify.icons.${toVerifier === ETH ? 'account' : toVerifier.toLowerCase()}` }}
              </v-icon>
            </div>
          </div>
        </div>
      </v-flex>
      <v-flex xs12>
        <div class="d-flex transfer-to-from__details">
          <div class="name">
            <div class="text-clamp-one">{{ fromVerifierId }}</div>
            <div class="name--address">{{ addressSlicer(fromAddress) }}</div>
          </div>
          <div class="network-container flex-grow-1" :class="{ isMobile: $vuetify.breakpoint.xsOnly }">
            <NetworkDisplay :is-plain="true" :store-network-type="networkType"></NetworkDisplay>
          </div>
          <div class="name name--right">
            <div class="text-clamp-one">{{ dappName === '' ? (toVerifier === ETH ? 'ETH Address' : toVerifierId) : dappName }}</div>
            <div class="name--address">{{ addressSlicer(toAddress) }}</div>
          </div>
        </div>
      </v-flex>
    </v-layout>
    <v-divider class="mx-6 my-3"></v-divider>
    <v-layout mx-6 py-3 wrap>
      <v-flex xs12>
        <div class="d-flex align-start justify-space-between" :class="isNonFungibleToken ? 'align-center' : 'align-start'">
          <div :style="{ lineHeight: '0px' }">
            <span class="caption">{{ isNonFungibleToken ? t('walletTransfer.assetToSend') : t('walletTransfer.amountToSend') }}</span>
          </div>
          <div v-if="isNonFungibleToken" class="ml-auto caption d-flex align-center text-right" :style="{ maxWidth: '200px' }">
            <span class="mr-2">{{ assetSelected.name }}</span>
            <img :src="assetSelected.image" height="30px" />
          </div>
          <div v-else class="ml-auto">
            <div class="caption text-right font-weight-medium">{{ displayAmount }}</div>
            <div class="caption-2 text-right">{{ convertedAmount }}</div>
          </div>
        </div>
      </v-flex>
      <v-flex xs12 mt-10>
        <div class="d-flex align-start">
          <div :style="{ lineHeight: '0px' }">
            <span class="caption">{{ t('walletTransfer.transferFee') }}</span>
          </div>
          <div class="ml-auto">
            <div class="caption text-right font-weight-medium">{{ transactionFee }} {{ selectedCurrency }}</div>
            <div class="caption-2 text-right">(~ {{ speedSelected }} {{ t('walletTransfer.minute') }})</div>
          </div>
        </div>
      </v-flex>
    </v-layout>
    <v-divider class="mx-6 my-3"></v-divider>
    <v-layout mx-6 py-3 wrap>
      <v-flex xs12>
        <div class="d-flex align-start">
          <div :style="{ lineHeight: '0px' }">
            <span class="subtitle-2">{{ t('walletTransfer.totalCost') }}</span>
          </div>
          <div class="ml-auto">
            <div class="subtitle-2 text-right">{{ isNonFungibleToken ? transactionFeeEth : totalCost }}</div>
            <div class="caption-2 text-right">{{ isNonFungibleToken ? `${transactionFee} ${selectedCurrency}` : totalCostConverted }}</div>
          </div>
        </div>
      </v-flex>
    </v-layout>

    <v-layout wrap mx-6>
      <v-flex xs12 my-10>
        <v-layout mx-n2>
          <v-flex xs6 px-2>
            <v-btn block large text @click="onCancel">{{ t('walletTransfer.cancel') }}</v-btn>
          </v-flex>
          <v-flex xs6 px-2>
            <v-btn id="confirm-transfer-btn" block large color="torusBrand1" class="white--text" type="button" @click="onConfirm">
              {{ t('walletTransfer.confirm') }}
            </v-btn>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
import BigNumber from 'bignumber.js'

import { ETH, MAINNET } from '../../../utils/enums'
import { addressSlicer, significantDigits } from '../../../utils/utils'
import NetworkDisplay from '../../helpers/NetworkDisplay'

export default {
  components: { NetworkDisplay },
  props: {
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
      type: String,
      default: '',
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
  },
  data() {
    return {
      ETH,
    }
  },
  methods: {
    onCancel() {
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
