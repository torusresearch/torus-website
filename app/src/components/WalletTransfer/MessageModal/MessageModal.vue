<template>
  <v-card class="torus-v8 message-modal">
    <v-btn class="close-btn" icon @click="onCancel">
      <v-icon>$vuetify.icons.close</v-icon>
    </v-btn>
    <v-layout wrap>
      <v-flex class="card-shadow text-center" py-8 mb-4 xs12>
        <img :src="require(`../../../../public/images/status-${modalType}.svg`)" width="64" />
      </v-flex>

      <v-flex xs12 mx-10 class="text-center">
        <div class="mb-4 font-weight-bold text_2--text headline">{{ title }}</div>
        <div v-if="detailText" class="mb-6 text_2--text caption">{{ detailText }}</div>
        <slot name="link"></slot>
        <template v-if="isLoading">
          <div class="body-2 mb-6 font-weight-medium primary--text">Loading...</div>
          <v-btn text class="body-2 skip-btn mb-10" @click="onCancel">Skip</v-btn>
        </template>
        <div v-else-if="isReload" class="text_2--text mb-10 caption">Reloading in {{ reloadTime }} sec...</div>
        <v-btn
          v-else-if="!noClose"
          :color="modalType === MESSAGE_MODAL_TYPE_SUCCESS ? 'success' : modalType === MESSAGE_MODAL_TYPE_FAIL ? 'error' : ''"
          :outlined="modalType !== MESSAGE_MODAL_TYPE_PENDING"
          :depressed="modalType === MESSAGE_MODAL_TYPE_PENDING"
          class="mb-10 px-12"
          :class="modalType === MESSAGE_MODAL_TYPE_PENDING ? 'primary--text' : ''"
          @click="goTo ? redirectTo() : onCancel()"
        >
          {{ goTo ? 'Continue' : 'Return' }}
        </v-btn>
      </v-flex>
    </v-layout>
  </v-card>
  <!-- <v-card class="message-modal">
    <v-card-text class="text_1--text pa-0">
      <v-layout wrap class="image-container text-center" :class="modalType ? 'image-container-success' : 'image-container-danger'">
        <v-flex xs12 px-4>
          <img height="16px" width="16px" class="close-icon" :src="require('../../../../public/img/icons/close.svg')" @click="onCancel" />

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
          <v-btn v-if="modalType" id="continue-link" color="#2DCC70" class="px-12 py-4 mb-12 white--text modal-button" to="/wallet/history">
            Continue
          </v-btn>

          <v-btn v-else color="#FEA29F" class="px-12 py-4 mb-12 white--text modal-button" @click="onCancel">Try again</v-btn>
        </v-flex>
      </v-layout>
    </v-card-text>
  </v-card> -->
</template>

<script>
import { MESSAGE_MODAL_TYPE_FAIL, MESSAGE_MODAL_TYPE_PENDING, MESSAGE_MODAL_TYPE_SUCCESS } from '../../../utils/enums'

export default {
  props: {
    modalType: {
      type: Boolean
    },
    title: {
      type: String,
      default: ''
    },
    detailText: {
      type: String,
      default: ''
    },
    isLoading: {
      type: Boolean,
      default: true
    },
    isReload: {
      type: Boolean,
      default: false
    },
    reloadTime: {
      type: Number,
      default: 5
    },
    noClose: {
      type: Boolean,
      default: false
    },
    goTo: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      MESSAGE_MODAL_TYPE_SUCCESS,
      MESSAGE_MODAL_TYPE_PENDING,
      MESSAGE_MODAL_TYPE_FAIL
    }
  },
  created() {
    if (this.isReload) {
      const origTime = this.reloadTime
      setInterval(() => {
        this.reloadTime -= 1
        if (this.reloadTime === 0) {
          this.reloadTime = origTime
          window.location.reload()
        }
      }, 1000)
    }
  },
  methods: {
    onCancel() {
      this.$emit('onClose')
    },
    redirectTo() {
      this.$router.push({ name: this.goTo })
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'MessageModal.scss';
</style>
