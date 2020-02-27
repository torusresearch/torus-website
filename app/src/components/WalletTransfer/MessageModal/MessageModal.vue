<template>
  <v-card class="advance-option message-modal">
    <v-card-text class="text_1--text pa-0">
      <v-layout wrap class="image-container text-center" :class="modalType ? 'image-container-success' : 'image-container-danger'">
        <v-flex xs12 px-4>
          <img @click="onCancel" height="16px" width="16px" class="close-icon" :src="require('../../../../public/img/icons/close.svg')" />

          <img v-if="modalType" height="87px" width="87px" :src="require('../../../../public/img/icons/check-circle-white.svg')" />

          <img v-if="!modalType" height="87px" width="87px" :src="require('../../../../public/img/icons/error-circle.svg')" />
        </v-flex>
      </v-layout>
      <v-layout wrap py-6>
        <v-flex xs12 md10 mx-auto px-4 text-center>
          <div class="font-weight-bold headline mt-4 mb-2">{{ title }}</div>
        </v-flex>

        <v-flex xs10 md8 mx-auto px-4 text-center mb-6>
          <p>{{ detailText }}</p>
        </v-flex>

        <v-flex xs12 mx-auto px-4 text-center pb-4>
          <v-btn id="continue-link" v-if="modalType" color="#2DCC70" class="px-12 py-4 mb-12 white--text modal-button" to="/wallet/history">
            Continue
          </v-btn>

          <v-btn v-else color="#FEA29F" class="px-12 py-4 mb-12 white--text modal-button" @click="onCancel">Try again</v-btn>
        </v-flex>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: ['modalType', 'title', 'detailText'],
  methods: {
    onCancel() {
      this.$emit('onClose')
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'MessageModal.scss';
</style>
