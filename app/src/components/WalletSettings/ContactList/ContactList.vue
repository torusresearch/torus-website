<template>
  <div :class="$vuetify.breakpoint.xsOnly ? '' : 'py-0 px-12'">
    <div class="subtitle-2">List of Contacts</div>
    <v-card class="card-shadow mt-2">
      <v-list dense flat class="pa-0">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>
              Telegram -
              <span class="primary--text">calastres</span>
            </v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn icon small>
              <v-icon size="10">$vuetify.icons.close</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>
              Telegram -
              <span class="primary--text">lionellearth</span>
            </v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn icon small>
              <v-icon size="10">$vuetify.icons.close</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-card>
    <div class="subtitle-2 mt-4">Add new contact</div>

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
        <v-text-field :placeholder="verifierPlaceholder" required outlined></v-text-field>
      </v-flex>

      <v-flex xs12 class="pt-4 text-right">
        <v-btn color="primary" depressed class="px-12 py-1 mt-4">Add Contact</v-btn>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
const { GOOGLE, REDDIT, DISCORD, ETH } = require('../../../utils/enums')

export default {
  name: 'networkSettings',
  data() {
    return {
      selectedVerifier: ETH,
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
      ]
    }
  },
  computed: {
    verifierPlaceholder() {
      return `Enter ${this.verifierOptions.find(verifier => verifier.value === this.selectedVerifier).name}`
    }
  }
}
</script>
