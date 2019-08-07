<template>
  <v-layout wrap align-center justify-center>
    <v-flex flex-grow-1 xs12>
      <div class="text-center">
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
