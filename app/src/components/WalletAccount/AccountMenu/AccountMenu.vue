<template>
  <v-card :flat="$vuetify.breakpoint.smAndDown" width="400" class="account-menu">
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
        v-for="acc in wallets"
        :key="acc.address"
        class="d-flex flex-column account-list__item mb-2 py-2 px-3"
        :class="{ active: acc.address === selectedAddress, 'theme--dark': $vuetify.theme.dark }"
        @click="changeAccount(acc.address)"
      >
        <div class="d-flex align-center">
          <div class="mr-2" :style="{ lineHeight: '0' }">
            <v-icon :class="$vuetify.theme.dark ? 'torusGray1--text' : 'torusFont2--text'" size="16">
              {{ `$vuetify.icons.${userInfo.verifier}` }}
            </v-icon>
          </div>
          <div class="caption text_1--text font-weight-bold" :style="{ paddingLeft: '2px' }">
            <span>{{ userInfo.email }}</span>
          </div>
          <div class="caption ml-auto text_2--text text-right">
            <span>{{ acc.balance }}</span>
          </div>
        </div>
        <div class="d-flex align-start mt-1">
          <div class="account-list__address-container pt-1" :style="{ maxWidth: $vuetify.breakpoint.xsOnly ? '140px' : 'inherit' }">
            <div v-if="userInfo.verifier === DISCORD" class="account-list__address">Discord ID: {{ userInfo.verifierId }}</div>
            <div class="account-list__address mt-1">{{ acc.address }}</div>
          </div>
          <div class="ml-auto">
            <span class="mr-1">
              <ShowToolTip :is-btn="true" :address="acc.address">
                <v-icon size="12" class="torusFont2--text" v-text="'$vuetify.icons.copy'" />
              </ShowToolTip>
            </span>
            <span>
              <ExportQrCode :custom-address="acc.address">
                <v-icon class="torusFont2--text" x-small v-text="'$vuetify.icons.qr'" />
              </ExportQrCode>
            </span>
          </div>
        </div>
      </div>
    </div>
    <v-divider></v-divider>
    <v-list class="ml-1 py-1">
      <v-list-item id="import-account-btn" @click="accountImportDialog = true">
        <v-list-item-action class="mr-2">
          <v-icon size="24" class="text_2--text" v-text="'$vuetify.icons.import'" />
        </v-list-item-action>
        <v-list-item-content class="caption font-weight-bold text_1--text">{{ t('accountMenu.importAccount') }}</v-list-item-content>
      </v-list-item>
      <v-dialog v-model="accountImportDialog" width="600" class="import-dialog">
        <AccountImport @onClose="accountImportDialog = false" />
      </v-dialog>
    </v-list>

    <v-divider></v-divider>

    <v-list class="py-1" :style="{ marginLeft: '6px' }">
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
      <v-list-item href="https://docs.tor.us/#users" target="_blank">
        <v-list-item-action class="mr-2">
          <v-icon size="20" class="text_2--text" v-text="'$vuetify.icons.info'" />
        </v-list-item-action>
        <v-list-item-content class="caption font-weight-bold">{{ t('accountMenu.infoSupport') }}</v-list-item-content>
      </v-list-item>
    </v-list>

    <v-divider v-if="$vuetify.breakpoint.xsOnly"></v-divider>
    <v-list v-if="$vuetify.breakpoint.xsOnly" class="ml-1">
      <LanguageSelector></LanguageSelector>
    </v-list>

    <v-divider></v-divider>
    <div class="text-right py-4 px-3">
      <v-btn text class="caption text_2--text font-weight-bold" @click="logout">{{ t('accountMenu.logOut') }}</v-btn>
    </div>
  </v-card>
</template>

<script>
import { BroadcastChannel } from 'broadcast-channel'
import { mapGetters, mapState } from 'vuex'

import { DISCORD } from '../../../utils/enums'
import { addressSlicer, broadcastChannelOptions } from '../../../utils/utils'
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
  },
  data() {
    return {
      accountImportDialog: false,
      DISCORD,
    }
  },
  computed: {
    ...mapState(['userInfo', 'selectedAddress', 'selectedCurrency', 'currencyData']),
    ...mapGetters({
      wallets: 'walletBalances',
    }),
    userEmail() {
      const verifierLabel = `${this.userInfo.verifier.charAt(0).toUpperCase() + this.userInfo.verifier.slice(1)}: `
      return verifierLabel + (this.userInfo.email !== '' ? this.userInfo.email : this.userInfo.verifierId)
    },
    userId() {
      return this.userInfo.verifier === DISCORD ? `Discord ID: ${this.userInfo.verifierId.toString()}` : ''
    },
    userName() {
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
    async logout() {
      const urlInstance = new URLSearchParams(window.location.search).get('instanceId')
      if (urlInstance && urlInstance !== '') {
        const bc = new BroadcastChannel(`torus_logout_channel_${urlInstance}`, broadcastChannelOptions)
        await bc.postMessage({ data: { type: 'logout' } })
        bc.close()
      }
      this.$store.dispatch('logOut')
      this.$router.push({ path: '/logout' }).catch((_) => {})
    },
    async changeAccount(newAddress) {
      this.$store.dispatch('updateSelectedAddress', { selectedAddress: newAddress })
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
  },
}
</script>

<style lang="scss" scoped>
@import 'AccountMenu.scss';
</style>
