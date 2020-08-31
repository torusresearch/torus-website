<template>
  <div>
    <v-container :class="[$vuetify.breakpoint.xsOnly ? 'pa-0' : 'pa-4']">
      <v-layout class="justify-center">
        <v-flex :class="[$vuetify.breakpoint.xsOnly ? 'xs12' : 'xs7']">
          <div class="new-device-container" :class="[$vuetify.breakpoint.xsOnly ? 'is-mobile' : '', { 'is-dark': $vuetify.theme.dark }]">
            <div class="text-center mb-10">
              <img src="../../assets/images/ob-verification.svg" alt="Verification Required" class="mr-2" />
            </div>

            <!-- TITLE -->
            <div class="text-center new-device-header">
              <div class="new-device-header__title">{{ t('tkeyNew.verificationReq') }}</div>
              <div class="new-device-header__description">
                {{ t('tkeyNew.youAreAccessing') }}
              </div>
              <div class="new-device-header__description">{{ t('tkeyNew.verifyWithPass') }}</div>
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
                  <v-flex v-if="!$vuetify.breakpoint.xsOnly" class="xs4 px-2"></v-flex>
                  <v-flex class="px-2 text-center" :class="$vuetify.breakpoint.xsOnly ? 'xs6' : 'xs4'">
                    <!-- <a
                      class="caption text-decoration-none"
                      :class="$vuetify.theme.dark ? 'torusFont1--text' : 'torusBrand1--text'"
                      @click="onAnotherMethod"
                    >
                      {{ t('tkeyNew.verifyViaAnother') }}
                    </a> -->
                  </v-flex>
                  <v-flex class="px-2" :class="$vuetify.breakpoint.xsOnly ? 'xs6' : 'xs4'">
                    <v-btn type="submit" :disabled="!validVerifyPasswordForm" block large color="torusBrand1" class="white--text">
                      {{ t('tkeyNew.confirm') }}
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-form>
            </div>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  data() {
    return {
      // verify password
      validVerifyPasswordForm: true,
      verifyPassword: '',
      showVerifyPassword: false,
      rules: {
        required: (value) => !!value || this.t('tkeyNew.required'),
      },
    }
  },
  computed: {
    ...mapState(['tKeyStore', 'selectedAddress']),
    shareInput() {
      if (!this.tKeyStore.securityQuestionShareUserInput) return {}
      return this.tKeyStore.securityQuestionShareUserInput
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
  methods: {
    ...mapActions(['setSecurityQuestionShareFromUserInput']),
    onVerifyPassword() {
      this.setSecurityQuestionShareFromUserInput({
        id: this.$route.query.id,
        password: this.verifyPassword,
      })
    },
    onAnotherMethod() {
      // TODO
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'TkeyInputPassword.scss';
</style>
