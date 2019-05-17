<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <span class="selected-account font-weight-medium" :color="$vuetify.theme.torus_accept" size="18" v-on="on" @click="copyToClip(address)">
        <slot></slot>
      </span>
    </template>
    <template v-if="copied">
      Copied!
    </template>
    <template v-else>
      Copy to clipboard
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
  props: ['address'],
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

<style lang="scss">
.text-bluish {
  color: var(--v-torus_blue-base);
}

.selected-account {
  cursor: pointer;
  @extend .text-bluish;

  &:hover {
    background-color: var(--v-torus_reject_mild-base);
    opacity: 0.5;
    color: #fff;
  }

  &.active {
    background-color: var(--v-torus_active-base);
  }
}
</style>
