<template>
  <v-card class="advance-option">
    <v-card-text class="torus_text--text py-5">
      <v-layout wrap row>
        <v-flex xs12 px-3>
          <div class="font-weight-bold headline">Private Key</div>
        </v-flex>
        <v-flex xs12 mt-3>
          <span>Private Key content</span>
        </v-flex>
      </v-layout>
      <v-layout mt-3 pr-3 row>
        <v-spacer></v-spacer>
        <v-btn large text @click="onClose">Close</v-btn>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  methods: {
    onClose() {
      this.$emit('onClose')
    }
  }
}
</script>
