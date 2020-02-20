<template>
  <div class="default">
    <v-layout wrap fill-height align-center justify-center class="login-panel-left">
      <v-flex xs10 md6>
        <v-layout wrap>
          <v-flex class="mb-5" xs12 sm12 ml-auto mr-auto>
            <img width="117" :src="require(`../../../../../public/images/torus-logo-${$vuetify.theme.dark ? 'white' : 'blue'}.svg`)" />
          </v-flex>
          <v-flex class="mb-3" xs12 sm12 ml-auto mr-auto>
            <span class="display-1 font-weight-bold">Log in</span>
          </v-flex>
          <v-flex :class="$vuetify.theme.dark ? '' : 'text_1--text'" class="body-2" mb-8 xs12 sm12 ml-auto mr-auto>
            <span>{{ t('login.message') }}</span>
          </v-flex>
          <v-flex xs12 sm12 ml-auto mb-2 pt-4 mr-auto>
            <v-flex xs12>
              <v-form @submit.prevent="login" lazy-validation>
                <v-layout wrap>
                  <v-flex xs12>
                    <v-text-field
                      outlined
                      type="text"
                      name="verifier_id"
                      label="Enter Email"
                      elevation="4"
                      v-model="verifier_id"
                      :rules="[rules.required, rules.validEmail]"
                      single-line
                    >
                      <template v-slot:prepend-inner>
                        <img class="mr-2 mt-1" :src="require(`../../../../../public/images/email.svg`)" height="16px" />
                      </template>
                    </v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field
                      outlined
                      name="password"
                      label="Enter Password"
                      @click:append="toggleShowPassword"
                      :rules="[rules.required, rules.minLength]"
                      v-model="password"
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
                              <span class="caption">
                                <router-link :to="{ path: 'forgot' }">Forgot password?</router-link>
                              </span>
                            </v-flex>
                            <v-flex grow-shrink-0>
                              <span class="caption">
                                Don't have an account?
                                <router-link :to="{ name: 'torusEmailRegister' }">Sign up here</router-link>
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
                      :disabled="!formComplete"
                      class="body-1 font-weight-bold card-shadow-v8 login-btn"
                      large
                      depressed
                      block
                      type="submit"
                    >
                      Login
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-flex>
          </v-flex>
          <v-flex class="headline" mb-6 xs12 sm12 ml-auto mr-auto>
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
import Web3 from 'web3'
import log from 'loglevel'
import { post } from '../../../../utils/httpHelpers'
import config from '../../../../config'
export default {
  data() {
    return {
      showPassword: false,
      verifier_id: '',
      password: '',
      redirect_uri: '',
      state: '',
      rules: {
        required: value => !!value || 'Required',
        minLength: value => value.length > 8 || 'Password length must be greater than 8 characters',
        validEmail: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Invalid email address'
      }
    }
  },
  mounted() {
    const queryParams = this.$router.currentRoute.query
    this.state = queryParams.state
    this.redirect_uri = queryParams.redirect_uri
  },
  computed: {
    formComplete() {
      return this.verifier_id.length >= 11 && this.password.length >= 8
    }
  },
  methods: {
    toggleShowPassword(event) {
      event.preventDefault()
      this.showPassword = !this.showPassword
    },
    login() {
      this.updateExtendedPassword()
      post('https://verifier.dev.tor.us/authorize', {
        verifier_id: this.verifier_id,
        redirect_uri: this.redirect_uri,
        state: this.state,
        hash: Web3.utils.sha3(this.extendedPassword).replace('0x', '')
      })
        .then(data => {
          let completeRedirectURI = new URL(data.redirect_uri)
          completeRedirectURI.searchParams.set('state', data.state)
          completeRedirectURI.hash = `idtoken=${data.idtoken}&timestamp=${data.timestamp}\
          &verifier_id=${data.verifier_id}&extendedPassword=${this.extendedPassword}`
          window.location.href = completeRedirectURI.toString()
        })
        .catch(err => {
          log.error(err)
        })
    },
    updateExtendedPassword: function() {
      this.extendedPassword = Web3.utils.sha3(this.password).replace('0x', '')
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'Login.scss';
</style>
