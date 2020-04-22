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
            <div class="icon-box elevation-3">
              <v-icon size="20" class="torusGray1--text">{{ `$vuetify.icons.${userInfo.verifier}` }}</v-icon>
            </div>
          </div>

          <div class="flex-grow-1">
            <v-divider></v-divider>
          </div>

          <div class="d-flex icon-container icon-container--right align-center">
            <div class="icon-box elevation-3">
              <v-icon size="20" class="torusGray1--text">{{ `$vuetify.icons.${toVerifier}` }}</v-icon>
            </div>
          </div>
        </div>
      </v-flex>
      <v-flex xs12>
        <div class="d-flex transfer-to-from__details">
          <div class="name text-clamp-one">
            {{ userInfo.verifierId }}
          </div>
          <div class="network-container">
            <NetworkDisplay :is-plain="true" :store-network-type="storeNetworkType"></NetworkDisplay>
          </div>
          <div class="name name--right text-clamp-one">
            {{ toAddress }}
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
    <!-- <v-card-text class="py-12">
      <v-layout wrap>
        <v-flex xs12 px-4>
          <div class="font-weight-bold headline">{{ t('walletTransfer.transferConfirm') }}</div>
        </v-flex>
        <v-flex xs12 mt-4>
          <v-layout wrap>
            <v-flex xs12 px-4 pb-4>
              <div class="subtitle-2">{{ t('walletTransfer.sendingTo') }}:</div>
              <v-divider class="my-1" />
              <div class="caption text_2--text">{{ toAddress }}</div>
            </v-flex>
            <v-flex xs12 px-4 pb-4>
              <div class="subtitle-2">{{ isNonFungibleToken ? t('walletTransfer.assetToSend') : t('walletTransfer.amountToSend') }}:</div>
              <v-divider class="my-1" />
              <div v-if="isNonFungibleToken" class="mt-2">
                <img class="mr-2 float-left" :src="assetSelected.image" height="24px" />
                {{ assetSelected.name }}
              </div>
              <div v-else>
                <div class="float-right text-right">
                  <div class="body-1 font-weight-bold">{{ displayAmount }}</div>
                  <div class="caption text_2--text">{{ convertedAmount }}</div>
                </div>
              </div>
            </v-flex>
            <v-flex xs12 px-4 pb-4>
              <div class="subtitle-2">{{ t('walletTransfer.transferFee') }}:</div>
              <v-divider class="my-1" />
              <div>
                <div class="float-right text-right">
                  <div class="body-1 font-weight-bold">~ {{ speedSelected }} Mins</div>
                  <div class="caption text_2--text">{{ transactionFee }} {{ selectedCurrency }}</div>
                </div>
              </div>
            </v-flex>
            <v-flex>
              <div v-if="sendEthToContractError" class="float-right text-right red--text">
                It looks like you're sending ETH to a Contract. Gas Estimation is incorrect and some ETH may be left
              </div>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
      <v-layout mt-4 pr-4>
        <v-spacer></v-spacer>
        <v-btn large text @click="onCancel">{{ t('walletTransfer.cancel') }}</v-btn>
        <v-btn id="confirm-transfer-btn" large color="torusBrand1" class="ml-4 white--text" type="button" @click="onConfirm">
          {{ t('walletTransfer.confirm') }}
        </v-btn>
      </v-layout>
    </v-card-text> -->
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
  },
  computed: {
    storeNetworkType() {
      return this.$store.state.networkType
    },
    userInfo() {
      return this.$store.state.userInfo
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
