<template>
  <v-row class="collectibles-tab-container mx-n4 align-center" wrap :class="{ 'justify-center': collectibleBalances.length === 0 }">
    <v-col v-for="(collectible, i) in collectibleBalances" :key="i" cols="12" sm="6" md="4" lg="3" class="px-4 mb-4">
      <v-card class="elevation-1">
        <v-list-item
          :class="$vuetify.display.xs ? 'pt-3 pb-8 px-4' : 'py-2 px-5'"
          router-link
          :to="{ name: 'walletHomeCollectible', params: { address: collectible.address } }"
          title="View Assets"
        >
          <template #prepend>
            <div :size="$vuetify.display.xs ? 36 : 50" :class="$vuetify.display.xs ? 'my-0' : ''">
              <img
                :src="collectible.logo"
                :alt="collectible.name"
                onerror="if (!this.src.includes('/images/nft-placeholder.svg')) this.src = '/images/nft-placeholder.svg';"
              />
            </div>
          </template>
          <v-list-item-title class="caption text-text_1 font-weight-bold" :class="{ 'mb-2': !$vuetify.display.xs }">
            {{ collectible.name }}
          </v-list-item-title>
          <v-list-item-subtitle v-if="!$vuetify.display.xs" class="text-text_3 caption">
            {{ collectible.assets.length }} {{ collectible.assets.length > 1 ? t('walletHome.assets') : t('walletHome.asset') }}
          </v-list-item-subtitle>
          <div v-if="$vuetify.display.xs" class="text-right text-text_3 asset-note">
            {{ collectible.assets.length }} {{ collectible.assets.length > 1 ? t('walletHome.assets') : t('walletHome.asset') }}
          </div>
        </v-list-item>
      </v-card>
    </v-col>
    <v-col cols="12" sm="6" md="4" lg="3" class="px-4 mb-4">
      <v-card color="elevation-1">
        <v-card-text class="pa-0">
          <div class="d-flex align-center py-3 px-4 card-header elevation-1">
            <div class="flex-grow-1 text-clamp-one text-center" :style="{ height: '25px' }">
              <span class="caption text-text_1 font-weight-bold">{{ $t('homeAssets.didNotSee') }}</span>
            </div>
          </div>
          <div class="text-center py-3 px-4" :style="{ lineHeight: '0' }">
            <AddAsset />
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'

import { LOCALE_JA } from '../../../utils/enums'
import AddAsset from '../AddAsset'

export default {
  components: { AddAsset },
  data: () => ({
    LOCALE_JA,
  }),
  computed: {
    ...mapGetters(['collectibleBalances']),
    localeSelected() {
      return this.$i18n.locale
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'CollectiblesList.scss';
</style>
