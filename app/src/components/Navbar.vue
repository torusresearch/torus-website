<template>
  <div>
    <nav class="container pb-0">
      <v-toolbar flat app>
        <v-toolbar-title>
          <img :src="require('../../public/images/torus_logo.png')" />
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn class="hidden-sm-and-up" text @click="drawer = !drawer">
          <img :src="require('../../public/img/icons/menu-primary.svg')" />
        </v-btn>
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn class="hidden-xs-only" small text v-on="on">
              <span>Satoshi Nakamoto</span>
              <v-icon class="ml-2 mt-1">$vuetify.icons.select</v-icon>
            </v-btn>
          </template>
          <span>Profile Settings</span>
        </v-menu>
      </v-toolbar>

      <v-navigation-drawer v-model="drawer" disable-resize-watcher app right class="primary">
        <v-list>
          <v-list-tile v-for="headerItem in headerItems" :key="headerItem.name" router :to="headerItem.route">
            <v-list-tile-content>{{ headerItem.name }}</v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>
    </nav>
    <v-container class="py-0">
      <v-tabs>
        <v-tab v-for="headerItem in headerItems" :key="headerItem.name" :to="headerItem.route" class="black--text">
          {{ headerItem.display }}
        </v-tab>
      </v-tabs>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      drawer: false,
      selectedItem: 'home',
      headerItems: [
        { name: 'home', display: 'Home', route: '/wallet/home' },
        { name: 'transfer', display: 'Transfer', route: '/wallet/transfer' },
        { name: 'top-up', display: 'Top-up', route: '/wallet/topup' },
        { name: 'activity', display: 'Activity', route: '/wallet/history' },
        { name: 'settings', display: 'Settings', route: '/wallet/settings' },
        { name: 'accounts', display: 'Accounts', route: '/wallet/accounts' }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .v-tab {
  text-transform: inherit;
  font-size: 16px;
  &.v-tab--active {
    border-bottom: 0;
  }
}
</style>
