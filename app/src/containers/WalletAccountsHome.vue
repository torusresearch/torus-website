<template>
  <v-layout mt-5 row wrap align-center justify-center align-content-start>
    <v-flex xs12 sm8>
      <span>
        <v-icon alt="Account" :color="$vuetify.theme.torus_blue" size="28">account_circle</v-icon>
        <span class="text-bluish headline"> My Accounts</span>
      </span>
    </v-flex>
    <router-view></router-view>
    <v-flex xs12>
      <v-layout row wrap>
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

<style lang="scss"></style>
