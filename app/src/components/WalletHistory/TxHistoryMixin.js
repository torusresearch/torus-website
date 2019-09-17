const { SUPPORTED_NETWORK_TYPES } = require('../../utils/enums')

export default {
  props: ['transactions', 'selectedAction', 'selectedPeriod'],
  data() {
    return {
      mapper: SUPPORTED_NETWORK_TYPES
    }
  },
  computed: {
    filteredTransactions() {
      const selectedAction = this.selectedAction === 'All Transactions' ? '' : this.selectedAction
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
          if (this.selectedPeriod === 'All') {
            isScoped = true
          } else {
            let minDate = new Date()
            let itemDate = new Date(item.date)
            if (this.selectedPeriod === 'Last 1 Week') {
              minDate.setDate(minDate.getDate() - 7)
            } else if (this.selectedPeriod === 'Last 1 Month') {
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
      if (action === 'Top up') {
        return '$vuetify.icons.coins_topup'
      } else if (action === 'Send') {
        return '$vuetify.icons.coins_send'
      } else if (action === 'Receive') {
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
