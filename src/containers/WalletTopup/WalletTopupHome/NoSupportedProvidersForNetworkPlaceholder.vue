<template>
  <v-container class="wallet-topup-view pt-6" :class="$vuetify.display.xs ? 'px-4' : ''">
    <slot></slot>

    <v-row class="mt-7 mx-n4" wrap>
      <PlaceholderTopupProviders />
    </v-row>
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
