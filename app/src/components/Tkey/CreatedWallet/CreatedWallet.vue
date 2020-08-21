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
      class="wallet-item-container d-flex align-center mb-4"
      :class="[{ active: selectedWallet === WALLET_2FA }]"
      @click="selectedWallet = WALLET_2FA"
    >
      <div class="mr-4">
        <v-icon :color="selectedWallet === WALLET_2FA ? 'torusBrand1' : 'torusGray3'">
          {{ `$vuetify.icons.${selectedWallet === WALLET_2FA ? 'radioOn' : 'radioOff'}` }}
        </v-icon>
      </div>
      <div class="wallet-item py-3 px-4 d-flex grow align-center">
        <v-icon small class="mr-3">
          $vuetify.icons.wallet_fill
        </v-icon>
        <div>
          <div class="caption wallet-item__id">{{ t('tkeyCreateDone.yourWallet') }}</div>
          <div class="wallet-item__address caption">{{ t('tkeyCreateDone.walletAddress') }}: 0x11f...5Gdfv</div>
        </div>
      </div>
    </div>

    <div
      class="wallet-item-container d-flex align-center mb-4"
      :class="[{ active: selectedWallet === WALLET_GOOGLE }]"
      @click="selectedWallet = WALLET_GOOGLE"
    >
      <div class="mr-4">
        <v-icon :color="selectedWallet === WALLET_GOOGLE ? 'torusBrand1' : 'torusGray3'">
          {{ `$vuetify.icons.${selectedWallet === WALLET_GOOGLE ? 'radioOn' : 'radioOff'}` }}
        </v-icon>
      </div>
      <div class="wallet-item py-3 px-4 d-flex grow align-center">
        <v-icon small class="mr-3">$vuetify.icons.google</v-icon>
        <div>
          <div class="caption wallet-item__id">
            youremailhere@gmail.com
          </div>
          <div class="wallet-item__address caption">{{ t('tkeyCreateDone.walletAddress') }}: 0x11f...5Gdfv</div>
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
    onSelectWallet(walletSelected) {
      this.selectedWallet = walletSelected
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'CreatedWallet.scss';
</style>
