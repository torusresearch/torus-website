<template>
  <v-layout row wrap justify-center fill-height>
    <v-flex d-flex xs12>
      <v-tabs fixed-tabs v-model="selectedItem" grow>
        <header-item
          v-for="headerItem in headerItems"
          :key="headerItem.name"
          :isSelected="selectedItem === headerItem.name"
          :href="`#${headerItem.name}`"
          :icon="headerItem.icon"
        >
          {{ headerItem.display }}
        </header-item>
        <v-tabs-items v-model="selectedItem" vertical>
          <v-tab-item value="home" lazy>
            <wallet-home />
          </v-tab-item>
          <v-tab-item value="history" lazy>
            <wallet-history />
          </v-tab-item>
          <v-tab-item value="settings" lazy>
            <wallet-settings />
          </v-tab-item>
          <v-tab-item value="accounts" lazy>
            <wallet-accounts />
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
    </v-flex>
  </v-layout>
</template>

<script>
import HeaderItem from '../components/HeaderItem.vue'

export default {
  components: {
    HeaderItem,
    WalletHome: () => import('./WalletHome.vue'),
    WalletHistory: () => import('./WalletHistory.vue'),
    WalletSettings: () => import('./WalletSettings.vue'),
    WalletAccounts: () => import('./WalletAccounts.vue')
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

<style lang="scss"></style>
