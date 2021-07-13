<template>
  <v-container class="wallet-activity" :class="$vuetify.breakpoint.xsOnly ? 'px-4' : ''">
    <v-layout mt-3 wrap>
      <v-flex xs12 md7>
        <div class="text_2--text font-weight-bold float-left page-title" :class="{ 'display-1': $vuetify.breakpoint.width > 390 }">
          {{ t('walletActivity.transactionActivities') }}
        </div>
      </v-flex>
      <v-flex xs12 md5 :class="$vuetify.breakpoint.xsOnly ? 'mt-7' : ''">
        <v-layout mx-n2>
          <v-flex xs6 px-2>
            <v-menu offset-y>
              <template #activator="{ on }">
                <div class="d-flex align-center filter-selector pa-2" :class="{ 'theme--dark': $vuetify.theme.isDark }" v-on="on">
                  <v-icon x-small class="text_2--text">$vuetify.icons.activities</v-icon>
                  <span class="ml-1 text_1--text" :class="$vuetify.breakpoint.xsOnly ? 'caption' : 'body-2'">{{ t(selectedAction) }}</span>
                  <v-icon class="ml-auto text_2--text">$vuetify.icons.select</v-icon>
                </div>
              </template>
              <v-card class="pa-3">
                <v-list min-width="190" dense>
                  <v-list-item-group color="torusBrand1">
                    <v-list-item
                      v-for="actionType in actionTypes"
                      :key="actionType.value"
                      :class="selectedAction === actionType.value ? 'active' : ''"
                      @click="selectedAction = actionType.value"
                    >
                      <v-list-item-content>
                        <v-list-item-title>{{ actionType.text }}</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-card>
            </v-menu>
          </v-flex>
          <v-flex xs6 px-2>
            <v-menu offset-y>
              <template #activator="{ on }">
                <div class="d-flex align-center filter-selector pa-2" :class="{ 'theme--dark': $vuetify.theme.isDark }" v-on="on">
                  <v-icon class="text_2--text" small>$vuetify.icons.calendar</v-icon>
                  <span class="ml-1 text_1--text" :class="$vuetify.breakpoint.xsOnly ? 'caption' : 'body-2'">{{ t(selectedPeriod) }}</span>
                  <v-icon class="ml-auto text_2--text">$vuetify.icons.select</v-icon>
                </div>
              </template>
              <v-card class="pa-3">
                <v-list min-width="190" dense>
                  <v-list-item-group color="torusBrand1">
                    <v-list-item
                      v-for="period in periods"
                      :key="period.value"
                      :class="selectedPeriod === period.value ? 'active' : ''"
                      @click="selectedPeriod = period.value"
                    >
                      <v-list-item-content>
                        <v-list-item-title>{{ period.text }}</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-card>
            </v-menu>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs12 :class="$vuetify.breakpoint.xsOnly ? 'mt-6' : 'mt-7'">
        <TxHistoryTable :selected-action="selectedAction" :selected-period="selectedPeriod" :transactions="calculatedFinalTx" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'

import TxHistoryTable from '../../components/WalletHistory/TxHistoryTable'
import {
  ACTIVITY_ACTION_ALL,
  ACTIVITY_ACTION_RECEIVE,
  ACTIVITY_ACTION_SEND,
  ACTIVITY_ACTION_TOPUP,
  ACTIVITY_PERIOD_ALL,
  ACTIVITY_PERIOD_MONTH_ONE,
  ACTIVITY_PERIOD_MONTH_SIX,
  ACTIVITY_PERIOD_WEEK_ONE,
  ACTIVITY_STATUS_PENDING,
  ACTIVITY_STATUS_SUCCESSFUL,
  ACTIVITY_STATUS_UNSUCCESSFUL,
  CONTRACT_INTERACTION_KEY,
  CONTRACT_TYPE_ERC20,
  CONTRACT_TYPE_ERC721,
  CONTRACT_TYPE_ERC1155,
  CONTRACT_TYPE_ETH,
  DEPLOY_CONTRACT_ACTION_KEY,
  ETHERSCAN_SUPPORTED_NETWORKS,
  MAINNET,
  TOKEN_METHOD_APPROVE,
} from '../../utils/enums'
import { formatDate } from '../../utils/utils'

export default {
  name: 'WalletHistory',
  components: { TxHistoryTable },
  data() {
    return {
      selectedAction: ACTIVITY_ACTION_ALL,
      selectedPeriod: ACTIVITY_PERIOD_ALL,
    }
  },
  computed: {
    ...mapState({
      pastTx: 'pastTransactions',
      etherscanTx: (state) => (ETHERSCAN_SUPPORTED_NETWORKS.has(state.networkType.host) ? state.etherscanTx : []),
      paymentTx: (state) => (state.networkType.host === MAINNET ? state.paymentTx : []),
      networkType: 'networkType',
    }),
    actionTypes() {
      return [
        {
          text: this.t(ACTIVITY_ACTION_ALL),
          value: ACTIVITY_ACTION_ALL,
        },
        {
          text: this.t(ACTIVITY_ACTION_SEND),
          value: ACTIVITY_ACTION_SEND,
        },
        {
          text: this.t(ACTIVITY_ACTION_RECEIVE),
          value: ACTIVITY_ACTION_RECEIVE,
        },
        {
          text: this.t(ACTIVITY_ACTION_TOPUP),
          value: ACTIVITY_ACTION_TOPUP,
        },
      ]
    },
    periods() {
      return [
        {
          text: this.t(ACTIVITY_PERIOD_ALL),
          value: ACTIVITY_PERIOD_ALL,
        },
        {
          text: this.t(ACTIVITY_PERIOD_WEEK_ONE),
          value: ACTIVITY_PERIOD_WEEK_ONE,
        },
        {
          text: this.t(ACTIVITY_PERIOD_MONTH_ONE),
          value: ACTIVITY_PERIOD_MONTH_ONE,
        },
        {
          text: this.t(ACTIVITY_PERIOD_MONTH_SIX),
          value: ACTIVITY_PERIOD_MONTH_SIX,
        },
      ]
    },
    calculatedFinalTx() {
      let finalTx = [...this.paymentTx, ...this.pastTx, ...this.etherscanTx]
      finalTx = finalTx.reduce((accumulator, x) => {
        x.actionIcon = this.getIcon(x)
        x.actionText = this.getActionText(x)
        x.statusText = this.getStatusText(x.status)
        x.dateFormatted = formatDate(x.date)
        x.timeFormatted = this.formatTime(x.date)
        if (x.etherscanLink === '' || accumulator.findIndex((y) => y.etherscanLink === x.etherscanLink) === -1) accumulator.push(x)
        return accumulator
      }, [])
      return finalTx.sort((a, b) => b.date - a.date) || []
    },
  },
  mounted() {
    this.$vuetify.goTo(0)
  },
  methods: {
    getStatusText(status) {
      switch (status) {
        case 'rejected':
        case 'denied':
        case 'unapproved':
        case 'failed':
          return ACTIVITY_STATUS_UNSUCCESSFUL
        case 'confirmed':
        case 'completed':
        case 'complete':
        case 'success':
          return ACTIVITY_STATUS_SUCCESSFUL
        case 'pending':
        case 'submitted':
        case 'processing':
          return ACTIVITY_STATUS_PENDING
        default:
          return ''
      }
    },
    getActionText(activity) {
      if (activity.transaction_category === CONTRACT_INTERACTION_KEY) {
        return this.t('walletActivity.contractInteraction')
      }
      if (activity.transaction_category === DEPLOY_CONTRACT_ACTION_KEY) {
        return this.t('walletActivity.contractDeployment')
      }
      if (activity.transaction_category === TOKEN_METHOD_APPROVE) {
        return `${this.t('walletActivity.approved')} ${activity.type_name !== 'n/a' ? activity.type_name.toUpperCase() : activity.type.toUpperCase()}`
      }
      if (activity.type_name === 'n/a' || activity.type === 'n/a') {
        return `${activity.action === ACTIVITY_ACTION_SEND ? this.t('walletActivity.sent') : this.t('walletActivity.received')} ${
          activity.type_name !== 'n/a' ? activity.type_name : activity.type.toUpperCase()
        }`
      }
      if (activity.type_name || activity.type) {
        return `${activity.action === ACTIVITY_ACTION_SEND ? this.t('walletActivity.sent') : this.t('walletActivity.received')} ${
          activity.type === 'eth' ? activity.type_name.toUpperCase() : activity.type_name
        }`
      }
      return `${`${this.t(activity.action)} ${activity.from}`} `
    },
    getIcon(activity) {
      if ([TOKEN_METHOD_APPROVE, DEPLOY_CONTRACT_ACTION_KEY, CONTRACT_INTERACTION_KEY].includes(activity.transaction_category)) {
        return '$vuetify.icons.coins_approve'
      }
      if (activity.action === ACTIVITY_ACTION_TOPUP) {
        return `provider-${activity.from.toLowerCase()}.svg`
      }
      if (activity.action === ACTIVITY_ACTION_SEND || activity.action === ACTIVITY_ACTION_RECEIVE) {
        if (activity.type === CONTRACT_TYPE_ERC721 || activity.type === CONTRACT_TYPE_ERC1155) {
          return activity.type_image_link // will be an opensea image url
        }
        if (activity.type === CONTRACT_TYPE_ERC20) {
          return activity.type_image_link
        }
        if (activity.type === CONTRACT_TYPE_ETH) {
          return this.networkType.logo
        }
        const action = activity.action.split('.')
        return action.length > 0 ? `$vuetify.icons.coins_${activity.action.split('.')[1].toLowerCase()}` : ''
      }
      return ''
    },
    formatTime(time) {
      return new Date(time).toTimeString().slice(0, 8)
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'WalletHistory.scss';
</style>
