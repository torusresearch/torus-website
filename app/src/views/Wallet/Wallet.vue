<template>
  <div>
    <navbar :header-items="headerItems">
      <template v-slot:drawer>
        <v-btn id="menu-dropdown-mobile-btn" v-if="$vuetify.breakpoint.smAndDown" icon @click="drawer = !drawer" aria-label="Open Account Menu">
          <img :src="require('../../../public/img/icons/menu-primary.svg')" alt="Burger Icon" />
        </v-btn>
      </template>
    </navbar>
    <v-navigation-drawer v-model="drawer" disable-resize-watcher app right :width="$vuetify.breakpoint.xsOnly ? '80%' : ''">
      <account-menu :headerItems="headerItems"></account-menu>
    </v-navigation-drawer>
    <v-content>
      <hr v-if="!$vuetify.theme.dark" class="navbar-line" />
      <router-view></router-view>
    </v-content>
  </div>
</template>

<script>
import Navbar from '../../components/helpers/Navbar'
import AccountMenu from '../../components/WalletAccount/AccountMenu'

export default {
  components: {
    Navbar,
    AccountMenu
  },
  data() {
    return {
      drawer: false
    }
  },
  computed: {
    headerItems() {
      const items = [
        { name: 'home', display: this.t('navBar.home'), route: '/wallet/home', icon: 'settings' },
        { name: 'transfer', display: this.t('navBar.transfer'), route: '/wallet/transfer', icon: 'transaction' },
        { name: 'activity', display: this.t('navBar.activity'), route: '/wallet/history', icon: 'activities' },
        { name: 'settings', display: this.t('navBar.settings'), route: '/wallet/settings', icon: 'settings' }
      ]
      if (process.env.VUE_APP_TORUS_BUILD_ENV !== 'lrc') {
        items.splice(2, 0, { name: 'top-up', display: this.t('navBar.topUp'), route: '/wallet/topup', icon: 'topup' })
      }
      return items
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'Wallet.scss';
</style>
