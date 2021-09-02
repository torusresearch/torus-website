<template>
  <div class="default-account-container" :class="$vuetify.breakpoint.xsOnly ? 'pt-5' : 'py-5 px-4'">
    <div class="body-2 torusFont1--text text-capitalize mb-2 px-1">
      {{ computedWallets.length > 1 ? t('tkeySettings.accounts') : t('tkeySettings.account') }}
    </div>

    <v-list dense outlined class="pa-0 account-list mb-2">
      <v-list-item v-for="wallet in computedWallets" :key="wallet.key" class="pl-0 pr-1">
        <v-list-item-avatar class="ma-0">
          <v-icon size="16" class="torusGray1--text">{{ `$vuetify.icons.${wallet.icon}` }}</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="font-weight-bold caption">
            <span class="text_2--text">{{ wallet.title }}</span>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item v-if="hasThreshold && !hasThresholdLogged" class="pl-0 pr-1">
        <v-list-item-avatar class="ma-0">
          <v-icon size="16" class="torusGray1--text">$vuetify.icons.wallet</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="font-weight-bold caption">
            <span class="text_2--text">{{ `OpenLogin ${t('tkeySettings.account')}` }}</span>
          </v-list-item-title>
        </v-list-item-content>
        <v-list-item-action class="ma-0">
          <v-progress-circular v-if="loggingWithThreshold" color="torusBrand1" size="16" width="2" class="mr-3" indeterminate />
          <a v-else class="caption mr-3" @click="loginWithThreshold">{{ t('tkeySettings.loginWith').replace(/\{account\}/gi, `OpenLogin`) }}</a>
        </v-list-item-action>
      </v-list-item>
      <v-list-item v-if="!hasThreshold" class="pl-0 pr-1">
        <v-list-item-avatar class="ma-0">
          <v-icon size="16" class="torusGray1--text">$vuetify.icons.wallet</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="caption mb-3 mt-1">
            <span class="text_1--text font-weight-bold mr-1">{{ `OpenLogin ${t('tkeySettings.account')}` }}</span>
            <span class="torusBrand1--text font-italic">{{ t('tkeySettings.new') }}</span>
          </v-list-item-title>
          <div class="caption pb-3">
            <div class="mb-1">{{ t('tkeySettings.newThresholdDesc') }}:</div>
            <ul class="tkey-features mb-4">
              <li>{{ t('tkeySettings.newThresholdList1') }}</li>
              <li>{{ t('tkeySettings.newThresholdList2') }}</li>
              <li>{{ t('tkeySettings.newThresholdList3') }}</li>
            </ul>
            <div class="text-right">
              <v-btn
                large
                class="torus-btn1"
                :class="$store.state.whiteLabel.isActive ? 'white--text' : 'torusBrand1--text'"
                :color="$store.state.whiteLabel.isActive ? 'torusBrand1' : ''"
                type="submit"
                @click="createThresholdAccount"
              >
                {{ t('tkeySettings.newThresholdCreate') }}
              </v-btn>
            </div>
          </div>
        </v-list-item-content>
        <v-list-item-action class="ma-0"></v-list-item-action>
      </v-list-item>
    </v-list>

    <div v-if="hasThresholdLogged" class="caption text_3--text mb-10 px-1">
      {{ t('tkeySettings.manageOpenLogin') }}
      <a class="text-decoration-none" :href="openLoginUrl" target="_blank">app.openlogin.com</a>
    </div>

    <div class="mb-2 px-1 d-flex align-center select-default-label">
      <div class="body-2 torusFont1--text">Select default account</div>
      <HelpTooltip :title="`Default account`" :description="`This is the account you will use on a DApp.`" icon="info" :icon-size="16"></HelpTooltip>
    </div>
    <v-menu class="select-default-menu">
      <template #activator="{ on }">
        <v-list dense outlined class="pa-0 account-list">
          <v-list-item class="pl-0 pr-1" :disabled="settingDefaultAccount" v-on="on">
            <v-list-item-avatar class="ma-0">
              <v-icon size="16" class="torusGray1--text">{{ `$vuetify.icons.${defaultWallet.icon}` }}</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="font-weight-bold caption">
                <span class="text_2--text">{{ defaultWallet.title }}</span>
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action class="ma-0 pr-2">
              <v-progress-circular v-if="settingDefaultAccount" size="16" width="2" class="mr-3" indeterminate />
              <v-icon v-else>$vuetify.icons.select</v-icon>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </template>
      <v-list dense outlined class="pa-0 account-list">
        <v-list-item v-for="wallet in computedWallets" :key="wallet.key" class="menu-item pl-0 pr-1" @click="setDefaultAccount(wallet.key)">
          <v-list-item-avatar class="ma-0">
            <v-icon size="16" class="torusGray1--text">{{ `$vuetify.icons.${wallet.icon}` }}</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="font-weight-bold caption">
              <span class="text_2--text">{{ wallet.title }}</span>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import log from 'loglevel'
import { mapActions, mapState } from 'vuex'

import config from '../../../config'
import { ACCOUNT_TYPE } from '../../../utils/enums'
import { getUserEmail, getUserIcon } from '../../../utils/utils'
import HelpTooltip from '../../helpers/HelpTooltip'

export default {
  name: 'DefaultAccount',
  components: { HelpTooltip },
  data() {
    return {
      loggingWithThreshold: false,
      openLoginUrl: config.openLoginUrl,
      settingDefaultAccount: false,
    }
  },
  computed: {
    ...mapState({
      wallets: 'wallet',
      userInfo: 'userInfo',
      defaultPublicAddress: 'defaultPublicAddress',
      loginConfig: (state) => state.embedState.loginConfig,
    }),
    computedWallets() {
      return Object.keys(this.wallets).reduce((acc, key) => {
        const { accountType } = this.wallets[key]
        if (accountType !== ACCOUNT_TYPE.IMPORTED)
          acc.push({
            key,
            accountType,
            isDefault: this.defaultPublicAddress ? key === this.defaultPublicAddress : accountType === ACCOUNT_TYPE.NORMAL,
            icon: this.accountIcon(accountType),
            title: this.accountTitle(accountType, key),
          })
        return acc
      }, [])
    },
    defaultWallet() {
      return this.computedWallets.find((x) => x.isDefault)
    },
    userEmail() {
      return getUserEmail(this.userInfo, this.loginConfig, this.t('accountMenu.wallet'))
    },
    hasThreshold() {
      // TODO: check if has existing openlogin/tkey
      return true
    },
    hasThresholdLogged() {
      // TODO: check openlogin/tkey is loggedin
      return true
    },
    hasSeedPhraseAccount() {
      return Object.keys(this.wallets).some((address) => this.wallets[address].accountType === ACCOUNT_TYPE.TKEY_SEED_PHRASE)
    },
  },
  methods: {
    ...mapActions(['setDefaultPublicAddress', 'updateSelectedAddress']),
    async createThresholdAccount() {
      log.info('createThresholdAccount')
      // TODO: Create openlogin account
    },
    async loginWithThreshold() {
      log.info('loginWithThreshold')
      // TODO: Login with openlogin account
      this.loggingWithThreshold = true
    },
    accountTitle(accountType, address) {
      if (accountType === ACCOUNT_TYPE.THRESHOLD) return `OpenLogin ${this.t('tkeySettings.account')}`
      if (accountType === ACCOUNT_TYPE.TKEY_SEED_PHRASE) {
        const index = Object.keys(this.wallets)
          .filter((x) => this.wallets[x].accountType === ACCOUNT_TYPE.TKEY_SEED_PHRASE)
          .indexOf(address)
        return `${this.t('tkeySettings.tkeySeedPhrase.seedPhraseAccount')} ${index + 1}`
      }
      return this.userInfo.verifierId
    },
    accountIcon(accountType) {
      return getUserIcon(accountType, this.userInfo.typeOfLogin)
    },
    async setDefaultAccount(key) {
      this.settingDefaultAccount = true
      await this.setDefaultPublicAddress(key)
      this.settingDefaultAccount = false
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'DefaultAccount.scss';
</style>
