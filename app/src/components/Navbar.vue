<template>
  <div>
    <nav class="container pb-0">
      <v-app-bar>
        <v-badge right class="hidden-xs-only">
          <template v-slot:badge>
            <span>Beta</span>
          </template>
          <v-toolbar-title class="mr-6">
            <router-link :to="{ name: 'walletHome' }">
              <img
                class="home-link"
                width="135"
                height="30"
                :src="require(`../../public/images/torus-logo-${$vuetify.theme.dark ? 'white' : 'blue'}.svg`)"
              />
            </router-link>
          </v-toolbar-title>
        </v-badge>
        <v-toolbar-title class="mt-8 hidden-sm-and-up">
          <router-link :to="{ name: 'walletHome' }">
            <img :src="require('../../public/img/icons/t-fill.svg')" width="35" />
          </router-link>
          <div class="primary--text subtitle-2 beta-text">Beta</div>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn class="hidden-sm-and-up" icon @click="drawer = !drawer">
          <img :src="require('../../public/img/icons/menu-primary.svg')" />
        </v-btn>

        <v-menu offset-y bottom left :close-on-content-click="false">
          <template v-slot:activator="{ on }">
            <v-btn class="hidden-xs-only" small text v-on="on">
              <span class="text-capitalize">{{ userName }}</span>
              <v-icon class="ml-2 mt-1" small>$vuetify.icons.select</v-icon>
            </v-btn>
          </template>

          <account-menu></account-menu>
        </v-menu>
      </v-app-bar>

      <v-navigation-drawer v-model="drawer" disable-resize-watcher app right :width="$vuetify.breakpoint.xsOnly ? '80%' : ''">
        <account-menu :headerItems="headerItems"></account-menu>
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
        { name: 'home', display: 'Home', route: '/wallet/home', icon: 'settings.svg' },
        { name: 'transfer', display: 'Transfer', route: '/wallet/transfer', icon: 'transaction.svg' },
        { name: 'top-up', display: 'Top up', route: '/wallet/topup', icon: 'topup.svg' },
        { name: 'activity', display: 'Activity', route: '/wallet/history', icon: 'activities.svg' },
        { name: 'settings', display: 'Settings', route: '/wallet/settings', icon: 'settings.svg' }
      ]
    }
  },
  computed: {
    userName() {
      return this.$store.state.name
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

.beta-text {
  line-height: 1em;
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

.home-link {
  cursor: pointer;
}
</style>
