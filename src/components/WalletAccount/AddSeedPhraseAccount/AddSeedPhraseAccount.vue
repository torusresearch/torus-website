<template>
  <v-card class="seed-phrase" :class="{ 'is-mobile': $vuetify.breakpoint.xsOnly, 'is-dark': $vuetify.theme.dark }">
    <v-layout class="card-header" wrap>
      <v-flex text-center xs12 pt-10 pb-6 px-6>
        <div class="display-1 mb-2">Seed Phrase Accounts</div>
        <v-btn class="close-btn" icon aria-label="Close Add Seed Phrase" title="Close Add Seed Phrase" @click="onClose">
          <v-icon>$vuetify.icons.close</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
    <v-layout mx-6 py-6 wrap>
      <v-flex xs12>
        <div lass="mb-4">
          <v-list dense outlined class="pa-0 seed-group_item mb-4">
            <v-list-item v-for="(address, index) in accounts" :key="index" class="pl-0 pr-1">
              <v-list-item-content class="px-4">
                <v-list-item-title>Account #{{ index + 1 }}</v-list-item-title>
                <v-list-item-subtitle :class="{ caption: $vuetify.breakpoint.xsOnly }">{{ address }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <div class="d-flex">
            <div class="ml-auto">
              <v-btn
                class="torus-btn1"
                :class="$store.state.whiteLabel.isActive ? 'white--text' : 'torusBrand1--text'"
                :color="$store.state.whiteLabel.isActive ? 'torusBrand1' : ''"
                aria-label="Add Account"
                :loading="addingAccount"
                :disabled="addingAccount"
                @click="addAccount(wallet.seedPhrase)"
              >
                <v-icon left x-small>$vuetify.icons.add</v-icon>
                Add Account
              </v-btn>
            </div>
          </div>
        </div>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
import log from 'loglevel'
import { mapActions, mapState } from 'vuex'

import { ACCOUNT_TYPE } from '../../../utils/enums'

export default {
  data() {
    return {
      addingAccount: false,
      addingAccouns: [],
    }
  },
  computed: {
    ...mapState({
      wallet: 'wallet',
    }),
    accounts() {
      const wallets = Object.keys(this.wallet).filter((address) => {
        const { accountType } = this.wallet[address]
        return accountType === ACCOUNT_TYPE.TKEY_SEED_PHRASE
      })

      return wallets
    },
  },
  methods: {
    ...mapActions(['addSeedPhraseAccount']),
    async addAccount(seedPhrase) {
      this.addingAccount = true
      try {
        await this.addSeedPhraseAccount(seedPhrase)
      } catch (error) {
        log.error(error)
      } finally {
        this.addingAccount = false
      }
    },
    onClose() {
      this.$emit('onClose')
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'AddSeedPhraseAccount.scss';
</style>
