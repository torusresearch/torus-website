<template>
  <v-app-bar app flat class="header-container" :color="$vuetify.theme.dark ? '' : 'white'">
    <div v-if="!showNav" class="d-flex align-end">
      <img
        v-if="!$vuetify.breakpoint.xsOnly"
        class="home-link mr-1"
        alt="Torus Logo"
        :width="$store.state.whiteLabel.isActive ? '' : '135'"
        height="30"
        :src="getLogo.logo"
      />
      <img v-else src="../../../assets/img/icons/t-fill.svg" width="35" height="30" alt="Torus Logo" />
    </div>
    <div v-else class="d-flex align-end">
      <router-link v-if="!$vuetify.breakpoint.xsOnly" :to="{ name: 'walletHome' }">
        <img class="home-link mr-1" alt="Torus Logo" :width="$store.state.whiteLabel.isActive ? '' : '135'" height="30" :src="getLogo.logo" />
      </router-link>
      <router-link v-if="$vuetify.breakpoint.xsOnly" id="logo-home-lnk" :to="{ name: 'walletHome' }">
        <img src="../../../assets/img/icons/t-fill.svg" width="35" height="30" alt="Torus Logo" />
      </router-link>
    </div>
    <v-spacer></v-spacer>
    <v-tabs v-if="!$vuetify.breakpoint.smAndDown && showNav" centered>
      <v-tab
        v-for="headerItem in headerItems"
        :id="`${headerItem.name}-link`"
        :key="headerItem.display"
        :class="`gmt-page-${headerItem.name === 'history' ? 'activity' : headerItem.name}`"
        :to="headerItem.route"
      >
        {{ headerItem.display }}
      </v-tab>
    </v-tabs>

    <v-spacer></v-spacer>

    <slot name="drawer"></slot>

    <LanguageSelector v-if="!$vuetify.breakpoint.smAndDown && showLanguageSelector"></LanguageSelector>
    <v-menu v-if="!$vuetify.breakpoint.smAndDown" offset-y bottom left z-index="20" :close-on-content-click="false">
      <template v-slot:activator="{ on }">
        <v-btn id="menu-dropdown-btn" small text aria-label="View Account Menu" v-on="on">
          <span class="text-subtitle-2">{{ userInfo.name || `${t('login.your')} ${t('accountMenu.account')}` }}</span>
          <v-icon class="ml-2 mt-0" small>$vuetify.icons.select</v-icon>
        </v-btn>
      </template>

      <AccountMenu></AccountMenu>
    </v-menu>
    <!-- Wallet System Bar -->
    <v-system-bar
      v-show="successMsg"
      fixed
      :color="`success ${$vuetify.theme.dark ? '' : 'lighten-5'}`"
      :class="[`${$vuetify.theme.dark ? 'white--text' : 'success--text text--darken-1'}`, lrcMsg ? 'is-lrc' : '']"
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
      :class="[`${$vuetify.theme.dark ? 'white--text' : 'error--text text--darken-1'}`, lrcMsg ? 'is-lrc' : '']"
    >
      <div class="container d-flex align-center">
        <v-spacer />
        <v-icon small :class="`${$vuetify.theme.dark ? 'white--text' : 'error--text text--darken-1'}`">$vuetify.icons.info</v-icon>
        <span class="caption">
          {{ capitalizeFirstLetter(t(errorMsg)) }}
        </span>
        <v-spacer />
        <v-icon :class="`${$vuetify.theme.dark ? 'white--text' : 'error--text text--darken-1'}`" @click="clearMsg('ErrorMsg')">
          $vuetify.icons.close
        </v-icon>
      </div>
    </v-system-bar>
    <!-- TKey System Bar -->
    <v-system-bar
      v-show="tkeySuccess"
      fixed
      :color="`success ${$vuetify.theme.dark ? '' : 'lighten-5'}`"
      :class="[`${$vuetify.theme.dark ? 'white--text' : 'success--text text--darken-1'}`, lrcMsg ? 'is-lrc' : '']"
    >
      <div class="container d-flex align-center">
        <v-spacer />
        <v-icon small :class="`${$vuetify.theme.dark ? 'white--text' : 'success--text text--darken-1'}`">$vuetify.icons.check_circle</v-icon>
        <span class="caption">
          {{ tkeySuccess }}
        </span>
        <v-spacer />
        <v-icon :class="`${$vuetify.theme.dark ? 'white--text' : 'success--text text--darken-1'}`" @click="clearTkeySuccess">
          $vuetify.icons.close
        </v-icon>
      </div>
    </v-system-bar>
    <v-system-bar
      v-show="tkeyError"
      fixed
      :color="`error ${$vuetify.theme.dark ? '' : 'lighten-5'}`"
      :class="[`${$vuetify.theme.dark ? 'white--text' : 'error--text text--darken-1'}`, lrcMsg ? 'is-lrc' : '']"
    >
      <div class="container d-flex align-center">
        <v-spacer />
        <v-icon small :class="`${$vuetify.theme.dark ? 'white--text' : 'error--text text--darken-1'}`">$vuetify.icons.info</v-icon>
        <span class="caption">
          {{ tkeyError }}
        </span>
        <v-spacer />
        <v-icon :class="`${$vuetify.theme.dark ? 'white--text' : 'error--text text--darken-1'}`" @click="clearTkeyError">$vuetify.icons.close</v-icon>
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
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'

import { capitalizeFirstLetter } from '../../../utils/utils'
import AccountMenu from '../../WalletAccount/AccountMenu'
import LanguageSelector from '../LanguageSelector'

export default {
  components: {
    AccountMenu,
    LanguageSelector,
  },
  props: {
    headerItems: {
      type: Array,
      default: () => [],
    },
    showNav: {
      type: Boolean,
      default: true,
    },
    showLanguageSelector: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      selectedItem: 'home',
    }
  },
  computed: {
    ...mapState(['userInfo', 'successMsg', 'errorMsg', 'tKeyStore']),
    ...mapGetters(['getLogo']),
    bannerColor() {
      return this.$vuetify.theme.isDark ? this.$vuetify.theme.themes.dark.infoBanner : this.$vuetify.theme.themes.light.infoBanner
    },
    lrcMsg() {
      if (process.env.VUE_APP_TORUS_BUILD_ENV === 'lrc') {
        return 'navBar.lrcMsg'
      }
      return ''
    },
    tkeyError() {
      return this.t(this.tKeyStore.error || '')
    },
    tkeySuccess() {
      return this.tKeyStore.success || ''
    },
  },
  methods: {
    ...mapActions(['clearTkeyError', 'clearTkeySuccess']),
    capitalizeFirstLetter,
    clearMsg(statusMessage) {
      this.$store.commit(`set${statusMessage}`, '')
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'Navbar.scss';
</style>
