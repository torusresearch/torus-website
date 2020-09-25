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
    <v-main>
      <hr v-if="!$vuetify.theme.dark" class="navbar-line" />
      <router-view></router-view>
    </v-main>
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
import WalletConnect from '@walletconnect/client'
import log from 'loglevel'
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'

import Navbar from '../../components/helpers/Navbar'
import AccountMenu from '../../components/WalletAccount/AccountMenu'
import BadgesAlert from '../../components/WalletHome/BadgesAlert'
import torus from '../../torus'
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
      wcConnectorURI: 'wcConnectorURI',
      wcConnectorSession: 'wcConnectorSession',
      networkType: 'networkType',
      selectedAddress: 'selectedAddress',
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
  watch: {
    selectedAddress(newValue, oldValue) {
      if (newValue !== oldValue) {
        if (Object.keys(this.wcConnectorSession).length > 0 && this.wcConnectorSession.connected) {
          this.wcConnector.updateSession({
            chainId: this.networkType.chainId,
            accounts: [this.selectedAddress],
          })
        }
      }
    },
    networkType(newValue, oldValue) {
      if (newValue !== oldValue) {
        if (Object.keys(this.wcConnectorSession).length > 0 && this.wcConnectorSession.connected) {
          this.wcConnector.updateSession({
            chainId: this.networkType.chainId,
            accounts: [this.selectedAddress],
          })
        }
      }
    },
    wcConnectorURI(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.initWalletConnect(newValue)
      }
    },
  },
  async mounted() {
    await this.initWalletConnect(this.wcConnectorURI)
  },
  methods: {
    ...mapActions(['setUserBadge']),
    ...mapMutations(['setWCConnectorSession']),
    closeBadge(data) {
      this.setUserBadge(data.type)
      if (data.returnHome && !['walletHomeMain', 'walletHome'].includes(this.$route.name)) this.$router.push({ name: 'walletHome' })
    },
    async initWalletConnect(uri) {
      if (uri) {
        log.info('CREATING NEW WALLET CONNECT SESSION', uri)
        this.wcConnector = new WalletConnect({ uri })
        this.setWCConnectorSession(JSON.parse(JSON.stringif(this.wcConnector.session)))
      } else if (Object.keys(this.wcConnectorSession).length > 0) {
        log.info('THERE IS A SESSION ALREADY', this.wcConnectorSession)
        this.wcConnector = new WalletConnect({ session: this.wcConnectorSession })
      } else {
        return
      }
      if (!this.wcConnector.connected) {
        await this.wcConnector.createSession()
      }
      log.info('THIS IS THE WCCONNECTOR', this.wcConnector)
      this.wcConnector.on('session_request', (err, payload) => {
        log.info('SESSION REQUEST', err, payload)
        this.wcConnector.approveSession({ chainId: this.networkType.chainId, accounts: [this.selectedAddress] })
      })
      this.wcConnector.on('session_update', (err, payload) => {
        log.info('SESSION UPDATE', err, payload)
        this.setWCConnectorSession(JSON.parse(JSON.stringify(this.wcConnector.session)))
      })
      this.wcConnector.on('call_request', (err, payload) => {
        log.info('CALL REQUEST', err, payload, torus)
        payload.params[0].isWalletConnectRequest = 'true'
        torus.torusController.provider.send(payload, (error, result) => {
          if (err) {
            log.info(`FAILED REJECT REQUEST, ERROR ${err.message}`)
            this.wcConnector.rejectRequest({ id: payload.id, error: { message: `Failed or Rejected Request ${error.message}` } })
          } else {
            log.info(`SUCCEEDED APPROVE REQUEST, RESULT ${JSON.stringify(result)}`)
            this.wcConnector.approveRequest({ id: payload.id, result })
          }
        })
      })
      this.wcConnector.on('connect', (err, payload) => {
        log.info('CONNECT', err, payload)
      })
      this.wcConnector.on('disconnect', (err, payload) => {
        log.info('DISCONNECT', err, payload)
        this.setWCConnectorURI('')
        this.setWCConnectorSession({})
      })
      log.info('SESSION IS THIS', this.wcConnector.session)
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'Wallet.scss';
</style>
