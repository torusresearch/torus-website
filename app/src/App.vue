<template>
  <v-app class="torus-app" v-if="isOnline">
    <router-view />
  </v-app>
  <v-app class="torus-app" v-else>
    <offline />
  </v-app>
</template>

<script>
import { mapState } from 'vuex'
import Offline from './views/Offline'
export default {
  components: {
    Offline
  },
  computed: mapState(['isOnline']),
  mounted() {
    if (typeof window !== 'undefined') {
      const onlineHandler = () => {
        this.$store.dispatch('updateNetworkState', { infuraNetworkStatus: true })
      }

      const offlineHandler = () => {
        this.$store.dispatch('updateNetworkState', { infuraNetworkStatus: false })
      }

      window.addEventListener('online', onlineHandler)
      window.addEventListener('offline', offlineHandler)

      this.$once('hook:beforeDestroy', () => {
        window.removeEventListener('online', onlineHandler)
        window.removeEventListener('offline', offlineHandler)
      })
    }
  }
}
</script>

<style src="../public/css/circles.css"></style>

<style lang="scss">
@import 'App.scss';
</style>
