<template>
  <nav class="header-container pa-0">
    <v-app-bar fixed :class="$vuetify.breakpoint.xsOnly ? 'pa-0' : 'px-2 py-0'">
      <router-link class="hidden-xs-only" :to="{ name: 'walletHome' }">
        <img
          class="home-link"
          alt="Torus Logo"
          width="135"
          height="30"
          :src="require(`../../../../public/images/torus-logo-${$vuetify.theme.dark ? 'white' : 'blue'}.svg`)"
        />
      </router-link>
      <v-toolbar-title class="mt-1 hidden-sm-and-up">
        <router-link id="logo-home-lnk" :to="{ name: 'walletHome' }">
          <img :src="require('../../../../public/img/icons/t-fill.svg')" width="35" height="30" alt="Torus Logo" />
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-tabs v-if="!$vuetify.breakpoint.smAndDown" centered>
        <v-tab v-for="headerItem in headerItems" :id="`${headerItem.name}-link`" :key="headerItem.display" :to="headerItem.route">
          {{ headerItem.display }}
        </v-tab>
      </v-tabs>

      <v-btn v-if="$vuetify.breakpoint.smAndDown" id="menu-dropdown-mobile-btn" icon aria-label="Open Account Menu" @click="drawer = !drawer">
        <img :src="require('../../../../public/img/icons/menu-primary.svg')" alt="Burger Icon" />
      </v-btn>

      <LanguageSelector v-if="!$vuetify.breakpoint.smAndDown"></LanguageSelector>
      <v-menu v-if="!$vuetify.breakpoint.smAndDown" offset-y bottom left z-index="20" :close-on-content-click="false">
        <template v-slot:activator="{ on }">
          <v-btn id="menu-dropdown-btn" small text v-on="on">
            <span class="text-capitalize subtitle-2">{{ userName }}</span>
            <v-icon class="ml-2 mt-0" small>$vuetify.icons.select</v-icon>
          </v-btn>
        </template>

        <AccountMenu></AccountMenu>
      </v-menu>
      <v-system-bar
        v-show="successMsg"
        fixed
        :color="`success ${$vuetify.theme.dark ? '' : 'lighten-5'}`"
        :class="`${$vuetify.theme.dark ? 'white--text' : 'success--text text--darken-1'}`"
      >
        <div class="container d-flex align-center">
          <v-spacer />
          <v-icon small :class="`${$vuetify.theme.dark ? 'white--text' : 'success--text text--darken-1'}`">$vuetify.icons.check_circle</v-icon>
          <span class="caption">
            {{ capitalizeFirstLetter(t(successMsg)) }}
          </span>
          <v-spacer />
          <v-icon :class="`${$vuetify.theme.dark ? 'white--text' : 'success--text text--darken-1'}`" @click="clearMsg('SuccessMsg')">
            $vuetify.icons.close
          </v-icon>
        </div>
      </v-system-bar>
      <v-system-bar
        v-show="errorMsg"
        fixed
        :color="`error ${$vuetify.theme.dark ? '' : 'lighten-5'}`"
        :class="`${$vuetify.theme.dark ? 'white--text' : 'error--text text--darken-1'}`"
      >
        <div class="container d-flex align-center">
          <v-spacer />
          <v-icon small :class="`${$vuetify.theme.dark ? 'white--text' : 'error--text text--darken-1'}`">$vuetify.icons.info</v-icon>
          <span class="caption">
            {{ capitalizeFirstLetter(t(errorMsg)) }}
          </span>
          <v-spacer />
          <v-icon :class="`${$vuetify.theme.dark ? 'white--text' : 'error--text text--darken-1'}`" @click="clearMsg('SuccessMsg')">
            $vuetify.icons.close
          </v-icon>
        </div>
      </v-system-bar>
      <v-system-bar
        v-show="lrcMsg"
        fixed
        :color="`warning ${$vuetify.theme.dark ? '' : 'lighten-5'}`"
        :class="`${$vuetify.theme.dark ? 'white--text' : 'warning--text text--darken-1'}`"
      >
        <div class="container d-flex align-center">
          <v-spacer />
          <v-icon small :class="`${$vuetify.theme.dark ? 'white--text' : 'warning--text text--darken-1'}`">$vuetify.icons.info</v-icon>
          <span class="caption">
            {{ capitalizeFirstLetter(t(lrcMsg)) }}
          </span>
          <v-spacer />
        </div>
      </v-system-bar>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" disable-resize-watcher app right :width="$vuetify.breakpoint.xsOnly ? '80%' : ''">
      <AccountMenu :header-items="headerItems"></AccountMenu>
    </v-navigation-drawer>
  </nav>
</template>

<script>
import { capitalizeFirstLetter } from '../../../utils/utils'
import AccountMenu from '../../WalletAccount/AccountMenu'
import LanguageSelector from '../LanguageSelector'

export default {
  components: {
    AccountMenu,
    LanguageSelector
  },
  data() {
    return {
      drawer: false,
      selectedItem: 'home'
    }
  },
  computed: {
    bannerColor() {
      return this.$vuetify.theme.isDark ? this.$vuetify.theme.themes.dark.infoBanner : this.$vuetify.theme.themes.light.infoBanner
    },
    userName() {
      return this.$store.state.userInfo.name
    },
    successMsg() {
      return this.$store.state.successMsg
    },
    errorMsg() {
      return this.$store.state.errorMsg
    },
    headerItems() {
      const items = [
        { name: 'home', display: this.t('navBar.home'), route: '/wallet/home', icon: 'settings' },
        { name: 'transfer', display: this.t('navBar.transfer'), route: '/wallet/transfer', icon: 'transaction' },
        { name: 'activity', display: this.t('navBar.activity'), route: '/wallet/history', icon: 'activities' },
        { name: 'settings', display: this.t('navBar.settings'), route: '/wallet/settings', icon: 'settings' }
      ]
      if (process.env.VUE_APP_TORUS_BUILD_ENV !== 'lrc' && process.env.VUE_APP_TORUS_BUILD_ENV !== 'alpha5') {
        items.splice(2, 0, { name: 'top-up', display: this.t('navBar.topUp'), route: '/wallet/topup', icon: 'topup' })
      }
      return items
    },
    lrcMsg() {
      if (process.env.VUE_APP_TORUS_BUILD_ENV === 'lrc' || process.env.VUE_APP_TORUS_BUILD_ENV === 'alpha5') {
        return 'You are using the test cluster on torus network'
      }
      return ''
    }
  },
  methods: {
    capitalizeFirstLetter,
    clearMsg(statusMessage) {
      this.$store.commit(`set${statusMessage}`, '')
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'Navbar.scss';
</style>
