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
  MATIC_DISPLAY_NAME
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
  props: ['transactions', 'selectedAction', 'selectedPeriod'],
  data() {
    return {
      mapper: mapper
    }
  },
  computed: {
    filteredTransactions() {
      const selectedAction = this.selectedAction === 'All Transactions' ? '' : this.selectedAction
      var regExAction = new RegExp(selectedAction, 'i')

      return this.transactions
        .map(item => {
          item.actionIcon = this.getIcon(item.action)
          item.dateFormatted = this.formatDate(item.date)
          item.timeFormatted = this.formatTime(item.date)
          return item
        })
        .filter(item => {
          // GET Date Scope
          let isScoped = false
          if (this.selectedPeriod === 'Period') {
            isScoped = true
          } else {
            let minDate = new Date()
            let itemDate = new Date(item.date)
            if (this.selectedPeriod === 'Last Week') {
              minDate.setDate(minDate.getDate() - 7)
            } else {
              minDate.setMonth(minDate.getMonth() - 1)
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
    getIcon(action) {
      if (action === 'Topup') {
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
