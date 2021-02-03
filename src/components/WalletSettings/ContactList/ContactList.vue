<template>
  <div class="contact-list-container" :class="$vuetify.breakpoint.xsOnly ? 'pt-5' : 'py-5 px-0'">
    <v-layout wrap>
      <v-flex xs12 px-1 mb-1>
        <div class="d-flex align-center">
          <div class="body-2">{{ t('walletSettings.listContacts') }}</div>
          <div class="d-flex ml-auto">
            <v-text-field
              v-if="!$vuetify.breakpoint.smAndDown"
              id="search-name"
              v-model="searchName"
              class="search-name caption"
              dense
              hide-details
              :placeholder="t('walletSettings.searchByName')"
              outlined
              aria-label="Search Name"
            ></v-text-field>
            <v-select
              id="search-verifier"
              v-model="searchVerifier"
              class="search-verifier caption"
              hide-details
              dense
              outlined
              append-icon="$vuetify.icons.select"
              :items="verifierOptions"
              item-text="name"
              item-value="value"
              aria-label="Filter Type"
              :placeholder="t('walletSettings.filterByType')"
            >
              <template #selection="{ item }">
                <div class="v-select__selection v-select__selection--comma">
                  {{ item === 'walletSettings.all' ? t(item) : t(item.name) }}
                </div>
              </template>
              <template #item="{ item }">{{ t(item.name) }}</template>
            </v-select>
          </div>
        </div>
        <div v-if="$vuetify.breakpoint.smAndDown" class="mt-4">
          <v-text-field
            id="search-name"
            v-model="searchName"
            class="search-name caption mobile"
            dense
            hide-details
            placeholder="Search by name"
            outlined
            aria-label="Search Name"
          ></v-text-field>
        </div>
        <v-card class="elevation-1 mt-4">
          <v-list dense class="pa-0 contact-list">
            <template v-for="contact in contacts">
              <v-list-item :key="`contact-${contact.id}`" class="pl-0 pr-1">
                <v-list-item-avatar class="ma-0">
                  <img
                    v-if="contact.verifier === 'eth'"
                    :src="require(`../../../assets/img/icons/eth-grey${$vuetify.theme.dark ? '-black' : '-white'}.svg`)"
                    style="width: 16px"
                    class="ma-1"
                    :alt="`${contact.verifier} Icon`"
                  />
                  <v-icon v-else size="16" class="torusGray1--text">
                    {{ `$vuetify.icons.${contact.verifier.toLowerCase()}` }}
                  </v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="font-weight-regular caption">
                    <span class="text_1--text">{{ contact.name }}</span>
                    -
                    <span class="contact-list__id label">{{ contact.contact }}</span>
                  </v-list-item-title>
                </v-list-item-content>
                <v-list-item-action class="ma-0">
                  <v-btn class="delete-btn" color="text_2" icon small :aria-label="`Delete ${contact.name}`" @click="deleteContact(contact.id)">
                    <v-icon x-small>$vuetify.icons.trash</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </template>
          </v-list>
        </v-card>

        <div class="body-2 mt-4">{{ t('walletSettings.addNewContact') }}</div>

        <v-form ref="addContactForm" v-model="contactFormValid" lazy-validation @submit.prevent="addContact">
          <v-layout wrap class="mt-2 mx-n1">
            <v-flex xs12 sm7 px-1>
              <v-text-field
                id="contact-name"
                v-model="newContactName"
                :placeholder="t('walletSettings.enterContact')"
                :rules="[rules.required]"
                outlined
                aria-label="Contact Name"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm5 px-1>
              <v-select
                id="select-verifier"
                v-model="selectedVerifier"
                class="select-verifier-container"
                outlined
                append-icon="$vuetify.icons.select"
                :items="verifierOptionsNew"
                item-text="name"
                item-value="value"
                aria-label="Select Contact Verifier"
                @change="validateContactForm"
              >
                <template #selection="{ item }">
                  <div class="v-select__selection v-select__selection--comma">
                    {{ t(item.name) }}
                  </div>
                </template>
                <template #item="{ item }">{{ t(item.name) }}</template>
              </v-select>
            </v-flex>
          </v-layout>
          <v-layout wrap>
            <v-flex xs12>
              <v-text-field
                id="contact-value"
                v-model="newContact"
                :placeholder="verifierPlaceholder"
                :rules="[toAddressRule, rules.required, checkDuplicates]"
                outlined
                aria-label="Contact Value"
              >
                <template #message="props">
                  {{ t(props.message) }}
                </template>
              </v-text-field>
            </v-flex>

            <v-layout wrap>
              <v-flex class="ml-auto xs12 sm6 text-right" :class="$vuetify.breakpoint.xsOnly ? 'mt-2' : ''">
                <v-btn
                  id="contact-submit-btn"
                  large
                  class="torus-btn1 py-1 gmt-add-address"
                  :class="$store.state.whiteLabel.isActive ? 'white--text' : 'torusBrand1--text'"
                  :color="$store.state.whiteLabel.isActive ? 'torusBrand1' : ''"
                  type="submit"
                  :disabled="!contactFormValid"
                >
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
import log from 'loglevel'
import { mapGetters } from 'vuex'

import { ALLOWED_VERIFIERS, ETH } from '../../../utils/enums'
import { getVerifierOptions, validateVerifierId } from '../../../utils/utils'

export default {
  name: 'NetworkSettings',
  data() {
    return {
      contactFormValid: true,
      selectedVerifier: ETH,
      newContact: '',
      newContactName: '',
      rules: {
        required: (value) => !!value || this.t('walletSettings.required'),
      },
      ETH,
      searchName: '',
      searchVerifier: null,
    }
  },
  computed: {
    ...mapGetters({
      stateContacts: 'filteredContacts',
    }),
    verifierOptions() {
      return [
        {
          name: 'walletSettings.all',
          value: '',
        },
        ...this.verifierOptionsNew,
      ]
    },
    verifierPlaceholder() {
      const verifierLocale = ALLOWED_VERIFIERS.find((verifier) => verifier.value === this.selectedVerifier).name
      return `${this.t('walletSettings.enter')} ${this.t(verifierLocale)}`
    },
    contacts() {
      return this.stateContacts.filter((contact) => {
        if (this.searchVerifier && this.searchVerifier !== contact.verifier) return false

        if (this.searchName) {
          const nameFilter = new RegExp(this.searchName, 'i')
          if (!contact.name.match(nameFilter)) return false
        }
        return !!contact
      })
    },
    verifierOptionsNew() {
      return getVerifierOptions()
    },
  },
  methods: {
    checkDuplicates(value) {
      if (!this.contacts || !value) return ''
      return this.contacts.findIndex((x) => x.contact.toLowerCase() === value.toLowerCase()) < 0 || 'walletSettings.duplicateContact'
    },
    async addContact() {
      if (!this.$refs.addContactForm.validate()) return
      const contact = this.newContact
      const name = this.newContactName
      this.newContact = ''
      this.newContactName = ''
      this.$refs.addContactForm.resetValidation()
      try {
        await this.$store.dispatch('addContact', {
          contact,
          name,
          verifier: this.selectedVerifier,
        })
      } catch (error) {
        log.error(error)
      }
    },
    deleteContact(contactId) {
      this.$store.dispatch('deleteContact', contactId)
    },
    toAddressRule(value) {
      return validateVerifierId(this.selectedVerifier, value)
    },
    validateContactForm() {
      if (this.$refs.addContactForm) this.$refs.addContactForm.validate()
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'ContactList.scss';
</style>
