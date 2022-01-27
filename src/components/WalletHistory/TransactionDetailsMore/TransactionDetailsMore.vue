<template>
  <v-layout class="mt-3" wrap>
    <v-flex xs12 class="activity-details" :class="{ isMobile: $vuetify.breakpoint.xsOnly }">
      <div class="caption">
        <div class="text_1--text d-flex mb-2">
          <div class="details-label d-flex mr-6">
            <span>{{ t('walletActivity.startedAt') }}</span>
            <span class="ml-auto">:</span>
          </div>
          <div class="details-value">
            <span>{{ transaction.timeFormatted }} - {{ transaction.dateFormatted }}</span>
          </div>
        </div>
        <div class="text_1--text d-flex mb-2">
          <div class="details-label d-flex mr-6">
            <span>{{ transaction.action === ACTIVITY_ACTION_SEND ? t('walletActivity.sendTo') : t('walletActivity.receiveFrom') }}</span>
            <span class="ml-auto">:</span>
          </div>
          <div class="details-value">
            <span>{{ transaction.action === ACTIVITY_ACTION_SEND ? transaction.to : transaction.from }}</span>
          </div>
        </div>
        <div v-if="transaction.type !== CONTRACT_TYPE_ERC721 && transaction.type !== CONTRACT_TYPE_ERC1155" class="text_1--text d-flex mb-2">
          <div class="details-label d-flex mr-6">
            <span>{{ t('walletActivity.rate') }}</span>
            <span class="ml-auto">:</span>
          </div>
          <div class="details-value">
            <span>
              {{
                transaction.isEtherscan || !transaction.ethRate
                  ? t('walletActivity.unavailable')
                  : `${transaction.ethRate} ${transaction.currencyUsed}`
              }}
            </span>
          </div>
        </div>
        <div v-if="transaction.type !== CONTRACT_TYPE_ERC721 && transaction.type !== CONTRACT_TYPE_ERC1155" class="text_1--text d-flex mb-2">
          <div class="details-label d-flex mr-6">
            <span>{{ t('walletActivity.amount') }}</span>
            <span class="ml-auto">:</span>
          </div>
          <div class="details-value amount-text">
            {{ transaction.totalAmountString }} {{ transaction.currencyAmountString ? `/${transaction.currencyAmountString}` : '' }}
          </div>
        </div>
        <div class="text_1--text d-flex mb-2">
          <div class="details-label d-flex mr-6">
            <span>{{ t('walletActivity.network') }}</span>
            <span class="ml-auto">:</span>
          </div>
          <div class="details-value">
            <NetworkDisplay :minimal="true" :network="transaction.networkType" :store-network-type="networkType"></NetworkDisplay>
          </div>
        </div>
      </div>
      <v-layout wrap class="mt-8">
        <v-flex xs12 sm6>
          <div v-if="transaction.hasCancel" class="caption">
            <div class="text_1--text d-flex mb-2">
              <div class="details-label d-flex mr-6">
                <span>{{ t('walletActivity.cancelDate') }}</span>
                <span class="ml-auto">:</span>
              </div>
              <div class="details-value">{{ transaction.cancelDateInitiated }}</div>
            </div>
            <!-- <div class="text_1--text d-flex mb-2">
              <div class="details-label d-flex mr-6">
                <span>Cancellation fee</span> 
                <span class="ml-auto">:</span>
              </div>
              <div class="details-value">{{ cancellationFee }}</div>
            </div> -->
          </div>
        </v-flex>
        <v-flex v-if="transaction.etherscanLink || transaction.statusText === ACTIVITY_STATUS_PENDING" xs12 sm6 class="text-right mt-4 mt-sm-0">
          <v-layout :class="{ 'd-inline-flex': !$vuetify.breakpoint.xsOnly }">
            <v-flex>
              <v-tooltip top>
                <template #activator="{ on }">
                  <span v-on="on">
                    <v-btn
                      v-if="transaction.statusText === ACTIVITY_STATUS_PENDING"
                      class="text_2--text"
                      :class="{ 'mr-2': !$vuetify.breakpoint.xsOnly }"
                      :block="$vuetify.breakpoint.xsOnly"
                      text
                      @click.stop="showCancelTransaction"
                    >
                      {{ t('walletActivity.cancelButton') }}
                    </v-btn>
                  </span>
                </template>
                <span>
                  <div class="caption text_3--text text-justify">{{ t('walletActivity.cancelButtonTooltip') }} {{ cancellationFeeEstimate }}</div>
                </span>
              </v-tooltip>
            </v-flex>
            <v-flex>
              <v-btn
                v-if="transaction.etherscanLink"
                class="torus-btn1"
                :block="$vuetify.breakpoint.xsOnly"
                :class="$store.state.whiteLabel.isActive ? 'white--text' : 'torusBrand1--text'"
                :color="$store.state.whiteLabel.isActive ? 'torusBrand1' : ''"
                :href="transaction.etherscanLink"
                target="_blank"
                rel="noreferrer noopener"
                @click.stop
              >
                {{ t('walletActivity.viewOnEtherscan') }}
              </v-btn>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'

import { ACTIVITY_ACTION_SEND, ACTIVITY_STATUS_PENDING, CONTRACT_TYPE_ERC721, CONTRACT_TYPE_ERC1155 } from '../../../utils/enums'
import NetworkDisplay from '../../helpers/NetworkDisplay'

export default {
  components: { NetworkDisplay },
  props: {
    transaction: {
      type: Object,
      default() {
        return {}
      },
    },
    cancellationFeeEstimate: {
      type: String,
      default: '',
    },
    cancellationFee: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      ACTIVITY_ACTION_SEND,
      ACTIVITY_STATUS_PENDING,
      CONTRACT_TYPE_ERC721,
      CONTRACT_TYPE_ERC1155,
    }
  },
  computed: {
    ...mapState(['networkType']),
  },
  methods: {
    showCancelTransaction() {
      this.$emit('showCancelTransaction')
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'TransactionDetailsMore.scss';
</style>
