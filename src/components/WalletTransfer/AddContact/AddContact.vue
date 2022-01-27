<template>
  <v-dialog v-model="addContactDialog" width="400">
    <template #activator="{ on }">
      <v-btn depressed x-small block class="caption torusBrand1 lighten-5 torusBrand1--text add-contact-alert" v-on="on">
        {{ t('walletTransfer.clickToAddContact') }}
      </v-btn>
    </template>
    <v-card class="add-contact-container">
      <v-form ref="addContactForm" v-model="contactFormValid" lazy-validation @submit.prevent="addContact">
        <v-card-text class="py-6">
          <v-layout wrap>
            <v-flex xs12 :class="$vuetify.breakpoint.xsOnly ? '' : 'px-4'">
              <div class="font-weight-bold headline">{{ t('walletTransfer.addContact') }}</div>
              <v-chip small class="caption" light color="#CAF1FE">{{ verifierLabels[verifier] }}</v-chip>
            </v-flex>
            <v-flex xs12 mt-6 :class="$vuetify.breakpoint.xsOnly ? '' : 'px-4'">
              <div class="text-subtitle-2 mb-2">{{ t('walletTransfer.contactName') }}</div>
              <v-text-field v-model="newContactName" :placeholder="t('walletTransfer.enterName')" :rules="[rules.required]" outlined></v-text-field>
            </v-flex>
          </v-layout>
        </v-card-text>

        <v-card-actions class="pb-6">
          <v-flex xs6>
            <v-btn block text color="text_2" @click="addContactDialog = false">{{ t('walletTransfer.cancel') }}</v-btn>
          </v-flex>
          <v-divider vertical></v-divider>
          <v-flex xs6>
            <v-btn type="submit" color="torusBrand1" depressed class="px-12 py-1 white--text" :disabled="!contactFormValid">
              {{ t('walletTransfer.confirm') }}
            </v-btn>
          </v-flex>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import log from 'loglevel'

import {
  DISCORD,
  DISCORD_LABEL,
  ENS,
  ENS_LABEL,
  ETH,
  ETH_LABEL,
  GITHUB,
  GITHUB_LABEL,
  GOOGLE,
  GOOGLE_LABEL,
  REDDIT,
  REDDIT_LABEL,
  TWITTER,
  TWITTER_LABEL,
  UNSTOPPABLE_DOMAINS,
  UNSTOPPABLE_DOMAINS_LABEL,
} from '../../../utils/enums'

const VERIFIER_LABELS = {
  [ETH]: ETH_LABEL,
  [GOOGLE]: GOOGLE_LABEL,
  [REDDIT]: REDDIT_LABEL,
  [DISCORD]: DISCORD_LABEL,
  [TWITTER]: TWITTER_LABEL,
  [GITHUB]: GITHUB_LABEL,
  [ENS]: ENS_LABEL,
  [UNSTOPPABLE_DOMAINS]: UNSTOPPABLE_DOMAINS_LABEL,
}
export default {
  props: {
    verifier: {
      type: String,
      default: '',
    },
    contact: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      addContactDialog: false,
      contactFormValid: true,
      newContactName: '',
      rules: {
        required: (value) => !!value || this.t('walletSettings.required'),
      },
    }
  },
  computed: {
    verifierLabels() {
      return Object.keys(VERIFIER_LABELS).reduce((accumulator, current) => {
        accumulator[current] = this.t(VERIFIER_LABELS[current])
        return accumulator
      }, {})
    },
  },
  methods: {
    async addContact() {
      if (!this.$refs.addContactForm.validate()) return
      this.$refs.addContactForm.resetValidation()
      try {
        await this.$store.dispatch('addContact', {
          contact: this.contact,
          verifier: this.verifier,
          name: this.newContactName,
        })
      } catch (error) {
        log.error(error)
      } finally {
        this.newContactName = ''
        this.addContactDialog = false
      }
    },
  },
}
</script>
