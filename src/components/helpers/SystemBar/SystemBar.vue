<template>
  <v-system-bar
    v-show="message"
    fixed
    :height="$vuetify.breakpoint.xsOnly ? 46 : ''"
    :color="barColor"
    :class="[`${$vuetify.theme.dark ? 'white--text' : `${textColor}--text text--darken-1`}`]"
  >
    <div class="container d-flex align-center">
      <v-spacer />
      <v-icon v-if="icon" small :class="`${$vuetify.theme.dark ? 'white--text' : `${textColor}--text text--darken-1`}`">
        $vuetify.icons.{{ icon }}
      </v-icon>
      <span class="caption">{{ messageFormatted }}</span>
      <v-spacer />
      <v-icon v-if="hasClose" size="12" :class="`${$vuetify.theme.dark ? 'white--text' : `${textColor}--text text--darken-1`}`" @click="onClose">
        $vuetify.icons.close
      </v-icon>
    </div>
  </v-system-bar>
</template>

<script>
import { capitalizeFirstLetter } from '../../../utils/utils'

export default {
  props: {
    message: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
  },
  computed: {
    messageFormatted() {
      return capitalizeFirstLetter(this.type === 'announcement' ? this.message : this.t(this.message))
    },
    barColor() {
      const barColor = []
      if (this.type === 'lrc') barColor.push('warning')
      else if (this.type === 'success') barColor.push('success')
      else if (this.type === 'error') barColor.push('error')
      else barColor.push('infoBanner')

      if (!this.$vuetify.theme.dark && this.type !== 'announcement') barColor.push('lighten-5')
      return barColor.join(' ')
    },
    textColor() {
      if (this.type === 'lrc') return 'warning'
      if (this.type === 'success') return 'success'
      if (this.type === 'error') return 'error'
      return 'infoBannerText'
    },
    hasClose() {
      return this.type !== 'lrc'
    },
  },
  methods: {
    onClose() {
      this.$emit('onClose')
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'SystemBar.scss';
</style>
