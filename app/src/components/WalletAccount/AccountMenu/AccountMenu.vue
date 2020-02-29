<template>
  <v-card :flat="$vuetify.breakpoint.smAndDown" width="340" class="account-menu card-shadow-v8">
    <v-list class="pb-0 mb-2">
      <v-list-item>
        <v-list-item-avatar class="ml-2 mr-3">
          <img :src="profileImage" class="align-start" :alt="userName" onerror="this.src = '/images/person.jpeg';" />
        </v-list-item-avatar>
        <v-list-item-title>
          <div class="font-weight-bold subtitle-1 d-flex">
            <div class="torus-account--name mr-1" id="account-name">
              <span>{{ userName }}</span>
            </div>
            <div>{{ t('accountMenu.account') }}</div>
          </div>
        </v-list-item-title>
      </v-list-item>
    </v-list>
    <!-- <v-list>
      <v-list-item>
        <v-list-item-avatar class="mr-2">
          <img :src="profileImage" class="align-start" :alt="userName" />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-subtitle>
            <div class="caption text_2--text">
              <span>{{ userEmail }}</span>
            </div>
            <div class="caption text_2--text">
              <span>{{ userId }}</span>
            </div>
            <div class="caption public-address-container">
              <show-tool-tip :address="selectedAddress">{{ selectedAddress }}</show-tool-tip>
            </div>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          <div class="subtitle-2 mb-0">
            <v-icon class="mr-2 text_2--text" v-text="'$vuetify.icons.balance'" />
            <span class="text_1--text">{{ `${totalPortfolioValue} ${selectedCurrency}` }}</span>
          </div>
        </v-list-item-content>
      </v-list-item>
    </v-list> -->

    <div class="px-3 account-list">
      <div
        class="d-flex account-list__item mb-2 pa-1"
        :class="{ active: acc.address === selectedAddress }"
        v-for="acc in wallets"
        :key="acc.address"
        @click="changeAccount(acc.address)"
      >
        <div>
          <v-icon v-if="acc.type === 'SC'" size="16">$vuetify.icons.smart_contract</v-icon>
          <img v-else :src="require(`../../../../public/img/icons/google-dark.svg`)" style="width: 16px" class="ma-1" />
        </div>
        <div class="d-flex flex-column account-list__details px-1">
          <div class="caption">
            <span class="font-weight-bold">{{ acc.type === 'SC' ? 'Smart Contract Wallet' : userInfo.email }}</span>
            <span class="float-right">{{ acc.balance }}</span>
          </div>
          <div class="caption">
            <span class="account-list__address">{{ acc.address }}</span>
            <span class="float-right">
              <show-tool-tip :address="acc.address">
                <v-icon size="12" :class="{ 'text_2--text': !$vuetify.theme.dark }" v-text="'$vuetify.icons.copy'" />
              </show-tool-tip>
              <export-qr-code :customAddress="acc.address">
                <v-icon x-small v-text="'$vuetify.icons.qr'" />
              </export-qr-code>
            </span>
          </div>
        </div>
      </div>
    </div>

    <v-divider v-if="wallets.length > 0"></v-divider>

    <v-list v-if="hasPendingSmartContract">
      <v-list-item two-line>
        <v-list-item-action class="mr-2 mt-0">
          <v-icon class="text_2--text" size="20" v-text="'$vuetify.icons.smart_contract'" />
        </v-list-item-action>
        <v-list-item-content class="text_1--text font-weight-bold">
          <v-list-item-title class="mb-2">Smart Contract Wallet</v-list-item-title>
          <v-list-item-subtitle>
            <v-layout>
              <v-flex xs12>
                <v-progress-linear background-color="#EEF2F4" color="#0364FF" class="mt-1" height="8" rounded value="40"></v-progress-linear>
              </v-flex>
            </v-layout>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-divider v-if="hasPendingSmartContract"></v-divider>

    <v-list>
      <v-list-item id="import-account-btn" @click="accountImportDialog = true">
        <v-list-item-action class="mr-2">
          <v-icon class="text_2--text" v-text="'$vuetify.icons.import'" />
        </v-list-item-action>
        <v-list-item-content class="text_1--text font-weight-bold">{{ t('accountMenu.importAccount') }}</v-list-item-content>
      </v-list-item>
      <v-dialog v-model="accountImportDialog" width="600" class="import-dialog">
        <account-import @onClose="accountImportDialog = false" />
      </v-dialog>
    </v-list>

    <v-divider></v-divider>

    <v-list>
      <v-list-item
        :id="`${headerItem.name}-link-mobile`"
        v-for="headerItem in filteredMenu"
        :key="headerItem.name"
        link
        router
        :to="headerItem.route"
      >
        <v-list-item-action class="mr-2">
          <v-icon :size="headerItem.icon === 'activities' ? 12 : 16" class="text_2--text" v-text="`$vuetify.icons.${headerItem.icon}`" />
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title class="font-weight-bold text_1--text">{{ headerItem.display }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item href="https://docs.tor.us/#users" target="_blank">
        <v-list-item-action class="mr-2">
          <v-icon :small="$vuetify.breakpoint.xsOnly" class="text_2--text" v-text="'$vuetify.icons.info'" />
        </v-list-item-action>
        <v-list-item-content class="text_1--text font-weight-bold">{{ t('accountMenu.infoSupport') }}</v-list-item-content>
      </v-list-item>
    </v-list>

    <v-divider v-if="$vuetify.breakpoint.xsOnly"></v-divider>
    <v-list v-if="$vuetify.breakpoint.xsOnly">
      <language-selector></language-selector>
    </v-list>

    <v-list>
      <v-list-item @click="logout">
        <v-list-item-content class="text_1--text font-weight-bold body-1">{{ t('accountMenu.logOut') }}</v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
import { BroadcastChannel } from 'broadcast-channel'
import { significantDigits, addressSlicer, broadcastChannelOptions } from '../../../utils/utils'
import ShowToolTip from '../../helpers/ShowToolTip'
import LanguageSelector from '../../helpers/LanguageSelector'
import AccountImport from '../AccountImport'
import ExportQrCode from '../../helpers/ExportQrCode'

import { GOOGLE, FACEBOOK, REDDIT, TWITCH, DISCORD } from '../../../utils/enums'
import torus from '../../../torus'
import BigNumber from 'bignumber.js'
import copyToClipboard from 'copy-to-clipboard'

export default {
  props: ['headerItems'],
  components: {
    AccountImport,
    LanguageSelector,
    ShowToolTip,
    ExportQrCode
  },
  data() {
    return {
      accountImportDialog: false
    }
  },
  computed: {
    hasPendingSmartContract() {
      return Object.values(this.$store.state.wallet).filter(
        x => x.type === 'SC' && x.network === this.$store.state.networkType.host && x.address === 'PROCESSING'
      ).length
    },
    userEmail() {
      const verifierLabel = this.userInfo.verifier.charAt(0).toUpperCase() + this.userInfo.verifier.slice(1) + ': '
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
    profileImage() {
      return this.userInfo.profileImage
    },
    userInfo() {
      return this.$store.state.userInfo
    },
    selectedAddress() {
      return this.$store.state.selectedAddress
    },
    slicedSelectedAddress() {
      return addressSlicer(this.$store.state.selectedAddress)
    },
    selectedCurrency() {
      return this.$store.state.selectedCurrency
    },
    wallets() {
      let { wallet: storeWallet, weiBalance: storeWalletBalance, selectedCurrency } = this.$store.state || {}

      const wallets = Object.keys(storeWallet).reduce((accts, x) => {
        const computedBalance = new BigNumber(storeWalletBalance[x]).dividedBy(new BigNumber(10).pow(new BigNumber(18))) || new BigNumber(0)
        const tokenRateMultiplier = new BigNumber(1)
        const currencyRate = new BigNumber(this.getCurrencyMultiplier).times(tokenRateMultiplier)
        let currencyBalance = computedBalance.times(currencyRate) || new BigNumber(0)
        if (
          storeWallet[x].type === 'EOA' ||
          (storeWallet[x].type === 'SC' && storeWallet[x].network === this.$store.state.networkType.host && storeWallet[x].address != 'PROCESSING')
        )
          accts.push({ address: x, balance: `${significantDigits(currencyBalance, false, 3)} ${selectedCurrency}`, ...storeWallet[x] })
        return accts
      }, [])
      return wallets
    },
    getCurrencyMultiplier() {
      const { selectedCurrency, currencyData } = this.$store.state || {}
      let currencyMultiplier = 1
      if (selectedCurrency !== 'ETH') currencyMultiplier = currencyData[selectedCurrency.toLowerCase()] || 1
      return currencyMultiplier
    },
    totalPortfolioValue() {
      return this.$store.getters.tokenBalances.totalPortfolioValue || '0'
    },
    filteredMenu() {
      if (this.headerItems) {
        return this.headerItems.filter(item => {
          return item.name !== 'home'
        })
      } else {
        return []
      }
    }
  },
  methods: {
    async logout() {
      const urlInstance = new URLSearchParams(window.location.search).get('instanceId')
      if (urlInstance && urlInstance !== '') {
        var bc = new BroadcastChannel(`torus_logout_channel_${urlInstance}`, broadcastChannelOptions)
        await bc.postMessage({ data: { type: 'logout' } })
        bc.close()
      }
      this.$store.dispatch('logOut')
      this.$router.push({ path: '/logout' }).catch(err => {})
    },
    async changeAccount(newAddress) {
      this.$store.dispatch('updateSelectedAddress', { selectedAddress: newAddress })
      const urlInstance = new URLSearchParams(window.location.search).get('instanceId')
      if (urlInstance && urlInstance !== '') {
        const selectedAddressChannel = new BroadcastChannel(`selected_address_channel_${urlInstance}`, broadcastChannelOptions)
        await selectedAddressChannel.postMessage({
          data: {
            name: 'selected_address',
            payload: newAddress
          }
        })
        selectedAddressChannel.close()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'AccountMenu.scss';
</style>
