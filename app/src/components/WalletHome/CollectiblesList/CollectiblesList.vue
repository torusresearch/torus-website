<template>
  <v-layout class="collectibles-tab-container mx-n4" wrap align-center>
    <v-flex v-for="(collectible, i) in collectibleBalances" :key="i" class="xs12 sm6 md4 lg3 px-4 mb-4">
      <v-card class="elevation-1" :class="$vuetify.breakpoint.xsOnly ? 'pt-1 pb-2 px-5' : 'py-2 px-5'">
        <v-list-item class="px-0" router-link :to="{ name: 'walletHomeCollectible', params: { address: collectible.address } }">
          <v-list-item-avatar :size="$vuetify.breakpoint.xsOnly ? 36 : 50">
            <v-img :src="collectible.logo" :alt="collectible.name"></v-img>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="caption text_1--text font-weight-bold mb-2">{{ collectible.name }}</v-list-item-title>
            <v-list-item-subtitle v-if="!$vuetify.breakpoint.xsOnly" class="text_3--text caption">
              {{ collectible.assets.length }} {{ collectible.assets.length > 1 ? t('walletHome.assets') : t('walletHome.asset') }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <div v-if="$vuetify.breakpoint.xsOnly" class="text-right text_3--text">
          {{ collectible.assets.length }} {{ collectible.assets.length > 1 ? t('walletHome.assets') : t('walletHome.asset') }}
        </div>
      </v-card>
    </v-flex>
    <v-flex>
      <div class="d-flex collectibles-tab-container justify-center">
        <div class="mb-4 explore-container" :class="$vuetify.breakpoint.xsOnly ? 'explore-container--mobile' : ''">
          <v-card class="elevation-1 py-4 px-3">
            <div class="d-flex mb-2 align-center">
              <div class="mr-2">
                <img
                  :width="$vuetify.breakpoint.xsOnly ? 51 : 51"
                  :src="require(`../../../../public/images/opensea-logo${$vuetify.theme.isDark ? '-dark' : ''}.svg`)"
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
                :class="whiteLabelGlobal.isWhiteLabelActive ? 'white--text' : 'torusBrand1--text'"
                :color="whiteLabelGlobal.isWhiteLabelActive ? 'torusBrand1' : ''"
                href="https://opensea.io/"
                target="_blank"
              >
                {{ t('walletHome.explore') }}
              </v-btn>
            </div>
          </v-card>
        </div>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: mapGetters(['collectibleBalances']),
}
</script>

<style lang="scss" scoped>
@import 'CollectiblesList.scss';
</style>
