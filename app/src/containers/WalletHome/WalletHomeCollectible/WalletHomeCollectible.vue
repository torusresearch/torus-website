<template>
  <v-container>
    <v-breadcrumbs class="px-4 subtitle-1 font-weight-bold" :items="breadcrumb">
      <template v-slot:divider>
        <v-icon small>$vuetify.icons.page_next_double</v-icon>
      </template>
    </v-breadcrumbs>
    <v-layout wrap align-end>
      <v-flex xs12 sm6 px-4>
        <v-select
          v-model="selectedContract"
          :items="collectibles"
          item-text="name"
          item-value="address"
          outlined
          hide-details
          append-icon="$vuetify.icons.select"
          return-object
          aria-label="Selected contract"
          @change="changeContract"
        >
          <template v-slot:prepend-inner>
            <img v-if="selectedContract" class="mr-1" :src="selectedContract.logo" :alt="selectedContract.name" height="24px" />
          </template>
        </v-select>
      </v-flex>
      <v-flex xs12 sm6 px-4 class="body-2 text_2--text text-capitalize" :class="$vuetify.breakpoint.xsOnly ? 'text-right mt-1' : 'pb-1'"></v-flex>
    </v-layout>
    <v-layout v-if="selectedContract" wrap align-top mt-10>
      <v-flex v-for="asset in selectedContract.assets" :key="asset.tokenId" xs12 sm3 md2 px-4 pb-4>
        <!-- Asset Desktop View -->
        <v-expand-transition>
          <v-card v-if="!$vuetify.breakpoint.xsOnly" class="mx-auto asset elevation-1" max-width="344" :ripple="false" @click="toggleDetails($event)">
            <!-- <v-img :src="asset.image" height="140px" :style="{ backgroundColor: asset.color }"></v-img> -->
            <div class="text-center">
              <img :src="asset.image" style="width: auto; height: 140px" :alt="asset.name || `${selectedContract.name} #${asset.tokenId}`" />
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
              <div class="font-weight-medium">{{ t('walletHome.description') }}</div>
              <div class="ml-2 text_2--text">{{ asset.description }}</div>
              <div class="font-weight-medium mt-2">ID</div>
              <div class="ml-2 text_2--text">#{{ asset.tokenId }}</div>
              <div class="mt-4">
                <v-btn block depressed :outlined="$vuetify.theme.dark" class="torus_brand1--text transfer-btn mb-2" @click="transferAsset(asset)">
                  {{ t('walletHome.transfer') }}
                </v-btn>
                <v-btn block depressed @click.stop="toggleDetails($event)">{{ t('walletHome.close') }}</v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-expand-transition>

        <!-- Asset Mobile View -->
        <v-expand-transition>
          <v-card v-if="$vuetify.breakpoint.xsOnly" class="asset elevation-1 asset--mobile" @click="toggleDetails($event)">
            <!-- <v-list-item :style="{ backgroundColor: asset.color }"> -->
            <v-list-item>
              <v-list-item-content class="asset-text">
                <div
                  class="subtitle-1 text_2--text text-clamp-two font-weight-bold"
                  :title="asset.name || `${selectedContract.name} #${asset.tokenId}`"
                >
                  {{ asset.name || `${selectedContract.name} #${asset.tokenId}` }}
                </div>
              </v-list-item-content>

              <v-list-item-avatar size="72" tile>
                <v-img :src="asset.image" :alt="asset.name || `${selectedContract.name} #${asset.tokenId}`" />
              </v-list-item-avatar>
            </v-list-item>

            <v-card-text class="asset-more py-2 px-4">
              <div class="font-weight-medium">{{ t('walletHome.description') }}</div>
              <div class="ml-2 text_2--text">{{ asset.description }}</div>
              <div class="font-weight-medium mt-2">ID</div>
              <div class="ml-2 text_2--text">#{{ asset.tokenId }}</div>
            </v-card-text>

            <v-card-actions class="px-2 pt-0 pb-3">
              <v-flex xs6 class="px-2">
                <v-btn block depressed class="more-info-show mx-0" @click.stop="toggleDetails($event)">{{ t('walletHome.moreInfo') }}</v-btn>
                <v-btn block depressed class="more-info-hide mx-0" @click.stop="toggleDetails($event)">{{ t('walletHome.lessInfo') }}</v-btn>
              </v-flex>
              <v-flex xs6 class="px-2">
                <v-btn block depressed :outlined="$vuetify.theme.dark" class="torus_brand1--text transfer-btn" @click="transferAsset(asset)">
                  {{ t('walletHome.transfer') }}
                </v-btn>
              </v-flex>
            </v-card-actions>
          </v-card>
        </v-expand-transition>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      breadcrumb: [
        {
          text: this.t('walletHome.home'),
          disabled: false,
          exact: true,
          to: '/wallet/home'
        },
        {
          text: this.t('walletHome.collectibles'),
          disabled: false,
          exact: true,
          to: '/wallet/home#collectibles'
        },
        {
          text: '',
          disabled: true
        }
      ],
      selectedContract: '',
      assetActive: false
    }
  },
  computed: {
    platform() {
      return 'Ethereum Blockchain'
    },
    collectibles() {
      return this.$store.getters.collectibleBalances
    }
  },
  watch: {
    collectibles(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.updateFieldsBasedOnRoute()
      }
    }
  },
  mounted() {
    this.updateFieldsBasedOnRoute()
  },
  methods: {
    changeContract() {
      if (this.selectedContract) {
        this.breadcrumb[2].text = this.selectedContract.name
        this.breadcrumb[2].href = `collectible?address=${this.selectedContract.address}`
      }
    },
    toggleDetails(event) {
      if (event.target.closest('.asset').classList.contains('asset--active')) {
        event.target.closest('.asset').classList.remove('asset--active')
        this.assetActive = false
      } else {
        event.target.closest('.asset').classList.add('asset--active')
        this.assetActive = true
      }
    },
    transferAsset(asset) {
      this.$router.push({ name: 'walletTransfer', query: { ...this.$route.query, contract: asset.address, asset: asset.tokenId } }).catch(_ => {})
    },
    updateFieldsBasedOnRoute() {
      const contractAddress = this.$route.params.address
      this.selectedContract =
        this.collectibles.find(contract => contract.address.toLowerCase() === contractAddress.toLowerCase()) || this.collectibles[0]

      this.changeContract()
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'WalletHomeCollectible.scss';
</style>
