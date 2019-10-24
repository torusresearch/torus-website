<template>
  <div class="contact-list-container" :class="$vuetify.breakpoint.xsOnly ? '' : 'py-0 px-12'">
    <div class="subtitle-2">List of Contacts</div>
    <v-card class="card-shadow mt-2">
      <v-list dense flat class="pa-0">
        <template v-for="contact in contacts">
          <v-list-item :key="`contact-${contact.id}`">
            <v-list-item-content>
              <v-list-item-title>
                <span class="text-capitalize">{{ contact.verifier === ETH ? 'Eth Address' : contact.verifier }}</span>
                -
                <span class="primary--text">{{ contact.contact }}</span>
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn icon small @click="deleteContact(contact.id)">
                <v-icon size="10">$vuetify.icons.close</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </template>
      </v-list>
    </v-card>
    <div class="subtitle-2 mt-4">Add new contact</div>

    <v-form ref="addContactForm" @submit="addContact" lazy-validation>
      <v-layout wrap class="mt-2">
        <v-flex xs12 sm6>
          <v-select
            outlined
            append-icon="$vuetify.icons.select"
            :items="verifierOptions"
            item-text="name"
            item-value="value"
            v-model="selectedVerifier"
          ></v-select>
        </v-flex>
        <v-flex xs12>
          <v-text-field v-model="newContact" :placeholder="verifierPlaceholder" required outlined></v-text-field>
        </v-flex>

        <v-flex xs12 class="pt-4 text-right">
          <v-btn type="submit" color="primary" depressed class="px-12 py-1 mt-4">Add Contact</v-btn>
        </v-flex>
      </v-layout>
    </v-form>
  </div>
</template>

<script>
const { GOOGLE, REDDIT, DISCORD, ETH } = require('../../../utils/enums')

export default {
  name: 'networkSettings',
  data() {
    return {
      selectedVerifier: ETH,
      newContact: '',
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
      this.$store.dispatch('updateContacts', {
        contact: this.newContact,
        verifier: this.selectedVerifier
      })

      this.newContact = ''
    },
    deleteContact(contactId) {
      this.$store.dispatch('deleteContact', contactId)
    }
  }
}
</script>

<style lang="scss">
@import 'ContactList.scss';
</style>
