<template>
  <v-card class="elevation-1 promotion-card fill-height" :class="{ isMobile: $vuetify.display.xs }">
    <v-row class="d-flex flex-column flex-nowrap fill-height py-4 px-6" no-gutters>
      <v-col class="flex-grow-1 d-flex mb-4 mb-md-2 py-2">
        <div class="promotion-text pr-3">
          <div
            class="text-body-2 text-sm-body-1 font-weight-bold text-text_1"
            :class="{ 'text-clamp-one': !$vuetify.display.xs }"
            :title="$t('walletConnect.title')"
          >
            {{ $t('walletConnect.title') }}
          </div>
          <div class="caption text-text_1" :title="$t('walletConnect.caption')">
            {{ $t('walletConnect.caption') }}
          </div>
        </div>
        <slot name="image">
          <div class="ml-auto mt-1">
            <v-img
              :src="`${isDarkMode && imageDarkPath ? imageDarkPath : imagePath}`"
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
      </v-col>
      <v-col>
        <WalletConnect></WalletConnect>
      </v-col>
    </v-row>
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
  computed: {
    isDarkMode() {
      return this.$vuetify.theme.name === 'dark'
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'WalletConnectCard.scss';
</style>
