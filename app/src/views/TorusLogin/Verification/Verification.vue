<template>
  <div class="default">
    <v-layout wrap fill-height align-center justify-center class="panel-left">
      <v-flex xs12 md6>
        <v-layout wrap>
          <v-flex class="mb-5" xs9 sm7 ml-auto mr-auto>
            <img width="117" :src="require(`../../../../public/images/torus-logo-${$vuetify.theme.dark ? 'white' : 'blue'}.svg`)" />
          </v-flex>
          <v-flex class="mb-3" xs9 sm7 ml-auto mr-auto>
            <span class="display-1 font-weight-bold">Verification</span>
          </v-flex>
          <v-flex class="display" mb-6 xs9 sm7 ml-auto mr-auto>
            <span>
              Check your email and key in the verification code to access your account
            </span>
          </v-flex>
          <v-flex xs9 sm7 ml-auto mb-2 mr-auto>
            <v-flex xs12>
              <v-form @submit.prevent lazy-validation>
                <v-layout wrap>
                  <v-flex xs12 mb-4>
                    <v-text-field
                      outlined
                      type="text"
                      name="code"
                      v-model="code"
                      :error-messages="responseMessage"
                      class="field"
                      v-on:keyup.enter="verifyAccount"
                      label="Enter your verification code"
                      single-line
                      :error="response"
                      :rules="[rules.required, rules.validLength]"
                    >
                      <template v-slot:append>
                        <img
                          v-if="!responseMessage && response"
                          class="mr-2"
                          :src="require(`../../../../public/images/valid-check.svg`)"
                          height="20px"
                        />
                        <img
                          v-else-if="responseMessage && !response"
                          class="mr-2"
                          :src="require(`../../../../public/images/invalid-check.svg`)"
                          height="20px"
                        />
                        <img v-if="!responseMessage && !response" class="mr-2" :src="require(`../../../../public/images/shield.svg`)" height="20px" />
                      </template>
                    </v-text-field>
                    <div class="v-text-field__details mb-6">
                      <div class="v-messages">
                        <div class="v-messages__wrapper">
                          <div class="v-messages__message d-flex text_2--text">
                            <v-flex>
                              Did not receive? Click
                              <router-link
                                @click.native="resendCode"
                                :to="{
                                  name: 'torusVerify'
                                }"
                              >
                                here
                              </router-link>
                              to resend verification code
                            </v-flex>
                          </div>
                        </div>
                      </div>
                    </div>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-flex>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex v-if="$vuetify.breakpoint.smAndUp" xs12 sm12 md6 fill-height class="panel-right" :class="$vuetify.theme.dark ? 'torus-dark' : ''">
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
import log from 'loglevel'
import { post } from '../../../utils/httpHelpers'
import config from '../../../config'
export default {
  data() {
    return {
      code: '',
      verifier_id: '',
      response: false,
      responseMessage: '',
      rules: {
        required: value => !!value || 'Required',
        validLength: value => value.length === 6 || 'Invalid verification code'
      }
    }
  },
  created() {
    this.verifier_id = this.$route.query.email
  },
  watch: {
    code(value) {
      if (value === '') {
        this.responseMessage = ''
        this.response = false
      }
    }
  },
  methods: {
    verifyAccount() {
      post('https://verifier.dev.tor.us/verify', {
        verifier_id: this.verifier_id,
        code: this.code
      })
        .then(() => {
          this.responseMessage = ''
          this.response = true
        })
        .catch(err => {
          this.responseMessage = 'Invalid verification code'
          this.response = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'Verification.scss';
</style>
