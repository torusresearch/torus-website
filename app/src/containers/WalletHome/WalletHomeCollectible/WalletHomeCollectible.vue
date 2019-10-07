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
          :items="contracts"
          v-model="selectedContract"
          @change="changeContract"
          item-text="name"
          item-value="id"
          outlined
          hide-details
          append-icon="$vuetify.icons.select"
          return-object
        >
          <template v-slot:prepend-inner>
            <img class="mr-1" :src="selectedContract.image" height="24px" />
          </template>
        </v-select>
      </v-flex>
      <v-flex xs12 sm6 px-4 class="body-2 text_2--text text-capitalize" :class="$vuetify.breakpoint.xsOnly ? 'text-right mt-1' : 'pb-1'">
        {{ platform }}
      </v-flex>
    </v-layout>
    <v-layout wrap align-top mt-10>
      <v-flex xs12 sm3 md2 px-4 pb-4 v-for="asset in selectedContract.assets" :key="asset.id">
        <!-- Asset Desktop View -->
        <v-card class="mx-auto asset" max-width="344" :ripple="false" @click="asset.isSelected = true" v-if="!$vuetify.breakpoint.xsOnly">
          <v-img :src="asset.image_url" height="140px" :style="{ backgroundColor: asset.color }"></v-img>
          <v-card-text class="asset-text py-1 px-3">
            <div class="body-2 asset-name" :title="asset.name">{{ asset.name }}</div>
            <div class="text-right asset-details mt-1">
              <div class="font-weight-medium">{{ asset.costEth }}</div>
              <div class="font-weight-light text_2--text">{{ asset.costCurrency }}</div>
            </div>
          </v-card-text>
          <v-expand-transition>
            <v-card-text class="asset-more py-1 px-3" v-show="asset.isSelected">
              <div class="font-weight-medium">Description</div>
              <div class="ml-2 text_2--text">Hatched by werekitty</div>
              <div class="font-weight-medium mt-2">ID</div>
              <div class="ml-2 text_2--text">#{{ asset.id }}</div>
              <div class="mt-4">
                <v-btn block depressed color="primary">Transfer</v-btn>
                <v-btn block text @click.stop="asset.isSelected = false">Close</v-btn>
              </div>
            </v-card-text>
          </v-expand-transition>
        </v-card>
        <!-- Asset Mobile View -->
        <v-card class="asset" v-if="$vuetify.breakpoint.xsOnly">
          <v-list-item :style="{ backgroundColor: asset.color }">
            <v-list-item-content class="asset-text">
              <div class="body-2 asset-name" :title="asset.name">{{ asset.name }}</div>
              <div class="asset-details mt-8 align-self-baseline">
                <div class="font-weight-medium">{{ asset.costEth }}</div>
                <div class="font-weight-light text_2--text">{{ asset.costCurrency }}</div>
              </div>
            </v-list-item-content>

            <v-list-item-avatar size="100" tile>
              <v-img :src="asset.image_url"></v-img>
            </v-list-item-avatar>
          </v-list-item>

          <v-expand-transition>
            <v-card-text class="asset-more py-1 px-3" v-show="asset.isSelected">
              <v-layout>
                <v-flex xs6 sm12>
                  <div class="font-weight-medium">Description</div>
                  <div class="ml-2 text_2--text">Hatched by werekitty</div>
                </v-flex>
                <v-flex xs6 sm12>
                  <div class="font-weight-medium" :class="$vuetify.breakpoint.xsOnly ? '' : 'mt-2'">ID</div>
                  <div class="ml-2 text_2--text">#{{ asset.id }}</div>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-expand-transition>

          <v-card-actions>
            <v-flex xs6>
              <v-btn block small text @click.stop="asset.isSelected = !asset.isSelected">{{ asset.isSelected ? 'Less' : 'More' }} Info</v-btn>
            </v-flex>
            <v-divider inset vertical></v-divider>
            <v-flex xs6>
              <v-btn block small text color="primary">Transfer</v-btn>
            </v-flex>
          </v-card-actions>
        </v-card>
      </v-flex>

      <!-- Add Asset -->
      <v-flex xs12 sm3 md2 px-4 pb-4>
        <!-- Add Asset Desktop View -->
        <v-card class="mx-auto asset asset--new" max-width="344" v-if="!$vuetify.breakpoint.xsOnly">
          <v-img src="https://img.cryptokitties.co/0x06012c8cf97bead5deae237070f9587f8e7a266d/1713976.png" height="140px" />
          <v-card-text class="asset-text py-1 px-3">
            <div class="body-2 asset-name">Nisse Fabears</div>
            <div class="text-right asset-details mt-1">
              <div class="font-weight-medium">0.25 ETH</div>
              <div class="font-weight-light text_2--text">$49.38 USD</div>
            </div>
          </v-card-text>
          <div class="asset__new-overlay text-center">
            <div class="add-container text-center">
              <v-icon x-large class="primary--text">$vuetify.icons.add</v-icon>
            </div>
            <div class="caption primary--text font-weight-medium mt-4 mb-2">Add Collectible</div>
          </div>
        </v-card>
        <!-- Add Asset Mobile View -->
        <v-card class="asset asset--new" v-if="$vuetify.breakpoint.xsOnly">
          <v-list-item>
            <v-list-item-content class="asset-text">
              <div class="body-2 asset-name">Nisse Fabears</div>
              <div class="asset-details mt-8 align-self-baseline">
                <div class="font-weight-medium">0.25 ETH</div>
                <div class="font-weight-light text_2--text">$49.38 USD</div>
              </div>
            </v-list-item-content>

            <v-list-item-avatar size="100" tile>
              <v-img src="https://img.cryptokitties.co/0x06012c8cf97bead5deae237070f9587f8e7a266d/1713976.png"></v-img>
            </v-list-item-avatar>
          </v-list-item>

          <div class="asset__new-overlay text-center">
            <div class="add-container text-center">
              <v-icon x-large class="primary--text">$vuetify.icons.add</v-icon>
            </div>
            <div class="caption primary--text font-weight-medium mt-4 mb-2">Add Collectible</div>
          </div>

          <v-card-actions>
            <v-flex xs6>
              <v-btn block small text>More Info</v-btn>
            </v-flex>
            <v-divider inset vertical></v-divider>
            <v-flex xs6>
              <v-btn block small text color="primary">Transfer</v-btn>
            </v-flex>
          </v-card-actions>
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
          disabled: true,
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
              id: 1,
              name: 'Long nameeee',
              image_url: 'https://img.cryptokitties.co/0x06012c8cf97bead5deae237070f9587f8e7a266d/1713976.png',
              costEth: '0.0498 ETH',
              costCurrency: '$8.65 USD',
              color: 'Thistle',
              isSelected: false
            },
            {
              id: 2,
              name: 'Jack',
              image_url: 'https://img.cryptokitties.co/0x06012c8cf97bead5deae237070f9587f8e7a266d/1712114.png',
              costEth: '0.0498 ETH',
              costCurrency: '$8.65 USD',
              color: 'Thistle',
              isSelected: false
            },
            {
              id: 3,
              name: 'Jack',
              image_url: 'https://img.cryptokitties.co/0x06012c8cf97bead5deae237070f9587f8e7a266d/1712114.png',
              costEth: '0.0498 ETH',
              costCurrency: '$8.65 USD',
              color: 'Thistle',
              isSelected: false
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
