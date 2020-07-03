<template>
  <v-layout>
    <v-flex xs12 text-center>
      <v-dialog :value="loginDialog && showModal" max-width="375" persistent>
        <v-card class="login-dialog-container">
          <v-layout wrap>
            <v-flex text-center class="login-header" xs12 pt-8 pb-6 px-6>
              <img class="home-link mr-1" alt="Torus Logo" :height="getLogo.isExternal ? '50' : '30'" :src="getLogo.logo" />
              <v-btn class="close-btn" icon aria-label="Close Login Modal" @click="closeDialog">
                <v-icon>$vuetify.icons.close</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
          <v-layout wrap pa-6>
            <v-flex xs12>
              <div class="verifier-title headline torus_text--text font-weight-bold">
                <span v-if="$vuetify.breakpoint.xsOnly">
                  {{ t('login.your') }}
                  <img :src="require(`../../../assets/images/login-verifiers.gif`)" alt="Login Verifier Icon" />
                </span>
                <span v-else>
                  {{ t('login.your') }}
                  <span v-if="activeButton === GOOGLE">
                    <span class="verifier-title__google-blue">G</span>
                    <span class="verifier-title__google-red">o</span>
                    <span class="verifier-title__google-yellow">o</span>
                    <span class="verifier-title__google-blue">g</span>
                    <span class="verifier-title__google-green">l</span>
                    <span class="verifier-title__google-red">e</span>
                  </span>
                  <span v-else-if="activeButton" class="text-capitalize" :class="`verifier-title__${activeButton}`">{{ activeButton }}</span>
                </span>
              </div>
              <div class="font-weight-bold verifier-subtitle torus_text--text">
                {{ t('login.digitalWallet') }}
              </div>
            </v-flex>
            <v-flex xs12 mt-7>
              <div class="body-1 torus_text--text">{{ t('login.signUpIn') }}</div>
            </v-flex>
            <v-flex xs12>
              <v-layout wrap mx-n1>
                <v-flex v-for="verifier in loginButtons" :key="verifier.typeOfLogin" xs4 px-1 mt-2>
                  <v-btn
                    block
                    class="login-btn"
                    :class="{ active: verifier.name === activeButton }"
                    type="button"
                    :title="`${t('login.loginWith')} ${verifier.typeOfLogin}`"
                    @mouseover="loginBtnHover(verifier.name)"
                    @click="startLogin(verifier.verifier)"
                  >
                    <img
                      v-if="verifier.name === activeButton || $vuetify.breakpoint.xsOnly"
                      :src="verifier.logoHover || require(`../../../assets/img/icons/login-${verifier.typeOfLogin}.svg`)"
                      :alt="`${verifier.name} Icon`"
                    />
                    <img v-else-if="$vuetify.theme.isDark && verifier.logoLight" :src="verifier.logoLight" :alt="`${verifier.name} Icon`" />
                    <img v-else-if="!$vuetify.theme.isDark && verifier.logoDark" :src="verifier.logoDark" :alt="`${verifier.name} Icon`" />
                    <v-icon v-else size="30" :class="$vuetify.theme.dark ? 'white--text' : 'loginBtnGray--text'">
                      {{ `$vuetify.icons.${verifier.typeOfLogin}` }}
                    </v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex v-if="loginButtonsLong.length > 0" xs12 mt-4 class="text-center">
              <div class="d-flex align-center">
                <v-divider></v-divider>
                <div :class="$vuetify.breakpoint.xsOnly ? 'px-5' : 'px-4'">
                  <div class="body-2 text_2--text">{{ t('login.or') }}</div>
                </div>
                <v-divider></v-divider>
              </div>
              <div v-for="verifier in loginButtonsLong" :key="verifier.typeOfLogin" class="mt-4">
                <v-btn
                  :id="`${verifier.typeOfLogin}LoginBtn`"
                  :color="$vuetify.theme.dark ? '' : 'white'"
                  block
                  :class="[$vuetify.theme.dark ? 'torus-dark' : '', `login-btn-${verifier.typeOfLogin}`]"
                  class="body-1 font-weight-bold card-shadow-v8 text_2--text login-btn-long"
                  @click="startLogin(verifier.verifier)"
                >
                  <img
                    v-if="$vuetify.theme.isDark && verifier.logoLight"
                    class="mr-4"
                    height="20"
                    :src="verifier.logoLight"
                    :alt="`${verifier.name} Icon`"
                  />
                  <img
                    v-else-if="!$vuetify.theme.isDark && verifier.logoDark"
                    class="mr-4"
                    height="20"
                    :src="verifier.logoDark"
                    :alt="`${verifier.name} Icon`"
                  />
                  <v-icon v-else class="mr-4">{{ `$vuetify.icons.${verifier.typeOfLogin}` }}</v-icon>
                  {{ t(verifier.description) }}
                </v-btn>
              </div>
            </v-flex>
            <v-flex mt-2 mb-2 mt-10>
              <div class="text_2--text mb-4 caption">
                {{ t('dappLogin.termsHandle') }}
              </div>
              <div class="text_2--text mb-5 caption">
                {{ t('dappLogin.termsAuth0') }}
                <a class="privacy-learn-more text_2--text" href="https://docs.tor.us/legal/privacy-policy" target="_blank">
                  {{ t('dappLogin.termsLearnMore') }}
                </a>
              </div>
              <div class="caption torus_text--text">
                {{ t('login.acceptTerms') }}
                <a :href="tncLink" target="_blank" rel="noreferrer noopener" :style="{ textDecoration: 'none' }">
                  <span class="torusBrand1--text">{{ t('login.termsAndConditions') }}</span>
                </a>
              </div>
            </v-flex>
          </v-layout>
        </v-card>
      </v-dialog>
      <PasswordlessLogin
        :passwordless-login-dialog="passwordlessLoginDialog"
        :passwordless-email-sent="passwordlessEmailSent"
        @cancel="
          passwordlessLoginDialog = false
          passwordlessEmailSent = false
        "
        @sendLink="passwordlessEmailSent = true"
      />
    </v-flex>
  </v-layout>
</template>

<script>
import log from 'loglevel'
import { mapActions, mapGetters } from 'vuex'

import PasswordlessLogin from '../../../components/helpers/PasswordLessLogin'
import { GOOGLE, PASSWORDLESS } from '../../../utils/enums'

export default {
  name: 'PopupLogin',
  components: { PasswordlessLogin },
  props: {
    loginDialog: {
      type: Boolean,
      dafault: false,
    },
  },
  data() {
    return {
      GOOGLE,
      PASSWORDLESS,
      showModal: true,
      activeButton: '',
      passwordlessLoginDialog: false,
      passwordlessEmailSent: false,
    }
  },
  computed: {
    ...mapGetters(['loginButtonsArray', 'getLogo']),
    loginButtons() {
      return this.loginButtonsArray.filter((button) => !button.description && button.typeOfLogin !== PASSWORDLESS)
    },
    loginButtonsLong() {
      return this.loginButtonsArray.filter((button) => button.description && button.typeOfLogin !== PASSWORDLESS)
    },
    localeSelected() {
      return this.$vuetify.lang.current
    },
    tncLink() {
      let finalLink = 'https://docs.tor.us/legal/terms-and-conditions'
      const { isActive, tncLink } = this.$store.state.whiteLabel
      if (isActive && tncLink) {
        finalLink = tncLink[this.localeSelected] || tncLink[Object.keys(tncLink)[0]]
      }
      return finalLink
    },
  },
  mounted() {
    this.activeButton = (this.loginButtons.concat(this.loginButtonsLong)[0] || { typeOfLogin: GOOGLE }).typeOfLogin
  },
  methods: {
    loginBtnHover(verifier) {
      if (!this.$vuetify.breakpoint.xsOnly) this.activeButton = verifier
    },
    async startLogin(verifier) {
      if (verifier === PASSWORDLESS) {
        this.passwordlessLoginDialog = true
        return
      }
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
@import 'PopupLogin.scss';
</style>
