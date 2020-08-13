<template>
  <div class="elevation-1 pa-10">
    <div class="display-1 text_1--text text-center mb-9">Add a 2FA wallet to your account</div>
    <div class="d-flex">
      <div :style="{ width: '200px' }">
        <div class="d-flex align-center mb-6">
          <img src="../../../assets/images/ob-self-custodial.svg" alt="Self Custodial" class="mr-2" />
          <div class="font-weight-bold body-2 text_1--text">Self-custodial</div>
        </div>
        <div class="d-flex align-center mb-6">
          <img src="../../../assets/images/ob-access.svg" alt="Self Custodial" class="mr-2" />
          <div class="font-weight-bold body-2 text_1--text">Access with or without Google</div>
        </div>
        <div class="d-flex align-center mb-7">
          <img src="../../../assets/images/ob-secure.svg" alt="Self Custodial" class="mr-2" />
          <div class="font-weight-bold body-2 text_1--text">Secure your assets</div>
        </div>
        <div class="d-flex align-center">
          <div class="body-2 text_2--text">
            Learn more
            <v-icon small>$vuetify.icons.arrow_right</v-icon>
          </div>
        </div>
      </div>
      <div class="ml-auto" :style="{ width: '235px', height: '200px' }">
        <img src="../../../assets/images/ob-add-2fa.svg" alt="Add 2-FA" :style="{ marginLeft: '-30px', marginTop: '-20px' }" />
      </div>
    </div>
    <v-layout class="mx-n2 mt-9 mb-12">
      <v-flex class="xs6 px-2">
        <v-btn block x-large outlined color="torusBrand1">Not now</v-btn>
      </v-flex>
      <v-flex class="xs6 px-2">
        <v-btn block x-large color="torusBrand1" class="white--text" @click="next">Sure let's add one</v-btn>
      </v-flex>
    </v-layout>
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
@import 'AddWallet.scss';
</style>
