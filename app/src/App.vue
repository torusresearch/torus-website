<template>
  <v-app>
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
.v-input__slot {
  margin-bottom: 2px;
}

.v-text-field.v-text-field--enclosed .v-text-field__details {
  margin-bottom: 0;
}

.v-btn {
  text-transform: inherit;
}

.theme--light {
  /* width */
  ::-webkit-scrollbar {
    width: 0.8em;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: #e2e2e2;
    box-shadow: inset 0 0 1px #e2e2e2;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #7d7d7d;
    border: 2px solid #e2e2e2;
    border-radius: 8px;
  }
}

.theme--dark {
  /* width */
  ::-webkit-scrollbar {
    width: 0.8em;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: #626262;
    box-shadow: inset 0 0 5px #626262;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #242529;
    border: 2px solid #626262;
    border-radius: 8px;
  }
}
</style>
