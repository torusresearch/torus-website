<template>
  <div>
    <navbar />
    <!-- <hr v-if="!$vuetify.theme.dark" class="navbar-line" /> -->
    <v-content>
      <router-view></router-view>
    </v-content>
  </div>
</template>

<script>
import Navbar from '../../components/helpers/Navbar'

export default {
  components: {
    Navbar
  }
}
</script>

<style lang="scss" scoped>
@import 'Wallet.scss';
</style>
