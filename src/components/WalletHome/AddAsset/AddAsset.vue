<template>
  <v-dialog v-model="addAssetDialog" max-width="375" persistent>
    <template #activator="{ props }">
      <a class="text-torusBrand1 caption font-weight-medium gtm-add-asset-cta" tabindex="0" v-bind="props">{{ $t('homeAssets.add') }}</a>
    </template>
    <v-card class="add-asset">
      <v-window v-model="tab">
        <v-window-item>
          <v-row class="card-header bg-torusBlack2" wrap no-gutters>
            <v-col class="text-center py-10 px-6" cols="12">
              <div class="text-h5 font-weight-bold">{{ $t('homeAssets.add') }}</div>
              <v-btn class="close-btn" variant="plain" icon aria-label="Close Add Asset" title="Close Add Asset" @click="closeForm">
                <v-icon>$close</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-form ref="addAssetForm" v-model="addAssetFormValid" class="fill-height" lazy-validation @submit="nextTab">
            <v-row class="mx-7 pt-6 pb-4" wrap no-gutters>
              <v-col cols="12" class="text-center">
                <div class="text-body-1 font-weight-bold">{{ $t('homeAssets.formTitle') }}</div>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row class="mx-7 pt-6 pb-10" wrap no-gutters>
              <v-col cols="12">
                <div class="body-2 mb-2">{{ $t('homeAssets.contractAddress') }}</div>
                <v-text-field
                  :model-value="contractAddress"
                  :rules="[rules.required]"
                  :error-messages="errorMessages"
                  :error="errorMessages.length > 0"
                  variant="outlined"
                  @update:modelValue="setContractAddress"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <div class="body-2 mb-2">{{ $t('homeAssets.tokenId') }}</div>
                <v-text-field
                  :model-value="tokenId"
                  :rules="[rules.required, ownerShipRule, duplicateNftRule]"
                  variant="outlined"
                  :error-messages="displayError"
                  :error="!!displayError"
                  @update:modelValue="setTokenId"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <div class="body-2 mb-2">{{ $t('homeAssets.tokenName') }}</div>
                <v-text-field v-model="nftName" :rules="[rules.required]" variant="outlined"></v-text-field>
              </v-col>

              <v-col cols="12" class="mt-15">
                <v-row class="mx-n2">
                  <v-col cols="6" class="px-2">
                    <v-btn block size="large" variant="text" class="text-body-2" @click="closeForm">{{ $t('homeToken.cancel') }}</v-btn>
                  </v-col>
                  <v-col cols="6" class="px-2">
                    <v-btn block size="large" color="torusBrand1" class="text-body-2 text-white" type="submit" :disabled="!addAssetFormValid">
                      {{ $t('homeToken.next') }}
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-form>
        </v-window-item>
        <v-window-item>
          <v-row class="card-header" wrap no-gutters>
            <v-col cols="12" class="py-10 px-6 text-center">
              <div class="text-h5 font-weight-bold">{{ $t('homeAssets.add') }}</div>
              <v-btn class="close-btn" icon aria-label="Close Add Token" title="Close Add Token" @click="closeForm">
                <v-icon>$close</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-row class="mx-7 pt-6 pb-4" wrap>
            <v-col cols="12" class="text-center">
              <div class="text-body-1 font-weight-bold">{{ $t('homeAssets.infoTitle') }}</div>
            </v-col>
          </v-row>
          <v-divider></v-divider>
          <v-row wrap class="align-center mb-8 mx-7 pt-6">
            <v-col cols="12">
              <div class="body-2 font-weight-bold">{{ $t('homeAssets.infoCollectible') }}</div>
              <div class="d-flex mb-5">
                <div>
                  <img
                    :src="assetInfo.image"
                    style="width: 136px; height: auto"
                    onerror="if (!this.src.includes('/images/nft-placeholder.svg')) this.src = '/images/nft-placeholder.svg';"
                  />
                </div>
                <div class="ml-auto flex-shrink-1" style="width: 136px">
                  <div class="body-2 text-text_1 mb-3">{{ assetInfo.name }}</div>
                  <div class="text-caption text-text_1 mb-1">{{ $t('homeAssets.infoId') }}</div>
                  <div class="text-caption text-text_3 mb-2">{{ assetInfo.id }}</div>
                  <div class="text-caption text-text_1 mb-1">{{ $t('homeAssets.infoContractAdd') }}</div>
                  <div class="text-caption text-text_3">{{ assetInfo.address }}</div>
                </div>
              </div>
              <div class="text-caption text-text_1 mb-3">{{ $t('homeAssets.infoExplorer') }}</div>
              <div class="text-caption text-text_3 mb-4">{{ assetInfo.explorerLink }}</div>
              <div class="text-caption text-text_1 mb-3">{{ $t('homeAssets.infoDesc') }}</div>
              <div class="text-caption text-text_3 mb-1" :class="{ 'text-clamp-one': !viewMore }">{{ assetInfo.description }}</div>
              <div class="text-right">
                <a class="text-caption text-torusBrand1" @click="viewMore = !viewMore">
                  {{ viewMore ? $t('homeAssets.viewLess') : $t('homeAssets.viewMore') }}
                </a>
              </div>
            </v-col>
            <v-col cols="12" class="mt-10">
              <v-row class="mx-n2">
                <v-col cols="6" class="px-2">
                  <v-btn block size="large" variant="text" class="text-body-2" @click="tab = 0">{{ $t('homeToken.back') }}</v-btn>
                </v-col>
                <v-col cols="6" class="px-2">
                  <v-btn block size="large" color="torusBrand1" class="text-body-2 text-white" @click="addCollectible">
                    {{ $t('homeAssets.add') }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-window-item>
      </v-window>
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
      contractAddress: null,
      tokenId: null,
      nftName: null,
      description: null,
      nftStandard: CONTRACT_TYPE_ERC721,
      nftImageLink: null,
      nftBalance: 1,
      errorMessages: [],
      rules: {
        required: (value) => !!value || this.$t('walletSettings.required'),
      },
      assetInfo: {},
      displayError: '',
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
      return found ? this.$t('homeAssets.duplicateNft') : true
    },
    ownerShipRule() {
      if (this.isOwner) return true
      return this.$t('homeAssets.invalidOwnership')
    },
  },
  watch: {
    isValidAddress(value) {
      if (value) this.errorMessages = []
      else this.errorMessages = this.$t('homeAssets.invalidContractAddress')
    },
  },
  methods: {
    ...mapActions(['addCustomNft']),
    async populateNftDetails(contractAddress, tokenId) {
      try {
        this.currentNft = new NftHandler({ address: contractAddress, tokenId, userAddress: this.selectedAddress, web3: torus.web3 })
        const balance = await this.currentNft.fetchNftBalance()
        this.isOwner = balance > 0
        if (this.isOwner) {
          const { nftName, nftImageLink, description, nftStandard } = await this.currentNft.getNftMetadata()
          this.nftName = nftName
          this.nftImageLink = nftImageLink
          this.description = description
          this.nftStandard = nftStandard
          this.nftBalance = `${balance}`
        }
      } catch (error) {
        let displayError = getDisplayErrorMsg(error?.message || '')
        if (displayError === null) {
          displayError = 'walletSettings.somethingWrong'
          log.error('error while populating custom nft details', error)
        } else {
          log.debug('error', displayError)
        }
        this.displayError = this.$t(displayError)
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
    async nextTab() {
      const formValid = await this.$refs.addAssetForm.validate()
      if (!formValid.valid) return
      // fetch details
      this.assetInfo = {
        id: `#${this.tokenId}`,
        address: this.contractAddress,
        name: this.nftName,
        image: this.nftImageLink,
        explorerLink: getEtherScanAddressLink(this.contractAddress, this.networkType.host),
        description: this.description,
      }
      this.tab = 1
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
      this.displayError = ''
      this.errorMessages = []
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'AddAsset.scss';
</style>
