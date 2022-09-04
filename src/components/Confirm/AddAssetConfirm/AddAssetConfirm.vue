<template>
  <div v-if="type === CONTRACT_TYPE_ERC20">
    <v-card class="add-token">
      <v-row class="card-header" wrap>
        <v-col cols="12" class="text-center py-10 px-6">
          <div class="display-1">{{ $t('homeToken.addTokens') }}</div>
        </v-col>
      </v-row>
      <v-row class="mx-6 pt-6 pb-4" wrap>
        <v-col cols="12">
          <div class="title">{{ $t('homeToken.likeToAddToken') }}</div>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <v-row wrap class="align-center mb-8 mx-6 pt-6">
        <v-col cols="8" class="mb-3">
          <div class="body-2 font-weight-bold">{{ $t('homeToken.token') }}</div>
        </v-col>
        <v-col cols="4" class="text-right mb-3">
          <div class="body-2 font-weight-bold">{{ $t('homeToken.balance') }}</div>
        </v-col>
        <v-col cols="8">
          <div class="d-flex align-center">
            <img :src="`${image}`" class="inline-small d-inline-flex" height="36" />
            <div class="ml-2 body-1">{{ name }}</div>
          </div>
        </v-col>
        <v-col cols="4" class="text-right">
          <div class="body-2">{{ balance }}</div>
        </v-col>
      </v-row>
      <v-row class="mx-6 pt-6 pb-10 pt-15" wrap>
        <v-col cols="12">
          <v-row class="mx-n2">
            <v-col cols="6" class="px-2">
              <v-btn block size="large" variant="text" @click="rejectAddToken">{{ $t('homeToken.cancel') }}</v-btn>
            </v-col>
            <v-col cols="6" class="px-2">
              <v-btn block size="large" color="torusBrand1" class="text-white" type="button" @click="approveAddToken">
                {{ $t('homeToken.addToken') }}
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card>
  </div>
  <div v-else>
    <v-row class="card-header" wrap>
      <v-col cols="12" class="text-center py-10 px-6">
        <div class="display-1">{{ $t('homeAssets.add') }}</div>
      </v-col>
    </v-row>
    <v-row class="mx-7 pt-6 pb-4" wrap>
      <v-col cols="12">
        <div class="title">{{ $t('homeAssets.infoTitle') }}</div>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-row wrap class="align-center mb-8 mx-7 pt-6">
      <v-col cols="12">
        <div class="body-2 font-weight-bold">{{ $t('homeAssets.infoCollectible') }}</div>
        <div class="d-flex mb-5">
          <div>
            <img
              :src="image"
              style="width: 90px; height: auto"
              onerror="if (!this.src.includes('/images/nft-placeholder.svg')) this.src = '/images/nft-placeholder.svg';"
            />
          </div>
          <div class="ml-auto flex-shrink-1">
            <div class="body-2 text-text_1 mb-3">{{ name }}</div>
            <div class="caption text-text_1 mb-1">{{ $t('homeAssets.infoId') }}</div>
            <div class="caption text-text_3 mb-2">{{ id }}</div>
            <div class="caption text-text_1 mb-1">{{ $t('homeAssets.infoContractAdd') }}</div>
            <div class="caption text-text_3">{{ address }}</div>
          </div>
        </div>
        <div class="caption text-text_1 mb-3">{{ $t('homeAssets.infoExplorer') }}</div>
        <div class="caption text-text_3 mb-4">{{ explorerlink }}</div>
        <div v-if="description !== ''" class="caption text-text_1 mb-3">{{ $t('homeAssets.infoDesc') }}</div>
        <div v-if="description !== ''" class="caption text-text_3 mb-1" :class="{ 'text-clamp-one': !viewMore }">{{ description }}</div>
        <div v-if="description !== ''" class="text-right">
          <a class="caption text-torusBrand1" @click="viewMore = !viewMore">
            {{ viewMore ? $t('homeAssets.viewLess') : t$('homeAssets.viewMore') }}
          </a>
        </div>
      </v-col>
      <v-col cols="12" class="mt-10">
        <v-row class="mx-n2">
          <v-col cols="6" class="px-2">
            <v-btn block size="large" variant="text" @click="rejectAddToken">{{ $t('homeToken.cancel') }}</v-btn>
          </v-col>
          <v-col cols="6" class="px-2">
            <v-btn block size="large" color="torusBrand1" class="text-white" @click="approveAddToken">{{ $t('homeAssets.add') }}</v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import config from '../../../config'
import { CONTRACT_TYPE_ERC20 } from '../../../utils/enums'

export default {
  name: 'AddAssetConfirm',
  props: {
    address: {
      type: String,
      required: true,
    },
    symbol: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      default: '',
    },
    decimals: {
      type: Number,
      required: true,
    },
    balance: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: false,
      default: `${config.logosUrl}/eth.svg`,
    },

    type: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    explorerlink: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      logosUrl: config.logosUrl,
      viewMore: false,
      CONTRACT_TYPE_ERC20,
    }
  },
  mounted() {},
  methods: {
    approveAddToken() {
      this.$emit('triggerAddCustomToken')
    },
    rejectAddToken() {
      this.$emit('triggerRejectCustomToken')
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'AddAssetConfirm.scss';
</style>
