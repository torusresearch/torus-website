<template>
  <v-layout class="collectibles-tab-container mx-n4" wrap align-center :justify-center="collectibleBalances.length === 0">
    <v-flex v-for="(collectible, i) in collectibleBalances" :key="i" class="xs12 sm6 md4 lg3 px-4 mb-4">
      <v-card class="elevation-1">
        <v-list-item
          :class="$vuetify.breakpoint.xsOnly ? 'pt-3 pb-8 px-4' : 'py-2 px-5'"
          router-link
          :to="{ name: 'walletHomeCollectible', params: { address: collectible.address } }"
          title="View Assets"
        >
          <v-list-item-avatar :size="$vuetify.breakpoint.xsOnly ? 36 : 50" :class="$vuetify.breakpoint.xsOnly ? 'my-0' : ''">
            <img
              :src="collectible.logo"
              :alt="collectible.name"
              onerror="if (!this.src.includes('/images/nft-placeholder.svg')) this.src = '/images/nft-placeholder.svg';"
            />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="caption text_1--text font-weight-bold" :class="{ 'mb-2': !$vuetify.breakpoint.xsOnly }">
              {{ collectible.name }}
            </v-list-item-title>
            <v-list-item-subtitle v-if="!$vuetify.breakpoint.xsOnly" class="text_3--text caption">
              {{ collectible.assets.length }} {{ collectible.assets.length > 1 ? t('walletHome.assets') : t('walletHome.asset') }}
            </v-list-item-subtitle>
          </v-list-item-content>
          <div v-if="$vuetify.breakpoint.xsOnly" class="text-right text_3--text asset-note">
            {{ collectible.assets.length }} {{ collectible.assets.length > 1 ? t('walletHome.assets') : t('walletHome.asset') }}
          </div>
        </v-list-item>
      </v-card>
    </v-flex>
    <v-flex class="xs12 sm6 md4 lg3 px-4 mb-4">
      <v-card color="elevation-1">
        <v-card-text class="pa-0">
          <div class="d-flex align-center py-3 px-4 card-header elevation-1">
            <div class="flex-grow-1 text-clamp-one text-center" :style="{ height: '25px' }">
              <span class="caption text_1--text font-weight-bold">{{ t('homeAssets.didNotSee') }}</span>
            </div>
          </div>
          <div class="text-center py-3 px-4" :style="{ lineHeight: '0' }">
            <AddAsset />
          </div>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
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
