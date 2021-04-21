<template>
  <div class="torus-widget" :class="embedState.buttonPosition">
    <v-dialog v-if="loggedIn" v-model="activeWidget" max-width="375" @click:outside="showWidget">
      <div class="torus-widget__panel pa-4" :class="[embedState.buttonPosition, $vuetify.theme.isDark ? 'isDark' : '']">
        <div class="d-flex torus-widget__user-details">
          <div class="avatar-container">
            <v-avatar size="32">
              <div v-if="accountType === ACCOUNT_TYPE.IMPORTED" class="avatar-import">
                <v-icon>$vuetify.icons.person</v-icon>
              </div>
              <img
                v-else
                :src="userInfo.profileImage"
                :alt="`${userInfo.verifierId} Avatar`"
                onerror="if (!this.src.includes('/images/person.jpeg')) this.src = '/images/person.jpeg';"
              />
            </v-avatar>
          </div>
          <div class="details-container d-flex flex-column pr-2 ml-2">
            <div class="d-flex align-center">
              <v-icon size="12" class="details-container__icon text_2--text">{{ `$vuetify.icons.${userIcon}` }}</v-icon>
              <div class="details-container__text ml-2 font-weight-bold" :title="userEmail">{{ userEmail }}</div>
              <!-- Will add when dropdown available -->
              <!-- <v-icon size="16" class="ml-auto text_2--text">$vuetify.icons.select</v-icon> -->
            </div>
            <div class="d-flex align-center">
              <v-icon size="12" class="details-container__icon text_2--text">{{ `$vuetify.icons.address` }}</v-icon>
              <div class="details-container__text caption ml-2">
                <ShowToolTip :address="fullAddress">
                  <div class="d-flex align-center">
                    {{ address }}
                    <v-icon size="12" class="ml-4 text_2--text">$vuetify.icons.copy_outline</v-icon>
                  </div>
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
            <v-btn
              class="torus-btn1 torusBrand1--text"
              small
              fab
              title="Open Transfer Page"
              aria-label="Open Transfer Page"
              @click="showWalletPopup({ path: '/transfer' })"
            >
              <v-icon size="20">$vuetify.icons.send</v-icon>
            </v-btn>

            <v-btn
              v-if="!whiteLabel.topupHide"
              fab
              depressed
              small
              class="ml-2 torus-btn1 torusBrand1--text"
              title="Open Topup Page"
              aria-label="Open Topupu Page"
              @click="showWalletPopup({ path: '/topup' })"
            >
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
            <div class="icon-holder">
              <v-icon
                v-if="[TOKEN_METHOD_APPROVE, DEPLOY_CONTRACT_ACTION_KEY, CONTRACT_INTERACTION_KEY].includes(recentTransaction.transaction_category)"
                class="float-left"
                size="24"
                color="torusBrand1"
              >
                {{ recentTransaction.actionIcon }}
              </v-icon>
              <img
                v-else-if="recentTransaction.type === CONTRACT_TYPE_ERC20 && recentTransaction.actionIcon !== 'n/a'"
                :src="`${logosUrl}/${recentTransaction.actionIcon}`"
                :alt="`${recentTransaction.type_name} Icon`"
                onerror="if (!this.src.includes('images/logos/eth.svg')) this.src = '/images/logos/eth.svg';"
              />
              <v-icon v-else-if="recentTransaction.type === CONTRACT_TYPE_ERC20" class="float-left" size="24" color="torusBrand1">
                $vuetify.icons.token
              </v-icon>
              <img
                v-else-if="recentTransaction.action === ACTIVITY_ACTION_TOPUP"
                :src="require(`../../../assets/images/${recentTransaction.actionIcon}`)"
                :alt="`${recentTransaction.type_name} Icon`"
                class="ml-2"
                width="30"
              />
              <img
                v-else-if="recentTransaction.type === CONTRACT_TYPE_ERC721 && recentTransaction.actionIcon !== 'n/a'"
                :src="recentTransaction.actionIcon"
                class="ml-1"
                height="30"
                large
                :alt="`${recentTransaction.type_name} Icon`"
                onerror="if (!this.src.includes('images/logos/eth.svg')) this.src = '/images/logos/eth.svg';"
              />
              <v-icon v-else-if="recentTransaction.type === CONTRACT_TYPE_ERC721" class="float-left" size="24" color="torusBrand1">
                $vuetify.icons.collectibles
              </v-icon>
              <v-icon v-else class="float-left" size="24" color="torusBrand1">{{ recentTransaction.actionIcon }}</v-icon>
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
          <div v-else class="text-center">
            <span class="caption text_2--text">{{ t('walletActivity.noTransaction') }}</span>
          </div>
        </div>
      </div>
    </v-dialog>
    <v-btn v-if="loggedIn" class="torus-widget__btn" color="primary" fab aria-label="Show/Hide Widget Panel" @click="showWidget">
      <img class="torus-widget__logo" :class="getWhitelabelIcon.isExternal ? '' : 'torus-logo'" :src="getWhitelabelIcon.logo" alt="Torus Logo" />
    </v-btn>
    <v-btn v-else-if="loginDialog" color="primary" fab>
      <BeatLoader size="10px" color="white" />
    </v-btn>
    <v-btn v-else class="torus-widget__login-btn" color="primary" fab @click="login">
      <img class="torus-widget__login" src="../../../assets/images/login.png" alt="Login Icon" />
      <span class="torus-widget__login-with">Login</span>
    </v-btn>
  </div>
</template>

<script>
import BeatLoader from 'vue-spinner/src/BeatLoader'
import { mapActions, mapGetters, mapState } from 'vuex'

import ShowToolTip from '../../../components/helpers/ShowToolTip'
import config from '../../../config'
import {
  ACCOUNT_TYPE,
  ACTIVITY_ACTION_RECEIVE,
  ACTIVITY_ACTION_SEND,
  ACTIVITY_ACTION_TOPUP,
  CONTRACT_INTERACTION_KEY,
  CONTRACT_TYPE_ERC20,
  CONTRACT_TYPE_ERC721,
  DEPLOY_CONTRACT_ACTION_KEY,
  TOKEN_METHOD_APPROVE,
} from '../../../utils/enums'
import { addressSlicer, getUserEmail, getUserIcon } from '../../../utils/utils'

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
      TOKEN_METHOD_APPROVE,
      DEPLOY_CONTRACT_ACTION_KEY,
      CONTRACT_INTERACTION_KEY,
      CONTRACT_TYPE_ERC20,
      ACTIVITY_ACTION_TOPUP,
      ACTIVITY_ACTION_SEND,
      CONTRACT_TYPE_ERC721,
      logosUrl: config.logosUrl,
      ACCOUNT_TYPE,
    }
  },
  computed: {
    ...mapState({
      address: (state) => `${state.selectedAddress.slice(0, 10)}...${state.selectedAddress.slice(-10)}`,
      fullAddress: (state) => state.selectedAddress,
      userInfo: 'userInfo',
      selectedCurrency: 'selectedCurrency',
      wallet: 'wallet',
      embedState: 'embedState',
      pastTransactions: 'pastTransactions',
      whiteLabel: 'whiteLabel',
      networkType: 'networkType',
    }),
    ...mapGetters({ getWhitelabelIcon: 'getIcon' }),
    totalPortfolioValue() {
      return this.$store.getters.tokenBalances.totalPortfolioValue || '0'
    },
    recentTransaction() {
      const oldTx = this.pastTransactions
      const [recent] = oldTx.sort((a, b) => new Date(b.date) - new Date(a.date)) || []
      if (!recent) return undefined
      const { id, type, date: createdAt, to, from, totalAmountString, action } = recent
      return {
        id,
        date: new Date(createdAt),
        type,
        action,
        actionIcon: this.getIcon(recent),
        actionText: this.getActionText(recent),
        slicedTo: addressSlicer(to),
        slicedFrom: addressSlicer(from),
        totalAmountString,
      }
    },
    userEmail() {
      if (this.accountType === ACCOUNT_TYPE.THRESHOLD) {
        return `OpenLogin ${this.t('accountMenu.wallet')}`
      }
      if (this.accountType === ACCOUNT_TYPE.IMPORTED) {
        const index = Object.keys(this.wallet)
          .filter((x) => this.wallet[x].accountType === ACCOUNT_TYPE.IMPORTED)
          .indexOf(this.fullAddress)
        return `${this.t('accountMenu.importedAccount')} ${index + 1}`
      }
      return getUserEmail(this.userInfo, this.embedState.loginConfig, this.t('accountMenu.wallet'))
    },
    userIcon() {
      return getUserIcon(this.accountType, this.userInfo.typeOfLogin)
    },
    accountType() {
      return this.wallet[this.fullAddress]?.accountType
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
      if ([TOKEN_METHOD_APPROVE, DEPLOY_CONTRACT_ACTION_KEY, CONTRACT_INTERACTION_KEY].includes(transaction.transaction_category)) {
        return '$vuetify.icons.coins_approve'
      }
      if (transaction.action === ACTIVITY_ACTION_TOPUP) {
        return `provider-${transaction.from.toLowerCase()}.svg`
      }
      if (transaction.action === ACTIVITY_ACTION_SEND || transaction.action === ACTIVITY_ACTION_RECEIVE) {
        if (transaction.type === CONTRACT_TYPE_ERC721) {
          return transaction.type_image_link // will be an opensea image url
        }
        if (transaction.type === CONTRACT_TYPE_ERC20) {
          return transaction.type_image_link
        }
        const action = transaction.action.split('.')
        return action.length > 0 ? `$vuetify.icons.coins_${transaction.action.split('.')[1].toLowerCase()}` : ''
      }
      return ''
    },
    getActionText(transaction) {
      if (transaction.type_name === 'n/a' || transaction.type === 'n/a') {
        return `${transaction.action === ACTIVITY_ACTION_SEND ? this.t('walletActivity.sent') : this.t('walletActivity.received')} ${
          transaction.type_name !== 'n/a' ? transaction.type_name : transaction.type?.toUpperCase() || ''
        }`
      }
      if (transaction.type_name || transaction.type) {
        return `${transaction.action === ACTIVITY_ACTION_SEND ? this.t('walletActivity.sent') : this.t('walletActivity.received')} ${
          transaction.type === 'eth' ? transaction.type_name?.toUpperCase() || '' : transaction.type_name
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
