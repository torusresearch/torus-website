<template>
  <v-card class="badges-alert-container">
    <v-btn class="close-btn" icon @click="onCancel">
      <v-icon>$vuetify.icons.close</v-icon>
    </v-btn>
    <v-layout wrap>
      <v-flex class="elevation-1 text-center" mb-6 py-3 xs12>
        <img :src="require('../../../../public/img/icons/ethereal-summit-token.svg')" width="152" />
      </v-flex>

      <v-flex xs12 mx-10 class="text-center">
        <div class="mb-2 font-weight-bold text_2--text display-1">Congratulations</div>
        <div class="mb-5 text_2--text details">
          <div>You have claimed your event Token!</div>
        </div>

        <v-btn color="torusBrand4" large class="torusBrand1--text mb-10 px-12">
          Return Home
        </v-btn>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
export default {
  methods: {
    onCancel() {
      this.$emit('onClose')
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'ClaimToken.scss';
</style>
