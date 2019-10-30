<template>
  <div class="contact-list-container" :class="$vuetify.breakpoint.xsOnly ? '' : 'py-0 px-12'">
    <div class="body-2">List of Contacts</div>
    <v-card class="card-shadow mt-2">
      <v-list dense flat class="pa-0">
        <template v-for="contact in contacts">
          <v-list-item two-line :key="`contact-${contact.id}`">
            <v-list-item-content>
              <v-list-item-title class="font-weight-regular caption">
                <span>{{ contact.name }}</span>
              </v-list-item-title>
              <v-list-item-subtitle class="font-weight-regular caption text_2--text text--lighten-2">
                <span class="text-capitalize">{{ contact.verifier === ETH ? '' : `${contact.verifier}: ` }}</span>
                <span>{{ contact.contact }}</span>
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn color="text_2" icon small @click="deleteContact(contact.id)">
                <v-icon size="10">$vuetify.icons.close</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </template>
      </v-list>
    </v-card>
    <div class="body-2 mt-4">Add new contact</div>

    <v-form ref="addContactForm" v-model="contactFormValid" @submit="addContact">
      <v-layout wrap class="mt-2">
        <v-flex xs12 sm6>
          <v-select
            outlined
            append-icon="$vuetify.icons.select"
            :items="verifierOptions"
            item-text="name"
            item-value="value"
            v-model="selectedVerifier"
            @change="$refs.addContactForm.validate()"
          ></v-select>
        </v-flex>
        <v-flex xs12>
          <v-text-field v-model="newContactName" placeholder="Enter Contact Name" :rules="[rules.required]" outlined></v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-text-field v-model="newContact" :placeholder="verifierPlaceholder" :rules="[toAddressRule, rules.required]" outlined></v-text-field>
        </v-flex>

        <v-flex xs12 class="pt-4 text-right">
          <v-btn type="submit" color="primary" depressed class="px-12 py-1" :disabled="!contactFormValid">Add Contact</v-btn>
        </v-flex>
      </v-layout>
    </v-form>
  </div>
</template>

<script>
import torus from '../../../torus'
const { GOOGLE, REDDIT, DISCORD, ETH } = require('../../../utils/enums')

export default {
  name: 'networkSettings',
  data() {
    return {
      contactFormValid: false,
      selectedVerifier: ETH,
      newContact: '',
      newContactName: '',
      rules: {
        required: value => !!value || 'Required'
      },
      verifierOptions: [
        {
          name: 'ETH Address',
          value: ETH
        },
        {
          name: 'Google Email',
          value: GOOGLE
        },
        {
          name: 'Reddit ID',
          value: REDDIT
        },
        {
          name: 'Discord ID',
          value: DISCORD
        }
      ],
      ETH
    }
  },
  computed: {
    verifierPlaceholder() {
      return `Enter ${this.verifierOptions.find(verifier => verifier.value === this.selectedVerifier).name}`
    },
    contacts() {
      return this.$store.state.contacts
    }
  },
  methods: {
    addContact(e) {
      e.preventDefault()
      this.$store
        .dispatch('addContact', {
          contact: this.newContact,
          name: this.newContactName,
          verifier: this.selectedVerifier
        })
        .then(response => {
          this.newContact = ''
          this.newContactName = ''
        })
    },
    deleteContact(contactId) {
      this.$store.dispatch('deleteContact', contactId)
    },
    toAddressRule(value) {
      if (this.selectedVerifier === ETH) {
        return torus.web3.utils.isAddress(value) || 'Invalid ETH Address'
      } else if (this.selectedVerifier === GOOGLE) {
        return (
          // eslint-disable-next-line max-len
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            value
          ) || 'Invalid Email Address'
        )
      } else if (this.selectedVerifier === REDDIT) {
        return (/[\w-]+/.test(value) && !/\s/.test(value) && value.length >= 3 && value.length <= 20) || 'Invalid reddit username'
      } else if (this.selectedVerifier === DISCORD) {
        return (/^[0-9]*$/.test(value) && value.length === 18) || 'Invalid Discord ID'
      }

      return true
    }
  }
}
</script>

<style lang="scss">
@import 'ContactList.scss';
</style>
