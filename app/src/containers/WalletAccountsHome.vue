<template>
  <v-layout mt-12 wrap align-center justify-center align-content-start>
    <v-flex xs12 sm8>
      <span>
        <v-icon alt="Account" :color="$vuetify.theme.torus_blue" size="28">account_circle</v-icon>
        <span class="text-bluish headline">My Accounts</span>
      </span>
    </v-flex>
    <v-flex xs12 sm8 mt-4>
      <v-layout wrap align-content-space-between>
        <v-flex xs12 sm8 md6 px-1>
          <v-btn block depressed class="grey lighten-3 account-tab" :to="{ name: 'walletAccountsHome' }">Account Management</v-btn>
        </v-flex>
        <v-flex xs12 sm4 md6 px-1>
          <v-btn block depressed class="grey lighten-3 account-tab" :to="{ name: 'walletAccountImport' }">Import</v-btn>
        </v-flex>
      </v-layout>
    </v-flex>
    <router-view></router-view>
    <v-flex xs12>
      <v-layout wrap>
        <v-flex offset-xs10 xs2 align-self-center class="hidden-xs-only">
          <img :src="require('../../public/images/torus_logo.png')" />
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: 'walletAccountsHome'
}
</script>

<style lang="scss">
.account-tab:hover {
  transform: scale(1.05);
}
</style>
