<template>
  <v-card class="elevation-1 promotion-card" :class="{ isMobile: $vuetify.breakpoint.xsOnly }">
    <v-layout class="d-flex flex-column fill-height py-4 px-6">
      <v-flex class="flex-grow-1 d-flex mb-4 mb-md-2">
        <div class="promotion-text pr-3">
          <div
            class="text-body-2 text-sm-body-1 font-weight-bold text_1--text"
            :class="{ 'text-clamp-three': !$vuetify.breakpoint.xsOnly }"
            :title="walletConnectCardData.title"
          >
            {{ walletConnectCardData.title }}
          </div>
          <!-- <div class="caption text_1--text" :title="subtitle">
            {{ subtitle }}
          </div> -->
        </div>
        <slot name="image">
          <div class="ml-auto mt-1">
            <v-img
              :src="`${$vuetify.theme.isDark && imageDarkPath ? imageDarkPath : imagePath}`"
              class="mr-1"
              contain
              position="right center"
              max-width="170"
              :style="$vuetify.breakpoint.smAndDown ? 'width: 100px' : 'width: 170px'"
              :alt="`${walletConnectCardData.title}`"
            />
          </div>
        </slot>
      </v-flex>
      <v-flex>
        <WalletConnect
          btn-style="button"
          :cta-text="walletConnectCardData.ctaText"
          :cta-disconnect-text="walletConnectCardData.ctaDisconnectText"
        ></WalletConnect>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
import WalletConnect from '../../helpers/WalletConnect'

export default {
  components: { WalletConnect },
  props: {
    walletConnectCardData: {
      type: Object,
      default: () => ({
        title: { type: String, default: '' },
        ctaText: { type: String, default: '' },
        ctaDisconnectText: { type: String, default: '' },
      }),
    },
    imagePath: { type: String, default: '' },
    imageDarkPath: { type: String, default: '' },
  },
}
</script>

<style lang="scss" scoped>
@import 'WalletConnectCard.scss';
</style>
