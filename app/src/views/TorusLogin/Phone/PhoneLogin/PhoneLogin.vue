<template>
  <div class="default">
    <v-layout wrap fill-height align-center justify-center class="login-panel-left">
      <v-flex xs10 md6>
        <v-layout wrap>
          <v-flex class="mb-5" xs12 sm12 ml-auto mr-auto>
            <img width="117" :src="require(`../../../../../public/images/torus-logo-${$vuetify.theme.dark ? 'white' : 'blue'}.svg`)" />
          </v-flex>
          <v-flex class="mb-3" xs12 sm12 ml-auto mr-auto>
            <span class="display-1 font-weight-bold">{{ t('emailLogin.login') }}</span>
          </v-flex>
          <v-flex :class="$vuetify.theme.dark ? '' : 'text_1--text'" class="body-2" mb-8 xs12 sm12 ml-auto mr-auto>
            <span>{{ t('login.message') }}</span>
          </v-flex>
          <v-flex xs12 sm12 ml-auto mb-2 pt-4 mr-auto>
            <v-flex xs12>
              <v-form @submit.prevent="login" lazy-validation v-model="formValid" ref="form" autocomplete="off">
                <v-layout wrap>
                  <v-flex xs12 class="phone-login">
                    <vue-tel-input v-model="verifier_id" required mode="international" autocomplete="off" :autofocus="true"></vue-tel-input>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field
                      outlined
                      name="password"
                      :label="t('emailLogin.enterPassword')"
                      @click:append.prevent="showPassword = !showPassword"
                      :rules="[rules.required, rules.minLength]"
                      v-model="password"
                      @keyup="resetError"
                      :append-icon="showPassword ? '$vuetify.icons.visibility_off' : '$vuetify.icons.visibility_on'"
                      :type="showPassword ? 'text' : 'password'"
                      class="password"
                      single-line
                    >
                      <template v-slot:prepend-inner>
                        <img class="mr-2 mt-1" :src="require(`../../../../../public/images/lock.svg`)" height="20px" />
                      </template>
                    </v-text-field>
                    <div class="v-text-field__details mb-6">
                      <div class="v-messages">
                        <div class="v-messages__wrapper">
                          <div class="v-messages__message d-flex text_2--text">
                            <v-flex>
                              <!-- <span class="caption">
                                <router-link :to="{ path: 'forgot' }">Forgot password?</router-link>
                              </span> -->
                            </v-flex>
                            <v-flex grow-shrink-0>
                              <span class="caption">
                                {{ t('emailLogin.dontHaveAcnt') }}
                                <router-link :to="{ name: 'torusPhoneRegister' }">{{ t('emailLogin.signUpHere') }}</router-link>
                              </span>
                            </v-flex>
                          </div>
                        </div>
                      </div>
                    </div>
                  </v-flex>

                  <v-flex xs12>
                    <v-btn
                      color="primary"
                      :disabled="!formValid"
                      class="body-1 font-weight-bold card-shadow-v8 login-btn"
                      large
                      depressed
                      block
                      type="submit"
                    >
                      {{ t('emailLogin.loginNoSpace') }}
                    </v-btn>
                  </v-flex>
                  <v-flex xs12 py-3 v-if="notRegistered">
                    <span>
                      {{ t('emailLogin.notRegistered') }}
                      <router-link :to="{ name: 'torusPhoneRegister' }">{{ t('emailLogin.signUpHere') }}</router-link>
                    </span>
                  </v-flex>
                  <v-flex xs12 py-3 v-if="incorrectPassword">
                    <span>
                      {{ t('emailLogin.pleaseTryAgainPhone') }}
                    </span>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-flex>
          </v-flex>
          <v-flex class="caption" mb-6 xs12 sm12 ml-auto mr-auto>
            <span class="text_2--text body-1">
              {{ t('login.acceptTerms') }}
              <a href="https://docs.tor.us/legal/terms-and-conditions" target="_blank">
                <span class="primary--text">{{ t('login.termsAndConditions') }}</span>
              </a>
            </span>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { sha3 } from 'web3-utils'
import * as ethUtil from 'ethereumjs-util'
import { VueTelInput } from 'vue-tel-input'
import log from 'loglevel'
import { post } from '../../../../utils/httpHelpers'
import config from '../../../../config'
export default {
  components: {
    VueTelInput
  },
  data() {
    return {
      showPassword: false,
      verifier_id: '',
      password: '',
      formValid: true,
      redirect_uri: '',
      state: '',
      notRegistered: false,
      incorrectPassword: false,
      rules: {
        required: value => !!value || this.t('emailLogin.required'),
        minLength: value => value.length > 8 || this.t('emailLogin.passwordLength')
      }
    }
  },
  mounted() {
    const { state, redirect_uri, phone } = this.$route.query
    this.state = state
    this.redirect_uri = redirect_uri
    this.verifier_id = phone || ''
  },
  computed: {
    extendedPassword() {
      return ethUtil.stripHexPrefix(sha3(this.password))
    }
  },
  methods: {
    resetError() {
      this.incorrectPassword = false
    },
    async login() {
      if (!this.$refs.form.validate()) return
      try {
        const data = await post(`${config.torusVerifierHost}/authorize`, {
          verifier_id: this.verifier_id.replace(/ /g, ''),
          verifier_id_type: 'phone',
          redirect_uri: this.redirect_uri,
          state: this.state,
          hash: ethUtil.stripHexPrefix(sha3(this.extendedPassword))
        })
        let completeRedirectURI = new URL(data.redirect_uri)
        completeRedirectURI.hash = `idtoken=${data.idtoken}&timestamp=${data.timestamp}\
          &verifier_id=${data.verifier_id.replace(/ /g, '')}&extendedPassword=${this.extendedPassword}&state=${data.state}`
        window.location.href = completeRedirectURI.href
      } catch (error) {
        if (error && error.status === 404) this.notRegistered = true
        else if (error && error.status === 403) this.incorrectPassword = true

        log.error(error)
      }
    }
  }
}
</script>

<style lang="scss">
@import 'PhoneLogin.scss';
</style>
