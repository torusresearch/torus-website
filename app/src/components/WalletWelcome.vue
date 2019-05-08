<template>
  <v-layout align-center justify-center>
    <v-flex xs8 sm6 md4>
      <v-card class="elevation-10">
        <v-card-text>
          <div class="title">
            Welcome back!
          </div>
          <v-spacer></v-spacer>
          <div class="subheading">The decentralized web awaits</div>
          <v-spacer></v-spacer>
        </v-card-text>
        <v-card-actions>
          <v-btn :color="$vuetify.theme.torus_blue" class="white--text ml-auto" @click="triggerLogin">Login</v-btn>
        </v-card-actions>
      </v-card>
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
