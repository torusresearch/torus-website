<template>
  <v-container fill-height>
    <v-layout row wrap justify-center fill-height align-content-start>
      <v-flex d-flex xs12>
        <v-tabs fixed-tabs v-model="selectedItem" grow :color="$vuetify.theme.torus_bcg">
          <header-item
            v-for="headerItem in headerItems"
            :key="headerItem.name"
            :isSelected="selectedItem === headerItem.route"
            :href="`#${headerItem.name}`"
            :icon="headerItem.icon"
            :to="headerItem.route"
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

export default {
  components: {
    HeaderItem
  },
  data() {
    return {
      selectedItem: 'home',
      headerItems: [
        { name: 'home', icon: 'home', display: 'Home', route: '/wallet/home' },
        { name: 'history', icon: 'history', display: 'History', route: '/wallet/history' },
        { name: 'settings', icon: 'settings', display: 'Settings', route: '/wallet/settings' },
        { name: 'accounts', icon: 'account_circle', display: 'Accounts', route: '/wallet/accounts' }
      ]
    }
  },
  updated(){
    console.log(this.selectedItem)
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
