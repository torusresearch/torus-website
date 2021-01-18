<template>
  <v-card class="private-key-container">
    <v-card-text class="py-6">
      <v-layout wrap>
        <v-flex xs12 :class="$vuetify.breakpoint.xsOnly ? '' : 'px-4'">
          <div class="font-weight-bold headline">{{ 'Set custom private key' }}</div>
        </v-flex>
        <v-flex xs12>
          <v-layout wrap align-center>
            <v-flex>
              <v-text-field v-model="customPrivateKey" :rules="rules"></v-text-field>
            </v-flex>
            <v-flex xs4 sm2 class="ml-auto" px-4>
              <v-btn block @click="setKey(customPrivateKey)">Replace</v-btn>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs12>
          <div class="caption text_3--text mb-4 px-5">{{ 'Note: this replaces your Torus account private key with a custom private key' }}</div>
        </v-flex>
        <v-flex xs12>
          <v-flex xs4 sm4 class="mr-auto" px-4>
            <v-btn block @click="resetKey">Reset to default</v-btn>
          </v-flex>
        </v-flex>
      </v-layout>
    </v-card-text>
    <v-dialog v-model="confirm" max-width="290">
      <v-card>
        <v-card-title class="headline">
          {{ 'Are you sure?' }}
        </v-card-title>
        <v-card-text>
          {{
            nextAction === 'resetKey'
              ? 'This will remove your custom private key and replace it with your default Torus key.' +
                'You will be logged out of your wallet and asked to relogin.'
              : 'This will remove your private key and set it to the custom key that you have provided.' +
                'You will be logged out of your wallte and asked to relogin.'
          }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="disagree">Disagree</v-btn>
          <v-btn text @click="agree">Agree</v-btn>
        </v-card-actions>
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
      privateKeyValidated: false,
      nextAction: '',
      nextParams: [],
      rules: [(v) => this.privateKeyValidation(v)],
    }
  },
  methods: {
    privateKeyValidation(v) {
      try {
        if (v.length !== 64) {
          return 'Invalid private key length'
        }
        const customPrivBN = new BN(v, 16)
        if (customPrivBN.cmp(new BN(0)) === 0) {
          this.privateKeyValidated = false
          return 'Private key cannot be 0'
        }
        const prefixed = addHexPrefix(v)
        const buffer = toBuffer(prefixed)
        if (!isValidPrivate(buffer)) {
          this.privateKeyValidated = false
          return 'Invalid private key'
        }
      } catch (error) {
        this.privateKeyValidated = false
        return `Unable to validate private key: ${error.toString()}`
      }
      this.privateKeyValidated = true
      return true
    },
    setKey(newKey) {
      if (!this.privateKeyValidated) return
      this.nextParams[0] = newKey
      this.nextAction = 'setKey'
      this.confirm = true
    },
    resetKey() {
      if (!this.privateKeyValidated) return
      this.nextAction = 'resetKey'
      this.confirm = true
    },
    clearConfirmVars() {
      this.nextAction = ''
      this.nextParams = []
      this.confirm = false
    },
    agree() {
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
    },
    disagree() {
      this.clearConfirmVars()
    },
  },
}
</script>
