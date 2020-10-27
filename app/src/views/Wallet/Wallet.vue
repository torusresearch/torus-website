<template>
  <div>
    <Navbar :show-nav="!isTkeyScreen" :show-language-selector="!isTkeyScreen" :header-items="headerItems">
      <template v-slot:drawer>
        <v-btn v-if="$vuetify.breakpoint.smAndDown" id="menu-dropdown-mobile-btn" icon aria-label="Open Account Menu" @click="drawer = !drawer">
          <v-icon class="torusBrand1--text">$vuetify.icons.menu</v-icon>
        </v-btn>
      </template>
    </Navbar>
    <v-navigation-drawer v-model="drawer" disable-resize-watcher app right :width="$vuetify.breakpoint.xsOnly ? '80%' : ''">
      <AccountMenu :show-nav="!isTkeyScreen" :show-language-selector="!isTkeyScreen" :header-items="headerItems"></AccountMenu>
    </v-navigation-drawer>
    <v-main>
      <hr v-if="!$vuetify.theme.dark" class="navbar-line" />
      <router-view></router-view>
    </v-main>
    <!-- <v-dialog v-if="!isTkeyScreen && badgesTopupDialog" v-model="badgesTopupDialog" persistent width="375">
      <BadgesAlert :badge="badges[BADGES_TOPUP]" @closeBadge="closeBadge" />
    </v-dialog>
    <v-dialog v-else-if="!isTkeyScreen && badgesTransactionDialog" v-model="badgesTransactionDialog" persistent width="375">
      <BadgesAlert :badge="badges[BADGES_TRANSACTION]" @closeBadge="closeBadge" />
    </v-dialog>
    <v-dialog v-else-if="!isTkeyScreen && badgesCollectibleDialog" v-model="badgesCollectibleDialog" persistent width="375">
      <BadgesAlert :badge="badges[BADGES_COLLECTIBLE]" @closeBadge="closeBadge" />
    </v-dialog> -->
    <v-dialog v-model="showDialog" persistent width="500">
      <v-card>
        <ConfirmForm
          :current-confirm-modal="currentConfirmModal"
          :is-confirm-modal="true"
          @triggerSign="handleConfirmModal"
          @triggerDeny="handleConfirmModal"
        />
      </v-card>
      <!-- <v-card>
        <v-card-title>Confirm</v-card-title>
        <v-card-text>Confirm or deny this tx {{ currentConfirmModal && currentConfirmModal.id }}</v-card-text>
        <v-card-actions>
          <v-btn text color="deep-purple accent-4" @click="handleConfirmModal({ ...currentConfirmModal, approve: true })">Confirm</v-btn>
          <v-btn text color="deep-purple accent-4" @click="handleConfirmModal({ ...currentConfirmModal, approve: false })">Deny</v-btn>
        </v-card-actions>
      </v-card> -->
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'

import ConfirmForm from '../../components/Confirm/ConfirmForm'
import Navbar from '../../components/helpers/Navbar'
import AccountMenu from '../../components/WalletAccount/AccountMenu'
// import BadgesAlert from '../../components/WalletHome/BadgesAlert'
import { BADGES_COLLECTIBLE, BADGES_TOPUP, BADGES_TRANSACTION } from '../../utils/enums'

export default {
  components: {
    Navbar,
    AccountMenu,
    ConfirmForm,
    // BadgesAlert,
  },
  data() {
    return {
      drawer: false,
      BADGES_COLLECTIBLE,
      BADGES_TOPUP,
      BADGES_TRANSACTION,
    }
  },
  computed: {
    ...mapState({
      networkType: 'networkType',
      selectedAddress: 'selectedAddress',
      whiteLabel: 'whiteLabel',
      badgesCompletion: 'badgesCompletion',
      pastTransactions: 'pastTransactions',
      paymentTxStore: 'paymentTx',
      wallet: 'wallet',
      confirmModals: 'confirmModals',
    }),
    ...mapGetters(['collectibleBalances']),
    showDialog() {
      return !!this.currentConfirmModal
    },
    currentConfirmModal() {
      if (this.confirmModals.length > 0) {
        const {
          txType: type,
          txParams,
          selectedCurrency,
          currencyData,
          balance,
          networkType: network,
          jwtToken,
          tokenRates,
          origin,
        } = this.confirmModals[0]
        return {
          type,
          txParams,
          selectedCurrency,
          currencyData,
          balance,
          network,
          jwtToken,
          tokenRates,
          origin,
        }
      }
      return undefined
    },
    headerItems() {
      const items = [
        { name: 'home', display: this.t('navBar.home'), route: '/wallet/home', icon: 'settings' },
        { name: 'transfer', display: this.t('navBar.transfer'), route: '/wallet/transfer', icon: 'transaction' },
        { name: 'activity', display: this.t('navBar.activity'), route: '/wallet/history', icon: 'activities' },
        { name: 'settings', display: this.t('navBar.settings'), route: '/wallet/settings', icon: 'settings' },
      ]
      if (process.env.VUE_APP_TORUS_BUILD_ENV !== 'lrc' && !this.whiteLabel.topupHide) {
        items.splice(2, 0, { name: 'top-up', display: this.t('navBar.topUp'), route: '/wallet/topup', icon: 'topup' })
      }
      return items
    },
    badges() {
      return {
        [BADGES_TOPUP]: {
          type: BADGES_TOPUP,
          image: 'badge-topped-wallet',
          header: this.t('walletHome.topupTitle'),
          details1: this.t('walletHome.topupDetails1'),
          details2: this.t('walletHome.topupDetails2'),
        },
        [BADGES_TRANSACTION]: {
          type: BADGES_TRANSACTION,
          image: 'badge-first-transaction',
          header: this.t('walletHome.topupTransactionTitle'),
          details1: this.t('walletHome.topupTransactionDetails1'),
          details2: this.t('walletHome.topupTransactionDetails2'),
        },
        [BADGES_COLLECTIBLE]: {
          type: BADGES_COLLECTIBLE,
          image: 'badge-first-collectible',
          header: this.t('walletHome.collectiblesTitle'),
          details1: this.t('walletHome.collectiblesDetails1'),
          details2: this.t('walletHome.collectiblesDetails2'),
        },
      }
    },
    badgesCollectibleDialog() {
      return this.collectibleBalances && this.collectibleBalances.length > 0 && this.badgesCompletion[BADGES_COLLECTIBLE] === false
    },
    badgesTopupDialog() {
      return this.paymentTxStore && this.paymentTxStore.length > 0 && this.badgesCompletion[BADGES_TOPUP] === false
    },
    badgesTransactionDialog() {
      return this.pastTransactions && this.pastTransactions.length > 0 && this.badgesCompletion[BADGES_TRANSACTION] === false
    },
    isTkeyScreen() {
      return ['tkeyCreate', 'tkeyDappInput', 'tKeyInput'].includes(this.$route.name)
    },
  },
  mounted() {
    if (Object.keys(this.wallet).length === 0) {
      this.$router.push({ name: 'login' })
    }
  },
  methods: {
    ...mapActions(['setUserBadge', 'handleConfirmModal']),
    closeBadge(data) {
      this.setUserBadge(data.type)
      if (data.returnHome && !['walletHomeMain', 'walletHome'].includes(this.$route.name)) this.$router.push({ name: 'walletHome' })
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'Wallet.scss';
</style>
