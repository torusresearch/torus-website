<template>
  <v-card class="advance-option message-modal">
    <v-card-text text-center class="text_1--text pa-0">
      <div class="text-right">
        <v-btn icon class="close-btn" small @click="onCancel">
          <v-icon size="12">$vuetify.icons.close</v-icon>
        </v-btn>
      </div>
      <v-layout wrap justify-center class="image-container card-shadow py-5 text-center">
        <v-flex xs6 text-center>
          <img width="80" src="../../../../public/images/badges/check.png" />
        </v-flex>
      </v-layout>
      <v-layout wrap>
        <v-flex xs12 md10 mx-auto px-4 text-center>
          <div class="font-weight-bold headline mt-10 mb-2">Do no track badges</div>
        </v-flex>

        <v-flex xs10 md9 mx-auto mb-6>
          <span class="body-1 font-weight-normal">
            Carrying out this action will make you lose all the badges you have in your wallet. This cannot be undone.
          </span>
        </v-flex>

        <v-flex xs6 mx-auto px-4 mt-6 text-center pb-4>
          <v-btn text large block depressed class="px-12 cancel-btn" @click="onCancel">Cancel</v-btn>
        </v-flex>
        <v-flex xs6 mx-auto px-4 mt-6 text-center pb-4>
          <v-btn large block depressed class="px-12 confirm-btn" @click="onConfirm">Confirm</v-btn>
        </v-flex>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  methods: {
    onCancel() {
      this.$emit('onClose')
    },
    onConfirm() {
      this.$emit('onConfirm')
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'BadgeConsentModal.scss';
</style>
