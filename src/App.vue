<template>
  <v-app class="torus-app">
    <template v-if="loginInProgress">
      <v-container class="spinner" fluid :class="$vuetify.theme.dark ? 'torus-dark' : ''">
        <BoxLoader :force-spinner="true" />
        <p class="bottom-text text-body-1 text-center font-weight-medium">
          {{ t('login.loader') }}
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
import { mapActions } from 'vuex'

import BoxLoader from './components/helpers/BoxLoader'
import { OpenLoginHandler } from './handlers/Auth'
import { isMain } from './utils/utils'
/* eslint-disable vue-scoped-css/enforce-style-type */
export default {
  components: { BoxLoader },
  data() {
    return {
      loginInProgress: false,
    }
  },
  watch: {
    $route(to) {
      this.updateBackgrounds(to.name)
    },
  },
  async created() {
    this.updateBackgrounds(this.$route.name)
    if (!this.$route.meta.skipOpenLoginCheck) {
      this.loginInProgress = true
      try {
        const openLoginHandler = OpenLoginHandler.getInstance()
        const sessionInfo = await openLoginHandler.getActiveSession()
        if (sessionInfo && (sessionInfo.walletKey || sessionInfo.tKey)) {
          // already logged in
          // call autoLogin
          log.info('auto-login with openlogin session')
          await this.autoLogin({ calledFromEmbed: !isMain })
          if (this.$route.name !== 'popup' && this.$route.meta.requiresAuth === false) {
            await this.$router.push(this.$route.query.redirect || '/wallet').catch((_) => {})
          }
        } else {
          log.info('no openlogin session, redirect to login')
        }
      } catch (error) {
        log.error(error)
      } finally {
        this.loginInProgress = false
      }
    }
  },
  methods: {
    ...mapActions(['autoLogin']),
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
  },
}
</script>

<style lang="scss">
@import 'App.scss';
</style>
