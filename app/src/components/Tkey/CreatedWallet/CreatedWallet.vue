<template>
  <div class="elevation-1 pa-10">
    <div class="text-center mb-6">
      <img src="../../../assets/images/ob-add-2fa-created.svg" alt="2-FA Created" />
    </div>

    <div class="text-center mb-6">
      <div class="headline text_1--text mb-1">Add a 2FA wallet to your account</div>
      <div class="caption text_3--text">The default account would be displayed when you sign in on a DApp.</div>
    </div>

    <!-- Default Wallet -->
    <div
      class="wallet-item-container d-flex align-center mb-4"
      :class="[{ active: selectedWallet === WALLET_2FA }]"
      @click="selectedWallet = WALLET_2FA"
    >
      <div class="mr-4">
        <v-icon :color="selectedWallet === WALLET_2FA ? 'torusBrand1' : ''">
          {{ `$vuetify.icons.${selectedWallet === WALLET_2FA ? 'radioOn' : 'radioOff'}` }}
        </v-icon>
      </div>
      <div class="wallet-item py-3 px-4 d-flex grow align-center">
        <v-icon small class="mr-4" :class="selectedWallet === WALLET_2FA ? 'text_1--text' : 'text_3--text'">
          $vuetify.icons.wallet_fill
        </v-icon>
        <div>
          <div class="caption" :class="selectedWallet === WALLET_2FA ? 'text_2--text' : 'text_3--text'">Your 2FA wallet</div>
          <div class="text_3--text caption">Wallet address: 0x11f...5Gdfv</div>
        </div>
      </div>
    </div>

    <div
      class="wallet-item-container d-flex align-center mb-4"
      :class="[{ active: selectedWallet === WALLET_GOOGLE }]"
      @click="selectedWallet = WALLET_GOOGLE"
    >
      <div class="mr-4">
        <v-icon :color="selectedWallet === WALLET_GOOGLE ? 'torusBrand1' : ''">
          {{ `$vuetify.icons.${selectedWallet === WALLET_GOOGLE ? 'radioOn' : 'radioOff'}` }}
        </v-icon>
      </div>
      <div class="wallet-item py-3 px-4 d-flex grow align-center">
        <v-icon small class="mr-4" :class="selectedWallet === WALLET_GOOGLE ? 'text_1--text' : 'text_3--text'">$vuetify.icons.google</v-icon>
        <div>
          <div class="caption" :class="selectedWallet === WALLET_GOOGLE ? 'text_2--text' : 'text_3--text'">youremailhere@gmail.com</div>
          <div class="text_3--text caption">Wallet address: 0x11f...5Gdfv</div>
        </div>
      </div>
    </div>

    <div class="text-center mt-9">
      <v-btn x-large color="torusBrand1" class="white--text" @click="next">Let's explore</v-btn>
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
