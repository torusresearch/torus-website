<template>
  <div>
    <Navbar :header-items="headerItems">
      <template v-slot:drawer>
        <v-btn v-if="$vuetify.breakpoint.smAndDown" id="menu-dropdown-mobile-btn" icon aria-label="Open Account Menu" @click="drawer = !drawer">
          <img :src="require('../../../public/img/icons/menu-primary.svg')" alt="Burger Icon" />
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
    <v-dialog v-if="badgesCompletion[BADGES_TOPUP]" v-model="badgesCompletion[BADGES_TOPUP]" persistent width="375">
      <BadgesAlert :badge="badges[BADGES_TOPUP]" @closeBadge="closeBadge" />
    </v-dialog>
    <v-dialog v-else-if="badgesCompletion[BADGES_TRANSACTION]" v-model="badgesCompletion[BADGES_TRANSACTION]" persistent width="375">
      <BadgesAlert :badge="badges[BADGES_TRANSACTION]" @closeBadge="closeBadge" />
    </v-dialog>
    <v-dialog v-else-if="badgesCompletion[BADGES_COLLECTIBLE]" v-model="badgesCompletion[BADGES_COLLECTIBLE]" persistent width="375">
      <BadgesAlert :badge="badges[BADGES_COLLECTIBLE]" @closeBadge="closeBadge" />
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'

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
    }),
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
          header: 'Congratulations',
          details1: 'Good work in completing your first Top up.',
          details2: 'You are all set up!',
        },
        [BADGES_TRANSACTION]: {
          type: BADGES_TRANSACTION,
          image: 'badge-first-transaction',
          header: 'Well Done',
          details1: 'You just made your first transaction.',
          details2: 'You are definitely on the right track!',
        },
        [BADGES_COLLECTIBLE]: {
          type: BADGES_COLLECTIBLE,
          image: 'badge-first-collectible',
          header: 'You nailed it',
          details1: 'You have started your first collection.',
          details2: 'Keep it going!',
        },
      }
    },
  },
  methods: {
    closeBadge(type) {
      // Move to action and trigger request
      this.badgesCompletion[type] = false
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'Wallet.scss';
</style>
