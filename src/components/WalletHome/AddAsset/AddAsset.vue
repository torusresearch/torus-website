<template>
  <v-dialog v-model="addAssetDialog" max-width="375" persistent>
    <template #activator="{ on }">
      <a class="torusBrand1--text caption font-weight-medium gtm-add-asset-cta" v-on="on">{{ t('homeAssets.add') }}</a>
    </template>
    <v-card class="add-asset">
      <v-tabs-items v-model="tab" touchless>
        <v-tab-item>
          <v-layout class="card-header" wrap>
            <v-flex text-center xs12 py-10 px-6>
              <div class="display-1">{{ t('homeAssets.add') }}</div>
              <v-btn class="close-btn" icon aria-label="Close Add Asset" title="Close Add Asset" @click="closeForm">
                <v-icon>$vuetify.icons.close</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
          <v-form ref="addAssetForm" v-model="addAssetFormValid" class="fill-height" lazy-validation @submit.prevent="nextTab">
            <v-layout mx-7 pt-6 pb-4 wrap>
              <v-flex xs12 class="text-center">
                <div class="title">{{ t('homeAssets.formTitle') }}</div>
              </v-flex>
            </v-layout>
            <v-divider></v-divider>
            <v-layout mx-7 pt-6 pb-10 wrap>
              <v-flex xs12>
                <div class="body-2 mb-2">{{ t('homeAssets.contractAddress') }}</div>
                <v-text-field
                  :value="contractAddress"
                  :rules="[rules.required, validateContractAddress]"
                  outlined
                  @change="setContractAddress"
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <div class="body-2 mb-2">{{ t('homeAssets.tokenId') }}</div>
                <v-text-field v-model="tokenId" :rules="[rules.required]" outlined></v-text-field>
              </v-flex>
              <v-flex xs12>
                <div class="body-2 mb-2">{{ t('homeAssets.tokenName') }}</div>
                <v-text-field v-model="tokenName" :rules="[rules.required]" outlined></v-text-field>
              </v-flex>

              <v-flex xs12 mt-15>
                <v-layout mx-n2>
                  <v-flex xs6 px-2>
                    <v-btn block large text @click="closeForm">{{ t('homeToken.cancel') }}</v-btn>
                  </v-flex>
                  <v-flex xs6 px-2>
                    <v-btn block large color="torusBrand1" class="white--text" type="submit" :disabled="!addAssetFormValid">
                      {{ t('homeToken.next') }}
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-form>
        </v-tab-item>
        <v-tab-item>
          <v-layout class="card-header" wrap>
            <v-flex text-center xs12 py-10 px-6>
              <div class="display-1">{{ t('homeAssets.add') }}</div>
              <v-btn class="close-btn" icon aria-label="Close Add Token" title="Close Add Token" @click="closeForm">
                <v-icon>$vuetify.icons.close</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
          <v-layout mx-7 pt-6 pb-4 wrap>
            <v-flex xs12 class="text-center">
              <div class="title">{{ t('homeAssets.infoTitle') }}</div>
            </v-flex>
          </v-layout>
          <v-divider></v-divider>
          <v-layout mb-8 mx-7 pt-6 wrap class="align-center">
            <v-flex xs12>
              <div class="body-2 font-weight-bold">{{ t('homeAssets.infoCollectible') }}</div>
              <div class="d-flex mb-5">
                <div>
                  <img
                    :src="assetInfo.image"
                    style="width: 136px; height: auto"
                    onerror="if (!this.src.includes('/images/nft-placeholder.svg')) this.src = '/images/nft-placeholder.svg';"
                  />
                </div>
                <div class="ml-auto flex-shrink-1" style="width: 136px">
                  <div class="body-2 text_1--text mb-3">{{ assetInfo.name }}</div>
                  <div class="caption text_1--text mb-1">{{ t('homeAssets.infoId') }}</div>
                  <div class="caption text_3--text mb-2">{{ assetInfo.id }}</div>
                  <div class="caption text_1--text mb-1">{{ t('homeAssets.infoContractAdd') }}</div>
                  <div class="caption text_3--text">{{ assetInfo.address }}</div>
                </div>
              </div>
              <div class="caption text_1--text mb-3">{{ t('homeAssets.infoExplorer') }}</div>
              <div class="caption text_3--text mb-4">{{ assetInfo.explorerLink }}</div>
              <div class="caption text_1--text mb-3">{{ t('homeAssets.infoDesc') }}</div>
              <div class="caption text_3--text mb-1" :class="{ 'text-clamp-one': !viewMore }">{{ assetInfo.description }}</div>
              <div class="text-right">
                <a class="caption torusBrand1--text" @click="viewMore = !viewMore">
                  {{ viewMore ? t('homeAssets.viewLess') : t('homeAssets.viewMore') }}
                </a>
              </div>
            </v-flex>
            <v-flex xs12 mt-10>
              <v-layout mx-n2>
                <v-flex xs6 px-2>
                  <v-btn block large text @click="tab = 0">{{ t('homeToken.back') }}</v-btn>
                </v-flex>
                <v-flex xs6 px-2>
                  <v-btn block large color="torusBrand1" class="white--text" @click="addCollectible">{{ t('homeAssets.add') }}</v-btn>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-dialog>
</template>

<script>
import log from 'loglevel'

export default {
  props: {},
  data() {
    return {
      addAssetDialog: false,
      tab: 0,
      viewMore: false,
      addAssetFormValid: false,
      contractAddress: '',
      tokenId: '',
      tokenName: '',
      rules: {
        required: (value) => !!value || this.t('walletSettings.required'),
      },
      assetInfo: {},
    }
  },
  methods: {
    setContractAddress(value) {
      this.contractAddress = value
    },
    nextTab() {
      if (this.$refs.addAssetForm.validate()) {
        // fetch details
        this.assetInfo = {
          id: '#48504412872145064436409815726759718',
          address: '#48504412872145064436409815726759718',
          name: '6ETH Crystal Coins',
          image: 'https://lh3.googleusercontent.com/keEgYUeLeefxvHzZDUbLgIfCxqMqfD0bcT6nnbO5zLGZjlrSmWr7EWzguoT9fSXPxrKW6_PzEciUFu25pqIwMmzW',
          explorerLink: 'https://blockchain.com-explorer-link/123ejuhy345087y68',
          description: `6 ETH Crystal Coins. Pixel art inspired by retro coins tha6 ETH Crystal Coins.
            Pixel art inspired by retro coins tha retro coins tha6 ETH Crystal Coins. Pixel art inspired
            by retro coins thaystal Coins. Pixel art inspired by retro coins tha6 ETH Crystal Coins.
            Pixel art inspired by retro coins tha retro coins tha6 ETH Crystal Coins. Pixel art inspired by retro coins tha.`,
        }
        this.tab = 1
      }
    },
    addCollectible() {
      log.info(this.assetInfo)
      this.closeForm()
    },
    closeForm() {
      this.$refs.addAssetForm.reset()
      this.tab = 0
      this.addAssetDialog = false
    },
    validateContractAddress(value) {
      log.info(value)
      return true
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'AddAsset.scss';
</style>
