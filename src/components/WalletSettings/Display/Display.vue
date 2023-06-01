<template>
  <div class="select-theme-container" :class="$vuetify.breakpoint.xsOnly ? 'pt-5' : 'py-5 px-4'">
    <div class="body-2 torusFont1--text mb-2 px-1">{{ t('walletSettings.selectTheme') }}</div>
    <v-layout wrap mx-n3>
      <v-flex v-for="theme in themes" :key="theme.name" px-3 xs12 sm6 @click="saveTheme(theme)">
        <v-btn
          block
          large
          class="theme-btn gmt-display-change"
          :class="[
            $vuetify.theme.isDark ? 'torusBlack2' : 'white',
            theme.name === activeTheme ? 'active' : 'elevation-3',
            { 'mb-2': $vuetify.breakpoint.xsOnly },
          ]"
        >
          <span>{{ t(theme.label) }}</span>
          <img :src="require(`../../../assets/images/${theme.icon}`)" alt="Display Settings Icon" />
        </v-btn>
      </v-flex>
    </v-layout>
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
  computed: mapState({
    activeTheme: 'theme',
  }),
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
        color: `${theme.theme.torusBrand1.base} !important`,
        backgroundColor: `${theme.theme.torusLight} !important`,
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'Display.scss';
</style>
