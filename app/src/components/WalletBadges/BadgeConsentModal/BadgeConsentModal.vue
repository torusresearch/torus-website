<template>
  <v-card class="advance-option message-modal">
    <div class="text-right">
      <v-btn icon class="close-btn" small @click="onCancel">
        <v-icon size="8">$vuetify.icons.close</v-icon>
      </v-btn>
    </div>
    <v-card-text text-center class="text_1--text pa-0">
      <v-layout wrap justify-center class="image-container text-center">
        <v-flex xs6 text-center>
          <img width="80" src="../../../../public/images/badges/check.png" />
        </v-flex>
      </v-layout>
      <v-layout wrap class="badge-info">
        <v-flex xs12 md10 mx-auto px-4 text-center>
          <div class="font-weight-bold headline mt-4 mb-2">Do no track badges</div>
        </v-flex>

        <v-flex xs10 md9 mx-auto text-center mb-6>
          <span class="title text-gray">
            Carrying out this action will make you lose all the badges you have in your wallet. This cannot be undone.
          </span>
        </v-flex>

        <v-flex xs6 mx-auto px-4 mt-6 text-center pb-4>
          <v-btn text large block depressed class="px-12 return-btn" @click="onCancel">Cancel</v-btn>
        </v-flex>
        <v-flex xs6 mx-auto px-4 mt-6 text-center pb-4>
          <v-btn color="primary" large block depressed class="px-12 allow-btn">Confirm</v-btn>
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
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'BadgeConsentModal.scss';
</style>
