<template>
  <v-layout wrap align-center>
    <v-flex class="xs12 sm6 px-4 my-4" v-for="(balance, index) in tokenBalances" :key="index" :style="`order: ${index > 0 ? index + 1 : index}`">
      <v-card color="card-shadow pb-6 pt-1">
        <v-card-text class="torus_text--text py-6 px-6">
          <v-layout>
            <v-flex xs6>
              <img
                :src="require(`../../../../public/images/logos/${balance.logo}`)"
                class="inline-small d-inline-flex"
                onerror="if (this.src != 'eth.svg') this.src = 'images/logos/eth.svg';"
              />
              <span class="subtitle-1 ml-2 d-inline-flex">{{ balance.name }}</span>
            </v-flex>
            <v-flex xs6 class="text-right">
              {{ balance.formattedBalance }}
            </v-flex>
          </v-layout>
          <v-divider class="my-1"></v-divider>
          <v-layout class="font-weight-regular torus_text--text text--lighten-4">
            <v-flex xs6>
              {{ balance.currencyRateText }}
            </v-flex>
            <v-flex xs6 class="text-right">
              {{ balance.currencyBalance }}
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-flex>

    <v-flex class="xs12 sm6 px-4 my-4" v-if="!isFreshAccount" style="order: 1">
      <PromotionCard
        title="Check out the latest Dapp"
        subtitle="Visit Etheremon and start using ETH."
        link-text="Play Now"
        link-target="https://www.etheremon.com"
        image-path="learn-more.svg"
      >
        <template v-slot:image>
          <v-flex pt-4 class="text-right hidden-xs-only" :class="$vuetify.breakpoint.lgAndUp ? 'xs4' : 'xs3'">
            <img :src="require(`../../../../public/images/etheremon.png`)" style="width: 100%" />
          </v-flex>
        </template>
      </PromotionCard>
    </v-flex>

    <v-flex class="xs12 sm6 px-4 my-4" v-if="isFreshAccount" style="order: 1">
      <PromotionCard title="Welcome to Torusss." subtitle="Learn more about your wallet today." image-path="learn-more.svg">
        <template v-slot:link>
          <v-dialog v-model="dialog" max-width="700">
            <template v-slot:activator="{ on }">
              <v-btn color="primary" depressed class="px-12 py-1 mt-4" v-on="on">Learn more</v-btn>
            </template>
            <LearnMore @onClose="dialog = false" />
          </v-dialog>
        </template>
      </PromotionCard>
    </v-flex>
  </v-layout>
</template>

<script>
import LearnMore from '../LearnMore'
import PromotionCard from '../PromotionCard'

export default {
  props: ['tokenBalances', 'selected', 'isFreshAccount'],
  data() {
    return {
      pagination: {
        sortBy: 'name'
      },
      dialog: false
    }
  },
  components: {
    LearnMore,
    PromotionCard
  },
  computed: {
    showFooter() {
      return this.tokenBalances.length > 5
    }
  },
  methods: {
    changeSort(column) {
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending
      } else {
        this.pagination.sortBy = column
        this.pagination.descending = false
      }
    },
    selectEmit(item) {
      this.$emit('update:select', item)
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'TokenBalancesTable.scss';
</style>
