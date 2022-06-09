<template>
  <v-card class="add-token">
    <v-layout class="card-header" wrap>
      <v-flex text-center xs12 py-10 px-6>
        <div class="display-1">{{ isHideMode ? t('homeToken.hideTokens') : t('homeToken.addTokens') }}</div>
      </v-flex>
    </v-layout>
    <v-layout mx-6 pt-6 pb-4 wrap>
      <v-flex xs12>
        <div class="title">{{ isHideMode ? t('homeToken.likeToHideToken') : t('homeToken.likeToAddToken') }}</div>
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
    <v-layout v-if="isHideMode" mb-15 mx-6 wrap>
      <v-flex xs12>
        <div class="body-2 text_2--text">{{ t('homeToken.hideTokenDesc') }}</div>
      </v-flex>
    </v-layout>
    <v-layout mx-6 pt-6 pb-10 wrap :class="isHideMode ? '' : 'pt-15'">
      <v-flex xs12>
        <v-layout mx-n2>
          <v-flex xs6 px-2>
            <v-btn v-if="isHideMode" block large text @click="closeForm">{{ t('homeToken.cancel') }}</v-btn>
            <v-btn v-else block large text @click="tab = 0">{{ t('homeToken.back') }}</v-btn>
          </v-flex>
          <v-flex xs6 px-2>
            <v-btn v-if="isHideMode" block large color="torusBrand1" class="white--text" type="button" @click="rejectAddToken">
              {{ t('homeToken.hideToken') }}
            </v-btn>
            <v-btn v-else block large color="torusBrand1" class="white--text" type="button" @click="approveAddToken">
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
  name: 'AddTokenConfirm',
  props: {
    address: {
      type: String,
      required: true,
    },
    symbol: {
      type: String,
      required: true,
    },
    decimals: {
      type: String,
      required: true,
    },
    balance: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
      default: `${this.logosUrl}/eth.svg`,
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
      const params = {}
      this.$emit('triggerAddCustomToken', params)
    },
    rejectAddToken() {
      const params = {}
      this.$emit('triggerRejectCustomToken', params)
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'AddTokenConfirm.scss';
</style>
