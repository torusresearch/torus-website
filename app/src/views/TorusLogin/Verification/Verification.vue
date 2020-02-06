<template>
  <div class="default">
    <v-layout wrap fill-height align-center justify-center class="panel-left">
      <v-flex xs12 md6>
        <v-layout wrap>
          <v-flex class="mb-5" xs9 sm7 ml-auto mr-auto>
            <img width="117" :src="require('../../../../public/images/torus-logo-blue.svg')" />
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
                      class="field"
                      v-on:keyup.enter="verifyAccount"
                      label="Enter your verification code"
                      single-line
                    >
                      <template v-slot:append>
                        <img class="mr-2" v-if="!response && !error" :src="require(`../../../../public/images/shield.svg`)" height="20px" />
                        <img
                          class="mr-2"
                          v-if="response && !error"
                          :src="require(`../../../../public/images/valid-check.svg`)"
                          height="20px"
                          title="You have successfully verified your account"
                        />
                        <img
                          class="mr-2"
                          v-if="!response && error"
                          :src="require(`../../../../public/images/invalid-check.svg`)"
                          height="20px"
                          title="An error occured. Please try again"
                        />
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
      <v-flex xs12 md6 fill-height class="hidden-sm-and-down panel-right">
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
import log from 'loglevel'
import { post } from '../../../utils/httpHelpers'
import config from '../../../config'
export default {
  data() {
    return {
      code: '',
      verifier_id: '',
      response: false,
      error: false
    }
  },
  created() {
    this.verifier_id = this.$route.query.email
  },
  methods: {
    verifyAccount() {
      post('https://verifier.dev.tor.us/verify', {
        verifier_id: this.verifier_id,
        code: this.code
      })
        .then(() => (this.response = true))
        .catch(err => (this.error = true))
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'Verification.scss';
</style>
