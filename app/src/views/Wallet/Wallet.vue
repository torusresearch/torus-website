<template>
  <div>
    <navbar />
    <hr class="navbar-line" />
    <v-container>
      <router-view></router-view>
    </v-container>
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

<style lang="scss">
@import 'Wallet.scss';
</style>
