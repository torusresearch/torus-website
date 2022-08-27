<template>
  <v-app class="torus-app">
    <template v-if="loginInProgress">
      <v-container class="spinner" fluid :class="$vuetify.theme.dark ? 'torus-dark' : ''">
        <BoxLoader :force-spinner="true" />
        <p class="bottom-text text-body-1 text-center font-weight-medium">
          {{ $t('login.loader') }}
        </p>
      </v-container>
    </template>
    <template v-else>
      <router-view />
    </template>
  </v-app>
</template>

<script>
import log from 'loglevel'
import { useTheme } from 'vuetify'
import { mapActions, mapState } from 'vuex'

import BoxLoader from './components/helpers/BoxLoader'
import { THEME_DARK_BLACK_NAME } from './utils/enums'
/* eslint-disable vue-scoped-css/enforce-style-type */
export default {
  components: { BoxLoader },
  setup() {
    const theme = useTheme()
    return { vuetifyTheme: theme }
  },
  data() {
    return {
      loginInProgress: false,
    }
  },
  computed: mapState(['theme', 'whitelabel']),
  watch: {
    async $route(to) {
      this.updateBackgrounds(to.name)
    },
    theme() {
      log.info('theme property has changed')
      this.updateTheme()
    },
    whitelabel() {
      log.info('whitelabel property has changed')
      this.updateTheme()
    },
  },
  async created() {
    this.updateBackgrounds(this.$route.name)
    this.updateTheme()
    try {
      this.loginInProgress = true
      await this.rehydrate()
    } catch (error) {
      log.error(error)
    } finally {
      this.loginInProgress = false
    }
  },
  methods: {
    ...mapActions(['rehydrate']),
    updateBackgrounds(routeName) {
      const pageHtml = document.querySelector('html')
      const pageBody = document.querySelector('body')
      const pageApplication = document.querySelector('#app')

      if (routeName === 'popup') {
        pageHtml.style.background = 'none'
        pageBody.style.background = 'none'
        pageApplication.style.background = 'none'
      } else {
        pageHtml.style.background = ''
        pageBody.style.background = ''
        pageApplication.style.background = ''
      }
    },
    updateTheme() {
      const isDarkMode = this.theme === THEME_DARK_BLACK_NAME
      this.vuetifyTheme.global.name.value = isDarkMode ? 'dark' : 'light'
    },
  },
}
</script>

<style lang="scss">
@import 'App.scss';
</style>
