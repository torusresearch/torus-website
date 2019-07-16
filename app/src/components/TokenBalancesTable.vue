<template>
  <v-layout row wrap align-center>
    <v-flex class="xs12 sm6 px-3 my-3" v-for="(balance, index) in tokenBalances" :key="index" :style="`order: ${index > 0 ? index + 1 : index}`">
      <v-card color="dark card-shadow" white>
        <v-card-title class="font-weight-bold subtitle-2 pt-4 pb-0 px-4">COINS / TOKENS</v-card-title>
        <v-card-text class="headline font-weight-bold pt-1 pb-4 px-4">
          <v-flex xs12>
            <v-text-field hide-details readonly type="text" :value="balance.name">
              <template v-slot:prepend>
                <img
                  :src="require(`../../public/images/logos/${balance.logo}`)"
                  class="inline-small"
                  onerror="if (this.src != 'eth.svg') this.src = 'images/logos/eth.svg';"
                />
              </template>
              <template v-slot:append>
                {{ balance.formattedBalance }}
              </template>
            </v-text-field>
            <div class="v-text-field__details">
              <div class="v-messages theme--light">
                <div class="v-messages__wrapper">
                  <div class="v-messages__message pl-4 pt-1">
                    <span class="left font-weight-regular ml-3">{{ balance.currencyRateText }}</span>
                    <span class="right font-weight-regular mr-2">{{ balance.currencyBalance }}</span>
                  </div>
                </div>
              </div>
            </div>
          </v-flex>
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
              <v-dialog v-model="dialog" max-width="700" persistent>
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
