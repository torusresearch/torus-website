<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <span class="selected-account" :color="$vuetify.theme.torus_accept" size="18" v-on="on" @click.stop="copyToClip(address)">
        <slot></slot>
      </span>
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
  name: 'showToolTip',
  data() {
    return {
      copied: false
    }
  },
  props: ['address', 'isBtn'],
  methods: {
    copyToClip(address) {
      this.copied = true
      copyToClipboard(address)
      setTimeout(() => {
        this.copied = false
      }, 2500)
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'ShowToolTip.scss';
</style>
