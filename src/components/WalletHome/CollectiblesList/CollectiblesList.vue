<template>
  <v-layout v-if="collectibleBalances.length > 0" class="collectibles-tab-container mx-n4" wrap align-center>
    <v-flex v-for="(collectible, i) in collectibleBalances" :key="i" class="xs12 sm6 md4 lg3 px-4 mb-4">
      <v-card class="elevation-1">
        <v-list-item
          :class="$vuetify.breakpoint.xsOnly ? 'pt-3 pb-8 px-4' : 'py-2 px-5'"
          router-link
          :to="{ name: 'walletHomeCollectible', params: { address: collectible.address } }"
          title="View Assets"
        >
          <v-list-item-avatar :size="$vuetify.breakpoint.xsOnly ? 36 : 50" :class="$vuetify.breakpoint.xsOnly ? 'my-0' : ''">
            <v-img :src="collectible.logo" :alt="collectible.name"></v-img>
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
  </v-layout>
  <div v-else class="d-flex collectibles-tab-container justify-center">
    <div class="mb-4 explore-container" :class="$vuetify.breakpoint.xsOnly ? 'explore-container--mobile' : ''">
      <v-card class="elevation-1 py-4 px-3">
        <div class="d-flex mb-2 align-center">
          <div class="mr-2">
            <img
              :width="localeSelected === LOCALE_JA ? 70 : 51"
              :src="
                require(`../../../assets/images/${localeSelected === LOCALE_JA ? 'miime' : 'opensea'}-logo${
                  $vuetify.theme.isDark ? '-dark' : ''
                }.svg`)
              "
              alt="Explore Opensea"
            />
          </div>
          <div>
            <div class="caption text_1--text font-weight-bold mb-1">{{ t('walletHome.exploreTitle') }}</div>
            <div class="explore-details text_1--text">{{ t('walletHome.exploreSubtitle') }}</div>
          </div>
        </div>
        <div class="text-center">
          <v-btn
            large
            class="torus-btn1 px-10"
            :class="$store.state.whiteLabel.isActive ? 'white--text' : 'torusBrand1--text'"
            :color="$store.state.whiteLabel.isActive ? 'torusBrand1' : ''"
            :href="localeSelected === LOCALE_JA ? 'https://miime.io/' : 'https://opensea.io/'"
            target="_blank"
            rel="noreferrer noopener"
          >
            {{ t('walletHome.explore') }}
          </v-btn>
        </div>
      </v-card>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import { LOCALE_JA } from '../../../utils/enums'

export default {
  data: () => ({
    LOCALE_JA,
  }),
  computed: {
    ...mapGetters(['collectibleBalances']),
    localeSelected() {
      return this.$vuetify.lang.current
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'CollectiblesList.scss';
</style>
