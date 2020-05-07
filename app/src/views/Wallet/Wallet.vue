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
    <v-dialog v-model="showEtherealEvent" max-width="375" persistent>
      <MessageModal
        :detail-text="messageModalDetails"
        :modal-type="MESSAGE_MODAL_TYPE_SUCCESS"
        :title="messageModalTitle"
        @onClose="$store.state.showEtherealEvent = false"
      >
        <template v-slot:image>
          <img :src="require(`../../../public/images/${$vuetify.theme.dark ? 'home-illustration' : 'learn-more'}.svg`)" style="height: 120px;" />
        </template>
      </MessageModal>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import Navbar from '../../components/helpers/Navbar'
import AccountMenu from '../../components/WalletAccount/AccountMenu'
import MessageModal from '../../components/WalletTransfer/MessageModal'
import { MESSAGE_MODAL_TYPE_SUCCESS } from '../../utils/enums'

export default {
  components: {
    Navbar,
    AccountMenu,
    MessageModal,
  },
  data() {
    return {
      drawer: false,
      MESSAGE_MODAL_TYPE_SUCCESS,
      messageModalDetails: 'Please check your email',
      messageModalTitle: 'You got a NFT Token',
    }
  },
  computed: {
    ...mapState({
      whiteLabel: 'whiteLabel',
      showEtherealEvent: 'showEtherealEvent',
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
