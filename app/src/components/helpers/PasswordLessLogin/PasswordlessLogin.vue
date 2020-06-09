<template>
  <v-dialog :value="passwordlessLoginDialog" width="500" persistent>
    <v-card>
      <v-layout wrap>
        <v-flex text-center class="login-header" xs12 px-6>
          <img
            class="home-link mr-1"
            alt="Torus Logo"
            height="42"
            :src="
              whiteLabelGlobal.isWhiteLabelActive && whiteLabelGlobal.logo
                ? whiteLabelGlobal.logo
                : require(`../../../assets/images/torus-logo-${$vuetify.theme.dark ? 'white' : 'blue'}.svg`)
            "
          />
          <v-btn class="close-btn" icon aria-label="Close Login Modal" @click="cancel">
            <v-icon>$vuetify.icons.close</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
      <v-layout wrap>
        <v-flex text-center class="login-form mb-3" xs12>
          <img :src="require(`../../../assets/images/passwordless.svg`)" height="160" />
          <div v-if="passwordlessEmailSent" class="pa-9">
            <div class="display-1 text_2--text mb-4">An email is on its way!</div>
            <div class="headline font-weight-regular text_2--text">
              A magic link has been sent to
              <span class="font-weight-bold">{{ email }}</span>
              , so you can sign in to Torus Wallet instantly!
            </div>
            <div class="headline font-weight-regular text_2--text mt-12">
              The link expires in 24 hours, so be sure sure to use it soon
            </div>
          </div>
          <v-form v-else v-model="formValid" class="pa-9" @submit.prevent="sendLink">
            <div class="headline font-weight-regular text_2--text mb-4">Enter your email</div>
            <v-text-field
              id="login-email"
              v-model="email"
              class="login-field text_2--text"
              placeholder="Enter Email"
              outlined
              type="email"
              aria-label="Enter Email"
              prepend-inner-icon="$vuetify.icons.email"
              :rules="[emailRule]"
            ></v-text-field>
            <v-btn :disabled="!formValid" x-large type="submit" depressed color="torusBrand1" class="magic-link-btn white--text" block>
              <v-icon small class="mr-1">$vuetify.icons.passwordless</v-icon>
              Send Magic Link
            </v-btn>
          </v-form>
        </v-flex>
      </v-layout>
    </v-card>
  </v-dialog>
</template>

<script>
import { GOOGLE } from '../../../utils/enums'
import { validateVerifierId } from '../../../utils/utils'

export default {
  name: 'PasswordlessLogin',
  props: {
    passwordlessLoginDialog: {
      type: Boolean,
      default: false,
    },
    passwordlessEmailSent: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      email: '',
      formValid: false,
    }
  },
  methods: {
    cancel() {
      this.email = ''
      this.$emit('cancel')
    },
    sendLink() {
      this.$emit('sendLink')
    },
    emailRule(contact) {
      return validateVerifierId(GOOGLE, contact)
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'PasswordlessLogin.scss';
</style>
