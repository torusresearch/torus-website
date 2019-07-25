<template>
  <v-layout row wrap align-center>
    <v-flex class="xs12 sm6 px-3 my-3" v-for="(balance, index) in tokenBalances" :key="index" :style="`order: ${index > 0 ? index + 1 : index}`">
      <v-card color="card-shadow pb-4 pt-1">
        <v-card-text class="torus_text--text py-4 px-4">
          <v-layout>
            <v-flex xs6>
              <img
                :src="require(`../../public/images/logos/${balance.logo}`)"
                class="inline-small d-inline-flex"
                onerror="if (this.src != 'eth.svg') this.src = 'images/logos/eth.svg';"
              />
              <span class="subtitle-1 ml-2 d-inline-flex">{{ balance.name }}</span>
            </v-flex>
            <v-flex xs6 class="text-xs-right">
              {{ balance.formattedBalance }}
            </v-flex>
          </v-layout>
          <v-divider class="my-1"></v-divider>
          <v-layout class="font-weight-regular torus_text--text text--lighten-4">
            <v-flex xs6>
              {{ balance.currencyRateText }}
            </v-flex>
            <v-flex xs6 class="text-xs-right">
              {{ balance.currencyBalance }}
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-flex>

    <v-flex class="xs12 sm6 px-3 my-3" v-if="!isFreshAccount" style="order: 1">
      <v-card color="dark card-shadow" white>
        <v-card-text class="pt-1 pb-3 px-4">
          <v-layout row align-center>
            <v-flex xs8 class="body-1 pt-3">
              <span class="font-weight-bold">Check out the latest Dapp</span>
              <br />
              Visit Etheremon and start using ETH.
              <v-btn color="primary" depressed class="px-5 py-1 mt-3 white--text" href="https://www.etheremon.com" target="_blank">Play Now</v-btn>
            </v-flex>
            <v-flex xs4 pt-3 class="text-xs-right">
              <img :src="require(`../../public/images/etheremon.png`)" style="width: 100%" />
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-flex>

    <v-flex class="xs12 sm6 px-3 my-3" v-if="isFreshAccount">
      <v-card color="dark card-shadow" white>
        <v-card-text class="pt-1 pb-3 px-4">
          <v-layout row>
            <v-flex xs8 class="body-1 pt-3">
              <span class="font-weight-bold">Welcome to Torus.</span>
              <br />
              Learn more about your wallet today.
              <v-dialog v-model="dialog" max-width="700">
                <template v-slot:activator="{ on }">
                  <v-btn color="primary" depressed class="px-5 py-1 mt-3" v-on="on">Learn more</v-btn>
                </template>
                <LearnMore @onClose="dialog = false" />
              </v-dialog>
            </v-flex>
            <v-flex xs4 pt-3 class="text-xs-right">
              <img :src="require(`../../public/images/learn-more.svg`)" style="height: 100px" />
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import LearnMore from '../components/LearnMore'

export default {
  props: ['headers', 'tokenBalances', 'selected', 'isFreshAccount'],
  data() {
    return {
      pagination: {
        sortBy: 'name'
      },
      dialog: false
    }
  },
  components: {
    LearnMore
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
.inline-small {
  width: 20px;
  height: 25px;
  display: inline-block;
  vertical-align: middle;
}
</style>
