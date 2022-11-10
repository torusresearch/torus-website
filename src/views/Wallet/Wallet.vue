<template>
  <div v-if="isLoaded">
    <Navbar :show-language-selector="true" :header-items="headerItems">
      <template #drawer>
        <v-btn v-if="$vuetify.breakpoint.smAndDown" id="menu-dropdown-mobile-btn" icon aria-label="Open Account Menu" @click="drawer = !drawer">
          <v-icon class="torusBrand1--text">$vuetify.icons.menu</v-icon>
        </v-btn>
      </template>
    </Navbar>
    <v-navigation-drawer v-model="drawer" disable-resize-watcher app right :width="$vuetify.breakpoint.xsOnly ? '80%' : ''">
      <AccountMenu :show-nav="true" :show-language-selector="true" :header-items="headerItems"></AccountMenu>
    </v-navigation-drawer>
    <v-main>
      <hr v-if="!$vuetify.theme.dark" class="navbar-line" />
      <div class="toast-container">
        <SystemBar type="lrc" icon="info" :message="lrcMsg" />
        <SystemBar
          v-for="announcement in localeAnnouncements"
          :key="announcement.id"
          type="announcement"
          :message="announcement.announcement"
          icon="info"
          @onClose="hideAnnouncement(announcement)"
        />
        <SystemBar type="success" :message="successMsg" icon="check_circle" @onClose="clearMsg('SuccessMsg')" />
        <SystemBar type="error" :message="errorMsg" icon="alert" @onClose="clearMsg('ErrorMsg')" />
      </div>
      <router-view></router-view>
    </v-main>
    <v-dialog v-model="showConfirmDialog" persistent width="500">
      <v-card>
        <ConfirmForm
          :current-confirm-modal="currentConfirmModal"
          :is-confirm-modal="true"
          @triggerSign="handleConfirmModal"
          @triggerDeny="handleConfirmModal"
        />
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import log from 'loglevel'
import { mapActions, mapGetters, mapState } from 'vuex'

import ConfirmForm from '../../components/Confirm/ConfirmForm'
import Navbar from '../../components/helpers/Navbar'
import SystemBar from '../../components/helpers/SystemBar'
import AccountMenu from '../../components/WalletAccount/AccountMenu'

export default {
  components: {
    Navbar,
    AccountMenu,
    ConfirmForm,
    SystemBar,
  },
  data() {
    return {
      drawer: false,
      isLoaded: false,
    }
  },
  computed: {
    ...mapState({
      announcements: 'announcements',
      successMsg: 'successMsg',
      errorMsg: 'errorMsg',
      networkType: 'networkType',
      selectedAddress: 'selectedAddress',
      whiteLabel: 'whiteLabel',
      pastTransactions: 'pastTransactions',
      paymentTxStore: 'paymentTx',
      wallet: 'wallet',
      confirmModals: 'confirmModals',
    }),
    ...mapGetters(['collectibleBalances']),
    localeAnnouncements() {
      return this.announcements[this.$i18n.locale] || []
    },
    lrcMsg() {
      if (process.env.VUE_APP_TORUS_BUILD_ENV === 'lrc') {
        return 'navBar.lrcMsg'
      }
      return ''
    },
    showConfirmDialog() {
      return !!this.currentConfirmModal
    },
    currentConfirmModal() {
      if (this.confirmModals.length > 0) {
        log.info(this.confirmModals, 'modals')
        return this.confirmModals[0]
      }
      return undefined
    },
    headerItems() {
      const items = [
        { name: 'home', display: this.t('navBar.home'), route: '/wallet/home', icon: 'settings' },
        { name: 'transfer', display: this.t('navBar.transfer'), route: '/wallet/transfer', icon: 'transaction' },
        { name: 'swap', display: this.t('navBar.swap'), route: '/wallet/swap', icon: 'swap' },
        { name: 'activity', display: this.t('navBar.activity'), route: '/wallet/history', icon: 'activities' },
        { name: 'settings', display: this.t('navBar.settings'), route: '/wallet/settings', icon: 'settings' },
        { name: 'discover', display: this.t('navBar.discover'), route: '/wallet/discover', icon: 'discover' },
      ]
      if (process.env.VUE_APP_TORUS_BUILD_ENV !== 'lrc' && !this.whiteLabel.topupHide) {
        items.splice(2, 0, { name: 'top-up', display: this.t('navBar.topUp'), route: '/wallet/topup', icon: 'topup' })
      }
      return items
    },
  },
  created() {
    if (Object.keys(this.wallet).length === 0) {
      const { currentRoute } = this.$router
      // eslint-disable-next-line promise/catch-or-return
      this.$router
        .push({ name: 'login', query: currentRoute.query, hash: currentRoute.hash, params: currentRoute.params })
        .catch((_) => {})
        .finally(() => {
          this.isLoaded = true
        })
    } else {
      this.isLoaded = true
    }
  },
  methods: {
    ...mapActions(['setUserBadge', 'handleConfirmModal', 'hideAnnouncement']),
    closeBadge(data) {
      this.setUserBadge(data.type)
      if (data.returnHome && !['walletHomeMain', 'walletHome'].includes(this.$route.name)) this.$router.push({ name: 'walletHome' }).catch((_) => {})
    },
    clearMsg(statusMessage) {
      this.$store.commit(`set${statusMessage}`, '')
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'Wallet.scss';
</style>
