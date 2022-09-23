<template>
  <v-card class="private-key-container">
    <v-card-text class="py-6">
      <v-row wrap>
        <v-col cols="12" :class="$vuetify.display.xs ? '' : 'px-4'">
          <div class="font-weight-bold headline">{{ $t('walletSettings.customKey.setCustomPrivateKey') }}</div>
        </v-col>
        <v-col cols="12" mb-4 :class="$vuetify.display.xs ? '' : 'px-4'">
          <v-form ref="customPrivateKeyForm" v-model="customPrivateKeyFormValid" lazy-validation @submit.prevent="setKey">
            <v-row wrap class="align-center">
              <v-col>
                <v-text-field v-model="customPrivateKey" :rules="rules.privateKey"></v-text-field>
              </v-col>
              <v-col cols="4" sm="2" class="ml-auto px-4">
                <v-btn
                  size="large"
                  block
                  class="torus-btn1"
                  :class="$store.state.whiteLabel.isActive ? 'text-white' : 'text-torusBrand1'"
                  :color="$store.state.whiteLabel.isActive ? 'torusBrand1' : ''"
                  type="submit"
                  :disabled="!customPrivateKeyFormValid"
                >
                  {{ $t('walletSettings.customKey.replace') }}
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-col>
        <v-col cols="12">
          <div class="caption text-text_3 mb-4 px-5">{{ $t('walletSettings.customKey.noteReplaceWarning') }}</div>
        </v-col>
        <v-col cols="12">
          <v-col cols="4" sm="4" class="mr-auto px-4">
            <v-btn
              block
              size="large"
              class="torus-btn1"
              :class="$store.state.whiteLabel.isActive ? 'text-white' : 'text-torusBrand1'"
              :color="$store.state.whiteLabel.isActive ? 'torusBrand1' : ''"
              @click="resetKey"
            >
              {{ $t('walletSettings.customKey.resetToDefault') }}
            </v-btn>
          </v-col>
        </v-col>
      </v-row>
      <v-row class="mt-4 pr-4">
        <v-spacer></v-spacer>
        <v-btn size="large" variant="text" @click="closeDialog">{{ 'Close' }}</v-btn>
      </v-row>
    </v-card-text>
    <v-dialog v-model="confirm" max-width="290">
      <v-card>
        <v-form ref="warningForm" v-model="warningFormValid" lazy-validation @submit.prevent="agree">
          <v-card-title class="headline">
            {{ $t('walletSettings.customKey.areYouSure') }}
          </v-card-title>
          <v-card-text>
            {{
              nextAction === 'resetKey'
                ? `${$t('walletSettings.customKey.replaceKeyWarning')} ${$t('walletSettings.customKey.reloginWarning')}`
                : `${$t('walletSettings.customKey.resetKeyWarning')} ${$t('walletSettings.customKey.reloginWarning')}`
            }}
          </v-card-text>
          <v-card-text cols="12">{{ $t('walletSettings.customKey.enterTextToContinue') }}</v-card-text>
          <v-card-text cols="12">
            <v-text-field
              v-model="warningCheckText"
              class="warning-check"
              placeholder="I agree to deleting my current private key"
              :rules="rules.warningText"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="text" type="button" @click="disagree">
              {{ $t('walletSettings.customKey.disagree') }}
            </v-btn>
            <v-btn :disabled="!warningFormValid" variant="text" type="submit">{{ $t('walletSettings.customKey.agree') }}</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { addHexPrefix, BN, isValidPrivate, stripHexPrefix, toBuffer } from 'ethereumjs-util'
import log from 'loglevel'

export default {
  props: {
    prevKey: {
      type: String,
      default() {
        return ''
      },
    },
  },
  data() {
    return {
      confirm: false,
      customPrivateKey: '',
      consent: false,
      warningCheckText: '',
      nextAction: '',
      nextParams: [],
      customPrivateKeyFormValid: false,
      warningFormValid: false,
      rules: {
        privateKey: [(v) => this.privateKeyValidation(v)],
        warningText: [(v) => this.warningCheck(v)],
      },
    }
  },
  methods: {
    closeDialog() {
      this.$emit('dialogClose')
    },
    privateKeyValidation(v) {
      try {
        if (v.length !== 64) {
          return this.$t('walletSettings.customKey.invalidPrivateKeyLength') // 'Invalid private key length'
        }
        const customPrivBN = new BN(v, 16)
        if (customPrivBN.cmp(new BN(0)) === 0) {
          return this.$t('walletSettings.customKey.privateKeyCannotBeZero') // 'Private key cannot be 0'
        }
        const prefixed = addHexPrefix(v)
        const buffer = toBuffer(prefixed)
        if (!isValidPrivate(buffer)) {
          return this.$t('walletSettings.customKey.invalidPrivateKey') // 'Invalid private key'
        }
      } catch (error) {
        log.error(error)
        return this.$t('walletSettings.customKey.unableToValidatePrivateKey') // 'Unable to validate private key'
      }
      return true
    },
    warningCheck(text) {
      return text === 'I agree to deleting my current private key' || 'Incorrect text'
    },
    async setKey() {
      const formValid = await this.$refs.customPrivateKeyForm.validate()
      if (!formValid.valid) return
      this.nextParams[0] = this.customPrivateKey
      this.nextAction = 'setKey'
      this.confirm = true
    },
    resetKey() {
      this.nextAction = 'resetKey'
      this.confirm = true
    },
    clearConfirmVars() {
      this.nextAction = ''
      this.nextParams = []
      this.confirm = false
    },
    agree() {
      if (this.$refs.warningForm.validate()) {
        if (this.nextAction === 'setKey') {
          this.$emit('setKey', stripHexPrefix(this.prevKey), this.nextParams[0])
          this.$emit('dialogClose')
        } else if (this.nextAction === 'resetKey') {
          this.$emit('resetKey', stripHexPrefix(this.prevKey))
          this.$emit('dialogClose')
        } else {
          log.error('invalid next action', this.nextAction)
        }
        this.clearConfirmVars()
      }
    },
    disagree() {
      this.clearConfirmVars()
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'TorusKeyDialog.scss';
</style>
