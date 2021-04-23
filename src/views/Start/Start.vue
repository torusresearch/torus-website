<template>
  <v-container fill-height text-center>
    <v-layout class="redirect-container" :class="$vuetify.breakpoint.xsOnly ? 'redirect-container--mobile' : ''" row wrap align-center>
      <v-flex text-center>
        <!-- <BeatLoader
          margin="24px 4px 0"
          size="12px"
          :color="$vuetify.theme.dark ? $vuetify.theme.themes.dark.torusBrand1 : $vuetify.theme.themes.light.torusBrand1"
        /> -->
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import log from 'loglevel'
// import BeatLoader from 'vue-spinner/src/BeatLoader'
import { mapState } from 'vuex'

import { getOpenLoginInstance } from '../../openlogin'

export default {
  name: 'Start',
  // components: { BeatLoader },
  computed: {
    ...mapState({
      loginConfig: (state) => state.embedState.loginConfig,
    }),
  },
  async mounted() {
    try {
      const { verifier, state, ...rest } = this.$route.query
      const openLogin = await getOpenLoginInstance()
      await openLogin.login({
        loginProvider: this.loginConfig[verifier]?.loginProvider,
        getWalletKey: true,
        relogin: true,
        appState: state,
        extraLoginOptions: {
          ...rest,
        },
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
