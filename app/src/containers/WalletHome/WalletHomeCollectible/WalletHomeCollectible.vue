<template>
  <div>
    <v-breadcrumbs class="px-4 subtitle-1 font-weight-bold" :items="breadcrumb">
      <template v-slot:divider>
        <v-icon small>$vuetify.icons.page_next_double</v-icon>
      </template>
    </v-breadcrumbs>
    <v-layout wrap align-end>
      <v-flex xs12 sm6 px-4>
        <v-select
          :items="collectibles"
          v-model="selectedContract"
          @change="changeContract"
          item-text="name"
          item-value="address"
          outlined
          hide-details
          append-icon="$vuetify.icons.select"
          return-object
          aria-label="Selected contract"
        >
          <template v-slot:prepend-inner>
            <img v-if="selectedContract" class="mr-1" :src="selectedContract.logo" :alt="selectedContract.name" height="24px" />
          </template>
        </v-select>
      </v-flex>
      <v-flex xs12 sm6 px-4 class="body-2 text_2--text text-capitalize" :class="$vuetify.breakpoint.xsOnly ? 'text-right mt-1' : 'pb-1'">
        {{ platform }}
      </v-flex>
    </v-layout>
    <v-layout wrap align-top mt-10 v-if="selectedContract">
      <v-flex xs12 sm3 md2 px-4 pb-4 v-for="asset in selectedContract.assets" :key="asset.tokenId">
        <!-- Asset Desktop View -->
        <v-expand-transition>
          <v-card class="mx-auto asset" max-width="344" :ripple="false" v-if="!$vuetify.breakpoint.xsOnly" @click="toggleDetails($event)">
            <!-- <v-img :src="asset.image" height="140px" :style="{ backgroundColor: asset.color }"></v-img> -->
            <div class="text-center">
              <img :src="asset.image" style="width: auto; height: 140px" :alt="asset.tokenId" />
            </div>
            <v-card-text class="asset-text py-1 px-3">
              <div class="body-2" :title="asset.name || `${selectedContract.name} #${asset.tokenId}`">
                {{ asset.name || `${selectedContract.name} #${asset.tokenId}` }}
              </div>
              <div class="text-right asset-details mt-1">
                <div class="font-weight-medium">{{ asset.costEth || '&nbsp;' }}</div>
                <div class="font-weight-light text_2--text">{{ asset.costCurrency || '&nbsp;' }}</div>
              </div>
            </v-card-text>
            <v-card-text class="asset-more py-1 px-3">
              <div class="font-weight-medium">Description</div>
              <div class="ml-2 text_2--text">{{ asset.description }}</div>
              <div class="font-weight-medium mt-2">ID</div>
              <div class="ml-2 text_2--text">#{{ asset.tokenId }}</div>
              <div class="mt-4">
                <v-btn block depressed color="primary" @click="transferAsset(asset)">Transfer</v-btn>
                <v-btn block text @click.stop="toggleDetails($event)">Close</v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-expand-transition>

        <!-- Asset Mobile View -->
        <v-expand-transition>
          <v-card class="asset asset--mobile" v-if="$vuetify.breakpoint.xsOnly" @click="toggleDetails($event)">
            <!-- <v-list-item :style="{ backgroundColor: asset.color }"> -->
            <v-list-item>
              <v-list-item-content class="asset-text">
                <div class="body-2" :title="asset.name || `${selectedContract.name} #${asset.tokenId}`">
                  {{ asset.name || `${selectedContract.name} #${asset.tokenId}` }}
                </div>
                <div class="asset-details mt-8 align-self-baseline">
                  <div class="font-weight-medium">{{ asset.costEth || '&nbsp;' }}</div>
                  <div class="font-weight-light text_2--text">{{ asset.costCurrency || '&nbsp;' }}</div>
                </div>
              </v-list-item-content>

              <v-list-item-avatar size="100" tile>
                <v-img :src="asset.image" :alt="asset.tokenId" />
              </v-list-item-avatar>
            </v-list-item>

            <v-card-text class="asset-more py-1 px-3">
              <div class="font-weight-medium">Description</div>
              <div class="ml-2 text_2--text">{{ asset.description }}</div>
              <div class="font-weight-medium mt-2">ID</div>
              <div class="ml-2 text_2--text">#{{ asset.tokenId }}</div>
            </v-card-text>

            <v-card-actions>
              <v-flex xs6>
                <v-btn block small text class="more-info-show" @click.stop="toggleDetails($event)">More Info</v-btn>
                <v-btn block small text class="more-info-hide" @click.stop="toggleDetails($event)">Less Info</v-btn>
              </v-flex>
              <v-divider inset vertical></v-divider>
              <v-flex xs6>
                <v-btn block small text color="primary" @click="transferAsset(asset)">Transfer</v-btn>
              </v-flex>
            </v-card-actions>
          </v-card>
        </v-expand-transition>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
export default {
  data() {
    return {
      breadcrumb: [
        {
          text: this.$vuetify.lang.t('$vuetify.walletHome.home'),
          disabled: false,
          exact: true,
          to: '/wallet/home'
        },
        {
          text: this.$vuetify.lang.t('$vuetify.walletHome.collectibles'),
          disabled: false,
          exact: true,
          to: '/wallet/home#collectibles'
        },
        {
          text: '',
          disabled: true
        }
      ],
      selectedContract: ''
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
    collectibles: function(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.updateFieldsBasedOnRoute()
      }
    }
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
      } else {
        event.target.closest('.asset').classList.add('asset--active')
      }
    },
    transferAsset(asset) {
      this.$router.push({ name: 'walletTransfer', query: { ...this.$route.query, contract: asset.address, asset: asset.tokenId } }).catch(err => {})
    },
    updateFieldsBasedOnRoute() {
      const contractAddress = this.$route.params.address
      this.selectedContract =
        this.collectibles.find(contract => {
          return contract.address.toLowerCase() === contractAddress.toLowerCase()
        }) || this.collectibles[0]

      this.changeContract()
    }
  },
  mounted() {
    this.updateFieldsBasedOnRoute()
  }
}
</script>

<style lang="scss" scoped>
@import 'WalletHomeCollectible.scss';
</style>
