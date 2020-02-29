<template>
  <v-layout mt-3 wrap class="wallet-settings">
    <div class="text-black font-weight-bold headline px-4 mb-4">{{ t('walletSettings.settings') }}</div>
    <v-flex xs12 px-4>
      <v-expansion-panels v-model="panel" multiple>
        <!-- Privacy and security settings -->
        <v-expansion-panel class="my-2 card-shadow">
          <v-expansion-panel-header
            id="privacy-panel-header"
            :class="$vuetify.breakpoint.xsOnly ? 'py-0 px-4' : 'py-4 px-6'"
            expand-icon="$vuetify.icons.select"
          >
            <v-icon small class="d-inline-flex mr-4 text_2--text shrink" v-text="'$vuetify.icons.lock'" />
            <div class="grow text_1--text font-weight-bold" :class="$vuetify.breakpoint.xsOnly ? 'subtitle-1' : 'subtitle-1'">
              {{ t('walletSettings.privacySecurity') }}
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <privacy-security />
          </v-expansion-panel-content>
        </v-expansion-panel>
        <!-- Smart Contract Wallet Settings -->
        <v-expansion-panel class="my-2 card-shadow">
          <v-expansion-panel-header
            id="smart-contract-header"
            :class="$vuetify.breakpoint.xsOnly ? 'py-0 px-4' : 'py-4 px-6'"
            expand-icon="$vuetify.icons.select"
          >
            <v-icon small class="d-inline-flex mr-4 text_2--text shrink" v-text="'$vuetify.icons.smart_contract'" />
            <div class="grow text_1--text font-weight-bold" :class="$vuetify.breakpoint.xsOnly ? 'subtitle-1' : 'subtitle-1'">
              Smart Contract Wallet
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <smart-contract />
          </v-expansion-panel-content>
        </v-expansion-panel>

        <!-- Network Settigs -->
        <v-expansion-panel class="my-2 card-shadow">
          <v-expansion-panel-header
            id="network-panel-header"
            :class="$vuetify.breakpoint.xsOnly ? 'py-0 px-4' : 'py-4 px-6'"
            expand-icon="$vuetify.icons.select"
          >
            <v-icon small class="d-inline-flex mr-4 text_2--text shrink" v-text="'$vuetify.icons.globe'" />
            <div class="grow text_1--text font-weight-bold" :class="$vuetify.breakpoint.xsOnly ? 'subtitle-1' : 'subtitle-1'">
              {{ t('walletSettings.network') }}
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <network />
          </v-expansion-panel-content>
        </v-expansion-panel>

        <!-- Contact List -->
        <v-expansion-panel class="my-2 card-shadow">
          <v-expansion-panel-header
            id="contact-list-panel-header"
            :class="$vuetify.breakpoint.xsOnly ? 'py-0 px-4' : 'py-4 px-6'"
            expand-icon="$vuetify.icons.select"
          >
            <v-icon size="12" class="d-inline-flex mr-4 text_2--text shrink" v-text="'$vuetify.icons.list'" />
            <div class="grow text_1--text font-weight-bold" :class="$vuetify.breakpoint.xsOnly ? 'subtitle-1' : 'subtitle-1'">
              {{ t('walletSettings.addressBook') }}
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <contact-list />
          </v-expansion-panel-content>
        </v-expansion-panel>

        <!-- Display Settings -->
        <v-expansion-panel class="my-2 card-shadow">
          <v-expansion-panel-header
            id="display-panel-header"
            :class="$vuetify.breakpoint.xsOnly ? 'py-0 px-4' : 'py-4 px-6'"
            expand-icon="$vuetify.icons.select"
          >
            <v-icon small class="d-inline-flex mr-4 text_2--text shrink" v-text="'$vuetify.icons.server'" />
            <div class="grow text_1--text font-weight-bold" :class="$vuetify.breakpoint.xsOnly ? 'subtitle-1' : 'subtitle-1'">
              {{ t('walletSettings.display') }}
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <display />
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-flex>
  </v-layout>
</template>
<script>
import PrivacySecurity from '../../components/WalletSettings/PrivacySecurity'
import ContactList from '../../components/WalletSettings/ContactList'
import Network from '../../components/WalletSettings/Network'
import Display from '../../components/WalletSettings/Display'
import SmartContract from '../../components/WalletSettings/SmartContract'
import { post, get } from '../../utils/httpHelpers.js'
import config, { nodeDetails } from '../../config'

import log from 'loglevel'

export default {
  name: 'walletSettings',
  components: {
    PrivacySecurity,
    ContactList,
    Network,
    Display,
    SmartContract
  },
  data() {
    return {
      panel: [0, 1, 2, 3, 4]
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'WalletSettings.scss';
</style>
