<template>
  <div v-if="type === CONTRACT_TYPE_ERC20">
    <v-card class="add-token">
      <v-layout class="card-header" wrap>
        <v-flex text-center xs12 py-10 px-6>
          <div class="display-1">{{ t('homeToken.addTokens') }}</div>
        </v-flex>
      </v-layout>
      <v-layout mx-6 pt-6 pb-4 wrap>
        <v-flex xs12>
          <div class="title">{{ t('homeToken.likeToAddToken') }}</div>
        </v-flex>
      </v-layout>
      <v-divider></v-divider>
      <v-layout mb-8 mx-6 pt-6 wrap class="align-center">
        <v-flex xs8 mb-3>
          <div class="body-2 font-weight-bold">{{ t('homeToken.token') }}</div>
        </v-flex>
        <v-flex xs4 text-right mb-3>
          <div class="body-2 font-weight-bold">{{ t('homeToken.balance') }}</div>
        </v-flex>
        <v-flex xs8>
          <div class="d-flex align-center">
            <img :src="`${image}`" class="inline-small d-inline-flex" height="36" />
            <div class="ml-2 body-1">{{ name }}</div>
          </div>
        </v-flex>
        <v-flex xs4 text-right>
          <div class="body-2">{{ balance }}</div>
        </v-flex>
      </v-layout>
      <v-layout mx-6 pt-6 pb-10 wrap :class="'pt-15'">
        <v-flex xs12>
          <v-layout mx-n2>
            <v-flex xs6 px-2>
              <v-btn block large text @click="rejectAddToken">{{ t('homeToken.cancel') }}</v-btn>
            </v-flex>
            <v-flex xs6 px-2>
              <v-btn block large color="torusBrand1" class="white--text" type="button" @click="approveAddToken">
                {{ t('homeToken.addToken') }}
              </v-btn>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-card>
  </div>
  <div v-else>
    <v-layout class="card-header" wrap>
      <v-flex text-center xs12 py-10 px-6>
        <div class="display-1">{{ t('homeAssets.add') }}</div>
        <v-btn class="close-btn" icon aria-label="Close Add Token" title="Close Add Token" @click="rejectAddToken">
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
              :src="image"
              style="width: 136px; height: auto"
              onerror="if (!this.src.includes('/images/nft-placeholder.svg')) this.src = '/images/nft-placeholder.svg';"
            />
          </div>
          <div class="ml-auto flex-shrink-1" style="width: 136px">
            <div class="body-2 text_1--text mb-3">{{ name }}</div>
            <div class="caption text_1--text mb-1">{{ t('homeAssets.infoId') }}</div>
            <div class="caption text_3--text mb-2">{{ id }}</div>
            <div class="caption text_1--text mb-1">{{ t('homeAssets.infoContractAdd') }}</div>
            <div class="caption text_3--text">{{ address }}</div>
          </div>
        </div>
        <div class="caption text_1--text mb-3">{{ t('homeAssets.infoExplorer') }}</div>
        <div class="caption text_3--text mb-4">{{ explorerlink }}</div>
        <div class="caption text_1--text mb-3">{{ t('homeAssets.infoDesc') }}</div>
        <div class="caption text_3--text mb-1" :class="{ 'text-clamp-one': !viewMore }">{{ description }}</div>
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
            <v-btn block large color="torusBrand1" class="white--text" @click="approveAddToken">{{ t('homeAssets.add') }}</v-btn>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import config from '../../../config'

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
      type: Number,
      default: 0,
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
    }
  },
  computed: {
    ...mapState(['networkType']),
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
