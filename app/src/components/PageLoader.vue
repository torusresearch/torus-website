<template>
  <v-layout row wrap align-center justify-center>
    <v-flex d-flex xs12>
      <div class="text-xs-center">
        <v-progress-circular indeterminate :color="$vuetify.theme.torus_blue"></v-progress-circular>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: 'PageLoader'
}
</script>
