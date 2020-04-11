<template>
  <v-card class="advance-option">
    <v-card-text class="text_1--text py-12">
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
        <v-btn id="confirm-transfer-btn" large color="primary" class="ml-4" type="button" @click="onConfirm">
          {{ t('walletTransfer.confirm') }}
        </v-btn>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
import BigNumber from 'bignumber.js'

import { significantDigits } from '../../../utils/utils'

export default {
  props: {
    toAddress: {
      type: String,
      default: '0x',
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
