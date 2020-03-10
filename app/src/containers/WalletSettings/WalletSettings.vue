<template>
  <v-container class="wallet-settings" :class="$vuetify.breakpoint.xsOnly ? 'px-4' : ''">
    <v-layout wrap align-start :class="$vuetify.breakpoint.xsOnly ? 'mt-2' : 'mt-3'">
      <v-flex xs12 sm6>
        <div class="font-weight-bold display-1 float-left">{{ t('walletSettings.settings') }}</div>
      </v-flex>
      <v-flex xs12 sm6 class="text-right">
        <ExportQrCode>
          <v-btn icon>
            <v-icon x-small v-text="'$vuetify.icons.qr'" />
          </v-btn>
        </ExportQrCode>
      </v-flex>
    </v-layout>
    <v-layout wrap mx-n4 mt-7>
      <v-flex px-4 xs12 sm6>
        <v-expansion-panels v-model="leftPanel" readonly multiple>
          <v-expansion-panel class="my-2">
            <v-expansion-panel-header id="privacy-panel-header" class="elevation-1">
              <v-icon size="20" class="d-inline-flex mr-4 text_2--text shrink" v-text="'$vuetify.icons.lock'" />
              <div class="grow text_1--text font-weight-bold title">
                {{ t('walletSettings.privacySecurity') }}
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <PrivacySecurity />
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel class="my-2">
            <v-expansion-panel-header id="contact-list-panel-header" class="elevation-1">
              <v-icon size="12" class="d-inline-flex mr-4 text_2--text shrink" v-text="'$vuetify.icons.list'" />
              <div class="grow text_1--text font-weight-bold title">
                {{ t('walletSettings.addressBook') }}
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <ContactList />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-flex>
      <v-flex px-4 xs12 sm6>
        <v-expansion-panels v-model="rightPanel" multiple>
          <v-expansion-panel readonly class="my-2 card-shadow">
            <v-expansion-panel-header id="network-panel-header" class="elevation-1">
              <v-icon small class="d-inline-flex mr-4 text_2--text shrink" v-text="'$vuetify.icons.globe'" />
              <div class="grow text_1--text font-weight-bold title">
                {{ t('walletSettings.network') }}
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <Network />
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel class="my-2 card-shadow">
            <v-expansion-panel-header id="display-panel-header" class="elevation-1">
              <v-icon small class="d-inline-flex mr-4 text_2--text shrink" v-text="'$vuetify.icons.server'" />
              <div class="grow text_1--text font-weight-bold title">
                {{ t('walletSettings.display') }}
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <Display />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-flex>
    </v-layout>
  </v-container>
  <!-- <v-layout mt-3 wrap class="wallet-settings">
    <div class="text-black font-weight-bold headline px-4 mb-4">{{ t('walletSettings.settings') }}</div>
    <v-flex xs12 px-4>
      <v-expansion-panels v-model="panel" multiple>
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
            <PrivacySecurity />
          </v-expansion-panel-content>
        </v-expansion-panel>

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
            <Network />
          </v-expansion-panel-content>
        </v-expansion-panel>

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
            <ContactList />
          </v-expansion-panel-content>
        </v-expansion-panel>

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
            <Display />
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-flex>
  </v-layout> -->
</template>
<script>
import ExportQrCode from '../../components/helpers/ExportQrCode'
import ContactList from '../../components/WalletSettings/ContactList'
import Display from '../../components/WalletSettings/Display'
import Network from '../../components/WalletSettings/Network'
import PrivacySecurity from '../../components/WalletSettings/PrivacySecurity'

export default {
  name: 'WalletSettings',
  components: {
    PrivacySecurity,
    Network,
    ContactList,
    ExportQrCode,
    Display
  },
  data() {
    return {
      leftPanel: [0, 1],
      rightPanel: [0, 1]
    }
  },
  mounted() {
    this.$vuetify.goTo(0)
  }
}
</script>

<style lang="scss" scoped>
@import 'WalletSettings.scss';
</style>
