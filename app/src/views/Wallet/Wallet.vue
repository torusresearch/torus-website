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
  </div>
</template>

<script>
import { mapState } from 'vuex'

import Navbar from '../../components/helpers/Navbar'
import AccountMenu from '../../components/WalletAccount/AccountMenu'

export default {
  components: {
    Navbar,
    AccountMenu,
  },
  data() {
    return {
      drawer: false,
    }
  },
  computed: {
    ...mapState({
      whiteLabel: 'whiteLabel',
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
  },
}
</script>

<style lang="scss" scoped>
@import 'Wallet.scss';
</style>
