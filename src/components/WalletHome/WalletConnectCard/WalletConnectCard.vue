<template>
  <v-card class="elevation-1 promotion-card" :class="{ isMobile: $vuetify.breakpoint.xsOnly }">
    <v-layout class="d-flex flex-column fill-height py-4 px-6">
      <v-flex class="flex-grow-1 d-flex mb-4 mb-md-2">
        <div class="promotion-text pr-3">
          <div
            class="text-body-2 text-sm-body-1 font-weight-bold text_1--text"
            :class="{ 'text-clamp-one': !$vuetify.breakpoint.xsOnly }"
            :title="t('walletConnect.title')"
          >
            {{ t('walletConnect.title') }}
          </div>
          <div class="caption text_1--text" :title="t('walletConnect.caption')">
            {{ t('walletConnect.caption') }}
          </div>
        </div>
        <slot name="image">
          <div class="ml-auto mt-1">
            <v-img
              :src="`${$vuetify.theme.isDark && imageDarkPath ? imageDarkPath : imagePath}`"
              class="mr-1"
              contain
              position="right center"
              max-width="170"
              max-height="30"
              :style="$vuetify.breakpoint.smAndDown ? 'width: 100px' : 'width: 170px'"
              :alt="t('walletConnect.title')"
            />
          </div>
        </slot>
      </v-flex>
      <v-flex>
        <WalletConnect></WalletConnect>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
import WalletConnect from '../../helpers/WalletConnect'

export default {
  components: { WalletConnect },
  props: {
    imagePath: { type: String, default: '' },
    imageDarkPath: { type: String, default: '' },
  },
}
</script>

<style lang="scss" scoped>
@import 'WalletConnectCard.scss';
</style>
