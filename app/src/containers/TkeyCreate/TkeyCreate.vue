<template>
  <div>
    <v-container v-if="tab === 0" class="pt-6 pb-5">
      <div class="text-center headline text_1--text mb-2">You're signed in</div>
      <div class="account-details d-flex pt-2 pb-4 px-4">
        <v-avatar size="34" class="mr-2">
          <img
            :src="userInfo.profileImage"
            class="align-start"
            :alt="userInfo.userName"
            onerror="if (!this.src.includes('/images/person.jpeg')) this.src = '/images/person.jpeg';"
          />
        </v-avatar>
        <div>
          <div class="body-2 text_1--text">{{ userInfo.verifierId }}</div>
          <div class="body-2 text_2--text">Wallet Address: {{ slicedAddress }}</div>
        </div>
      </div>
    </v-container>
    <v-container v-else class="pt-6 pb-5">
      <div class="text-center text_1--text display-1 mb-2">
        {{ tab === 1 ? 'Set up your 2FA wallet' : 'Great! Your 2FA wallet has been created.' }}
      </div>
    </v-container>
    <v-divider></v-divider>
    <v-container :class="[$vuetify.breakpoint.xsOnly ? 'pa-0' : 'pa-4']">
      <v-layout class="justify-center">
        <v-flex :class="[$vuetify.breakpoint.xsOnly ? 'xs12' : tab === 1 ? 'xs7' : 'xs6']">
          <v-tabs-items v-model="tab">
            <v-tab-item>
              <AddWallet @next="tab = 1" />
            </v-tab-item>
            <v-tab-item>
              <SetupWallet @next="tab = 2" />
            </v-tab-item>
            <v-tab-item>
              <CreatedWallet />
            </v-tab-item>
          </v-tabs-items>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import AddWallet from '../../components/Tkey/AddWallet'
import CreatedWallet from '../../components/Tkey/CreatedWallet'
import SetupWallet from '../../components/Tkey/SetupWallet'

export default {
  name: 'TkeyCreate',
  components: { AddWallet, SetupWallet, CreatedWallet },
  data: () => ({
    tab: 0,
  }),
  computed: {
    ...mapState(['userInfo', 'selectedAddress']),
    ...mapState(['selectedAddress']),
    slicedAddress() {
      return this.$vuetify.breakpoint.xsOnly
        ? `${this.selectedAddress.slice(0, 4)}...${this.selectedAddress.slice(-3)}`
        : `${this.selectedAddress.slice(0, 5)}...${this.selectedAddress.slice(-5)}`
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'TkeyCreate.scss';
</style>
