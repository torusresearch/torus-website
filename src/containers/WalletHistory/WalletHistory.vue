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
        <TxHistoryTable
          :currency-multiplier="currencyMultiplier"
          :selected-action="selectedAction"
          :selected-period="selectedPeriod"
          :transactions="calculatedFinalTx"
          :selected-currency="selectedCurrency"
          :cancel-gas-price="cancelGasPrice"
          @cancelTransaction="cancelTransaction"
        />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import BigNumber from 'bignumber.js'
import log from 'loglevel'
import { mapState } from 'vuex'

import TxHistoryTable from '../../components/WalletHistory/TxHistoryTable'
import torus from '../../torus'
import {
  ACTIVITY_ACTION_ALL,
  ACTIVITY_ACTION_RECEIVE,
  ACTIVITY_ACTION_SEND,
  ACTIVITY_ACTION_TOPUP,
  ACTIVITY_PERIOD_ALL,
  ACTIVITY_PERIOD_MONTH_ONE,
  ACTIVITY_PERIOD_MONTH_SIX,
  ACTIVITY_PERIOD_WEEK_ONE,
  ACTIVITY_STATUS_CANCELLED,
  ACTIVITY_STATUS_CANCELLING,
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
import { formatDate, formatTime } from '../../utils/utils'

export default {
  name: 'WalletHistory',
  components: { TxHistoryTable },
  data() {
    return {
      selectedAction: ACTIVITY_ACTION_ALL,
      selectedPeriod: ACTIVITY_PERIOD_ALL,
      cancelGasPrice: new BigNumber(5),
    }
  },
  computed: {
    ...mapState({
      pastTx: 'pastTransactions',
      etherscanTx: (state) => (ETHERSCAN_SUPPORTED_NETWORKS.has(state.networkType.host) ? state.etherscanTx : []),
      paymentTx: (state) => (state.networkType.host === MAINNET ? state.paymentTx : []),
      networkType: 'networkType',
      selectedCurrency: 'selectedCurrency',
      currencyData: 'currencyData',
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
        x.statusText = this.getStatusText(x)
        x.dateFormatted = formatDate(x.date)
        x.timeFormatted = formatTime(x.date)
        if (!x.is_cancel && (x.etherscanLink === '' || accumulator.findIndex((y) => y.etherscanLink === x.etherscanLink) === -1)) accumulator.push(x)
        return accumulator
      }, [])
      return finalTx.sort((a, b) => b.date - a.date) || []
    },
    currencyMultiplier() {
      const currencyMultiplierNumber = this.selectedCurrency !== 'ETH' ? this.currencyData[this.selectedCurrency.toLowerCase()] || 1 : 1
      return new BigNumber(currencyMultiplierNumber)
    },
  },
  async mounted() {
    this.$vuetify.goTo(0)
    let gasPrice = this.cancelGasPrice
    try {
      if (this.networkType.host === MAINNET) {
        const resp = await fetch('https://ethgasstation.info/json/ethgasAPI.json', {
          headers: {},
          referrer: 'http://ethgasstation.info/json/',
          referrerPolicy: 'no-referrer-when-downgrade',
          body: null,
          method: 'GET',
          mode: 'cors',
        })
        const { fastest: fastestTimes10 } = await resp.json()
        gasPrice = new BigNumber(fastestTimes10).div(new BigNumber('10'))
      } else {
        const recommended = await torus.web3.eth.getGasPrice()
        gasPrice = new BigNumber(recommended).div(new BigNumber(10).pow(new BigNumber(9))).plus(new BigNumber('5'))
      }
      const percent10Extra = gasPrice.times(new BigNumber('1.1'))
      // Add 5 to fastest recommended by transfer page
      const plus5 = gasPrice.plus(new BigNumber('5'))
      // 1 gwei -> 1.1 & 10 -> 1.1
      // 50 gwei -> 55 & 60 -> 55
      // 150 gwei -> 165 & 160 -> 160
      // Increase by a Max of (5 gwei , 10%)
      this.cancelGasPrice = percent10Extra.isGreaterThan(plus5) ? percent10Extra : plus5
    } catch (error) {
      log.error(error, 'unable to fetch gas price')
    }
  },
  methods: {
    getStatusText(currentTx) {
      switch (currentTx.status) {
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
        case 'cancelled':
          return ACTIVITY_STATUS_CANCELLED
        case 'cancelling':
          return ACTIVITY_STATUS_CANCELLING
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
    async cancelTransaction(transaction) {
      const { from, gas, nonce } = transaction
      const { cancelGasPrice } = this
      const sendingWei = 0
      return torus.web3.eth.sendTransaction({
        from,
        to: from,
        value: `0x${sendingWei.toString(16)}`,
        gas,
        gasPrice: `0x${cancelGasPrice
          .times(new BigNumber(10).pow(new BigNumber(9)))
          .dp(0, BigNumber.ROUND_DOWN)
          .toString(16)}`,
        customNonceValue: nonce,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'WalletHistory.scss';
</style>
