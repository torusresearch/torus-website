<template>
  <v-container class="wallet-settings" :class="$vuetify.display.xs ? 'px-4' : ''">
    <v-row no-gutters wrap class="align-start" :class="$vuetify.display.xs ? 'mt-2' : 'mt-3'">
      <v-col cols="6">
        <div class="font-weight-bold text-text_2 float-left page-title" :class="{ 'display-1': $vuetify.display.width > 390 }">
          {{ $t('walletSettings.settings') }}
        </div>
      </v-col>
      <v-col cols="6">
        <QuickAddress />
      </v-col>
    </v-row>
    <v-row wrap class="mt-7">
      <v-col cols="12" md="6">
        <v-expansion-panels v-model="leftPanel" multiple>
          <v-expansion-panel>
            <v-expansion-panel-title id="privacy-panel-header">
              <v-icon size="18" class="d-inline-flex mr-4 text-text_2 shrink">$lock</v-icon>
              <div class="grow font-weight-bold title text-text_1">
                {{ $t('walletSettings.privacySecurity') }}
              </div>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <PrivacySecurity />
            </v-expansion-panel-text>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-title id="contact-list-panel-header">
              <v-icon size="16" class="d-inline-flex mr-4 text-text_2 shrink">$list</v-icon>
              <div class="grow font-weight-bold title text-text_1">
                {{ $t('walletSettings.addressBook') }}
              </div>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <ContactList />
            </v-expansion-panel-text>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-title id="privacy-panel-header">
              <v-icon size="18" class="d-inline-flex mr-4 text-text_2 shrink">$device_detailed</v-icon>
              <div class="grow font-weight-bold title text-text_1">
                {{ $t('walletSettings.crashReport') }}
              </div>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <CrashReport />
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
      <v-col cols="12" md="6">
        <v-expansion-panels v-model="rightPanel" multiple>
          <v-expansion-panel>
            <v-expansion-panel-title id="network-panel-header">
              <v-icon size="small" class="d-inline-flex mr-4 text-text_2 shrink">$globe</v-icon>
              <div class="grow font-weight-bold title text-text_1">
                {{ $t('walletSettings.network') }}
              </div>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <Network />
            </v-expansion-panel-text>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-title id="display-panel-header">
              <v-icon size="small" class="d-inline-flex mr-4 text-text_2 shrink">$server</v-icon>
              <div class="grow font-weight-bold title text-text_1">
                {{ $t('walletSettings.display') }}
              </div>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <Display />
            </v-expansion-panel-text>
          </v-expansion-panel>
          <v-expansion-panel readonly>
            <v-expansion-panel-title id="display-panel-header">
              <v-icon size="small" class="d-inline-flex mr-4 text-text_2 shrink">$person_circle</v-icon>
              <div class="grow font-weight-bold title text-text_1">{{ $t('tkeySettings.accountManagement') }}</div>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <DefaultAccount :has-threshold-logged="hasThresholdLogged" />
            </v-expansion-panel-text>
          </v-expansion-panel>
          <v-expansion-panel v-show="canShowSetCustomKey" readonly>
            <v-expansion-panel-title id="display-panel-header">
              <v-icon size="small" class="d-inline-flex mr-4 text-text_2 shrink">$person_circle</v-icon>
              <div class="grow font-weight-bold title text-text_1">{{ 'Set Torus Key' }}</div>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <SetTorusKey />
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapState } from 'vuex'

import QuickAddress from '../../components/helpers/QuickAddress'
import ContactList from '../../components/WalletSettings/ContactList'
import CrashReport from '../../components/WalletSettings/CrashReport'
import DefaultAccount from '../../components/WalletSettings/DefaultAccount'
import Display from '../../components/WalletSettings/Display'
import Network from '../../components/WalletSettings/Network'
import PrivacySecurity from '../../components/WalletSettings/PrivacySecurity'
import SetTorusKey from '../../components/WalletSettings/SetTorusKey'
import { ACCOUNT_TYPE } from '../../utils/enums'

export default {
  name: 'WalletSettings',
  components: {
    PrivacySecurity,
    Network,
    ContactList,
    CrashReport,
    QuickAddress,
    Display,
    DefaultAccount,
    SetTorusKey,
  },
  data() {
    return {
      leftPanel: [0, 1, 2],
      rightPanel: [0, 1, 2, 3],
    }
  },
  computed: {
    ...mapState(['wallet', 'selectedAddress']),
    isThreshold() {
      const accountType = this.wallet[this.selectedAddress]?.accountType
      return accountType === ACCOUNT_TYPE.THRESHOLD || accountType === ACCOUNT_TYPE.TKEY_SEED_PHRASE
    },
    canShowSetCustomKey() {
      const normalAccount = Object.values(this.wallet).find((x) => x.accountType === ACCOUNT_TYPE.NORMAL) || {}
      return !!normalAccount.metadataNonceHex
    },
    hasThresholdLogged() {
      return Object.values(this.wallet).some((x) => x.accountType === ACCOUNT_TYPE.THRESHOLD)
    },
  },
  mounted() {
    // this.$vuetify.goTo(0)
  },
}
</script>

<style lang="scss" scoped>
@import 'WalletSettings.scss';
</style>
