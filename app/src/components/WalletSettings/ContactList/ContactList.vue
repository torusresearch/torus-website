<template>
  <div class="contact-list-container torus-v8" :class="$vuetify.breakpoint.xsOnly ? '' : 'py-0 px-12'">
    <v-layout wrap>
      <v-flex xs12 md6 px-1 mb-1>
        <div class="body-2">{{ t('walletSettings.listContacts') }}</div>
        <v-card class="card-shadow mt-2">
          <v-list dense flat class="pa-0 contact-list">
            <template v-for="contact in contacts">
              <v-list-item two-line :key="`contact-${contact.id}`">
                <v-list-item-content>
                  <v-list-item-title class="font-weight-regular caption">
                    <span>{{ contact.name }}</span>
                  </v-list-item-title>
                  <v-list-item-subtitle class="font-weight-regular caption text_2--text">
                    <span class="text-capitalize">{{ contact.verifier === ETH ? '' : `${contact.verifier}: ` }}</span>
                    <span>{{ contact.contact }}</span>
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn class="delete-btn" color="text_2" icon small @click="deleteContact(contact.id)" :aria-label="`Delete ${contact.name}`">
                    <v-icon>$vuetify.icons.close</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </template>
          </v-list>
        </v-card>

        <div class="body-2 mt-4">{{ t('walletSettings.addNewContact') }}</div>

        <v-form ref="addContactForm" v-model="contactFormValid" @submit="addContact" lazy-validation>
          <v-layout wrap class="mt-2">
            <v-flex xs12 sm8>
              <v-select
                id="select-verifier"
                class="select-verifier-container"
                outlined
                append-icon="$vuetify.icons.select"
                :items="verifierOptions"
                item-text="name"
                item-value="value"
                v-model="selectedVerifier"
                @change="$refs.addContactForm.validate()"
                aria-label="Select Contact Verifier"
              ></v-select>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                id="contact-name"
                v-model="newContactName"
                :placeholder="t('walletSettings.enterContact')"
                :rules="[rules.required]"
                outlined
                aria-label="Contact Name"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                id="contact-value"
                v-model="newContact"
                :placeholder="verifierPlaceholder"
                :rules="[toAddressRule, rules.required, checkDuplicates]"
                outlined
                aria-label="Contact Value"
              ></v-text-field>
            </v-flex>

            <v-layout wrap>
              <v-flex xs12 sm12 md6 :class="$vuetify.breakpoint.xsOnly ? '' : 'pr-2'"></v-flex>
              <v-flex xs12 sm12 md6 :class="$vuetify.breakpoint.xsOnly ? 'mt-2' : 'pl-2'">
                <v-btn id="contact-submit-btn" block type="submit" color="primary" depressed class="px-12 py-1" :disabled="!contactFormValid">
                  {{ t('walletSettings.addContact') }}
                </v-btn>
              </v-flex>
            </v-layout>
          </v-layout>
        </v-form>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import Notification from '../../helpers/Notification'
const { ALLOWED_VERIFIERS, ETH } = require('../../../utils/enums')
const { validateVerifierId } = require('../../../utils/utils')

export default {
  name: 'networkSettings',
  data() {
    return {
      contactFormValid: true,
      selectedVerifier: ETH,
      newContact: '',
      newContactName: '',
      rules: {
        required: value => !!value || this.t('walletSettings.required')
      },
      ETH
    }
  },
  computed: {
    verifierOptions() {
      const verifiers = JSON.parse(JSON.stringify(ALLOWED_VERIFIERS))
      return verifiers.map(verifier => {
        verifier.name = this.t(verifier.name)
        return verifier
      })
    },
    verifierPlaceholder() {
      const verifierLocale = ALLOWED_VERIFIERS.find(verifier => verifier.value === this.selectedVerifier).name
      return `${this.t('walletSettings.enter')} ${this.t(verifierLocale)}`
    },
    contacts() {
      return this.$store.state.contacts
    }
  },
  methods: {
    checkDuplicates(value) {
      if (this.contacts) {
        return this.contacts.findIndex(x => x.contact.toLowerCase() === value.toLowerCase()) < 0 || this.t('walletSettings.duplicateContact')
      }
      return ''
    },
    addContact(e) {
      e.preventDefault()
      if (this.$refs.addContactForm.validate()) {
        this.$store
          .dispatch('addContact', {
            contact: this.newContact,
            name: this.newContactName,
            verifier: this.selectedVerifier
          })
          .then(response => {
            this.newContact = ''
            this.newContactName = ''
            this.$refs.addContactForm.resetValidation()

            this.$store.dispatch('setSuccessMessage', response.message)
          })
          .catch(err => {
            this.$store.dispatch('setErrorMessage', err)
          })
      }
    },
    deleteContact(contactId) {
      this.$store
        .dispatch('deleteContact', contactId)
        .then(response => {
          this.$store.dispatch('setSuccessMessage', response.message)
        })
        .catch(err => {
          this.$store.dispatch('setErrorMessage', err)
        })
    },
    toAddressRule(value) {
      return validateVerifierId(this.selectedVerifier, value)
    }
  }
}
</script>

<style lang="scss">
@import 'ContactList.scss';
</style>
