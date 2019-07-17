<template>
  <v-app>
    <Navbar />
    <div id="app" style="width:100%; height:100%">
      <router-view />
    </div>
  </v-app>
</template>

<script>
import Navbar from './components/Navbar'

export default {
  components: {
    Navbar
  }
}
</script>

<style src="../public/css/circles.css"></style>

<style lang="scss">
#app {
  background: #ffffff !important;
  height: 100%;
  color: #0f1222;
}

.card-shadow {
  box-shadow: 0 14px 28px 0 rgba(0, 0, 0, 0.06);
}

.v-input__slot {
  margin-bottom: 2px;
}

.v-text-field.v-text-field--enclosed .v-text-field__details {
  margin-bottom: 0;
}

.v-btn {
  text-transform: inherit;
}
</style>
