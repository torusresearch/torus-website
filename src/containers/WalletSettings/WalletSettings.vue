<template>
  <v-container class="wallet-settings" :class="$vuetify.breakpoint.xsOnly ? 'px-4' : ''">
    <v-layout wrap align-start :class="$vuetify.breakpoint.xsOnly ? 'mt-2' : 'mt-3'">
      <v-flex xs6>
        <div class="font-weight-bold text_1--text float-left page-title" :class="{ 'display-1': $vuetify.breakpoint.width > 390 }">
          {{ t('walletSettings.settings') }}
        </div>
      </v-flex>
      <v-flex xs6>
        <QuickAddress />
      </v-flex>
    </v-layout>
    <v-layout wrap mx-n4 mt-7>
      <v-flex px-4 xs12 md6>
        <v-expansion-panels v-model="leftPanel" multiple>
          <v-expansion-panel class="my-2">
            <v-expansion-panel-header id="privacy-panel-header">
              <v-icon size="18" class="d-inline-flex mr-4 text_2--text shrink" v-text="'$vuetify.icons.lock'" />
              <div class="grow font-weight-bold title text_1--text">
                {{ t('walletSettings.privacySecurity') }}
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <PrivacySecurity />
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel class="my-2">
            <v-expansion-panel-header id="contact-list-panel-header">
              <v-icon size="16" class="d-inline-flex mr-4 text_2--text shrink" v-text="'$vuetify.icons.list'" />
              <div class="grow font-weight-bold title text_1--text">
                {{ t('walletSettings.addressBook') }}
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <ContactList />
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel v-show="isThreshold" class="my-2">
            <v-expansion-panel-header id="contact-list-panel-header">
              <v-icon size="16" class="d-inline-flex mr-4 text_2--text shrink" v-text="'$vuetify.icons.wallet'" />
              <div class="grow font-weight-bold title text_1--text">{{ t('tkeySettings.twoFaSettings') }}</div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <TwoFactorAuth />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-flex>
      <v-flex px-4 xs12 md6>
        <v-expansion-panels v-model="rightPanel" multiple>
          <v-expansion-panel class="my-2">
            <v-expansion-panel-header id="network-panel-header">
              <v-icon small class="d-inline-flex mr-4 text_2--text shrink" v-text="'$vuetify.icons.globe'" />
              <div class="grow font-weight-bold title text_1--text">
                {{ t('walletSettings.network') }}
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <Network />
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel class="my-2">
            <v-expansion-panel-header id="display-panel-header">
              <v-icon small class="d-inline-flex mr-4 text_2--text shrink" v-text="'$vuetify.icons.server'" />
              <div class="grow font-weight-bold title text_1--text">
                {{ t('walletSettings.display') }}
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <Display />
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel readonly class="my-2">
            <v-expansion-panel-header id="display-panel-header">
              <v-icon small class="d-inline-flex mr-4 text_2--text shrink" v-text="'$vuetify.icons.person_circle'" />
              <div class="grow font-weight-bold title text_1--text">{{ t('tkeySettings.defaultAccount') }}</div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <DefaultAccount :has-threshold="hasThreshold" :has-threshold-logged="hasThresholdLogged" />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import { mapState } from 'vuex'

import QuickAddress from '../../components/helpers/QuickAddress'
import ContactList from '../../components/WalletSettings/ContactList'
import DefaultAccount from '../../components/WalletSettings/DefaultAccount'
import Display from '../../components/WalletSettings/Display'
import Network from '../../components/WalletSettings/Network'
import PrivacySecurity from '../../components/WalletSettings/PrivacySecurity'
import TwoFactorAuth from '../../components/WalletSettings/TwoFactorAuth'
import { ACCOUNT_TYPE } from '../../utils/enums'

export default {
  name: 'WalletSettings',
  components: {
    PrivacySecurity,
    Network,
    ContactList,
    QuickAddress,
    Display,
    TwoFactorAuth,
    DefaultAccount,
  },
  data() {
    return {
      leftPanel: [0, 1, 2],
      rightPanel: [0, 1, 2],
    }
  },
  computed: {
    ...mapState(['wallet', 'selectedAddress', 'tKeyExists']),
    isThreshold() {
      return this.wallet[this.selectedAddress]?.accountType === ACCOUNT_TYPE.THRESHOLD
    },
    hasThreshold() {
      return this.tKeyExists
    },
    hasThresholdLogged() {
      return Object.values(this.wallet).some((x) => x.accountType === ACCOUNT_TYPE.THRESHOLD)
    },
  },
  mounted() {
    this.$vuetify.goTo(0)
  },
}
</script>

<style lang="scss" scoped>
@import 'WalletSettings.scss';
</style>
