<template>
  <v-card class="torus-v8 message-modal">
    <v-btn class="close-btn" icon aria-label="Close Message Modal" @click="onCancel">
      <v-icon>$close</v-icon>
    </v-btn>
    <v-row wrap>
      <v-col class="elevation-1 text-center py-8 mb-4" cols="12">
        <img :src="require(`../../../assets/images/status-${modalType}.svg`)" width="64" :alt="modalType" />
      </v-col>

      <v-col cols="12" class="text-center mx-10">
        <div class="mb-4 font-weight-bold text-text_2 headline">{{ title }}</div>
        <div v-if="detailText" class="mb-6 text-text_2 body-2">{{ detailText }}</div>
        <slot name="link"></slot>
        <v-btn
          v-if="!noClose"
          variant="outlined"
          block
          class="torus-btn1 mb-10 text-text_2"
          :style="{ height: '50px' }"
          @click="goTo ? redirectTo() : onCancel()"
        >
          {{ goTo ? 'Continue' : 'Return' }}
        </v-btn>
      </v-col>
    </v-row>
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
