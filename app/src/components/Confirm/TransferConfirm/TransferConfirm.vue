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
        <div class="headline">{{ /** t('walletTransfer.transferConfirm') */ }}Confirm Transaction</div>
      </v-flex>
    </v-layout>
    <v-layout py-3 px-6 wrap>
      <v-flex xs12>
        <div class="d-flex transfer-to-from align-center">
          <div class="d-flex icon-container align-center">
            <div class="icon-box elevation-3" :class="{ isDark: $vuetify.theme.isDark }">
              <v-icon size="20" class="torusGray1--text">
                {{ `$vuetify.icons.${fromVerifier.toLowerCase() === 'eth' ? 'account' : fromVerifier.toLowerCase()}` }}
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
                {{ `$vuetify.icons.${toVerifier.toLowerCase() === 'eth' ? 'account' : toVerifier.toLowerCase()}` }}
              </v-icon>
            </div>
          </div>
        </div>
      </v-flex>
      <v-flex xs12>
        <div class="d-flex transfer-to-from__details">
          <div class="name text-clamp-one">
            {{ fromAddress }}
          </div>
          <div class="network-container">
            <NetworkDisplay :is-plain="true" :store-network-type="networkType"></NetworkDisplay>
          </div>
          <div class="name name--right" :class="{ textClampOne: dappName !== '' }">
            {{ dappName === '' ? toAddress : dappName }}
          </div>
        </div>
      </v-flex>
    </v-layout>
    <v-divider class="mx-6 my-3"></v-divider>
    <v-layout mx-6 py-3 wrap>
      <v-flex xs12>
        <div class="d-flex align-start">
          <div :style="{ lineHeight: '0px' }">
            <span class="caption">{{ isNonFungibleToken ? t('walletTransfer.assetToSend') : t('walletTransfer.amountToSend') }}</span>
          </div>
          <div class="ml-auto">
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
            <div class="caption text-right font-weight-medium">
              {{ transactionFee }} {{ selectedCurrency }}
              <span class="caption-2">(~ {{ speedSelected }} Mins)</span>
            </div>
          </div>
        </div>
      </v-flex>
    </v-layout>
    <v-divider class="mx-6 my-3"></v-divider>
    <v-layout mx-6 py-3 wrap>
      <v-flex xs12>
        <div class="d-flex align-start">
          <div :style="{ lineHeight: '0px' }">
            <span class="subtitle-2">Total Cost</span>
          </div>
          <div class="ml-auto">
            <div class="subtitle-2 text-right">{{ totalCost }}</div>
            <div class="caption-2 text-right">{{ totalCostConverted }}</div>
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

import { significantDigits } from '../../../utils/utils'
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
    fromAddress: {
      type: String,
      default: '0x',
    },
    fromVerifier: {
      type: String,
      default: 'eth',
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
      type: String,
      default: '',
    },
    dappName: {
      type: String,
      default: '',
    },
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
  },
}
</script>

<style lang="scss" scoped>
@import 'TransferConfirm.scss';
</style>
