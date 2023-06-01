<template>
  <v-tooltip bottom>
    <template #activator="{ on }">
      <v-btn v-if="isBtn" icon small class="selected-account" aria-label="Copy to clipboard" v-on="on" @click.stop="copyToClip(address)">
        <slot></slot>
      </v-btn>
      <a
        v-else
        class="selected-account"
        tabindex="0"
        :color="$vuetify.theme.torus_accept"
        size="18"
        v-on="on"
        @click.stop="copyToClip(address)"
        @keydown.enter.space="copyToClip(address)"
      >
        <slot></slot>
      </a>
    </template>
    <template v-if="copied">{{ t('walletHome.copy') }}!</template>
    <template v-else>
      {{ t('walletHome.copyToClipboard') }}
    </template>
  </v-tooltip>
</template>

<script>
import copyToClipboard from 'copy-to-clipboard'

export default {
  name: 'ShowToolTip',
  props: {
    address: {
      type: String,
      default: '',
    },
    isBtn: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      copied: false,
    }
  },
  methods: {
    copyToClip(address) {
      this.copied = true
      copyToClipboard(address)
      setTimeout(() => {
        this.copied = false
      }, 3000)
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'ShowToolTip.scss';
</style>
