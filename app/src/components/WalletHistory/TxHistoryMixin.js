const {
  ROPSTEN,
  RINKEBY,
  KOVAN,
  MAINNET,
  LOCALHOST,
  GOERLI,
  RPC,
  MATIC,
  ROPSTEN_DISPLAY_NAME,
  RINKEBY_DISPLAY_NAME,
  KOVAN_DISPLAY_NAME,
  MAINNET_DISPLAY_NAME,
  LOCALHOST_DISPLAY_NAME,
  GOERLI_DISPLAY_NAME,
  RPC_DISPLAY_NAME,
  MATIC_DISPLAY_NAME,
  ACTIVITY_ACTION_ALL,
  ACTIVITY_ACTION_SEND,
  ACTIVITY_ACTION_RECEIVE,
  ACTIVITY_ACTION_TOPUP,
  ACTIVITY_PERIOD_ALL,
  ACTIVITY_PERIOD_WEEK_ONE,
  ACTIVITY_PERIOD_MONTH_ONE
} = require('../../utils/enums')

const mapper = {
  [ROPSTEN]: ROPSTEN_DISPLAY_NAME,
  [RINKEBY]: RINKEBY_DISPLAY_NAME,
  [KOVAN]: KOVAN_DISPLAY_NAME,
  [MAINNET]: MAINNET_DISPLAY_NAME,
  [LOCALHOST]: LOCALHOST_DISPLAY_NAME,
  [GOERLI]: GOERLI_DISPLAY_NAME,
  [RPC]: RPC_DISPLAY_NAME,
  [MATIC]: MATIC_DISPLAY_NAME
}

export default {
  props: ['transactions', 'selectedAction', 'selectedPeriod', 'nonTopupTransactionCount'],
  data() {
    return {
      mapper: mapper
    }
  },
  computed: {
    filteredTransactions() {
      const selectedAction = this.selectedAction === ACTIVITY_ACTION_ALL ? '' : this.selectedAction
      var regExAction = new RegExp(selectedAction, 'i')

      return this.transactions
        .map(item => {
          item.actionIcon = this.getIcon(item.action)
          item.statusText = this.getStatusText(item.status)
          item.dateFormatted = this.formatDate(item.date)
          item.timeFormatted = this.formatTime(item.date)
          return item
        })
        .filter(item => {
          // GET Date Scope
          let isScoped = false
          if (this.selectedPeriod === ACTIVITY_PERIOD_ALL) {
            isScoped = true
          } else {
            let minDate = new Date()
            let itemDate = new Date(item.date)
            if (this.selectedPeriod === ACTIVITY_PERIOD_WEEK_ONE) {
              minDate.setDate(minDate.getDate() - 7)
            } else if (this.selectedPeriod === ACTIVITY_PERIOD_MONTH_ONE) {
              minDate.setMonth(minDate.getMonth() - 1)
            } else {
              minDate.setMonth(minDate.getMonth() - 6)
            }

            isScoped = minDate.getTime() <= itemDate.getTime()
          }
          if (item.action) {
            return item.action.match(regExAction) && isScoped
          } else {
            return isScoped
          }
        })
    }
  },
  methods: {
    getStatusText(status) {
      switch (status) {
        case 'rejected':
        case 'denied':
        case 'unapproved':
          return 'Unsuccessful'
        case 'confirmed':
          return 'Successful'
        case 'pending':
        case 'submitted':
          return 'Pending'
        default:
          return ''
      }
    },
    getIcon(action) {
      if (action === ACTIVITY_ACTION_TOPUP) {
        return '$vuetify.icons.coins_topup'
      } else if (action === ACTIVITY_ACTION_SEND) {
        return '$vuetify.icons.coins_send'
      } else if (action === ACTIVITY_ACTION_RECEIVE) {
        return '$vuetify.icons.coins_receive'
      }
    },
    formatDate(date) {
      return date
        .toString()
        .substring(4)
        .substring(0, 20)
    },
    formatTime(time) {
      return time.toTimeString().substring(0, 8)
    }
  }
}
