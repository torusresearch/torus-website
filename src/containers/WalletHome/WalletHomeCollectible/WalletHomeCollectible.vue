<template>
  <v-container>
    <v-breadcrumbs class="px-2 text-subtitle-1 font-weight-bold" :items="breadcrumb">
      <template #divider>
        <v-icon small>$vuetify.icons.page_next_double</v-icon>
      </template>
    </v-breadcrumbs>
    <v-layout wrap align-end>
      <v-flex xs12 sm6 px-2>
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
          <template #prepend-inner>
            <img v-if="selectedContract" class="mr-1" :src="selectedContract.logo" :alt="selectedContract.name" height="24px" />
          </template>
        </v-select>
      </v-flex>
      <v-flex xs12 sm6 px-4 class="body-2 text_2--text text-capitalize" :class="$vuetify.breakpoint.xsOnly ? 'text-right mt-1' : 'pb-1'"></v-flex>
    </v-layout>
    <v-layout v-if="selectedContract" wrap align-top mt-10 mx-n2>
      <CollectibleAsset v-for="asset in selectedContract.assets" :key="asset.tokenId" :asset="asset" @onTransfer="transferAsset" />
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

import CollectibleAsset from '../../../components/WalletHome/CollectibleAsset'

export default {
  components: { CollectibleAsset },
  data() {
    return {
      breadcrumb: [
        {
          text: this.t('walletHome.home'),
          disabled: false,
          exact: true,
          to: '/wallet/home',
        },
        {
          text: this.t('walletHome.collectibles'),
          disabled: false,
          exact: true,
          to: '/wallet/home#collectibles',
        },
        {
          text: '',
          disabled: true,
        },
      ],
      selectedContract: '',
    }
  },
  computed: mapGetters({
    collectibles: 'collectibleBalances',
  }),
  watch: {
    collectibles(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.updateFieldsBasedOnRoute()
      }
    },
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
    transferAsset(asset) {
      this.$router.push({ name: 'walletTransfer', query: { ...this.$route.query, contract: asset.address, asset: asset.tokenId } }).catch((_) => {})
    },
    updateFieldsBasedOnRoute() {
      const contractAddress = this.$route.params.address
      this.selectedContract =
        this.collectibles.find((contract) => contract.address.toLowerCase() === contractAddress.toLowerCase()) || this.collectibles[0]

      this.changeContract()
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'WalletHomeCollectible.scss';
</style>
