<template>
  <v-layout class="home-cards" wrap align-center>
    <v-flex class="xs12 sm6 px-4 my-4" v-for="(balance, index) in tokenBalances" :key="index" :style="`order: ${index > 0 ? index + 1 : index}`">
      <v-card color="card-shadow pb-6 pt-1">
        <v-card-text class="text_1--text py-6 px-6">
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
          <v-layout class="font-weight-regular text_2--text">
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
      <promotion-card
        title="Join us at User X Devcon After-Party"
        :image-path="`ethereum-rainbow.svg`"
        subtitle="11 Oct 2019 @ osaka"
        details-link="https://www.eventbrite.sg/e/user-x-devcon-after-party-tickets-74785051101"
      ></promotion-card>
    </v-flex>

    <v-flex class="xs12 sm6 px-4 my-4" v-if="isFreshAccount" style="order: 1">
      <PromotionCard title="Welcome to Torus." :image-path="`${$vuetify.theme.dark ? 'home-illustration' : 'learn-more'}.svg`">
        <template v-slot:subtitle>
          <v-dialog v-model="dialog" max-width="700">
            <template v-slot:activator="{ on }">
              <div class="body-2'">
                <a id="learn-more-btn" class="primary--text font-weight-bold" v-on="on">Learn more</a>
                about your wallet today.
              </div>
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
