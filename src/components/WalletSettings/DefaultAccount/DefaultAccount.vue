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
          <v-list-item-title class="font-weight-regular caption">
            <span class="text_1--text">{{ wallet.title }}</span>
          </v-list-item-title>
        </v-list-item-content>
        <v-list-item-action class="ma-0">
          <div v-if="wallet.isDefault" class="caption torus_1--text" :style="{ marginRight: '15px' }">
            {{ t('tkeySettings.default') }}
          </div>
          <v-btn v-else-if="hasThresholdLogged" text small color="torusBrand1" class="caption" @click="setDefaultPublicAddress(wallet.key)">
            {{ t('tkeySettings.switchDefault') }}
          </v-btn>
        </v-list-item-action>
      </v-list-item>
      <!-- <v-list-item v-if="hasThreshold && !hasThresholdLogged" class="pl-0 pr-1">
        <v-list-item-avatar class="ma-0">
          <v-icon size="16" class="torusGray1--text">$vuetify.icons.wallet</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="font-weight-regular caption">
            <span class="text_1--text">{{ t('tkeySettings.twoFaWallet') }}</span>
          </v-list-item-title>
        </v-list-item-content>
        <v-list-item-action class="ma-0">
          <v-btn :loading="loggingWithTKey" text small color="torusBrand1" class="caption" @click="loginWithTKey">
            {{ t('tkeySettings.loginWithTkey') }}
          </v-btn>
        </v-list-item-action>
      </v-list-item> -->
      <!-- <v-list-item v-if="!hasThreshold" class="pl-0 pr-1">
        <v-list-item-avatar class="ma-0">
          <v-icon size="16" class="torusGray1--text">$vuetify.icons.wallet</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="caption mb-3 mt-1">
            <span class="text_1--text font-weight-bold mr-1">{{ t('tkeySettings.twoFaWallet') }}</span>
            <span class="torusBrand1--text font-italic">{{ t('tkeySettings.new') }}</span>
          </v-list-item-title>
          <div class="caption pb-3">
            <div class="mb-1">{{ t('tkeySettings.newDesc') }}:</div>
            <ul class="tkey-features mb-4">
              <li>{{ t('tkeySettings.newList1') }}</li>
              <li>{{ t('tkeySettings.newList2') }}</li>
              <li>{{ t('tkeySettings.newList3') }}</li>
            </ul>
            <div class="text-right">
              <v-btn
                large
                class="torus-btn1"
                :class="$store.state.whiteLabel.isActive ? 'white--text' : 'torusBrand1--text'"
                :color="$store.state.whiteLabel.isActive ? 'torusBrand1' : ''"
                type="submit"
                @click="goToTkeyOnboarding"
              >
                {{ t('tkeySettings.newCreate') }}
              </v-btn>
            </div>
          </div>
        </v-list-item-content>
        <v-list-item-action class="ma-0"></v-list-item-action>
      </v-list-item> -->
    </v-list>

    <div class="caption text_3--text mb-4 px-5">{{ t('tkeySettings.note') }}: {{ t('tkeySettings.theSelectedAccount') }}</div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'

import { ACCOUNT_TYPE } from '../../../utils/enums'
import { getUserEmail, getUserIcon } from '../../../utils/utils'

export default {
  name: 'DefaultAccount',
  props: {
    hasThresholdLogged: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loggingWithTKey: false,
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
    userEmail() {
      return getUserEmail(this.userInfo, this.loginConfig, this.t('accountMenu.wallet'))
    },
    hasSeedPhraseAccount() {
      return Object.keys(this.wallets).some((address) => this.wallets[address].accountType === ACCOUNT_TYPE.TKEY_SEED_PHRASE)
    },
  },
  methods: {
    ...mapActions(['setDefaultPublicAddress', 'manualAddTKey', 'updateSelectedAddress']),
    ...mapMutations(['setIsTkeySeedPhraseInputRequired']),
    goToTkeyOnboarding() {
      this.$router.push({ name: 'tkeyCreate' }).catch((_) => {})
    },
    async loginWithTKey() {
      this.loggingWithTKey = true
      await this.manualAddTKey({ calledFromEmbed: false })
      this.loggingWithTKey = false
    },
    createSeedPhraseAccount() {
      this.setIsTkeySeedPhraseInputRequired(true)
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
  },
}
</script>

<style lang="scss" scoped>
@import 'DefaultAccount.scss';
</style>
