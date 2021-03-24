<template>
  <v-container fill-height text-center>
    <v-layout class="redirect-container" :class="$vuetify.breakpoint.xsOnly ? 'redirect-container--mobile' : ''" row wrap align-center>
      <v-flex text-center>
        <BeatLoader
          margin="24px 4px 0"
          size="12px"
          :color="$vuetify.theme.dark ? $vuetify.theme.themes.dark.torusBrand1 : $vuetify.theme.themes.light.torusBrand1"
        />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import OpenLogin from '@toruslabs/openlogin'
import log from 'loglevel'
import BeatLoader from 'vue-spinner/src/BeatLoader'
import { mapState } from 'vuex'

import config from '../../config'

export default {
  name: 'Start',
  components: { BeatLoader },
  computed: {
    ...mapState({
      loginConfig: (state) => state.embedState.loginConfig,
    }),
  },
  async mounted() {
    try {
      const { verifier, state } = this.$route.query
      log.info(verifier, 'logging with')
      const openLogin = new OpenLogin({
        clientId: config.openLoginClientId,
        iframeUrl: config.openLoginUrl,
        redirectUrl: `${window.location.origin}/end`,
        replaceUrlOnRedirect: true,
        uxMode: 'redirect',
      })
      await openLogin.init()
      await openLogin.login({
        loginProvider: this.loginConfig[verifier]?.loginProvider,
        getWalletKey: true,
        relogin: true,
        appState: state,
      })
    } catch (error) {
      log.info(error, 'something went wrong')
    }
  },
}
</script>

<style lang="scss" scoped>
@import 'Start.scss';
</style>
