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
                  :rules="[rules.required, addressValidityRule, duplicateNftRule, ownerShipRule]"
                  outlined
                  @change="setContractAddress"
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <div class="body-2 mb-2">{{ t('homeAssets.tokenId') }}</div>
                <v-text-field v-model="tokenId" :rules="[rules.required]" outlined @change="setTokenId"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <div class="body-2 mb-2">{{ t('homeAssets.tokenName') }}</div>
                <v-text-field v-model="nftName" :rules="[rules.required]" outlined></v-text-field>
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
import { mapActions, mapState } from 'vuex'

import NftHandler, { getDisplayErrorMsg } from '../../../handlers/Token/NftHandler'
import torus from '../../../torus'
import { CONTRACT_TYPE_ERC721 } from '../../../utils/enums'
import { getEtherScanAddressLink, validateContractAddress } from '../../../utils/utils'

export default {
  props: {},
  data() {
    return {
      isValidAddress: true,
      isOwner: true,
      addAssetDialog: false,
      tab: 0,
      viewMore: false,
      addAssetFormValid: false,
      contractAddress: '',
      tokenId: '',
      nftName: '',
      nftDescription: '',
      nftStandard: CONTRACT_TYPE_ERC721,
      nftImageLink: '',
      nftBalance: 1,
      rules: {
        required: (value) => !!value || this.t('walletSettings.required'),
      },
      assetInfo: {},
    }
  },
  computed: {
    ...mapState(['selectedAddress', 'networkType', 'assets']),
    duplicateNftRule() {
      if (!this.assets[this.selectedAddress]) return true
      const found = this.assets[this.selectedAddress].find(
        (nft) =>
          nft.address.toLocaleLowerCase() === this.contractAddress?.toLocaleLowerCase() &&
          nft.assets.find((asset) => asset.tokenId.toString() === this.tokenId?.toString())
      )
      return found ? this.t('homeNft.duplicateNft') : true
    },
    addressValidityRule() {
      if (this.isValidAddress) return true
      return this.t('homeToken.invalidContractAddress')
    },
    ownerShipRule() {
      if (this.isOwner) return true
      return this.t('homeNft.invalidOwnership')
    },
  },
  methods: {
    ...mapActions(['addCustomNft']),
    async populateNftDetails(contractAddress, tokenId) {
      try {
        this.currentNft = new NftHandler({ address: contractAddress, tokenId, userAddress: this.selectedAddress, web3: torus.web3 })
        this.isOwner = (await this.currentNft.fetchNftBalance()) > 0
        if (this.isOwner) {
          const { nftBalance, nftName, nftImageLink, decription, nftStandard } = await this.currentNft.getNftDetails()
          this.nftName = nftName
          this.nftImageLink = nftImageLink
          this.decription = decription
          this.nftStandard = nftStandard
          this.nftBalance = `${nftBalance}`
        }
      } catch (error) {
        let displayError = getDisplayErrorMsg(error)
        if (displayError === null) {
          displayError = 'Something went wrong'
          log.error('error while populating custom nft details', error)
        } else {
          log.debug('error', displayError)
        }
        // todo: @lionell, need to show displayError
      }
    },
    async setContractAddress(value) {
      this.contractAddress = value
      // log.debug(await torus.web3.eth.getCode(value))
      this.isValidAddress = await validateContractAddress(torus.web3, value)
      if (this.isValidAddress && this.tokenId) {
        await this.populateNftDetails(value, this.tokenId)
      }
    },
    async setTokenId(value) {
      this.tokenId = value
      this.isValidAddress = await validateContractAddress(torus.web3, this.contractAddress)
      if (this.isValidAddress && !!value) {
        await this.populateNftDetails(this.contractAddress, value)
      }
    },
    nextTab() {
      if (this.$refs.addAssetForm.validate()) {
        // fetch details
        this.assetInfo = {
          id: `#${this.tokenId}`,
          address: this.contractAddress,
          name: this.nftName,
          image: this.nftImageLink,
          explorerLink: getEtherScanAddressLink(this.contractAddress, this.networkType.host),
          description: this.nftDescription,
        }
        this.tab = 1
      }
    },
    addCollectible() {
      log.info(this.assetInfo)
      const payload = {
        nft_address: this.contractAddress,
        network: this.networkType.host,
        nft_name: this.nftName,
        nft_id: this.tokenId,
        nft_contract_standard: this.nftStandard.toUpperCase(),
        nft_image_link: this.nftImageLink,
        description: this.description,
        nft_balance: this.nftBalance,
      }
      this.addCustomNft(payload)
      this.closeForm()
    },
    closeForm() {
      this.$refs.addAssetForm.reset()
      this.tab = 0
      this.addAssetDialog = false
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'AddAsset.scss';
</style>
