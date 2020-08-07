<template>
  <div>
    <Navbar :show-nav="false" :show-language-selector="false">
      <template v-slot:drawer>
        <v-btn v-if="$vuetify.breakpoint.smAndDown" id="menu-dropdown-mobile-btn" icon aria-label="Open Account Menu" @click="drawer = !drawer">
          <v-icon class="torusBrand1--text">$vuetify.icons.menu</v-icon>
        </v-btn>
      </template>
    </Navbar>
    <v-navigation-drawer v-model="drawer" disable-resize-watcher app right :width="$vuetify.breakpoint.xsOnly ? '80%' : ''">
      <AccountMenu :show-nav="false" :show-language-selector="false"></AccountMenu>
    </v-navigation-drawer>
    <v-main>
      <hr v-if="!$vuetify.theme.dark" class="navbar-line" />
      <router-view></router-view>
    </v-main>
  </div>
</template>

<script>
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
}
</script>

<style lang="scss" scoped>
@import 'Tkey.scss';
</style>
