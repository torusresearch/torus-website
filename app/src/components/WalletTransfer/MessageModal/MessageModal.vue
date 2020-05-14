<template>
  <v-card class="torus-v8 message-modal">
    <v-btn class="close-btn" icon @click="onCancel">
      <v-icon>$vuetify.icons.close</v-icon>
    </v-btn>
    <v-layout wrap>
      <v-flex class="card-shadow text-center" py-8 mb-4 xs12>
        <img :src="require(`../../../../public/images/status-${modalType}.svg`)" width="64" :alt="modalType" />
      </v-flex>

      <v-flex xs12 mx-10 class="text-center">
        <div class="mb-4 font-weight-bold text_2--text headline">{{ title }}</div>
        <div v-if="detailText" class="mb-6 text_2--text caption">{{ detailText }}</div>
        <slot name="link"></slot>
        <template v-if="isLoading">
          <div class="body-2 mb-6 font-weight-medium primary--text">Loading...</div>
          <v-btn text class="body-2 skip-btn mb-10" @click="onCancel">Skip</v-btn>
        </template>
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
</template>

<script>
import { MESSAGE_MODAL_TYPE_FAIL, MESSAGE_MODAL_TYPE_PENDING, MESSAGE_MODAL_TYPE_SUCCESS } from '../../../utils/enums'

export default {
  name: 'MessageModal',
  props: {
    modalType: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    detailText: {
      type: String,
      default: '',
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    noClose: {
      type: Boolean,
      default: false,
    },
    goTo: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      MESSAGE_MODAL_TYPE_SUCCESS,
      MESSAGE_MODAL_TYPE_PENDING,
      MESSAGE_MODAL_TYPE_FAIL,
    }
  },
  methods: {
    onCancel() {
      this.$emit('onClose')
    },
    redirectTo() {
      this.$router.push({ name: this.goTo })
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'MessageModal.scss';
</style>
