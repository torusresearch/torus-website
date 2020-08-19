<template>
  <div class="add-wallet-container" :class="[$vuetify.breakpoint.xsOnly ? 'pa-6' : 'pa-10', { 'is-dark': $vuetify.theme.dark }]">
    <div class="text_1--text text-center mb-9" :class="$vuetify.breakpoint.xsOnly ? 'headline' : 'display-1'">Add a 2FA wallet to your account</div>
    <div class="d-flex add-wallet-info" :class="$vuetify.breakpoint.xsOnly ? 'is-mobile flex-column' : ''">
      <div class="add-wallet-info__list" :class="$vuetify.breakpoint.xsOnly ? 'order-1' : ''">
        <div class="d-flex align-center mb-6">
          <img src="../../../assets/images/ob-self-custodial.svg" alt="Self Custodial" class="mr-2" />
          <div class="font-weight-bold body-2" :class="$vuetify.theme.dark ? 'torusFont1--text' : 'text_1--text'">Self-custodial</div>
        </div>
        <div class="d-flex align-center mb-6">
          <img src="../../../assets/images/ob-access.svg" alt="Self Custodial" class="mr-2" />
          <div class="font-weight-bold body-2" :class="$vuetify.theme.dark ? 'torusFont1--text' : 'text_1--text'">Access with or without Google</div>
        </div>
        <div class="d-flex align-center mb-7">
          <img src="../../../assets/images/ob-secure.svg" alt="Self Custodial" class="mr-2" />
          <div class="font-weight-bold body-2" :class="$vuetify.theme.dark ? 'torusFont1--text' : 'text_1--text'">Secure your assets</div>
        </div>
        <div class="d-flex align-center" :class="$vuetify.breakpoint.xsOnly ? 'justify-center' : ''">
          <div class="body-2" :class="$vuetify.theme.dark ? 'torusFont1--text' : 'text_2--text'">
            Learn more
            <v-icon v-if="!$vuetify.breakpoint.xsOnly" small>$vuetify.icons.arrow_right</v-icon>
          </div>
        </div>
      </div>
      <div :class="$vuetify.breakpoint.xsOnly ? 'order-0' : 'ml-auto'" class="add-wallet-info__image">
        <img :src="require(`../../../assets/images/ob-add-2fa${$vuetify.theme.dark ? '-dark' : ''}.svg`)" alt="Add 2-FA" />
      </div>
    </div>
    <v-layout class="mx-n2 mt-9 mb-12">
      <v-flex class="xs6 px-2">
        <v-btn
          block
          :x-large="!$vuetify.breakpoint.xsOnly"
          :class="$vuetify.breakpoint.xsOnly ? 'caption' : ''"
          outlined
          :color="$vuetify.theme.dark ? 'white' : 'torusBrand1'"
        >
          Not now
        </v-btn>
      </v-flex>
      <v-flex class="xs6 px-2">
        <v-btn
          block
          :x-large="!$vuetify.breakpoint.xsOnly"
          :class="$vuetify.breakpoint.xsOnly ? 'caption' : ''"
          color="torusBrand1"
          class="torusFont1--text"
          @click="next"
        >
          Sure let's add one
        </v-btn>
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
