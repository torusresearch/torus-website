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
    <div class="wallet-item-container active d-flex align-center mb-4">
      <div class="mr-4">
        <v-icon color="torusBrand1">$vuetify.icons.radioOn</v-icon>
      </div>
      <div class="wallet-item py-3 px-4 d-flex grow align-center">
        <v-icon small class="text_1--text mr-4">$vuetify.icons.wallet_fill</v-icon>
        <div>
          <div class="text_1--text caption">Your 2FA wallet</div>
          <div class="text_3--text caption">Wallet address: 0x11f...5Gdfv</div>
        </div>
      </div>
    </div>

    <div class="wallet-item-container d-flex align-center mb-4">
      <div class="mr-4">
        <v-icon>$vuetify.icons.radioOn</v-icon>
      </div>
      <div class="wallet-item py-3 px-4 d-flex grow align-center">
        <v-icon small class="text_3--text mr-4">$vuetify.icons.google</v-icon>
        <div>
          <div class="text_2--text caption">youremailhere@gmail.com</div>
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
export default {
  methods: {
    next() {
      this.$emit('next')
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'CreatedWallet.scss';
</style>
