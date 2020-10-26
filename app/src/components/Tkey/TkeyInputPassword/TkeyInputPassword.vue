<template>
  <div>
    <v-container :class="[$vuetify.breakpoint.xsOnly ? 'pt-6 px-0' : 'pa-4']">
      <v-layout class="justify-center">
        <v-flex class="xs12 sm10 md8 lg7">
          <div class="new-device-container" :class="[$vuetify.breakpoint.xsOnly ? 'is-mobile' : '', { 'is-dark': $vuetify.theme.dark, isDapp }]">
            <div
              class="text-center"
              :class="$vuetify.breakpoint.xsOnly ? 'mb-7' : 'mb-4'"
              :style="{ height: $vuetify.breakpoint.xsOnly ? '66px' : '100px' }"
            >
              <img
                src="../../../assets/images/ob-verification.svg"
                :height="$vuetify.breakpoint.xsOnly ? '82' : '125'"
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
                  :rules="[rules.required, passwordError]"
                  outlined
                  :placeholder="t('tkeyNew.enterPassword')"
                  @click:append="showVerifyPassword = !showVerifyPassword"
                  @keydown="passwordEntered = false"
                />
                <v-layout class="mx-n2 mb-12 align-center btn-container">
                  <v-flex v-if="!$vuetify.breakpoint.xsOnly" class="xs4 px-2"></v-flex>
                  <v-flex class="px-2 xs4 text-center">
                    <a
                      class="caption text-decoration-none"
                      :class="[$vuetify.theme.dark ? 'torusFont1--text' : 'torusBrand1--text']"
                      @click="onSkipDeviceLogin"
                    >
                      {{ t('tkeyNew.verifyViaAnother') }}
                      <!-- {{ t('tkeyNew.skip') }} -->
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
import { mapActions } from 'vuex'

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
    incorrectPassword: {
      type: Boolean,
      default: false,
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
      passwordEntered: false,
    }
  },
  computed: {
    isDapp() {
      return false
    },
    passwordError() {
      if (!this.passwordEntered) return true
      return this.incorrectPassword && 'Incorrect password'
    },
  },
  beforeDestroy() {
    this.isConfirming = false
  },
  methods: {
    ...mapActions(['setSecurityQuestionShareFromUserInput']),
    onVerifyPassword() {
      this.passwordEntered = true
      this.$emit('setPasswordInput', this.verifyPassword)
    },
    onSkipDeviceLogin() {
      // this.setPasswordInput({
      //   id: this.$route.query.id,
      //   rejected: true,
      // })
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'TkeyInputPassword.scss';
</style>
