<template>
  <v-layout align-center justify-center>
    <v-flex xs8 sm6 md4 align-self-center>
      <img src="images/torus-logo-white.svg" alt="logo" />
      <div class="headline text-capitalize  ml-2 mt-4 mb-5 white--text">The decentralized web awaits</div>
      <v-btn class="white--text btnStyle d-flex text-xs-center" outline large @click="triggerLogin">Login</v-btn>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'walletWelcome',
  methods: {
    ...mapActions({
      triggerLogin: 'triggerLogin'
    })
  }
}
</script>

<style lang="scss">
.btnStyle {
  width: 172px;
  height: 48px;
  border-radius: 12px;
  margin: 0 auto;
}
</style>
