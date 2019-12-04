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
  computed: mapState(['isOnline'])
}
</script>

<style src="../public/css/circles.css"></style>

<style lang="scss">
@import 'App.scss';
</style>
