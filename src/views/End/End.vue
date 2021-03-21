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

import config from '../../config'

export default {
  name: 'End',
  components: { BeatLoader },
  async mounted() {
    try {
      // TODO: integrate open login here
      const openLogin = new OpenLogin({
        clientId: config.openLoginClientId,
        iframeUrl: config.openLoginUrl,
        redirectUrl: `${window.location.origin}/end`,
        replaceUrlOnRedirect: true,
        uxMode: 'redirect',
      })
      await openLogin.init()
      await openLogin.login()
      const { privKey } = openLogin
      log.info(privKey, 'privKey')
    } catch (error) {
      log.info(error, 'something went wrong')
    }
  },
}
</script>

<style lang="scss" scoped>
@import 'End.scss';
</style>
