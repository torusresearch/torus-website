<template>
  <v-container class="wallet-topup-view pt-6" :class="$vuetify.breakpoint.xsOnly ? 'px-4' : ''">
    <slot></slot>

    <v-layout mt-7 mx-n4 wrap>
      <PlaceholderTopupProviders />
    </v-layout>
  </v-container>
</template>

<script>
import PlaceholderTopupProviders from '../../../components/WalletTopup/PlaceholderTopupProviders'

export default {
  components: {
    PlaceholderTopupProviders,
  },
}
</script>

<style lang="scss" scoped>
@import 'WalletTopupHome.scss';
</style>
