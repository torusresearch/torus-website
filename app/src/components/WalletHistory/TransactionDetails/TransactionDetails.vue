<template>
  <v-card color="elevation-1 activity mb-4 pa-5" :ripple="false" @click="showDetails = !showDetails">
    <v-layout wrap mx-n4>
      <v-flex
        px-4
        :class="$vuetify.breakpoint.xsOnly ? 'order-2 pt-2' : 'order-0'"
        :style="{ marginLeft: $vuetify.breakpoint.xsOnly ? '33px' : '0', maxWidth: '100px' }"
      >
        <div class="caption font-weight-medium">{{ transaction.dateFormatted }}</div>
        <div class="info font-weight-light">{{ transaction.timeFormatted }}</div>
      </v-flex>
      <v-divider v-if="!$vuetify.breakpoint.xsOnly" vertical class="mx-4"></v-divider>
      <v-flex :class="$vuetify.breakpoint.xsOnly ? 'xs8 order-0' : 'xs4 order-1'" pr-4 pl-0>
        <div
          class="icon-holder float-left"
          :class="{
            circle: !(
              transaction.type === CONTRACT_TYPE_ERC20 ||
              transaction.action === ACTIVITY_ACTION_TOPUP ||
              transaction.type === CONTRACT_TYPE_ERC721
            )
          }"
        >
          <img
            v-if="transaction.type === CONTRACT_TYPE_ERC20 || transaction.action === ACTIVITY_ACTION_TOPUP"
            :src="require(`../../../../public/images/${transaction.actionIcon}`)"
            :alt="transaction.from"
            class="mr-2"
            height="36"
          />
          <img
            v-else-if="transaction.type === CONTRACT_TYPE_ERC721"
            :src="transaction.actionIcon"
            class="mr-2"
            height="36"
            large
            color="torus_brand1"
          />
          <v-icon v-else class="float-left" large color="torus_brand1">{{ transaction.actionIcon }}</v-icon>
        </div>
        <div class="caption font-weight-medium">{{ transaction.actionText }}</div>
        <div class="info font-weight-light">
          {{
            transaction.action === ACTIVITY_ACTION_SEND
              ? `${t('walletActivity.to')} ${transaction.slicedTo}`
              : `${t('walletActivity.from')} ${transaction.slicedFrom}`
          }}
        </div>
      </v-flex>
      <v-flex class="text-right" :class="$vuetify.breakpoint.xsOnly ? 'xs4 order-1' : 'xs2 order-2'" px-4>
        <div class="caption font-weight-medium">
          <span v-if="transaction.type !== CONTRACT_TYPE_ERC721 && transaction.action === ACTIVITY_ACTION_SEND" class="error--text">-</span>
          {{ transaction.totalAmountString }}
        </div>
        <div class="info font-weight-light">{{ transaction.currencyAmountString }}</div>
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
      <v-flex xs12 class="activity-details">
        <v-list class="mx-n4 caption">
          <v-list-item>
            <v-list-item-content class="details-label">{{ t('walletActivity.startedAt') }}:</v-list-item-content>
            <v-list-item-content class="details-value text_2--text">
              <span>{{ transaction.timeFormatted }} - {{ transaction.dateFormatted }}</span>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content class="details-label">
              {{ transaction.action === ACTIVITY_ACTION_SEND ? t('walletActivity.sendTo') : t('walletActivity.receiveFrom') }}:
            </v-list-item-content>
            <v-list-item-content class="details-value text_2--text">
              <span>{{ transaction.action === ACTIVITY_ACTION_SEND ? transaction.to : transaction.from }}</span>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-if="transaction.type !== CONTRACT_TYPE_ERC721">
            <v-list-item-content class="details-label">{{ t('walletActivity.rate') }}:</v-list-item-content>
            <v-list-item-content class="details-value text_2--text">
              <span>{{ transaction.ethRate }} {{ transaction.currencyUsed }}</span>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-if="transaction.type !== CONTRACT_TYPE_ERC721">
            <v-list-item-content class="details-label">{{ t('walletActivity.amount') }}:</v-list-item-content>
            <v-list-item-content class="details-value text_2--text amount-text">
              {{ transaction.totalAmountString }} /{{ transaction.currencyAmountString }}
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content class="details-label">{{ t('walletActivity.network') }}:</v-list-item-content>
            <v-list-item-content class="details-value text_2--text">
              <NetworkDisplay :network="transaction.networkType" :store-network-type="storeNetworkType"></NetworkDisplay>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-if="transaction.etherscanLink">
            <v-list-item-content class="details-value text_2--text text-right mt-1">
              <a class="etherscan-lnk" color="torus_brand1" :href="transaction.etherscanLink" target="_blank">
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
import {
  ACTIVITY_ACTION_RECEIVE,
  ACTIVITY_ACTION_SEND,
  ACTIVITY_ACTION_TOPUP,
  ACTIVITY_STATUS_PENDING,
  ACTIVITY_STATUS_SUCCESSFUL,
  ACTIVITY_STATUS_UNSUCCESSFUL,
  CONTRACT_TYPE_ERC20,
  CONTRACT_TYPE_ERC721
} from '../../../utils/enums'
import NetworkDisplay from '../../helpers/NetworkDisplay'

export default {
  components: {
    NetworkDisplay
  },
  props: {
    transaction: {
      type: Object,
      default() {
        return {}
      }
    }
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
      CONTRACT_TYPE_ERC721
    }
  },
  computed: {
    storeNetworkType() {
      return this.$store.state.networkType
    }
  },
  methods: {
    getChipColor(status) {
      if (status === ACTIVITY_STATUS_SUCCESSFUL) return '#9BE8C7'
      if (status === ACTIVITY_STATUS_UNSUCCESSFUL) return '#FEA29F'
      return '#E0E0E0'
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'TransactionDetails.scss';
</style>
