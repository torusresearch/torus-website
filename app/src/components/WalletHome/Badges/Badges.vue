<template>
  <v-layout wrap class="badges-container">
    <v-flex xs12>
      <div class="display-1" :class="$vuetify.theme.dark ? 'torusGray2--text' : 'text_2--text'">Getting Started</div>
    </v-flex>
    <v-flex xs12 mt-6>
      <v-layout :wrap="$vuetify.breakpoint.xsOnly" mx-n4>
        <v-flex v-for="badge in badges" :key="badge.title" xs12 sm3 mx-4 mb-4>
          <v-card class="badge elevation-1 py-3">
            <div class="d-flex px-4 align-top">
              <div :style="{ lineHeight: '0px' }">
                <img :src="require(`../../../assets/images/${badge.image}${badge.completed ? '-active' : ''}.svg`)" />
              </div>
              <div class="pt-1 ml-2">
                <div class="subtitle-2 badge__title" v-html="badge.title" />
                <div v-if="badge.link" class="badge__link">
                  <a v-if="badge.external" :href="badge.link" target="_blank" rel="noreferrer noopener">{{ badge.linkText }}</a>
                  <router-link v-else :to="badge.link" tag="a">{{ badge.linkText }}</router-link>
                </div>
              </div>
            </div>
          </v-card>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'

import { BADGES_COLLECTIBLE, BADGES_TOPUP, BADGES_TRANSACTION } from '../../../utils/enums'

export default {
  computed: {
    ...mapState({
      badgesCompletion: 'badgesCompletion',
    }),
    badges() {
      return [
        {
          title: this.t('walletHome.walletCreated'),
          image: 'badge-wallet-created',
          link: '',
          linkText: '',
          completed: true,
          external: false,
        },
        {
          title: this.t('walletHome.topUpWallet'),
          image: 'badge-topped-wallet',
          link: '/wallet/topup',
          linkText: this.t('walletHome.goToTopUp'),
          completed: this.badgesCompletion[BADGES_TOPUP],
          external: false,
        },
        {
          title: this.t('walletHome.conductFirstTransaction'),
          image: 'badge-first-transaction',
          link: '/wallet/transfer',
          linkText: this.t('walletHome.goToTransfer'),
          completed: this.badgesCompletion[BADGES_TRANSACTION],
          external: false,
        },
        {
          title: this.t('walletHome.getFirstCollectible'),
          image: 'badge-first-collectible',
          link: 'https://opensea.io/',
          linkText: this.t('walletHome.goToOpensea'),
          completed: this.badgesCompletion[BADGES_COLLECTIBLE],
          external: true,
        },
      ]
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'Badges.scss';
</style>
