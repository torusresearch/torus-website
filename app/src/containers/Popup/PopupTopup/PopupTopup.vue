<template>
  <v-layout>
    <v-flex xs12 text-center>
      <v-dialog :value="isTopupModalVisible && showModal" max-width="80%" persistent>
        <v-card class="login-dialog-container">
          <WalletTopupHome />
        </v-card>
      </v-dialog>
    </v-flex>
  </v-layout>
</template>

<script>
import log from 'loglevel'
import { mapActions, mapState } from 'vuex'

import { DISCORD, FACEBOOK, GOOGLE, REDDIT, TWITCH } from '../../../utils/enums'
import { WalletTopupHome } from '../../WalletTopup'

export default {
  name: 'PopupTopup',
  components: {
    WalletTopupHome,
  },
  props: {
    isTopupModalVisible: {
      type: Boolean,
      dafault: false,
    },
  },
  data() {
    return {
      GOOGLE,
      FACEBOOK,
      REDDIT,
      TWITCH,
      DISCORD,
      activeButton: GOOGLE,
      showModal: true,
    }
  },
  computed: {
    ...mapState({
      enabledVerifiers: (state) => state.embedState.enabledVerifiers,
    }),
    loginButtons() {
      return Object.keys(this.enabledVerifiers).filter((x) => this.enabledVerifiers[x])
    },
  },
  methods: {
    loginBtnHover(verifier) {
      if (!this.$vuetify.breakpoint.xsOnly) this.activeButton = verifier
    },
    async startLogin(verifier) {
      try {
        this.showModal = false
        await this.triggerLogin({ verifier, calledFromEmbed: true })
      } catch (error) {
        log.error(error)
        this.closeDialog()
      } finally {
        this.showModal = true
      }
    },
    closeDialog() {
      this.$emit('closeDialog')
    },
    ...mapActions({
      triggerLogin: 'triggerLogin',
    }),
  },
}
</script>

<style lang="scss" scoped>
@import 'PopupTopup.scss';
</style>
