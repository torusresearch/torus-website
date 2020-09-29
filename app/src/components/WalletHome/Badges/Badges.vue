<template>
  <v-layout v-if="!allCompleted" wrap class="badges-container">
    <v-flex xs12>
      <div class="display-1" :class="$vuetify.theme.dark ? 'torusGray2--text' : 'text_2--text'">{{ t('walletHome.gettingStarted') }}</div>
    </v-flex>
    <v-flex xs12 mt-6>
      <v-layout wrap mx-n4>
        <v-flex v-for="badge in badges" :key="badge.title" class="xs12 sm6 md3 px-4 mb-4">
          <v-card class="badge elevation-1 py-3" :class="{ viewMd: $vuetify.breakpoint.mdOnly && !allCompleted }">
            <div class="d-flex px-4 align-top">
              <div :style="{ lineHeight: '0px' }">
                <img :src="require(`../../../assets/images/${badge.image}${badge.completed ? '-active' : ''}.svg`)" />
              </div>
              <div class="pt-1 ml-2">
                <div class="text-subtitle-2 font-weight-medium badge__title" v-html="badge.title" />
                <div v-if="!badge.completed && badge.link" class="badge__link">
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
          completed: this.badgesCompletion[BADGES_TOPUP] === undefined ? true : this.badgesCompletion[BADGES_TOPUP],
          external: false,
        },
        {
          title: this.t('walletHome.conductFirstTransaction'),
          image: 'badge-first-transaction',
          link: '/wallet/transfer',
          linkText: this.t('walletHome.goToTransfer'),
          completed: this.badgesCompletion[BADGES_TRANSACTION] === undefined ? true : this.badgesCompletion[BADGES_TRANSACTION],
          external: false,
        },
        {
          title: this.t('walletHome.getFirstCollectible'),
          image: 'badge-first-collectible',
          link: 'https://opensea.io/',
          linkText: this.t('walletHome.goToOpensea'),
          completed: this.badgesCompletion[BADGES_COLLECTIBLE] === undefined ? true : this.badgesCompletion[BADGES_COLLECTIBLE],
          external: true,
        },
      ]
    },
    allCompleted() {
      return this.badges.filter((badge) => !badge.completed).length === 0
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'Badges.scss';
</style>
