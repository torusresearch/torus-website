<template>
  <v-card class="private-key-container">
    <v-card-text class="py-6">
      <v-layout wrap>
        <v-flex xs12 :class="$vuetify.breakpoint.xsOnly ? '' : 'px-4'">
          <div class="font-weight-bold headline">{{ 'Replace private key' }}</div>
        </v-flex>
        <v-flex>
          <v-form>
            <v-text-field></v-text-field>
          </v-form>
        </v-flex>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
export default {}
</script>
