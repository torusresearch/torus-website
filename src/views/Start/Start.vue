<template>
  <v-container fill-height text-center>
    <v-layout class="redirect-container" :class="$vuetify.breakpoint.xsOnly ? 'redirect-container--mobile' : ''" row wrap align-center>
      <v-flex text-center>
        <BoxLoader />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { safeatob } from '@toruslabs/openlogin-utils'
import log from 'loglevel'
import { mapState } from 'vuex'

import BoxLoader from '../../components/helpers/BoxLoader'
import { getOpenLoginInstance } from '../../openlogin'

export default {
  name: 'Start',
  components: { BoxLoader },
  computed: {
    ...mapState({
      loginConfig: (state) => state.embedState.loginConfig,
      whiteLabel: 'whiteLabel',
    }),
  },
  async mounted() {
    try {
      const { verifier, state, skipTKey, ...rest } = this.$route.query
      const stateParams = JSON.parse(safeatob(state))
      log.info('logging in with', verifier, state, skipTKey, rest)
      const whiteLabel = stateParams.whiteLabel ? stateParams.whiteLabel : this.whiteLabel
      const openLogin = await getOpenLoginInstance(whiteLabel)
      await openLogin.login({
        loginProvider: this.loginConfig[verifier]?.loginProvider,
        getWalletKey: true,
        relogin: true,
        appState: state,
        skipTKey: skipTKey === 'true',
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
