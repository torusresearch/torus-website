<template>
  <div class="torus-widget" :class="embedState.buttonPosition">
    <v-dialog v-if="loggedIn" v-model="activeWidget" max-width="375" @click:outside="showWidget">
      <div class="torus-widget__panel pa-4" :class="[embedState.buttonPosition, $vuetify.theme.isDark ? 'isDark' : '']">
        <div class="d-flex torus-widget__user-details">
          <div class="avatar-container">
            <v-avatar size="32">
              <img :src="userInfo.profileImage" />
            </v-avatar>
          </div>
          <div class="details-container d-flex flex-column ml-2 pr-2">
            <div class="d-flex align-center">
              <v-icon size="12" class="details-container__icon torusGray1--text">{{ `$vuetify.icons.${userInfo.verifier}` }}</v-icon>
              <div class="details-container__text ml-2">{{ userInfo.verifierId }}</div>
              <!-- Will add when dropdown available -->
              <!-- <v-icon size="16" class="ml-auto text_2--text">$vuetify.icons.select</v-icon> -->
            </div>
            <div class="d-flex align-center">
              <img class="details-container__icon" :src="require(`../../../../public/img/icons/address-wallet.svg`)" />
              <div class="details-container__text ml-2">
                <ShowToolTip :address="address">
                  {{ address }}
                </ShowToolTip>
              </div>
              <div class="ml-auto mr-1">
                <ShowToolTip :address="address">
                  <v-icon size="8" class="text_2--text">$vuetify.icons.copy</v-icon>
                </ShowToolTip>
              </div>
            </div>
          </div>
        </div>
        <div class="d-flex torus-widget__amount-details mt-5">
          <div>
            <div>
              <span class="caption text_2--text">{{ t('dappPopup.totalValue') }}</span>
            </div>
            <div class="mt-1">
              <span class="amount text_2--text">{{ totalPortfolioValue }} {{ selectedCurrency }}</span>
            </div>
          </div>
          <div class="ml-auto">
            <v-btn fab depressed small @click="showWalletPopup({ path: '/transfer' })">
              <v-icon>$vuetify.icons.send</v-icon>
            </v-btn>

            <v-btn v-if="!whiteLabel.topupHide" fab depressed small class="ml-2" @click="showWalletPopup({ path: '/topup' })">
              <v-icon>$vuetify.icons.add</v-icon>
            </v-btn>
          </div>
        </div>
        <div class="d-flex align-center text_2--text" :style="{ marginTop: '2px' }">
          <v-icon size="8" v-text="'$vuetify.icons.network'"></v-icon>
          <span class="network-name ml-1">{{ networkType.networkName || networkType.host }}</span>
        </div>
        <div class="torus-widget__transaction-details mt-5">
          <div class="d-flex">
            <span class="caption text_2--text">{{ t('dappPopup.recentActivity') }}</span>
            <span class="caption primary--text ml-auto wallet-open" @click="showWalletPopup({ path: '/home' })">{{ t('dappPopup.openWallet') }}</span>
          </div>
          <v-divider class="my-1"></v-divider>
          <div v-if="recentTransaction" class="d-flex mb-4 mt-2">
            <div class="avatar-container">
              <v-avatar size="40">
                <img
                  v-if="recentTransaction.type === CONTRACT_TYPE_ERC20 || recentTransaction.action === ACTIVITY_ACTION_TOPUP"
                  :src="require(`../../../../public/images/${recentTransaction.actionIcon}`)"
                  :alt="recentTransaction.from"
                  height="36"
                />
                <img
                  v-else-if="recentTransaction.type === CONTRACT_TYPE_ERC721"
                  :src="recentTransaction.actionIcon"
                  height="36"
                  large
                  color="primary"
                />
                <v-icon v-else class="mx-2" color="primary">{{ recentTransaction.actionIcon }}</v-icon>
              </v-avatar>
            </div>
            <div class="ml-4 pt-1">
              <div class="caption text_2--text text-clamp-one">{{ recentTransaction.actionText }}</div>
              <div class="caption text-clamp-one">
                {{
                  recentTransaction.action === ACTIVITY_ACTION_SEND
                    ? `${t('walletActivity.to')} ${recentTransaction.slicedTo}`
                    : `${t('walletActivity.from')} ${recentTransaction.slicedFrom}`
                }}
              </div>
            </div>
            <div class="ml-auto pt-1" :style="{ lineHeight: '0px' }">
              <span class="caption text_2--text">{{ recentTransaction.totalAmountString }}</span>
            </div>
          </div>
        </div>
      </div>
    </v-dialog>
    <v-btn v-if="loggedIn" class="torus-widget__btn" color="primary" fab @click="showWidget">
      <img
        class="torus-widget__logo"
        :class="whiteLabelGlobal.isWhiteLabelActive && whiteLabelGlobal.logoLight ? '' : 'torus-logo'"
        :src="
          whiteLabelGlobal.isWhiteLabelActive && whiteLabelGlobal.logoLight
            ? whiteLabelGlobal.logoLight || whiteLabelGlobal.logo
            : require(`../../../../public/img/icons/torus-icon-light.svg`)
        "
      />
    </v-btn>
    <v-btn v-else-if="loginDialog" color="primary" fab>
      <BeatLoader size="10px" color="white" />
    </v-btn>
    <v-btn v-else class="torus-widget__login-btn" color="primary" fab @click="login">
      <img class="torus-widget__login" :src="require(`../../../../public/images/login.png`)" />
      <span class="torus-widget__login-with">Login</span>
    </v-btn>
  </div>
</template>

<script>
import BeatLoader from 'vue-spinner/src/BeatLoader'
import { mapActions, mapState } from 'vuex'

import ShowToolTip from '../../../components/helpers/ShowToolTip'
import { ACTIVITY_ACTION_RECEIVE, ACTIVITY_ACTION_SEND, ACTIVITY_ACTION_TOPUP, CONTRACT_TYPE_ERC20, CONTRACT_TYPE_ERC721 } from '../../../utils/enums'
import { addressSlicer, significantDigits } from '../../../utils/utils'

export default {
  name: 'PopupWidget',
  components: { BeatLoader, ShowToolTip },
  props: {
    loggedIn: {
      type: Boolean,
      default: false,
    },
    loginDialog: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      activeWidget: false,
      CONTRACT_TYPE_ERC20,
      ACTIVITY_ACTION_TOPUP,
      ACTIVITY_ACTION_SEND,
      CONTRACT_TYPE_ERC721,
    }
  },
  computed: {
    ...mapState({
      address: (state) => `${state.selectedAddress.slice(0, 12)}...${state.selectedAddress.slice(-12)}`,
      userInfo: 'userInfo',
      selectedCurrency: 'selectedCurrency',
      wallets: (state) => Object.keys(state.wallet).filter((x) => x !== state.selectedAddress),
      embedState: 'embedState',
      pastTransactions: 'pastTransactions',
      whiteLabel: 'whiteLabel',
      networkType: 'networkType',
    }),
    totalPortfolioValue() {
      return this.$store.getters.tokenBalances.totalPortfolioValue || '0'
    },
    recentTransaction() {
      const oldTx = this.pastTransactions
      const [recent] = oldTx.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) || []

      if (!recent) return undefined

      const { id, type, created_at: createdAt, to, from } = recent
      let totalAmountString = ''
      if (recent.type === CONTRACT_TYPE_ERC721) totalAmountString = recent.symbol
      else if (recent.type === CONTRACT_TYPE_ERC20)
        totalAmountString = `${significantDigits(Number.parseFloat(recent.total_amount))} ${recent.symbol}`
      else totalAmountString = `${significantDigits(Number.parseFloat(recent.total_amount))} ETH`
      recent.action = this.wallets.includes(to) ? ACTIVITY_ACTION_RECEIVE : ACTIVITY_ACTION_SEND
      return {
        id,
        date: new Date(createdAt),
        type,
        action: recent.action,
        actionIcon: this.getIcon(recent),
        actionText: this.getActionText(recent),
        slicedTo: addressSlicer(to),
        slicedFrom: addressSlicer(from),
        totalAmountString,
      }
    },
  },
  methods: {
    ...mapActions({
      toggleWidgetVisibility: 'toggleWidgetVisibility',
      showWalletPopup: 'showWalletPopup',
    }),
    login() {
      this.$emit('onLogin')
    },
    getIcon(transaction) {
      if (transaction.action === ACTIVITY_ACTION_TOPUP) {
        return `provider-${transaction.from.toLowerCase()}.svg`
      }
      if (transaction.action === ACTIVITY_ACTION_SEND || transaction.action === ACTIVITY_ACTION_RECEIVE) {
        if (transaction.type === CONTRACT_TYPE_ERC721) {
          return transaction.type_image_link // will be an opensea image url
        }
        if (transaction.type === CONTRACT_TYPE_ERC20) {
          return `logos/${transaction.type_image_link === 'n/a' ? 'eth.svg' : transaction.type_image_link}`
        }
        const action = transaction.action.split('.')
        return action.length >= 1 ? `$vuetify.icons.coins_${transaction.action.split('.')[1].toLowerCase()}` : ''
      }
      return ''
    },
    getActionText(transaction) {
      if (transaction.type_name === 'n/a' || transaction.type === 'n/a') {
        return `${transaction.action === ACTIVITY_ACTION_SEND ? this.t('walletActivity.sent') : this.t('walletActivity.received')} ${
          transaction.type_name !== 'n/a' ? transaction.type_name : transaction.type.toUpperCase()
        }`
      }
      if (transaction.type_name || transaction.type) {
        return `${transaction.action === ACTIVITY_ACTION_SEND ? this.t('walletActivity.sent') : this.t('walletActivity.received')} ${
          transaction.type === 'eth' ? transaction.type_name.toUpperCase() : transaction.type_name
        }`
      }
      return `${`${this.t(transaction.action)} ${transaction.from}`} `
    },
    showWidget() {
      const currentWidgetVisibility = this.activeWidget
      this.toggleWidgetVisibility(!currentWidgetVisibility)
      this.activeWidget = !currentWidgetVisibility
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'PopupWidget.scss';
</style>
