<template>
  <v-card width="400" class="account-menu">
    <v-list>
      <v-list-item>
        <v-list-item-avatar class="mr-2 mt-4">
          <img :src="profileImage" class="align-start" :alt="userName" />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>
            <div class="font-weight-bold title d-flex">
              <div class="torus-account--name mr-1" id="account-name">
                <span>{{ userName }}</span>
              </div>
              <div>{{ t('accountMenu.account') }}</div>
            </div>
          </v-list-item-title>
          <v-list-item-subtitle>
            <div class="caption text_2--text">
              <span>{{ userEmail }}</span>
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
    </v-list>

    <v-divider></v-divider>

    <v-list v-if="wallets.length > 1">
      <v-list-item v-for="acc in filteredWallets" :key="acc.id" @click="changeAccount(acc.address)">
        <v-list-item-content class="font-weight-bold">
          <v-list-item-title>
            <div class="font-weight-bold headline text-capitalize text--lighten-4">{{ t('accountMenu.account') }} #{{ acc.id + 1 }}</div>
          </v-list-item-title>

          <v-list-item-subtitle>{{ acc.address }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-divider v-if="wallets.length > 1"></v-divider>

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

    <v-card-actions>
      <v-btn text class="text_1--text font-weight-bold mb-6 ml-2" @click="logout">{{ t('accountMenu.logOut') }}</v-btn>
      <v-spacer></v-spacer>
    </v-card-actions>
  </v-card>
</template>

<script>
import { BroadcastChannel } from 'broadcast-channel'
import { significantDigits, addressSlicer, broadcastChannelOptions } from '../../../utils/utils'
import ShowToolTip from '../../helpers/ShowToolTip'
import AccountImport from '../AccountImport'
import { GOOGLE, FACEBOOK, REDDIT, TWITCH, DISCORD } from '../../../utils/enums'
import torus from '../../../torus'

export default {
  props: ['headerItems'],
  components: {
    ShowToolTip,
    AccountImport
  },
  data() {
    return {
      accountImportDialog: false
    }
  },
  computed: {
    userEmail() {
      const verifierLabel = this.userInfo.verifier.charAt(0).toUpperCase() + this.userInfo.verifier.slice(1) + ': '
      return verifierLabel + (this.userInfo.email !== '' ? this.userInfo.email : this.userInfo.verifierId)
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
      return Object.keys(this.$store.state.wallet).map((wallet, id) => ({ id: id, address: wallet }))
    },
    filteredWallets() {
      return this.wallets.filter(acc => acc.address !== this.selectedAddress)
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
