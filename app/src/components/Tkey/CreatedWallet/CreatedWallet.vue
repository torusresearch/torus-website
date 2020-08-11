<template>
  <div class="elevation-1 pa-10">
    <div class="text-center mb-6">
      <img src="../../../assets/images/ob-add-2fa-created.svg" alt="2-FA Created" />
    </div>

    <div class="text-center mb-6">
      <div class="headline text_1--text mb-1">Add a 2FA wallet to your account</div>
      <div class="caption text_3--text">The default account would be displayed when you sign in on a DApp.</div>
    </div>

    <div class="text-center">
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
