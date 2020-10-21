<template>
  <div>
    <v-container :class="[$vuetify.breakpoint.xsOnly ? 'pt-6 px-0' : 'pa-4']">
      <v-layout class="justify-center">
        <v-flex class="xs12 sm10 md8 lg7">
          <div
            class="new-device-container"
            :class="[$vuetify.breakpoint.xsOnly ? 'is-mobile' : '', { 'is-dark': $vuetify.theme.dark, isDapp: urlInstance }]"
          >
            <div
              class="text-center"
              :class="$vuetify.breakpoint.xsOnly ? 'mb-7' : 'mb-4'"
              :style="{ height: $vuetify.breakpoint.xsOnly ? '66px' : '107px' }"
            >
              <img
                src="../../../assets/images/ob-verification.svg"
                :height="$vuetify.breakpoint.xsOnly ? '82' : ''"
                alt="Verification Required"
                class="mr-2"
              />
            </div>

            <!-- TITLE -->
            <div class="text-center new-device-header">
              <div class="new-device-header__title" :class="$vuetify.theme.dark ? 'torusFont2--text' : 'torusFont1--text'">
                {{ t('tkeyNew.verificationReq') }}
              </div>
              <div class="new-device-header__description text_2--text">
                {{ t('tkeyNew.youAreAccessing') }}
              </div>
              <div class="new-device-header__description text_2--text">{{ t('tkeyNew.verifyWithPass') }}</div>
            </div>

            <!-- BODY -->
            <div>
              <v-form v-model="validVerifyPasswordForm" @submit.prevent="onVerifyPassword">
                <v-text-field
                  v-model="verifyPassword"
                  :append-icon="showVerifyPassword ? '$vuetify.icons.visibility_off' : '$vuetify.icons.visibility_on'"
                  :type="showVerifyPassword ? 'text' : 'password'"
                  :rules="[rules.required]"
                  outlined
                  :placeholder="t('tkeyNew.enterPassword')"
                  @click:append="showVerifyPassword = !showVerifyPassword"
                />
                <v-layout class="mx-n2 mb-12 align-center btn-container">
                  <v-flex v-if="!$vuetify.breakpoint.xsOnly" class="xs2 px-2"></v-flex>
                  <v-flex class="px-2 xs6" :class="$vuetify.breakpoint.xsOnly ? 'text-center' : 'text-right'">
                    <!-- TODO: Change to on another method when sign in with another device is implemented -->
                    <a
                      class="caption text-decoration-none"
                      :class="[$vuetify.theme.dark ? 'torusFont1--text' : 'torusBrand1--text']"
                      @click="onSkipDeviceLogin"
                    >
                      <!-- {{ t('tkeyNew.verifyViaAnother') }} -->
                      {{ t('tkeyNew.skip') }}
                    </a>
                  </v-flex>
                  <v-flex class="px-2" :class="$vuetify.breakpoint.xsOnly ? 'xs6' : 'xs4'">
                    <v-btn
                      type="submit"
                      :disabled="!validVerifyPasswordForm"
                      block
                      large
                      color="torusBrand1"
                      class="caption font-weight-bold white--text"
                    >
                      {{ t('tkeyNew.confirm') }}
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-form>
            </div>
            <NewDeviceFooter />
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import { BroadcastChannel } from 'broadcast-channel'
import { mapActions } from 'vuex'

import { broadcastChannelOptions } from '../../../utils/utils'
import NewDeviceFooter from '../NewDeviceFooter'

export default {
  components: { NewDeviceFooter },
  props: {
    tKeyStore: {
      type: Object,
      default() {
        return {}
      },
    },
    selectedAddress: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      // verify password
      validVerifyPasswordForm: true,
      verifyPassword: '',
      showVerifyPassword: false,
      rules: {
        required: (value) => !!value || this.t('tkeyNew.required'),
      },
      isConfirming: false,
    }
  },
  computed: {
    shareInput() {
      if (!this.tKeyStore.securityQuestionShareUserInput) return {}
      return this.tKeyStore.securityQuestionShareUserInput
    },
    urlInstance() {
      return new URLSearchParams(window.location.search).get('instanceId')
    },
  },
  watch: {
    selectedAddress(newAddress, oldAddress) {
      if (newAddress !== oldAddress && newAddress !== '') {
        let redirectPath = this.$route.query.redirect
        if (redirectPath === undefined || (redirectPath && redirectPath.includes('index.html'))) redirectPath = '/wallet/home'

        this.$router.push(redirectPath).catch((_) => {})
      }
    },
  },
  beforeDestroy() {
    this.isConfirming = false
  },
  methods: {
    ...mapActions(['setSecurityQuestionShareFromUserInput', 'skipDeviceLogin']),
    onVerifyPassword() {
      this.setPasswordInput({
        id: this.$route.query.id,
        password: this.verifyPassword,
      })
    },
    onSkipDeviceLogin() {
      this.setPasswordInput({
        id: this.$route.query.id,
        rejected: true,
      })
    },
    async setPasswordInput(details) {
      if (this.urlInstance && this.urlInstance !== '') {
        const bc = new BroadcastChannel(`tkey_channel_${this.urlInstance}`, broadcastChannelOptions)
        await bc.postMessage({
          data: {
            eventType: 'device_login_password',
            details,
          },
        })
        bc.close()
      } else this.setSecurityQuestionShareFromUserInput(details)
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'TkeyInputPassword.scss';
</style>
