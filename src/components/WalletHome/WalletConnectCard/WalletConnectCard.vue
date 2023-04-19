<template>
  <v-card class="elevation-1 promotion-card" :class="{ isMobile: $vuetify.breakpoint.xsOnly, fromEmbed: showFromEmbed }">
    <v-layout class="d-flex flex-column fill-height py-4 px-6">
      <v-flex class="flex-grow-1 d-flex" :class="showFromEmbed ? 'flex-column' : 'mb-4 mb-md-2'">
        <div class="promotion-text" :class="showFromEmbed ? 'order-1 text-center mb-4' : 'pr-3'">
          <div
            class="text-body-2 text-sm-body-1 font-weight-bold text_1--text"
            :class="{ 'text-clamp-one': !$vuetify.breakpoint.xsOnly }"
            :title="t('walletConnect.titleOpensea')"
          >
            {{ t('walletConnect.titleOpensea') }}
          </div>
          <div class="caption text_1--text" :title="t('walletConnect.caption')">
            {{ t('walletConnect.caption') }}
          </div>
        </div>
        <div :class="showFromEmbed ? 'order-0 mx-auto' : 'order-1 mt-1 ml-auto'">
          <v-img
            src="https://images.web3auth.io/wallet-connect.svg"
            class=""
            :class="showFromEmbed ? 'mb-4' : 'mr-1'"
            contain
            position="right center"
            max-width="170"
            max-height="30"
            :style="$vuetify.breakpoint.smAndDown && !showFromEmbed ? 'width: 100px' : 'width: 170px'"
            :alt="t('walletConnect.titleOpensea')"
          />
        </div>
      </v-flex>
      <v-flex>
        <WalletConnect :show-from-embed="showFromEmbed"></WalletConnect>
      </v-flex>
    </v-layout>

    <v-btn v-if="showFromEmbed" class="close-btn" icon aria-label="Close Wallet Connect" @click="closeWalletConnect">
      <v-icon>$vuetify.icons.close</v-icon>
    </v-btn>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex'

import WalletConnect from '../../helpers/WalletConnect'

export default {
  components: { WalletConnect },
  props: {
    showFromEmbed: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    ...mapActions(['sendWalletConnectResponse']),
    closeWalletConnect() {
      this.sendWalletConnectResponse({ success: true, errorMessage: 'User closed Wallet Connect' })
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'WalletConnectCard.scss';
</style>
