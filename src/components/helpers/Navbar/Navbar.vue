<template>
  <v-app-bar app flat class="header-container" :color="$vuetify.theme.dark ? '' : 'white'">
    <div class="d-flex align-end">
      <router-link v-if="!$vuetify.breakpoint.xsOnly || $store.state.whiteLabel.isActive" :to="{ name: 'walletHome' }" :style="{ lineHeight: 0 }">
        <v-img class="home-link mr-1" contain position="left center" alt="Torus Logo" :max-height="30" :width="193" :src="getLogo.logo" />
      </router-link>
      <router-link v-else id="logo-home-lnk" :to="{ name: 'walletHome' }" :style="{ lineHeight: 0 }">
        <img src="../../../assets/img/icons/t-fill.svg" width="35" height="30" alt="Torus Logo" />
      </router-link>
    </div>
    <v-spacer></v-spacer>
    <v-tabs v-if="!$vuetify.breakpoint.smAndDown" centered>
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
      <template #activator="{ on }">
        <v-btn id="menu-dropdown-btn" small text aria-label="View Account Menu" v-on="on">
          <span class="text-subtitle-2">{{ userInfo.name || `${t('login.your')} ${t('accountMenu.account')}` }}</span>
          <v-icon class="ml-2 mt-0" small>$vuetify.icons.select</v-icon>
        </v-btn>
      </template>

      <AccountMenu></AccountMenu>
    </v-menu>
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
  </v-app-bar>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'

import { capitalizeFirstLetter } from '../../../utils/utils'
import AccountMenu from '../../WalletAccount/AccountMenu'
import LanguageSelector from '../LanguageSelector'
import SystemBar from '../SystemBar'

export default {
  components: {
    AccountMenu,
    LanguageSelector,
    SystemBar,
  },
  props: {
    headerItems: {
      type: Array,
      default: () => [],
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
    ...mapState(['announcements', 'userInfo', 'successMsg', 'errorMsg']),
    ...mapGetters(['getLogo']),
    localeAnnouncements() {
      return this.announcements[this.$vuetify.lang.current] || []
    },
    lrcMsg() {
      if (process.env.VUE_APP_TORUS_BUILD_ENV === 'lrc') {
        return 'navBar.lrcMsg'
      }
      return ''
    },
  },
  methods: {
    ...mapActions(['hideAnnouncement']),
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
