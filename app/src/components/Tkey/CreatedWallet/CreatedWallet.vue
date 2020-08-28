<template>
  <div class="created-wallet-container" :class="[$vuetify.breakpoint.xsOnly ? 'pa-6' : 'pa-10', { 'is-dark': $vuetify.theme.dark }]">
    <div class="text-center mb-6">
      <img :src="require(`../../../assets/images/ob-add-2fa-created${$vuetify.theme.dark ? '-dark' : ''}.svg`)" alt="2-FA Created" />
    </div>

    <div class="text-center mb-6">
      <div class="headline mb-1" :class="$vuetify.theme.dark ? 'torusFont1--text' : 'text_1--text'">{{ t('tkeyCreateDone.selectDefault') }}</div>
      <div class="caption text_3--text">{{ t('tkeyCreateDone.theDefaultAccount') }}</div>
    </div>

    <!-- Default Wallet -->
    <div
      v-for="wallet in wallets"
      :key="wallet.key"
      class="wallet-item-container d-flex align-center mb-4"
      :class="[{ active: wallet.isDefault }]"
      @click="setDefaultPublicAddress"
    >
      <div class="mr-4">
        <v-icon :color="wallet.isDefault ? 'torusBrand1' : 'torusGray3'">
          {{ `$vuetify.icons.${wallet.isDefault ? 'radioOn' : 'radioOff'}` }}
        </v-icon>
      </div>
      <div class="wallet-item py-3 px-4 d-flex grow align-center">
        <v-icon small class="mr-3">$vuetify.icons.{{ wallet.icon }}</v-icon>
        <div>
          <div class="caption wallet-item__id">{{ wallet.title }}</div>
          <div class="wallet-item__address caption">{{ t('tkeyCreateDone.walletAddress') }}: {{ wallet.keySliced }}</div>
        </div>
      </div>
    </div>

    <div class="mt-9" :class="$vuetify.breakpoint.xsOnly ? 'text-right' : 'text-center'">
      <v-btn
        :x-large="!$vuetify.breakpoint.xsOnly"
        :class="$vuetify.breakpoint.xsOnly ? 'caption' : ''"
        color="torusBrand1"
        class="white--text"
        @click="next"
      >
        {{ t('tkeyCreateDone.letsExplore') }}
      </v-btn>
    </div>
  </div>
</template>

<script>
const WALLET_2FA = 'wallet_2fa'
const WALLET_GOOGLE = 'wallet_google'
export default {
  props: {
    wallets: {
      type: Array,
      default() {
        return []
      },
    },
    defaultPublicAddress: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      selectedWallet: WALLET_GOOGLE,
      WALLET_2FA,
      WALLET_GOOGLE,
    }
  },
  methods: {
    next() {
      this.$emit('next')
    },
    setDefaultPublicAddress(address) {
      this.$emit('setDefaultPublicAddress', address)
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'CreatedWallet.scss';
</style>
