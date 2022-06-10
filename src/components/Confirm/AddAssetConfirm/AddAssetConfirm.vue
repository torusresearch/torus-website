<template>
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
  },
  data() {
    return {
      logosUrl: config.logosUrl,
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
