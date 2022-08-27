<template>
  <v-system-bar
    v-show="message"
    :height="$vuetify.display.xs ? 46 : ''"
    :color="barColor"
    :class="[`${isDarkMode ? 'text-white' : `text-${textColor}`}`]"
  >
    <div class="container d-flex align-center w-100">
      <v-spacer />
      <v-icon v-if="icon" size="small" class="mr-1" :class="`${isDarkMode ? 'text-white' : `text-${textColor}`}`">
        {{ `$${icon}` }}
      </v-icon>
      <span class="caption">{{ messageFormatted }}</span>
      <v-spacer />
      <v-icon v-if="hasClose" size="12" :class="`${isDarkMode ? 'text-white' : `text-${textColor}`}`" @click="onClose">$close</v-icon>
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
      return capitalizeFirstLetter(this.type === 'announcement' ? this.message : this.$t(this.message))
    },
    barColor() {
      const barColor = []
      if (this.type === 'lrc') barColor.push('warning')
      else if (this.type === 'success') barColor.push('success')
      else if (this.type === 'error') barColor.push('error')
      else barColor.push('infoBanner')

      if (!this.isDarkMode && this.type !== 'announcement') barColor.push('lighten-5')
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
    isDarkMode() {
      return this.$vuetify.theme.name === 'dark'
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
