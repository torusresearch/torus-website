<template>
  <v-layout wrap class="badges-container">
    <v-flex xs12>
      <div class="display-1" :class="$vuetify.theme.dark ? 'torusGray2--text' : 'text_2--text'">Getting Started</div>
    </v-flex>
    <v-flex xs12 mt-6>
      <v-layout :wrap="$vuetify.breakpoint.xsOnly" mx-n4>
        <v-flex v-for="badge in badges" :key="badge.title" xs12 sm3 mx-4 mb-4>
          <v-card class="badge elevation-1 py-2">
            <div class="d-flex px-4 align-top">
              <div :style="{ lineHeight: '0px' }">
                <img :src="require(`../../../../public/img/icons/${badge.image}.svg`)" />
              </div>
              <div class="pt-1 ml-2">
                <div class="subtitle-2 badge__title" v-html="badge.title" />
                <div v-if="badge.link" class="badge__link">
                  <a href="#">{{ badge.linkText }}</a>
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
export default {
  data() {
    return {
      badges: [
        {
          title: 'Torus Wallet Account Created',
          image: 'badge-wallet-created',
          link: '',
          linkText: 'Go to Top-up Page',
        },
        {
          title: 'Top-up your<br/>Wallet',
          image: 'badge-topped-wallet',
          link: '#',
          linkText: 'Go to Top-up Page',
        },
        {
          title: 'Conduct First<br/>Transaction',
          image: 'badge-first-transaction',
          link: '#',
          linkText: 'Go to Transfer Page',
        },
        {
          title: 'Get your first collectible from OpenSea',
          image: 'badge-first-collectible',
          link: '#',
          linkText: 'Go to OpenSea',
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
@import 'Badges.scss';
</style>
