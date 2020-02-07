<template>
  <div class="default">
    <v-layout wrap fill-height align-center justify-center class="register-panel-left">
      <v-flex xs12 md6>
        <v-layout wrap>
          <v-flex class="mb-5" xs9 sm7 ml-auto mr-auto>
            <img width="117" :src="require(`../../../../public/images/torus-logo-${$vuetify.theme.dark ? 'white' : 'blue'}.svg`)" />
          </v-flex>
          <v-flex class="mb-3" xs9 sm7 ml-auto mr-auto>
            <span class="display-1 font-weight-bold">Sign Up</span>
          </v-flex>
          <v-flex xs9 sm7 ml-auto mb-2 pt-4 mr-auto>
            <v-flex xs12>
              <v-form @submit.prevent lazy-validation>
                <v-layout wrap>
                  <v-flex xs12>
                    <v-text-field
                      outlined
                      type="text"
                      name="verifier_id"
                      label="Enter Email"
                      v-model="verifier_id"
                      single-line
                      :rules="[rules.email, rules.required]"
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
                      @click:append="toggleShowPassword"
                      label="Enter Password"
                      v-model="password"
                      :append-icon="showPassword ? '$vuetify.icons.visibility_off' : '$vuetify.icons.visibility_on'"
                      :type="showPassword ? 'text' : 'password'"
                      single-line
                      :rules="[rules.required]"
                    >
                      <template v-slot:prepend-inner>
                        <img class="mr-2" :src="require(`../../../../public/images/lock.svg`)" height="20px" />
                      </template>
                    </v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field
                      outlined
                      name="confirmPassword"
                      label="Confirm Password"
                      @click:append="toggleShowConfirmPassword"
                      v-model="confirmPassword"
                      :append-icon="showConfirmPassword ? '$vuetify.icons.visibility_off' : '$vuetify.icons.visibility_on'"
                      :type="showConfirmPassword ? 'text' : 'password'"
                      single-line
                      :rules="[rules.required, rules.confirmPassword]"
                    >
                      <template v-slot:prepend-inner>
                        <img class="mr-2" :src="require(`../../../../public/images/lock.svg`)" height="20px" />
                      </template>
                    </v-text-field>
                    <div class="v-text-field__details mb-6">
                      <div class="v-messages">
                        <div class="v-messages__wrapper">
                          <div class="v-messages__message d-flex text_2--text">
                            <v-flex></v-flex>
                            <v-flex grow-shrink-0>
                              <span class="caption">
                                Already have an account? Log in
                                <router-link :to="{ name: 'torusLogin' }">here</router-link>
                              </span>
                            </v-flex>
                          </div>
                        </div>
                      </div>
                    </div>
                  </v-flex>

                  <v-flex xs12>
                    <v-btn color="primary" class="body-1 font-weight-bold card-shadow-v8 register-btn" @click="registerAccount" large depressed block>
                      Sign Up
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-flex>
          </v-flex>
          <v-flex class="caption" mb-6 xs9 sm7 ml-auto mr-auto>
            <span class="text_2--text body-1">
              {{ t('login.acceptTerms') }}
              <a href="https://docs.tor.us/legal/terms-and-conditions" target="_blank">
                <span class="primary--text">{{ t('login.termsAndConditions') }}</span>
              </a>
            </span>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex
        v-if="$vuetify.breakpoint.smAndUp"
        xs12
        sm12
        md6
        fill-height
        class="register-panel-right"
        :class="$vuetify.theme.dark ? 'torus-dark' : ''"
      >
        <v-layout class="pb-8" wrap fill-height align-end>
          <v-flex class="mb-3 text-center" xs9 sm8 md10 ml-auto mr-auto>
            <div class="right-panel-header white--text font-weight-bold mb-2">{{ t('login.frictionless') }}</div>
            <div class="body-2 right-panel-subheader white--text mx-auto">
              {{ t('login.simpleSecure') }}
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
      password: '',
      confirmPassword: '',
      verifier_id: '',
      verifier_id_type: '',
      showPassword: false,
      showConfirmPassword: false,
      rules: {
        email: value => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value) || 'Invalid email address format',
        required: value => !!value || 'Required',
        minLength: value => value.length > 8 || 'Password length must be greater than 8 characters',
        confirmPassword: value => value === this.password || 'Passwords do not match'
      }
    }
  },
  methods: {
    toggleShowPassword(event) {
      event.preventDefault()
      this.showPassword = this.showPassword === true ? false : true
    },
    toggleShowConfirmPassword(event) {
      event.preventDefault()
      this.showConfirmPassword = this.showConfirmPassword === true ? false : true
    },
    registerAccount() {
      this.updateExtendedPassword()
      post('https://verifier.dev.tor.us/register', {
        verifier_id: this.verifier_id,
        verifier_id_type: this.verifier_id.indexOf('@') > 0 ? 'email' : 'phone',
        hash: Web3.utils.sha3(this.extendedPassword).replace('0x', '')
      })
        .then(data => this.$router.push(`torus-verify?email=${this.verifier_id}`))
        .catch(err => log.error(err))
    },
    updateExtendedPassword: function() {
      this.extendedPassword = Web3.utils.sha3(this.password).replace('0x', '')
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'Register.scss';
</style>
