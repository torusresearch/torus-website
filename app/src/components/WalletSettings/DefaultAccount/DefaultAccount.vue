<template>
  <div class="default-account-container" :class="$vuetify.breakpoint.xsOnly ? 'pt-5' : 'py-5 px-4'">
    <div class="body-2 torusFont1--text mb-2 px-1">{{ t('tkeySettings.accounts') }}</div>

    <v-list dense class="pa-0 factor-list mb-4">
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
          <div v-if="wallet.isDefault" class="caption torus_1--text">{{ t('tkeySettings.default') }}</div>
          <a v-else href="#" class="caption text-decoration-none" @click="setDefaultPublicAddress(wallet.key)">
            {{ t('tkeySettings.switchDefault') }}
          </a>
        </v-list-item-action>
      </v-list-item>
      <!-- <v-list-item class="pl-0 pr-1">
        <v-list-item-avatar class="ma-0">
          <v-icon size="16" class="torusGray1--text">{{ `$vuetify.icons.wallet` }}</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="font-weight-regular caption">
            <span class="text_1--text">{{ t('tkeySettings.twoFaWallet') }}</span>
          </v-list-item-title>
        </v-list-item-content>
        <v-list-item-action class="ma-0">
          <a href="#" class="caption text-decoration-none">{{ t('tkeySettings.switchDefault') }}</a>
        </v-list-item-action>
      </v-list-item> -->
    </v-list>

    <div class="caption text_3--text mb-4 px-5">{{ t('tkeySettings.note') }}: {{ t('tkeySettings.theSelectedAccount') }}</div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

import { ACCOUNT_TYPE } from '../../../utils/enums'

export default {
  name: 'DefaultAccount',
  computed: {
    ...mapState({
      wallets: 'wallet',
      userInfo: 'userInfo',
      defaultPublicAddress: 'defaultPublicAddress',
    }),
    computedWallets() {
      return Object.keys(this.wallets).reduce((acc, key) => {
        const { accountType } = this.wallets[key]
        if (accountType !== ACCOUNT_TYPE.IMPORTED)
          acc.push({
            key,
            accountType,
            isDefault: this.defaultPublicAddress ? key === this.defaultPublicAddress : accountType === ACCOUNT_TYPE.NORMAL,
            icon: accountType === ACCOUNT_TYPE.THRESHOLD ? 'wallet' : this.userInfo.typeOfLogin.toLowerCase(),
            title: accountType === ACCOUNT_TYPE.THRESHOLD ? '2FA' : 'Wallet',
          })
        return acc
      }, [])
    },
  },
  methods: {
    ...mapActions(['setDefaultPublicAddress']),
  },
}
</script>

<style lang="scss" scoped>
@import 'DefaultAccount.scss';
</style>
