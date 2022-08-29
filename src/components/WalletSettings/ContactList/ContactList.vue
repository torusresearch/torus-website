<template>
  <div class="contact-list-container" :class="$vuetify.display.xs ? 'pt-5' : 'py-5 px-0'">
    <v-row wrap>
      <v-col cols="12" class="px-1 mb-1">
        <div class="d-flex align-center">
          <div class="body-2">{{ $t('walletSettings.listContacts') }}</div>
          <div class="d-flex ml-auto">
            <v-text-field
              v-if="!$vuetify.display.smAndDown"
              id="search-name"
              v-model="searchName"
              class="search-name caption"
              density="comfortable"
              hide-details
              :placeholder="$t('walletSettings.searchByName')"
              variant="outlined"
              aria-label="Search Name"
            ></v-text-field>
            <v-select
              id="search-verifier"
              v-model="searchVerifier"
              class="search-verifier caption"
              hide-details
              density="comfortable"
              variant="outlined"
              append-icon="$select"
              :items="verifierOptions"
              item-title="name"
              item-value="value"
              aria-label="Filter Type"
              :placeholder="$t('walletSettings.filterByType')"
            >
              <template #selection="{ item }">
                <div class="v-select__selection v-select__selection--comma">
                  {{ item === 'walletSettings.all' ? $t(item) : $t(item.title) }}
                </div>
              </template>
              <template #item="{ item }">{{ $t(item.title) }}</template>
            </v-select>
          </div>
        </div>
        <div v-if="$vuetify.display.smAndDown" class="mt-4">
          <v-text-field
            id="search-name"
            v-model="searchName"
            class="search-name caption mobile"
            density="comfortable"
            hide-details
            placeholder="Search by name"
            variant="outlined"
            aria-label="Search Name"
          ></v-text-field>
        </div>
        <v-card class="elevation-1 mt-4">
          <v-list v-for="contact in contacts" :key="`contact-${contact.id}`" density="comfortable" class="pa-0 contact-list">
            <v-list-item class="pl-0 pr-1">
              <template #prepend>
                <div class="ma-0">
                  <img
                    v-if="contact.verifier === 'eth'"
                    :src="require(`../../../assets/img/icons/eth-grey${isDarkMode ? '-black' : '-white'}.svg`)"
                    style="width: 16px"
                    class="ma-1"
                    :alt="`${contact.verifier} Icon`"
                  />
                  <v-icon v-else size="16" class="text-torusGray1">
                    {{ `$${contact.verifier.toLowerCase()}` }}
                  </v-icon>
                </div>
              </template>
              <v-list-item-title class="font-weight-regular caption">
                <span class="text-text_1">{{ contact.name }}</span>
                -
                <span class="contact-list__id label">{{ contact.contact }}</span>
              </v-list-item-title>
              <v-list-item-action class="ma-0">
                <v-btn class="delete-btn" color="text_2" icon size="small" :aria-label="`Delete ${contact.name}`" @click="deleteContact(contact.id)">
                  <v-icon size="x-small">$trash</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card>

        <div class="body-2 mt-4">{{ $t('walletSettings.addNewContact') }}</div>

        <v-form ref="addContactForm" v-model="contactFormValid" lazy-validation @submit.prevent="addContact">
          <v-row wrap class="mt-2 mx-n1">
            <v-col cols="12" sm="7" class="px-1">
              <v-text-field
                id="contact-name"
                v-model="newContactName"
                :placeholder="$t('walletSettings.enterContact')"
                :rules="[rules.required]"
                variant="outlined"
                aria-label="Contact Name"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="5" class="px-1">
              <v-select
                id="select-verifier"
                v-model="selectedVerifier"
                class="select-verifier-container"
                variant="outlined"
                append-icon="$select"
                :items="verifierOptionsNew"
                item-title="name"
                item-value="value"
                aria-label="Select Contact Verifier"
                @change="validateContactForm"
              >
                <template #selection="{ item }">
                  <div class="v-select__selection v-select__selection--comma">
                    {{ $t(item.title) }}
                  </div>
                </template>
                <template #item="{ item }">{{ $t(item.title) }}</template>
              </v-select>
            </v-col>
          </v-row>
          <v-row wrap>
            <v-col cols="12">
              <v-text-field
                id="contact-value"
                v-model="newContact"
                :placeholder="verifierPlaceholder"
                :rules="[toAddressRule, rules.required, checkDuplicates]"
                variant="outlined"
                aria-label="Contact Value"
              >
                <template #message="props">
                  {{ $t(props.message) }}
                </template>
              </v-text-field>
            </v-col>

            <v-row wrap>
              <v-col cols="12" sm="6" class="ml-auto text-right" :class="$vuetify.display.xs ? 'mt-2' : ''">
                <v-btn
                  id="contact-submit-btn"
                  size="large"
                  class="torus-btn1 py-1 gmt-add-address"
                  :class="whiteLabel.isActive ? 'text-white' : 'text-torusBrand1'"
                  :color="whiteLabel.isActive ? 'torusBrand1' : ''"
                  type="submit"
                  :disabled="!contactFormValid"
                >
                  {{ $t('walletSettings.addContact') }}
                </v-btn>
              </v-col>
            </v-row>
          </v-row>
        </v-form>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import log from 'loglevel'
import { mapGetters, mapState } from 'vuex'

import { ALLOWED_VERIFIERS, ETH } from '../../../utils/enums'
import { getVerifierOptions, validateVerifierId } from '../../../utils/utils'

export default {
  name: 'ContactList',
  data() {
    return {
      contactFormValid: true,
      selectedVerifier: ETH,
      newContact: '',
      newContactName: '',
      rules: {
        required: (value) => !!value || this.$t('walletSettings.required'),
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
    ...mapState(['whiteLabel', 'networkId']),
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
      return `${this.$t('walletSettings.enter')} ${this.$t(verifierLocale)}`
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
    isDarkMode() {
      return this.$vuetify.theme.global.name === 'dark'
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
      return validateVerifierId(this.selectedVerifier, value, this.networkId)
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
