<template>
  <div>
    <v-breadcrumbs class="px-4" :items="breadcrumb">
      <template v-slot:divider>
        <v-icon>$vuetify.icons.page_next</v-icon>
      </template>
    </v-breadcrumbs>
    <v-layout wrap align-end>
      <v-flex xs6 px-4>
        <v-select
          :items="contracts"
          v-model="selectedContract"
          @change="changeContract"
          item-text="name"
          item-value="id"
          outlined
          hide-details
          append-icon="$vuetify.icons.select"
          return-object
        ></v-select>
      </v-flex>
      <v-flex xs6 px-4 pb-1 class="body-2 text_2--text text-capitalize">{{ platform }}</v-flex>
    </v-layout>
    <v-layout wrap align-center mt-10>
      <v-flex xs6 sm3 md2 px-4 pb-4 v-for="asset in selectedContract.assets" :key="asset.id">
        <v-card class="mx-auto asset" max-width="344">
          <v-img :src="asset.image_url" height="140px"></v-img>
          <v-card-text class="asset-text py-1 px-3">
            <div class="body-2">{{ asset.name }}</div>
            <div class="text-right asset-details mt-1">
              <div class="font-weight-medium">{{ asset.costEth }}</div>
              <div class="font-weight-light text_2--text">{{ asset.costCurrency }}</div>
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs6 sm3 md2 px-4 pb-4>
        <v-card class="mx-auto asset asset--new" max-width="344">
          <v-img src="https://img.cryptokitties.co/0x06012c8cf97bead5deae237070f9587f8e7a266d/1713976.png" height="140px">
            <v-card-title class="flex-column justify-end primary--text fill-height">
              <div class="add-container text-center">
                <v-icon x-large class="primary--text">$vuetify.icons.add</v-icon>
              </div>
              <div class="caption font-weight-medium mt-4 mb-2">Add Collectible</div>
            </v-card-title>
          </v-img>
          <v-card-text class="asset-text py-1 px-3">
            <div class="body-2">Nisse Fabears</div>
            <div class="text-right asset-details mt-1">
              <div class="font-weight-medium">0.25 ETH</div>
              <div class="font-weight-light text_2--text">$49.38 USD</div>
            </div>
          </v-card-text>
        </v-card>
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
          text: 'Home',
          disabled: false,
          exact: true,
          to: '/wallet/home'
        },
        {
          text: 'Collectibles',
          disabled: false,
          exact: true,
          to: '/wallet/home/collectible?id=1'
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
    contracts() {
      return [
        {
          id: 1,
          name: 'Cryptokitties',
          image: 'https://www.cryptokitties.co/images/kitty-eth.svg',
          assets: [
            {
              name: 'Jack',
              image_url: 'https://img.cryptokitties.co/0x06012c8cf97bead5deae237070f9587f8e7a266d/1713976.png',
              costEth: '0.0498 ETH',
              costCurrency: '$8.65 USD',
              color: 'dahlia'
            },
            {
              name: 'Jack',
              image_url: 'https://img.cryptokitties.co/0x06012c8cf97bead5deae237070f9587f8e7a266d/1712114.png',
              costEth: '0.0498 ETH',
              costCurrency: '$8.65 USD',
              color: 'dahlia'
            },
            {
              name: 'Jack',
              image_url: 'https://img.cryptokitties.co/0x06012c8cf97bead5deae237070f9587f8e7a266d/1712114.png',
              costEth: '0.0498 ETH',
              costCurrency: '$8.65 USD',
              color: 'dahlia'
            }
          ]
        },
        {
          id: 2,
          name: 'My Crypto Heroes',
          image: 'https://pbs.twimg.com/profile_images/1074160618788147200/W-COgBLA_400x400.jpg'
        },
        {
          id: 3,
          name: 'Proof of Attendance Protocol',
          image: 'https://cdn.stateofthedapps.com/dapps/poap/logo_poap_2e95b0adb2b95625bcd5240c61c74b8d1037c29aed9d3f2b6e4d9c1fb6cebdc3_opti.png'
        }
      ]
    }
  },
  methods: {
    changeContract() {
      this.breadcrumb[2].text = this.selectedContract.name
      this.breadcrumb[2].href = `collectible/${this.selectedContract.id}`
    }
  },
  created() {
    const contractId = parseInt(this.$route.query.id || 1)
    this.selectedContract = this.contracts.find(contract => {
      return contract.id === contractId
    })
    this.changeContract()
  }
}
</script>

<style lang="scss" scoped>
@import 'WalletHomeCollectible.scss';
</style>
