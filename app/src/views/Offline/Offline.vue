<template>
  <div class="offline">
    <nav class="header-container pa-0">
      <v-app-bar class="container" :class="$vuetify.breakpoint.xsOnly ? 'pa-0' : 'px-2 py-0'">
        <router-link :to="{ name: 'walletHome' }">
          <img class="home-link" width="135" height="30" :src="require(`../../../public/images/torus-logo-blue.svg`)" />
        </router-link>
        <div class="beta-text caption pr-4">Beta</div>
      </v-app-bar>
    </nav>
    <hr class="navbar-line" />
    <v-container wrap fill-height align-center justify-center>
      <v-flex xs12 sm12 md12 lg12 align-center>
        <v-layout wrap align-center justify-center align-content-center>
          <div class="px-12">
            <img width="280px" height="auto" :src="require('../../../public/images/blublu-icon.svg')" />
          </div>
          <div class="px-6 py-12">
            <div class="display-1 font-weight-bold py-4">It seems you are offline.</div>
            <v-flex class="headline font-weight-normal" xs12 sm12 md12 lg10>
              <span>
                Check your network and try again.
              </span>
            </v-flex>

            <div class="py-6">
              <v-btn @click="refreshNetwork" large depressed color="primary" class="px-12 title" type="button">
                RETRY
              </v-btn>
            </div>
          </div>
        </v-layout>
      </v-flex>
    </v-container>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'offline',
  methods: {
    ...mapActions({
      refreshNetwork: 'refreshNetwork'
    })
  }
}
</script>

<style lang="scss" scoped>
@import '../../components/helpers/Navbar/Navbar.scss';
@import 'Offline.scss';
</style>
