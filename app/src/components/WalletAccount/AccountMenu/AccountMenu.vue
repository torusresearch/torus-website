<template>
  <v-card width="400">
    <v-list>
      <v-list-item>
        <v-list-item-avatar class="mr-2 mt-4">
          <img :src="profileImage" class="align-start" />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>
            <div class="font-weight-bold headline text-capitalize">{{ userName }}'s Account</div>
          </v-list-item-title>
          <v-list-item-subtitle>
            <div class="caption">
              <span>{{ userEmail }}</span>
              <v-icon>{{ isShowSelectedAddress ? $vuetify.icons.visibility_off : $vuetify.icons.visibility_on }}</v-icon>
              <img
                class="float-right mr-5"
                width="16"
                :src="require(`../../../../public/img/icons/eye${isShowSelectedAddress ? '-off' : ''}-primary.svg`)"
                @click="isShowSelectedAddress = !isShowSelectedAddress"
              />
            </div>
            <div v-if="isShowSelectedAddress" class="caption">
              <show-tool-tip :address="selectedAddress">{{ selectedAddress }}</show-tool-tip>
            </div>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          <div class="subtitle-2 mb-0">
            <img :src="require(`../../../../public/img/icons/account-balance.svg`)" class="mr-2" />
            {{ totalPortfolioEthValue }} ETH / {{ `${totalPortfolioValue} ${selectedCurrency}` }}
          </div>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list v-if="wallets.length > 1">
      <v-list-item v-for="acc in filteredWallets" :key="acc.id" @click="changeAccount(acc.address)">
        <v-list-item-content class="font-weight-bold">
          <v-list-item-title>
            <div class="font-weight-bold headline text-capitalize text--lighten-4">Account #{{ acc.id + 1 }}</div>
          </v-list-item-title>

          <v-list-item-subtitle>{{ acc.address }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-divider v-if="wallets.length > 1"></v-divider>

    <v-list>
      <v-list-item @click="accountImportDialog = true">
        <v-list-item-action class="mr-2">
          <img :src="require('../../../../public/img/icons/import-grey.svg')" />
        </v-list-item-action>
        <v-list-item-content class="font-weight-bold">Import Account</v-list-item-content>
      </v-list-item>
      <v-dialog v-model="accountImportDialog" width="600" class="import-dialog">
        <account-import @onClose="accountImportDialog = false" />
      </v-dialog>
    </v-list>

    <v-divider></v-divider>

    <v-list>
      <v-list-item v-for="headerItem in filteredMenu" :key="headerItem.name" link router :to="headerItem.route">
        <v-list-item-action class="mr-2">
          <img :src="require(`../../../../public/img/icons/${headerItem.icon}`)" />
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title class="font-weight-bold">{{ headerItem.display }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item href="https://docs.tor.us/#users" target="_blank">
        <v-list-item-action class="mr-2">
          <img :src="require('../../../../public/img/icons/info-grey.svg')" />
        </v-list-item-action>
        <v-list-item-content class="font-weight-bold">Info and Support</v-list-item-content>
      </v-list-item>
    </v-list>

    <v-card-actions>
      <v-btn text class="torus_text--text text--lighten-4 font-weight-bold mb-6 ml-2" @click="logout">Log Out</v-btn>
      <v-spacer></v-spacer>
    </v-card-actions>
  </v-card>
</template>

<script>
import BroadcastChannel from 'broadcast-channel'
import { significantDigits, addressSlicer } from '../../../utils/utils'
import ShowToolTip from '../../helpers/ShowToolTip'
import AccountImport from '../AccountImport'
import { broadcastChannelOptions } from '../../../utils/utils'

export default {
  props: ['headerItems'],
  components: {
    ShowToolTip,
    AccountImport
  },
  data() {
    return {
      accountImportDialog: false,
      isShowSelectedAddress: false
    }
  },
  computed: {
    userEmail() {
      return this.userInfo.email
    },
    userName() {
      return this.userInfo.name
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
    totalPortfolioEthValue() {
      return significantDigits(parseFloat(this.totalPortfolioValue.replace(',', '')) / this.getCurrencyMultiplier)
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
      var bc = new BroadcastChannel(`torus_logout_channel_${new URLSearchParams(window.location.search).get('instanceId')}`, broadcastChannelOptions)
      await bc.postMessage({ data: { type: 'logout' } })
      bc.close()
      this.$store.dispatch('logOut')
      this.$router.push({ path: '/logout' })
    },
    changeAccount(newAddress) {
      this.$store.dispatch('updateSelectedAddress', { selectedAddress: newAddress })
      const selectedAddressChannel = new BroadcastChannel(
        `selected_address_channel_${new URLSearchParams(window.location.search).get('instanceId')}`,
        broadcastChannelOptions
      )
      selectedAddressChannel.postMessage({
        data: {
          name: 'selected_address',
          payload: newAddress
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'AccountMenu.scss';
</style>
