<template>
  <v-dialog v-model="addContactDialoag" width="400">
    <template v-slot:activator="{ on }">
      <v-btn depressed x-small block class="caption primary lighten-5 primary--text add-contact-alert" v-on="on">
        We just detected a new address. Click here to add to your contacts
      </v-btn>
    </template>
    <v-card class="add-contact-container">
      <v-form ref="addContactForm" v-model="contactFormValid" @submit="addContact" lazy-validation>
        <v-card-text class="text_1--text py-6">
          <v-layout wrap>
            <v-flex xs12 :class="$vuetify.breakpoint.xsOnly ? '' : 'px-4'">
              <div class="font-weight-bold headline">Add Contact</div>
              <v-chip small class="caption" color="#CAF1FE">{{ verifierLabels[verifier] }}</v-chip>
            </v-flex>
            <v-flex xs12 mt-6 :class="$vuetify.breakpoint.xsOnly ? '' : 'px-4'">
              <span class="subtitle-2">Contact Account Name</span>
              <v-text-field v-model="newContactName" placeholder="Enter the name here" :rules="[rules.required]" outlined></v-text-field>
            </v-flex>
          </v-layout>
        </v-card-text>

        <v-card-actions class="pb-6">
          <v-flex xs6>
            <v-btn block text color="text_2" @click="addContactDialoag = false">Cancel</v-btn>
          </v-flex>
          <v-divider vertical></v-divider>
          <v-flex xs6>
            <v-btn type="submit" color="primary" depressed class="px-12 py-1" :disabled="!contactFormValid">Confirm</v-btn>
          </v-flex>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import { GOOGLE, REDDIT, DISCORD, ETH, ETH_LABEL, GOOGLE_LABEL, REDDIT_LABEL, DISCORD_LABEL } from '../../../utils/enums'

const VERIFIER_LABELS = {
  [ETH]: ETH_LABEL,
  [GOOGLE]: GOOGLE_LABEL,
  [REDDIT]: REDDIT_LABEL,
  [DISCORD]: DISCORD_LABEL
}
export default {
  props: ['verifier', 'contact'],
  data() {
    return {
      addContactDialoag: false,
      contactFormValid: true,
      newContactName: '',
      rules: {
        required: value => !!value || 'Required'
      },
      verifierLabels: VERIFIER_LABELS
    }
  },
  methods: {
    addContact(e) {
      if (this.$refs.addContactForm.validate()) {
        e.preventDefault()
        this.$store
          .dispatch('addContact', {
            contact: this.contact,
            verifier: this.verifier,
            name: this.newContactName
          })
          .then(response => {
            this.newContactName = ''
            this.addContactDialoag = false
            this.$refs.addContactForm.reset()
          })
      }
    }
  }
}
</script>
