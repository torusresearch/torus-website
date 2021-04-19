<template>
  <v-card :flat="$vuetify.breakpoint.smAndDown" width="400" class="account-menu" :class="{ 'is-mobile': $vuetify.breakpoint.smAndDown }">
    <v-list class="pb-0 mb-2">
      <v-list-item>
        <v-list-item-avatar class="ml-2 mr-3">
          <img
            :src="userInfo.profileImage"
            class="align-start"
            :alt="userName"
            onerror="if (!this.src.includes('/images/person.jpeg')) this.src = '/images/person.jpeg';"
          />
        </v-list-item-avatar>
        <v-list-item-title>
          <div class="font-weight-bold title d-flex">
            <div id="account-name" class="torus-account--name mr-1">
              <span>{{ userName }}</span>
            </div>
            <div>{{ t('accountMenu.account') }}</div>
          </div>
        </v-list-item-title>
      </v-list-item>
    </v-list>

    <div class="px-3 mb-3 account-list">
      <div
        v-for="(acc, index) in wallets"
        :key="acc.address"
        class="d-flex flex-column account-list__item mb-2 py-2 px-3"
        :class="{ active: acc.address === selectedAddress, 'theme--dark': $vuetify.theme.dark }"
        @click="changeAccount(acc.address)"
      >
        <div class="d-flex align-center">
          <div class="mr-2" :style="{ lineHeight: '0' }">
            <v-icon :class="$vuetify.theme.dark ? 'torusGray1--text' : 'torusFont2--text'" size="16">
              $vuetify.icons.{{ userIcon(acc.accountType) }}
            </v-icon>
          </div>
          <div class="caption text_1--text font-weight-bold account-list__user-email" :style="{ paddingLeft: '2px' }">
            <span>
              {{ userEmail(acc) }}
            </span>
          </div>
          <div class="caption ml-auto text_2--text text-right">
            <span>{{ acc.totalPortfolioValue }} {{ selectedCurrency }}</span>
          </div>
        </div>
        <div class="d-flex align-start mt-1">
          <div class="account-list__address-container pt-1" :style="{ maxWidth: $vuetify.breakpoint.xsOnly ? '140px' : '180px' }">
            <div v-if="userId && index === 0" class="account-list__address">{{ userId }}</div>
            <div class="account-list__address mt-1">{{ acc.address }}</div>
          </div>
          <div class="ml-auto">
            <span class="mr-1">
              <ShowToolTip :is-btn="true" :address="acc.address">
                <v-icon size="12" class="torusFont2--text" v-text="'$vuetify.icons.copy'" />
              </ShowToolTip>
            </span>
            <span class="mr-1">
              <ExportQrCode :custom-address="acc.address">
                <v-icon class="torusFont2--text" x-small v-text="'$vuetify.icons.qr'" />
              </ExportQrCode>
            </span>
            <span>
              <v-btn icon small class="etherscan-lnk" :href="etherscanAddressLink(acc.address)" target="_blank" rel="noreferrer noopener">
                <v-icon class="torusFont2--text" x-small v-text="'$vuetify.icons.link'" />
              </v-btn>
            </span>
          </div>
        </div>
      </div>
    </div>
    <v-divider></v-divider>
    <v-list class="ml-1 py-1">
      <v-list-item id="import-account-btn" @click="accountImportDialog = true">
        <v-list-item-action class="mr-2">
          <v-icon size="24" class="text_2--text" v-text="'$vuetify.icons.add'" />
        </v-list-item-action>
        <v-list-item-content class="caption font-weight-bold text_1--text">{{ t('accountMenu.importAccount') }}</v-list-item-content>
      </v-list-item>
      <v-dialog v-model="accountImportDialog" width="600" class="import-dialog">
        <AccountImport @onClose="accountImportDialog = false" />
      </v-dialog>
    </v-list>

    <v-divider></v-divider>

    <v-list v-if="$vuetify.breakpoint.smAndDown && showNav" class="py-1" :style="{ marginLeft: '6px' }">
      <v-list-item
        v-for="headerItem in filteredMenu"
        :id="`${headerItem.name}-link-mobile`"
        :key="headerItem.name"
        link
        router
        :to="headerItem.route"
      >
        <v-list-item-action class="mr-1" :style="{ marginLeft: '3px' }">
          <v-icon :size="headerItem.icon === 'transaction' ? 13 : 15" class="text_2--text" v-text="`$vuetify.icons.${headerItem.icon}`" />
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title class="caption font-weight-bold text_1--text">{{ headerItem.display }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-divider v-if="$vuetify.breakpoint.smAndDown"></v-divider>
    <v-list class="ml-1">
      <v-list-item href="https://docs.tor.us/#users" target="_blank" rel="noreferrer noopener">
        <v-list-item-action class="mr-2 justify-center">
          <v-icon size="20" class="text_2--text" v-text="'$vuetify.icons.info'" />
        </v-list-item-action>
        <v-list-item-content class="caption font-weight-bold">{{ t('accountMenu.infoSupport') }}</v-list-item-content>
      </v-list-item>
      <LanguageSelector v-if="$vuetify.breakpoint.smAndDown && showLanguageSelector"></LanguageSelector>
    </v-list>

    <v-divider></v-divider>
    <div class="text-right py-4 px-3">
      <v-btn text class="caption text_2--text font-weight-bold" @click="logout">{{ t('accountMenu.logOut') }}</v-btn>
    </div>
  </v-card>
</template>

<script>
import { BroadcastChannel } from 'broadcast-channel'
import { mapActions, mapGetters, mapState } from 'vuex'

import { ACCOUNT_TYPE, DISCORD, GITHUB, TWITTER } from '../../../utils/enums'
import { addressSlicer, broadcastChannelOptions, getEtherScanAddressLink, getUserEmail, getUserIcon } from '../../../utils/utils'
import ExportQrCode from '../../helpers/ExportQrCode'
import LanguageSelector from '../../helpers/LanguageSelector'
import ShowToolTip from '../../helpers/ShowToolTip'
import AccountImport from '../AccountImport'

export default {
  components: {
    ShowToolTip,
    ExportQrCode,
    AccountImport,
    LanguageSelector,
  },
  props: {
    headerItems: {
      type: [Array, undefined],
      default: undefined,
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
      accountImportDialog: false,
      DISCORD,
      ACCOUNT_TYPE,
      camera: 'off',
      hasStreamApiSupport: true,
    }
  },
  computed: {
    ...mapState({
      userInfo: 'userInfo',
      selectedAddress: 'selectedAddress',
      selectedCurrency: 'selectedCurrency',
      currencyData: 'currencyData',
      networkType: 'networkType',
      wallet: 'wallet',
      loginConfig: (state) => state.embedState.loginConfig,
    }),
    ...mapGetters({
      wallets: 'walletBalances',
    }),
    userId() {
      if (this.userInfo.typeOfLogin === DISCORD) {
        return `Discord ID: ${this.userInfo.verifierId.toString()}`
      }
      if (this.userInfo.typeOfLogin === TWITTER) {
        return `Twitter ID: ${this.userInfo.verifierId.toString()}`
      }
      if (this.userInfo.typeOfLogin === GITHUB) {
        return `GitHub ID: ${this.userInfo.verifierId.toString()}`
      }
      return ''
    },
    userName() {
      if (!this.userInfo.name) return this.t('login.your')
      let userName = this.userInfo.name.charAt(0).toUpperCase() + this.userInfo.name.slice(1)
      userName = userName.length > 20 ? userName.split(' ')[0] : userName
      return `${userName}'s`
    },
    slicedSelectedAddress() {
      return addressSlicer(this.selectedAddress)
    },
    filteredWallets() {
      return this.wallets.filter((accumulator) => accumulator.address !== this.selectedAddress)
    },
    filteredMenu() {
      if (this.headerItems) {
        return this.headerItems.filter((item) => item.name !== 'home')
      }
      return []
    },
  },
  methods: {
    ...mapActions(['logOut', 'updateSelectedAddress', 'initWalletConnect', 'disconnectWalletConnect']),
    etherscanAddressLink(address) {
      return getEtherScanAddressLink(address, this.networkType.host)
    },
    async logout() {
      const urlInstance = new URLSearchParams(window.location.search).get('instanceId')
      if (urlInstance && urlInstance !== '') {
        const bc = new BroadcastChannel(`torus_logout_channel_${urlInstance}`, broadcastChannelOptions)
        await bc.postMessage({ data: { type: 'logout' } })
        bc.close()
      }
      this.logOut()
    },
    async changeAccount(newAddress) {
      this.updateSelectedAddress({ selectedAddress: newAddress })
      const urlInstance = new URLSearchParams(window.location.search).get('instanceId')
      if (urlInstance && urlInstance !== '') {
        const selectedAddressChannel = new BroadcastChannel(`selected_address_channel_${urlInstance}`, broadcastChannelOptions)
        await selectedAddressChannel.postMessage({
          data: {
            name: 'selected_address',
            payload: newAddress,
          },
        })
        selectedAddressChannel.close()
      }
    },
    userIcon(accountType) {
      return getUserIcon(accountType, this.userInfo.typeOfLogin)
    },
    userEmail(account) {
      if (account.accountType === ACCOUNT_TYPE.THRESHOLD) {
        return `OpenLogin ${this.t('accountMenu.wallet')}`
      }
      if (account.accountType === ACCOUNT_TYPE.IMPORTED) {
        const index = Object.keys(this.wallet)
          .filter((x) => this.wallet[x].accountType === ACCOUNT_TYPE.IMPORTED)
          .indexOf(account.address)
        return `${this.t('accountMenu.importedAccount')} ${index + 1}`
      }
      return getUserEmail(this.userInfo, this.loginConfig, this.t('accountMenu.wallet'))
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'AccountMenu.scss';
</style>
