<template>
  <v-container fill-height>
    <v-layout row wrap justify-center fill-height align-content-start>
      <v-flex d-flex xs12>
        <v-tabs fixed-tabs v-model="selectedItem" grow :color="$vuetify.theme.torus_bcg">
          <header-item
            v-for="headerItem in headerItems"
            :key="headerItem.name"
            :isSelected="selectedItem === headerItem.name"
            :href="`#${headerItem.name}`"
            :icon="headerItem.icon"
            :to="`/wallet/${headerItem.name}`"
          >
            {{ headerItem.display }}
          </header-item>
        </v-tabs>
      </v-flex>
      <v-flex xs12 fill-height>
        <router-view></router-view>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import HeaderItem from '../components/HeaderItem.vue'

// <v-tabs-items v-model="selectedItem" vertical class="fill-height">
//   <v-tab-item value="home" class="fill-height" lazy to="/wallet/home">
//     <!-- <wallet-home class="fill-height" /> -->
//   </v-tab-item>
//   <v-tab-item value="history" lazy to="/wallet/history">
//     <!-- <wallet-history /> -->
//   </v-tab-item>
//   <v-tab-item value="settings" lazy to="/wallet/settings">
//     <!-- <wallet-settings /> -->
//   </v-tab-item>
//   <v-tab-item value="accounts" lazy to="/wallet/accounts">
//     <!-- <wallet-accounts /> -->
//   </v-tab-item>
// </v-tabs-items>
export default {
  components: {
    HeaderItem
    // WalletHome: () => import('../containers/WalletHome.vue'),
    // WalletHistory: () => import('../containers/WalletHistory.vue'),
    // WalletSettings: () => import('../containers/WalletSettings.vue'),
    // WalletAccounts: () => import('../containers/WalletAccounts.vue')
  },
  data() {
    return {
      selectedItem: 'home',
      headerItems: [
        { name: 'home', icon: 'home', display: 'Home' },
        { name: 'history', icon: 'history', display: 'History' },
        { name: 'settings', icon: 'settings', display: 'Settings' },
        { name: 'accounts', icon: 'account_circle', display: 'Accounts' }
      ]
    }
  }
}
</script>

<style lang="scss">
body {
  background-color: #f7f7f7;
}
.v-window__container {
  height: 100% !important;
}

body,
html {
  height: 100%;
  overflow-y: hidden;
}
</style>
