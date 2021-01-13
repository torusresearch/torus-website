<template>
  <v-card class="private-key-container">
    <v-card-text class="py-6">
      <v-layout wrap>
        <v-flex xs12 :class="$vuetify.breakpoint.xsOnly ? '' : 'px-4'">
          <div class="font-weight-bold headline">{{ 'Replace private key' }}</div>
        </v-flex>
        <v-flex xs12>
          <v-layout wrap align-center>
            <v-flex>
              <v-text-field v-model="customPrivateKey"></v-text-field>
            </v-flex>
            <v-flex xs4 sm2 class="ml-auto" px-4>
              <v-btn block @click="setKey(customPrivateKey)">Replace</v-btn>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs12>
          <div class="caption text_3--text mb-4 px-5">{{ 'Note: this replaces your Torus account private key' }}</div>
        </v-flex>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    prevKey: {
      type: String,
      default() {
        return ''
      },
    },
  },
  data() {
    return {
      customPrivateKey: '',
    }
  },
  methods: {
    setKey(newKey) {
      this.$emit('setKey', this.prevKey, newKey)
      this.$emit('dialogClose')
    },
  },
}
</script>
