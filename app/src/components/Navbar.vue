<template>
  <div>
    <nav class="container pb-0">
      <v-app-bar>
        <v-badge right>
          <template v-slot:badge>
            <span>Beta</span>
          </template>
          <v-toolbar-title class="mr-6">
            <img width="135" height="30" :src="require(`../../public/images/torus-logo-${$vuetify.theme.dark ? 'white' : 'blue'}.svg`)" />
          </v-toolbar-title>
        </v-badge>
        <v-spacer></v-spacer>
        <v-btn class="hidden-sm-and-up" text @click="drawer = !drawer">
          <img :src="require('../../public/img/icons/menu-primary.svg')" />
        </v-btn>
        <account-menu></account-menu>
      </v-app-bar>

      <v-navigation-drawer v-model="drawer" disable-resize-watcher app right>
        <v-list>
          <v-list-item v-for="headerItem in headerItems" :key="headerItem.name" link router :to="headerItem.route">
            <v-list-item-content>
              <v-list-item-title>{{ headerItem.display }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
    </nav>
    <v-container class="py-0 hidden-xs-only">
      <v-tabs class="mx-4">
        <v-tab v-for="headerItem in headerItems" :key="headerItem.name" :to="headerItem.route">
          {{ headerItem.display }}
        </v-tab>
      </v-tabs>
    </v-container>
  </div>
</template>

<script>
import AccountMenu from '../components/AccountMenu'

export default {
  components: {
    AccountMenu
  },
  data() {
    return {
      drawer: false,
      selectedItem: 'home',
      headerItems: [
        { name: 'home', display: 'Home', route: '/wallet/home' },
        { name: 'transfer', display: 'Transfer', route: '/wallet/transfer' },
        { name: 'top-up', display: 'Top up', route: '/wallet/topup' },
        { name: 'activity', display: 'Activity', route: '/wallet/history' },
        { name: 'settings', display: 'Settings', route: '/wallet/settings' }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.v-toolbar {
  box-shadow: none;
}

.v-tab {
  text-transform: inherit;
  font-size: 16px;
}

::v-deep .v-badge__badge.primary {
  background-color: #ffffff !important;
  color: var(--v-primary-base);
  border: 1px solid var(--v-primary-base);
  border-radius: 3px;
  padding: 0 10px;
  right: -30px;
}

.theme--light {
  .v-tab {
    &.v-tab--active {
      color: var(--v-secondary-darken3);
    }
  }
}
</style>
