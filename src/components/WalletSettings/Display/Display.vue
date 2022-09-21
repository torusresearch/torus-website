<template>
  <div class="select-theme-container" :class="$vuetify.display.xs ? 'pt-5' : 'py-5'">
    <div class="body-2 text-torusFont1 mb-2 px-1">{{ $t('walletSettings.selectTheme') }}</div>
    <v-row wrap class="mx-n3">
      <v-col v-for="theme in themes" :key="theme.name" class="px-3" cols="12" sm="6" @click="saveTheme(theme)">
        <v-btn
          block
          size="large"
          class="theme-btn gmt-display-change"
          :class="[isDarkMode ? 'torusBlack2' : 'white', theme.name === activeTheme ? 'active' : 'elevation-3', { 'mb-2': $vuetify.display.xs }]"
        >
          <div>{{ $t(theme.label) }}</div>
          <template #append>
            <img :src="require(`../../../assets/images/${theme.icon}`)" alt="Display Settings Icon" />
          </template>
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import log from 'loglevel'
import { mapActions, mapState } from 'vuex'

import themes from '../../../plugins/themes'

export default {
  name: 'DisplaySettings',
  data() {
    return {
      themes,
      selectedTheme: '',
    }
  },
  computed: {
    ...mapState({
      activeTheme: 'theme',
    }),
    isDarkMode() {
      return this.$vuetify.theme.name === 'dark'
    },
  },
  methods: {
    ...mapActions(['setUserTheme']),
    async saveTheme(theme) {
      if (this.selectedTheme === theme) return
      this.selectedTheme = theme
      try {
        await this.setUserTheme(this.selectedTheme.name)
      } catch (error) {
        log.error(error)
      }
    },
    themeOptionStyle(theme) {
      if (!theme) return {}
      return {
        color: `${theme.theme.torusBrand1} !important`,
        backgroundColor: `${theme.theme.torusLight} !important`,
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'Display.scss';
</style>
