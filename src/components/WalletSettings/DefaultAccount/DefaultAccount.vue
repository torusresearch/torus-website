<template>
  <div class="default-account-container" :class="$vuetify.display.xs ? 'pt-5' : 'py-5'">
    <div class="body-2 text-torusFont1 text-capitalize mb-2 px-1">
      {{ computedWallets.length > 1 ? $t('tkeySettings.accounts') : $t('tkeySettings.account') }}
    </div>

    <v-list density="comfortable" class="pa-0 account-list mb-2">
      <v-list-item v-for="wallet in computedWallets" :key="wallet.key">
        <template #prepend>
          <div class="mr-4">
            <v-icon size="16" class="text-torusGray1">{{ `$${wallet.icon}` }}</v-icon>
          </div>
        </template>
        <template #append>
          <div v-if="wallet.isDefault" class="caption text-torus_1" :style="{ marginRight: '15px' }">
            {{ $t('tkeySettings.default') }}
          </div>
          <v-btn
            v-else-if="hasThresholdLogged"
            variant="text"
            size="small"
            color="torusBrand1"
            class="caption"
            @click="setDefaultPublicAddress(wallet.key)"
          >
            {{ $t('tkeySettings.switchDefault') }}
          </v-btn>
        </template>
        <v-list-item-title class="font-weight-regular caption">
          <span class="text-text_1">{{ wallet.title }}</span>
        </v-list-item-title>
      </v-list-item>
    </v-list>

    <div class="caption text-text_3 mb-4 px-5">{{ $t('tkeySettings.note') }}: {{ $t('tkeySettings.theSelectedAccount') }}</div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

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
      return getUserEmail(this.userInfo, this.loginConfig, this.$t('accountMenu.wallet'))
    },
    hasSeedPhraseAccount() {
      return Object.keys(this.wallets).some((address) => this.wallets[address].accountType === ACCOUNT_TYPE.TKEY_SEED_PHRASE)
    },
  },
  methods: {
    ...mapActions(['setDefaultPublicAddress', 'updateSelectedAddress']),
    accountTitle(accountType, address) {
      if (accountType === ACCOUNT_TYPE.THRESHOLD) return `OpenLogin ${this.$t('tkeySettings.account')}`
      if (accountType === ACCOUNT_TYPE.TKEY_SEED_PHRASE) {
        const index = Object.keys(this.wallets)
          .filter((x) => this.wallets[x].accountType === ACCOUNT_TYPE.TKEY_SEED_PHRASE)
          .indexOf(address)
        return `${this.$t('tkeySettings.tkeySeedPhrase.seedPhraseAccount')} ${index + 1}`
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
