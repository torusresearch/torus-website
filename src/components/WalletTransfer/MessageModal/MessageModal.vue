<template>
  <v-card class="torus-v8 message-modal">
    <v-btn class="close-btn" icon aria-label="Close Message Modal" @click="onCancel">
      <v-icon>$vuetify.icons.close</v-icon>
    </v-btn>
    <v-layout wrap>
      <v-flex class="elevation-1 text-center" py-8 mb-4 xs12>
        <img :src="require(`../../../assets/images/status-${modalType}.svg`)" width="64" :alt="modalType" />
      </v-flex>

      <v-flex xs12 mx-10 class="text-center">
        <div class="mb-4 font-weight-bold text_2--text headline">{{ title }}</div>
        <div v-if="detailText" class="mb-6 text_2--text body-2">{{ detailText }}</div>
        <slot name="link"></slot>
        <v-btn
          v-if="!noClose"
          outlined
          block
          class="torus-btn1 mb-10 text_2--text"
          :style="{ height: '50px' }"
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
      this.$router.push({ name: this.goTo }).catch((_) => {})
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'MessageModal.scss';
</style>
