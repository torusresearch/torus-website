<template>
  <div class="default">
    <v-layout wrap fill-height align-center justify-center class="register-panel-left">
      <v-flex xs10 md6>
        <v-layout wrap>
          <v-flex class="mb-5" xs12 sm12 ml-auto mr-auto>
            <img width="117" :src="require(`../../../../../public/images/torus-logo-${$vuetify.theme.dark ? 'white' : 'blue'}.svg`)" />
          </v-flex>
          <v-flex class="mb-3" xs12 sm12 ml-auto mr-auto>
            <span class="display-1 font-weight-bold">Sign Up</span>
          </v-flex>
          <v-flex xs12 sm12 ml-auto mb-2 pt-4 mr-auto>
            <v-flex xs12>
              <v-form lazy-validation v-model="formValid" ref="form" @submit.prevent="registerAccount" autocomplete="off">
                <v-layout wrap>
                  <v-flex xs12>
                    <v-text-field
                      outlined
                      type="text"
                      name="verifier_id"
                      label="Enter Email"
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
                      @click:append.prevent="showPassword = !showPassword"
                      label="Enter Password"
                      v-model="password"
                      :append-icon="showPassword ? '$vuetify.icons.visibility_off' : '$vuetify.icons.visibility_on'"
                      :type="showPassword ? 'text' : 'password'"
                      single-line
                      :rules="[rules.required, rules.minLength]"
                    >
                      <template v-slot:prepend-inner>
                        <img class="mr-2" :src="require(`../../../../../public/images/lock.svg`)" height="20px" />
                      </template>
                    </v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field
                      outlined
                      name="confirmPassword"
                      label="Enter Password"
                      @click:append.prevent="showConfirmPassword = !showConfirmPassword"
                      v-model="confirmPassword"
                      :append-icon="showConfirmPassword ? '$vuetify.icons.visibility_off' : '$vuetify.icons.visibility_on'"
                      :type="showConfirmPassword ? 'text' : 'password'"
                      single-line
                      :rules="[rules.required, rules.confirmPassword]"
                    >
                      <template v-slot:prepend-inner>
                        <img class="mr-2" :src="require(`../../../../../public/images/lock.svg`)" height="20px" />
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
                                <router-link :to="{ name: 'torusEmailLogin' }">here</router-link>
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
                      type="submit"
                      :disabled="!formValid"
                      class="body-1 font-weight-bold card-shadow-v8 register-btn"
                      large
                      depressed
                      block
                    >
                      Sign Up
                    </v-btn>
                  </v-flex>
                  <v-flex xs12 py-3 v-if="duplicate">
                    <span>
                      You already have an account. Please login
                      <router-link :to="{ name: 'torusEmailLogin' }">here</router-link>
                    </span>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-flex>
          </v-flex>
          <v-flex class="caption" mb-6 xs12 sm12 ml-auto mr-auto>
            <span class="text_2--text body-1">
              {{ t('login.acceptTerms') }}
              <a href="https://docs.tor.us/legal/terms-and-conditions" target="_blank" rel="noreferrer noopener">
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
import log from 'loglevel'

import { post } from '../../../../utils/httpHelpers'
import config from '../../../../config'

export default {
  data() {
    return {
      password: '',
      confirmPassword: '',
      verifier_id: '',
      showPassword: false,
      showConfirmPassword: false,
      formValid: true,
      duplicate: false,
      rules: {
        required: value => !!value || 'Required',
        minLength: value => value.length > 8 || 'Password length must be greater than 8 characters',
        confirmPassword: value => value === this.password || 'Passwords do not match',
        validEmail: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Invalid email address'
      }
    }
  },
  computed: {
    extendedPassword() {
      return ethUtil.stripHexPrefix(sha3(this.password))
    }
  },
  methods: {
    async registerAccount() {
      if (!this.$refs.form.validate()) return
      try {
        const hash = ethUtil.stripHexPrefix(sha3(this.extendedPassword))
        await post(`${config.torusVerifierHost}/register`, {
          verifier_id: this.verifier_id,
          verifier_id_type: 'email',
          hash
        })
        this.$router.push({ name: 'torusEmailVerify', query: { ...this.$route.query, email: this.verifier_id, hash } }).catch(_ => {})
      } catch (error) {
        if (error && error.status === 403) this.duplicate = true
        log.error(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'Register.scss';
</style>
