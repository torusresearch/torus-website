<template>
  <v-app class="torus-app">
    <router-view />
  </v-app>
</template>

<script>
import themes from './plugins/themes'
import { THEME_LIGHT_BLUE_NAME } from './utils/enums'

export default {
  computed: {
    currentTheme() {
      return this.$store.state.theme
    }
  },
  watch: {
    currentTheme(stateTheme) {
      this.applyTheme(stateTheme)
    }
  },
  methods: {
    applyTheme(themeName) {
      const theme = themes[themeName || THEME_LIGHT_BLUE_NAME]
      this.$vuetify.theme.dark = theme.isDark
      this.$vuetify.theme.themes[theme.isDark ? 'dark' : 'light'] = theme.theme
    }
  },
  created() {
    this.applyTheme(this.$store.state.theme)
  }
}
</script>

<style src="../public/css/circles.css"></style>

<style lang="scss">
@import 'App.scss';
</style>
