<template>
  <div class="default">
    <v-layout wrap fill-height align-center justify-center class="login-panel-left">
      <v-flex xs12 md6>
        <v-layout wrap>
          <v-flex class="mb-5" xs9 sm7 ml-auto mr-auto>
            <img width="117" :src="require('../../../../public/images/torus-logo-blue.svg')" />
          </v-flex>
          <v-flex class="mb-3" xs9 sm7 ml-auto mr-auto>
            <span class="display-1 font-weight-bold">Log in</span>
          </v-flex>
          <v-flex xs9 sm7 ml-auto mb-2 pt-4 mr-auto>
            <v-flex xs12>
              <v-form @submit.prevent="login" lazy-validation>
                <v-layout wrap>
                  <v-flex xs12>
                    <v-text-field
                      outlined
                      type="text"
                      name="verifier_id"
                      label="Email/Phone"
                      v-model="verifier_id"
                      :rules="[rules.required]"
                      single-line
                    >
                      <template v-slot:prepend-inner>
                        <img class="mr-2 mt-1" :src="require(`../../../../public/images/email.svg`)" height="16px" />
                      </template>
                    </v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field
                      outlined
                      name="password"
                      label="Password"
                      @click:append="toggleShowPassword"
                      :rules="[rules.required, rules.minLength]"
                      v-model="password"
                      :append-icon="showPassword ? '$vuetify.icons.visibility_off' : '$vuetify.icons.visibility_on'"
                      :type="showPassword ? 'text' : 'password'"
                      class="password"
                      single-line
                    >
                      <template v-slot:prepend-inner>
                        <img class="mr-2 mt-1" :src="require(`../../../../public/images/lock.svg`)" height="20px" />
                      </template>
                    </v-text-field>
                    <div class="v-text-field__details mb-6">
                      <div class="v-messages">
                        <div class="v-messages__wrapper">
                          <div class="v-messages__message d-flex text_2--text">
                            <v-flex>
                              <router-link :to="{ path: 'forgot' }">Forgot password?</router-link>
                            </v-flex>
                            <v-flex grow-shrink-0>
                              Don't have an account?
                              <router-link :to="{ name: 'torusRegister' }">Sign up here</router-link>
                            </v-flex>
                          </div>
                        </div>
                      </div>
                    </div>
                  </v-flex>

                  <v-flex xs12>
                    <v-btn color="primary" large depressed block type="submit">Login</v-btn>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-flex>
          </v-flex>
          <v-flex class="caption" mb-6 xs9 sm7 ml-auto mr-auto>
            <span>
              By clicking Login, you accept our
              <a href="https://docs.tor.us/legal/terms-and-conditions" target="_blank">
                <span class="primary--text">Terms and Conditions</span>
              </a>
            </span>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs12 md6 fill-height class="hidden-sm-and-down login-panel-right">
        <v-layout class="pb-8" wrap fill-height align-end>
          <v-flex class="mb-3 text-center" xs9 sm7 ml-auto mr-auto>
            <div class="display-1 white--text font-weight-bold">
              Frictionless Logins
            </div>
            <div class="display-1 white--text mb-3">for DApps</div>
            <div class="caption white--text">
              A simple and secure gateway to the decentralized ecosystem via OAuth logins
            </div>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import Web3 from 'web3'
import log from 'loglevel'
import { post } from '../../../utils/httpHelpers'
import config from '../../../config'
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
        minLength: value => value.length > 8 || 'Password length must be greater than 8 characters'
      }
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

<style lang="scss">
@import 'Login.scss';
</style>
