<template>
  <nav class="header-container pa-0">
    <v-app-bar class="container" :class="$vuetify.breakpoint.xsOnly ? 'pa-0' : 'px-2 py-0'">
      <router-link class="hidden-xs-only" :to="{ name: 'walletHome' }">
        <img
          class="home-link"
          alt="Torus Logo"
          width="135"
          height="30"
          :src="require(`../../../../public/images/torus-logo-${$vuetify.theme.dark ? 'white' : 'blue'}.svg`)"
        />
      </router-link>
      <div class="beta-text caption pr-4 hidden-xs-only">Beta</div>
      <v-toolbar-title class="mt-1 hidden-sm-and-up">
        <router-link id="logo-home-lnk" :to="{ name: 'walletHome' }">
          <img :src="require('../../../../public/img/icons/t-fill.svg')" width="35" height="30" alt="Torus Logo" />
        </router-link>
        <div class="primary--text subtitle-2 beta-text-mobile">Beta</div>
      </v-toolbar-title>
      <v-spacer class="hidden-sm-and-up"></v-spacer>
      <v-tabs centered class="hidden-xs-only">
        <v-tab v-for="headerItem in headerItems" :key="headerItem.name" :id="`${headerItem.name}-link`" :to="headerItem.route">
          {{ headerItem.display }}
        </v-tab>
      </v-tabs>

      <v-btn id="menu-dropdown-mobile-btn" class="hidden-sm-and-up" icon @click="drawer = !drawer" aria-label="Open Account Menu">
        <img :src="require('../../../../public/img/icons/menu-primary.svg')" alt="Burger Icon" />
      </v-btn>

      <v-menu offset-y bottom left z-index="20" :close-on-content-click="false">
        <template v-slot:activator="{ on }">
          <v-btn id="menu-dropdown-btn" class="hidden-xs-only" small text v-on="on">
            <span class="text-capitalize subtitle-2">{{ userName }}</span>
            <v-icon class="ml-2 mt-0" small>$vuetify.icons.select</v-icon>
          </v-btn>
        </template>

        <account-menu></account-menu>
      </v-menu>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" disable-resize-watcher app right :width="$vuetify.breakpoint.xsOnly ? '80%' : ''">
      <account-menu :headerItems="headerItems"></account-menu>
    </v-navigation-drawer>
  </nav>
</template>

<script>
import AccountMenu from '../../WalletAccount/AccountMenu'

export default {
  components: {
    AccountMenu
  },
  data() {
    return {
      drawer: false,
      selectedItem: 'home',
      headerItems: [
        { name: 'home', display: 'Home', route: '/wallet/home', icon: 'settings' },
        { name: 'transfer', display: 'Transfer', route: '/wallet/transfer', icon: 'transaction' },
        { name: 'top-up', display: 'Top up', route: '/wallet/topup', icon: 'topup' },
        { name: 'activity', display: 'Activity', route: '/wallet/history', icon: 'activities' },
        { name: 'settings', display: 'Settings', route: '/wallet/settings', icon: 'settings' }
      ]
    }
  },
  computed: {
    userName() {
      return this.$store.state.userInfo.name
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'Navbar.scss';
</style>
