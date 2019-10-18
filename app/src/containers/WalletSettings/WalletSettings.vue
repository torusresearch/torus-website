<template>
  <v-layout mt-1 wrap class="wallet-settings">
    <v-flex xs12 sm8 px-4>
      <v-expansion-panels multiple>
        <!-- Privacy and security settings -->
        <v-expansion-panel>
          <v-expansion-panel-header id="privacy-panel-header" :class="$vuetify.breakpoint.xsOnly ? 'pa-0' : ''" expand-icon="$vuetify.icons.select">
            <v-icon :small="$vuetify.breakpoint.xsOnly" class="d-inline-flex mr-4 text_2--text shrink" v-text="'$vuetify.icons.lock'" />
            <div class="grow text_1--text font-weight-bold" :class="$vuetify.breakpoint.xsOnly ? 'subtitle-1' : 'title'">
              Privacy and Security
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content class="privacy-security-container">
            <privacy-security />
          </v-expansion-panel-content>
        </v-expansion-panel>

        <!-- Contact List -->
        <v-expansion-panel>
          <v-expansion-panel-header
            id="contact-list-panel-header"
            :class="$vuetify.breakpoint.xsOnly ? 'pa-0' : ''"
            expand-icon="$vuetify.icons.select"
          >
            <v-icon :small="$vuetify.breakpoint.xsOnly" class="d-inline-flex mr-4 text_2--text shrink" v-text="'$vuetify.icons.list'" />
            <div class="grow text_1--text font-weight-bold" :class="$vuetify.breakpoint.xsOnly ? 'subtitle-1' : 'title'">
              Contact List
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <contact-list />
          </v-expansion-panel-content>
        </v-expansion-panel>

        <!-- Network Settigs -->
        <v-expansion-panel>
          <v-expansion-panel-header id="network-panel-header" :class="$vuetify.breakpoint.xsOnly ? 'pa-0' : ''" expand-icon="$vuetify.icons.select">
            <v-icon :small="$vuetify.breakpoint.xsOnly" class="d-inline-flex mr-4 text_2--text shrink" v-text="'$vuetify.icons.globe'" />
            <div class="grow text_1--text font-weight-bold" :class="$vuetify.breakpoint.xsOnly ? 'subtitle-1' : 'title'">
              Network
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <network />
          </v-expansion-panel-content>
        </v-expansion-panel>

        <!-- Display Settings -->
        <v-expansion-panel>
          <v-expansion-panel-header id="display-panel-header" :class="$vuetify.breakpoint.xsOnly ? 'pa-0' : ''" expand-icon="$vuetify.icons.select">
            <v-icon :small="$vuetify.breakpoint.xsOnly" class="d-inline-flex mr-4 text_2--text shrink" v-text="'$vuetify.icons.server'" />
            <div class="grow text_1--text font-weight-bold" :class="$vuetify.breakpoint.xsOnly ? 'subtitle-1' : 'title'">
              Display
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
import log from 'loglevel'

export default {
  name: 'walletSettings',
  components: {
    PrivacySecurity,
    ContactList,
    Network,
    Display
  }
}
</script>

<style lang="scss" scoped>
@import 'WalletSettings.scss';
</style>
