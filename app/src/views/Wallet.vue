<template>
  <div>
    <Navbar />
    <v-container fill-height>
      <v-layout row wrap justify-center fill-height align-content-start>
        <v-flex xs12>
          <router-view></router-view>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import Navbar from '../components/Navbar'

export default {
  components: {
    Navbar
  },
  data() {
    return {
      selectedItem: 'home'
    }
  }
}
</script>

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
