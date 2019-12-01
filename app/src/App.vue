<template>
  <v-app class="torus-app" v-if="isConnected">
    <router-view />
  </v-app>
  <v-app class="torus-app" v-else>
    <offline />
  </v-app>
</template>

<script>
import Offline from './views/Offline'
export default {
  data() {
    return {
      isConnected: false
    }
  },
  components: {
    Offline
  },
  mounted() {
    if (typeof window !== 'undefined') {
      this.isConnected = navigator.onLine

      const onlineHandler = () => {
        this.isConnected = true
      }

      const offlineHandler = () => {
        this.isConnected = false
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
