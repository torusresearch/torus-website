<template>
  <v-card color="elevation-1 activity mb-4 pa-5" :ripple="false" @click="showDetails = !showDetails">
    <v-layout wrap mx-n4>
      <v-flex
        px-4
        :class="$vuetify.breakpoint.xsOnly ? 'order-2 pt-2' : 'order-0'"
        :style="{ marginLeft: $vuetify.breakpoint.xsOnly ? '48px' : '0', maxWidth: '105px' }"
      >
        <div class="caption text_1--text font-weight-medium">{{ transaction.dateFormatted }}</div>
        <div class="info text_2--text font-weight-light">{{ transaction.timeFormatted }}</div>
      </v-flex>
      <v-divider v-if="!$vuetify.breakpoint.xsOnly" vertical class="mx-4"></v-divider>
      <v-flex :class="$vuetify.breakpoint.xsOnly ? 'xs8 order-0 pr-4 pl-3' : 'xs4 order-1 pl-0 pr-4'">
        <div
          class="icon-holder float-left"
          :class="{
            circle: !(
              transaction.type === CONTRACT_TYPE_ERC20 ||
              transaction.action === ACTIVITY_ACTION_TOPUP ||
              transaction.type === CONTRACT_TYPE_ERC721
            ),
          }"
        >
          <img
            v-if="transaction.type === CONTRACT_TYPE_ERC20 || transaction.action === ACTIVITY_ACTION_TOPUP"
            :src="`../../../assets/images/${transaction.actionIcon}`"
            :alt="`${transaction.from} Icon`"
            class="mr-2 ml-2"
            width="36"
          />
          <img
            v-else-if="transaction.type === CONTRACT_TYPE_ERC721"
            :src="transaction.actionIcon"
            class="mr-3 ml-1"
            height="36"
            large
            :alt="`${transaction.from} Icon`"
          />
          <v-icon v-else class="float-left" size="24" color="torusBrand1">{{ transaction.actionIcon }}</v-icon>
        </div>
        <div class="caption text_1--text font-weight-medium">{{ transaction.actionText }}</div>
        <div class="info text_2--text font-weight-light">
          {{
            transaction.action === ACTIVITY_ACTION_SEND
              ? `${t('walletActivity.to')} ${transaction.slicedTo}`
              : `${t('walletActivity.from')} ${transaction.slicedFrom}`
          }}
        </div>
      </v-flex>
      <v-flex class="text-right" :class="$vuetify.breakpoint.xsOnly ? 'xs4 order-1' : 'xs2 order-2'" px-4>
        <div class="caption text_1--text font-weight-medium">
          <span v-if="transaction.type !== CONTRACT_TYPE_ERC721 && transaction.action === ACTIVITY_ACTION_SEND" class="error--text">-</span>
          {{ transaction.totalAmountString }}
        </div>
        <div class="info text_2--text font-weight-light">{{ transaction.currencyAmountString }}</div>
      </v-flex>
      <v-flex v-if="!$vuetify.breakpoint.smAndDown" class="order-3" xs2></v-flex>
      <v-flex :class="$vuetify.breakpoint.xsOnly ? 'xs6 ml-auto text-right mt-3 order-3' : 'xs2 ml-auto text-right order-4'" px-4>
        <v-chip class="status-chip black--text" :color="getChipColor(transaction.statusText)" small>
          {{ t(transaction.statusText) }}
        </v-chip>
      </v-flex>
    </v-layout>
    <v-divider v-if="showDetails" class="mt-2"></v-divider>
    <v-layout v-if="showDetails" wrap>
      <v-flex xs12 class="activity-details" :class="{ isMobile: $vuetify.breakpoint.xsOnly }">
        <v-list class="mx-n4 caption">
          <v-list-item>
            <v-list-item-content class="details-label text_1--text">
              <div class="d-flex">
                <span>{{ t('walletActivity.startedAt') }}</span>
                <span class="ml-auto">:</span>
              </div>
            </v-list-item-content>
            <v-list-item-content class="details-value text_2--text">
              <span>{{ transaction.timeFormatted }} - {{ transaction.dateFormatted }}</span>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content class="details-label text_1--text">
              <div class="d-flex">
                <span>{{ transaction.action === ACTIVITY_ACTION_SEND ? t('walletActivity.sendTo') : t('walletActivity.receiveFrom') }}</span>
                <span class="ml-auto">:</span>
              </div>
            </v-list-item-content>
            <v-list-item-content class="details-value text_2--text">
              <span>{{ transaction.action === ACTIVITY_ACTION_SEND ? transaction.to : transaction.from }}</span>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-if="transaction.type !== CONTRACT_TYPE_ERC721">
            <v-list-item-content class="details-label text_1--text">
              <div class="d-flex">
                <span>{{ t('walletActivity.rate') }}</span>
                <span class="ml-auto">:</span>
              </div>
            </v-list-item-content>
            <v-list-item-content class="details-value text_2--text">
              <span>{{ transaction.ethRate }} {{ transaction.currencyUsed }}</span>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-if="transaction.type !== CONTRACT_TYPE_ERC721">
            <v-list-item-content class="details-label text_1--text">
              <div class="d-flex">
                <span>{{ t('walletActivity.amount') }}</span>
                <span class="ml-auto">:</span>
              </div>
            </v-list-item-content>
            <v-list-item-content class="details-value text_2--text amount-text">
              {{ transaction.totalAmountString }} /{{ transaction.currencyAmountString }}
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content class="details-label text_1--text">
              <div class="d-flex">
                <span>{{ t('walletActivity.network') }}</span>
                <span class="ml-auto">:</span>
              </div>
            </v-list-item-content>
            <v-list-item-content class="details-value text_2--text">
              <NetworkDisplay :minimal="true" :network="transaction.networkType" :store-network-type="networkType"></NetworkDisplay>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-if="transaction.etherscanLink">
            <v-list-item-content class="details-value text_2--text text-right mt-1">
              <a class="etherscan-lnk" color="torusBrand1" :href="transaction.etherscanLink" target="_blank" rel="noreferrer noopener">
                {{ t('walletActivity.viewOnEtherscan') }}
              </a>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'

import {
  ACTIVITY_ACTION_RECEIVE,
  ACTIVITY_ACTION_SEND,
  ACTIVITY_ACTION_TOPUP,
  ACTIVITY_STATUS_PENDING,
  ACTIVITY_STATUS_SUCCESSFUL,
  ACTIVITY_STATUS_UNSUCCESSFUL,
  CONTRACT_TYPE_ERC20,
  CONTRACT_TYPE_ERC721,
} from '../../../utils/enums'
import NetworkDisplay from '../../helpers/NetworkDisplay'

export default {
  components: {
    NetworkDisplay,
  },
  props: {
    transaction: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  data() {
    return {
      showDetails: false,
      ACTIVITY_ACTION_SEND,
      ACTIVITY_ACTION_RECEIVE,
      ACTIVITY_STATUS_SUCCESSFUL,
      ACTIVITY_STATUS_UNSUCCESSFUL,
      ACTIVITY_STATUS_PENDING,
      ACTIVITY_ACTION_TOPUP,
      CONTRACT_TYPE_ERC20,
      CONTRACT_TYPE_ERC721,
    }
  },
  computed: mapState(['networkType']),
  methods: {
    getChipColor(status) {
      if (status === ACTIVITY_STATUS_SUCCESSFUL) return '#9BE8C7'
      if (status === ACTIVITY_STATUS_UNSUCCESSFUL) return '#FEA29F'
      return '#E0E0E0'
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'TransactionDetails.scss';
</style>
