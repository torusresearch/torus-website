<template>
  <v-layout row align-center justify-center align-content-center>
    <v-flex d-flex xs12>
      <img src="images/torus-logo-white.svg" alt="logo" />
    </v-flex>
    <v-flex xs12 mt-3>
      <div class="text-xs-center headline text-capitalize white--text">The decentralized web awaits</div>
    </v-flex>
    <v-flex xs12 mt-5>
      <div class="text-xs-center ">
        <v-btn class="white--text btnStyle" outline large @click="triggerLogin">Login</v-btn>
      </div>
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
}
</style>
