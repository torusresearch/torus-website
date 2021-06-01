<template>
  <v-flex xs12 sm4 md3 lg2 px-3 pb-4>
    <!-- Asset Desktop View -->
    <v-expand-transition>
      <v-card
        v-if="!$vuetify.breakpoint.xsOnly"
        class="mx-auto asset elevation-1"
        :class="assetActive ? 'asset--active' : ''"
        max-width="344"
        :ripple="false"
        @click="toggleAsset(!assetActive)"
      >
        <div class="text-center pt-3">
          <img
            :src="asset.image"
            style="width: auto; height: 140px"
            :alt="asset.name || `${selectedContract.name} #${asset.tokenId}`"
            onerror="if (!this.src.includes('/images/nft-placeholder.svg')) this.src = '/images/nft-placeholder.svg';"
          />
        </div>
        <v-card-text class="asset-text py-1 px-3">
          <div class="body-2" :class="assetActive ? '' : 'text-clamp-two'" :title="asset.name || `${selectedContract.name} #${asset.tokenId}`">
            {{ asset.name || `${selectedContract.name} #${asset.tokenId}` }}
          </div>
          <div class="text-right asset-details mt-1">
            <div class="font-weight-medium">{{ asset.costEth || '&nbsp;' }}</div>
            <div class="font-weight-light text_2--text">{{ asset.costCurrency || '&nbsp;' }}</div>
          </div>
        </v-card-text>
        <v-card-text class="asset-more pt-1 py-3 px-3">
          <div class="font-weight-medium">ID</div>
          <div class="font-weight-light text_2--text mb-2">#{{ asset.tokenId }}</div>
          <div class="font-weight-medium">{{ t('walletHome.description') }}</div>
          <div class="font-weight-light text_2--text" :class="{ 'text-clamp-two': !viewMore }">{{ asset.description }}</div>
          <a class="caption text_3--text" @click.stop="viewMore = !viewMore">{{ viewMore ? t('walletHome.viewLess') : t('walletHome.viewMore') }}</a>
          <div class="mt-4">
            <v-btn block depressed :outlined="$vuetify.theme.dark" color="torusBrand1" class="white--text mb-2" @click="transferAsset(asset)">
              {{ t('walletHome.transfer') }}
            </v-btn>
            <v-btn
              block
              class="torus-btn1"
              :class="$store.state.whiteLabel.isActive ? 'white--text' : 'torusBrand1--text'"
              :color="$store.state.whiteLabel.isActive ? 'torusBrand1' : ''"
              @click.stop="toggleAsset(false)"
            >
              {{ t('walletHome.close') }}
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-expand-transition>

    <!-- Asset Mobile View -->
    <v-expand-transition>
      <v-card
        v-if="$vuetify.breakpoint.xsOnly"
        class="asset elevation-1 asset--mobile"
        :class="assetActive ? 'asset--active' : ''"
        :ripple="false"
        @click="toggleAsset(!assetActive)"
      >
        <v-list-item>
          <v-list-item-content class="asset-text">
            <div
              class="text-subtitle-1 text_2--text text-clamp-two font-weight-bold"
              :title="asset.name || `${selectedContract.name} #${asset.tokenId}`"
            >
              {{ asset.name || `${selectedContract.name} #${asset.tokenId}` }}
            </div>
            <div v-if="!assetActive" class="font-weight-medium caption">{{ t('walletHome.description') }}</div>
            <div v-if="!assetActive" class="font-weight-light caption text_2--text text-clamp-one">{{ asset.description }}</div>
          </v-list-item-content>

          <v-list-item-avatar size="72" tile>
            <img
              :src="asset.image"
              :alt="asset.name || `${selectedContract.name} #${asset.tokenId}`"
              onerror="if (!this.src.includes('/images/nft-placeholder.svg')) this.src = '/images/nft-placeholder.svg';"
            />
          </v-list-item-avatar>
        </v-list-item>

        <v-card-text class="asset-more py-2 px-4">
          <div class="font-weight-medium mt-2">ID</div>
          <div class="font-weight-light mb-2 text_2--text">#{{ asset.tokenId }}</div>
          <div class="font-weight-medium">{{ t('walletHome.description') }}</div>
          <div class="font-weight-light text_2--text">{{ asset.description }}</div>
        </v-card-text>

        <v-card-actions class="px-2 pt-0 pb-3">
          <v-flex xs6 class="px-2">
            <v-btn
              block
              class="torus-btn1"
              :class="$store.state.whiteLabel.isActive ? 'white--text' : 'torusBrand1--text'"
              :color="$store.state.whiteLabel.isActive ? 'torusBrand1' : ''"
              @click.stop="toggleAsset(!assetActive)"
            >
              {{ assetActive ? t('walletHome.lessInfo') : t('walletHome.moreInfo') }}
            </v-btn>
          </v-flex>
          <v-flex xs6 class="px-2">
            <v-btn block depressed :outlined="$vuetify.theme.dark" color="torusBrand1" class="white--text" @click.stop="transferAsset(asset)">
              {{ t('walletHome.transfer') }}
            </v-btn>
          </v-flex>
        </v-card-actions>
      </v-card>
    </v-expand-transition>
  </v-flex>
</template>

<script>
export default {
  props: {
    asset: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  data() {
    return {
      assetActive: false,
      viewMore: false,
    }
  },
  methods: {
    transferAsset(asset) {
      this.$emit('onTransfer', asset)
    },
    toggleAsset(active) {
      this.assetActive = active
      if (!this.assetActive) this.viewMore = false
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'CollectiblesAsset.scss';
</style>
