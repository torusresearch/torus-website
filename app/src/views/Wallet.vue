<script>
import HeaderItem from '../components/HeaderItem.vue'

export default {
  components: {
    HeaderItem
  },
  data() {
    return {
      selectedItem: 'home',
      headerItems: [
        { name: 'home', display: 'Home', route: '/wallet/home' },
        { name: 'transfer', display: 'Transfer', route: '/wallet/transfer' },
        { name: 'top-up', display: 'Top-up', route: '/wallet/top-up' },
        { name: 'activity', display: 'Activity', route: '/wallet/history' },
        { name: 'settings', display: 'Settings', route: '/wallet/settings' }
      ]
      // headerItems: [
      //   { name: 'home', display: 'Home', route: '/wallet/home' },
      //   { name: 'history', display: 'History', route: '/wallet/history' },
      //   { name: 'settings', display: 'Settings', route: '/wallet/settings' },
      //   { name: 'accounts', display: 'Accounts', route: '/wallet/accounts' }
      // ]
    }
  }
}
</script>

<template>
  <v-container fill-height>
    <v-layout row wrap justify-center fill-height align-content-start>
      <v-flex class="mb-4">
        <img :src="require('../../public/images/torus_logo.png')" />
      </v-flex>
      <v-flex d-flex xs12>
        <v-flex fixed-tabs v-model="selectedItem" grow :color="$vuetify.theme.torus_bcg">
          <header-item
            v-for="headerItem in headerItems"
            :key="headerItem.name"
            :isSelected="selectedItem === headerItem.route"
            :href="`#${headerItem.name}`"
            :to="headerItem.route"
          >
            <span class="font-weight-bold">
              {{ headerItem.display }}
            </span>
          </header-item>
        </v-flex>
      </v-flex>
      <v-flex xs12>
        <router-view></router-view>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<style lang="scss">
body {
  background-color: var(--v-torus_bcg-base);
}

.v-window__container {
  height: 100% !important;
}

.application--wrap {
  min-height: 0px !important;
}

body,
html {
  height: 100%;
}
</style>
