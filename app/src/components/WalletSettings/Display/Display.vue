<template>
  <div class="select-theme-container" :class="$vuetify.breakpoint.xsOnly ? 'pt-5' : 'py-5 px-4'">
    <div class="body-2 text_1--text mb-2 px-1">{{ t('walletSettings.selectTheme') }}</div>
    <v-layout wrap mx-n3>
      <v-flex v-for="theme in themes" :key="theme.name" px-3 xs6 @click="saveTheme(theme)">
        <v-btn
          block
          :disabled="theme.name === activeTheme"
          large
          class="primary--text theme-btn"
          :class="[$vuetify.theme.isDark ? 'torus_black_2' : 'white', theme.name === activeTheme ? '' : 'elevation-3']"
        >
          {{ t(theme.label) }}
        </v-btn>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import log from 'loglevel'

import themes from '../../../plugins/themes'

export default {
  name: 'DisplaySettings',
  data() {
    return {
      themes,
      selectedTheme: ''
    }
  },
  computed: {
    activeTheme() {
      return this.$store.state.theme
    }
  },
  methods: {
    async saveTheme(theme) {
      this.selectedTheme = theme
      try {
        await this.$store.dispatch('setUserTheme', this.selectedTheme.name)
      } catch (error) {
        log.error(error)
      }
    },
    themeOptionStyle(theme) {
      if (!theme) return {}
      return {
        color: `${theme.theme.primary.base} !important`,
        backgroundColor: `${theme.theme.background_body_1} !important`
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'Display.scss';
</style>
