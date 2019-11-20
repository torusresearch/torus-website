const {
  SUPPORTED_NETWORK_TYPES,
  ACTIVITY_ACTION_ALL,
  ACTIVITY_ACTION_TOPUP,
  ACTIVITY_ACTION_RECEIVE,
  ACTIVITY_ACTION_SEND,
  ACTIVITY_PERIOD_ALL,
  ACTIVITY_PERIOD_MONTH_ONE,
  ACTIVITY_PERIOD_WEEK_ONE,
  ACTIVITY_STATUS_SUCCESSFUL,
  ACTIVITY_STATUS_UNSUCCESSFUL,
  ACTIVITY_STATUS_PENDING
} = require('../../utils/enums')

const { formatDate } = require('../../utils/utils')

export default {
  props: ['transactions', 'selectedAction', 'selectedPeriod', 'nonTopupTransactionCount'],
  data() {
    return {
      mapper: SUPPORTED_NETWORK_TYPES
    }
  },
  computed: {
    filteredTransactions() {
      const selectedAction = this.selectedAction === ACTIVITY_ACTION_ALL ? '' : this.selectedAction
      var regExAction = new RegExp(selectedAction, 'i')

      return this.transactions
        .map(item => {
          item.actionIcon = this.getIcon(item.action)
          item.actionText = this.getActionText(item.action, 'ETH')
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
          return ACTIVITY_STATUS_UNSUCCESSFUL
        case 'confirmed':
          return ACTIVITY_STATUS_SUCCESSFUL
        case 'pending':
        case 'submitted':
          return ACTIVITY_STATUS_PENDING
        default:
          return ''
      }
    },
    getActionText(action, item) {
      if (action === ACTIVITY_ACTION_SEND) {
        return 'Send ' + item
      } else if (action === ACTIVITY_ACTION_RECEIVE) {
        return 'Received ' + item
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
      return formatDate(date)
    },
    formatTime(time) {
      return time.toTimeString().substring(0, 8)
    }
  }
}
