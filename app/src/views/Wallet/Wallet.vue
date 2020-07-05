<template>
  <div>
    <Navbar :header-items="headerItems">
      <template v-slot:drawer>
        <v-btn v-if="$vuetify.breakpoint.smAndDown" id="menu-dropdown-mobile-btn" icon aria-label="Open Account Menu" @click="drawer = !drawer">
          <v-icon class="torusBrand1--text">$vuetify.icons.menu</v-icon>
        </v-btn>
      </template>
    </Navbar>
    <v-navigation-drawer v-model="drawer" disable-resize-watcher app right :width="$vuetify.breakpoint.xsOnly ? '80%' : ''">
      <AccountMenu :header-items="headerItems"></AccountMenu>
    </v-navigation-drawer>
    <v-content>
      <hr v-if="!$vuetify.theme.dark" class="navbar-line" />
      <router-view></router-view>
    </v-content>
    <v-dialog v-if="badgesTopupDialog" v-model="badgesTopupDialog" persistent width="375">
      <BadgesAlert :badge="badges[BADGES_TOPUP]" @closeBadge="closeBadge" />
    </v-dialog>
    <v-dialog v-else-if="badgesTransactionDialog" v-model="badgesTransactionDialog" persistent width="375">
      <BadgesAlert :badge="badges[BADGES_TRANSACTION]" @closeBadge="closeBadge" />
    </v-dialog>
    <v-dialog v-else-if="badgesCollectibleDialog" v-model="badgesCollectibleDialog" persistent width="375">
      <BadgesAlert :badge="badges[BADGES_COLLECTIBLE]" @closeBadge="closeBadge" />
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'

import Navbar from '../../components/helpers/Navbar'
import AccountMenu from '../../components/WalletAccount/AccountMenu'
import BadgesAlert from '../../components/WalletHome/BadgesAlert'
import { BADGES_COLLECTIBLE, BADGES_TOPUP, BADGES_TRANSACTION } from '../../utils/enums'

export default {
  components: {
    Navbar,
    AccountMenu,
    BadgesAlert,
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
      whiteLabel: 'whiteLabel',
      badgesCompletion: 'badgesCompletion',
      pastTransactions: 'pastTransactions',
      paymentTxStore: 'paymentTx',
    }),
    ...mapGetters(['collectibleBalances']),
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
  },
  methods: {
    ...mapActions(['setUserBadge']),
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
