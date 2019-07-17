<template>
  <div>
    <Navbar />
    <v-container>
      <router-view></router-view>
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
