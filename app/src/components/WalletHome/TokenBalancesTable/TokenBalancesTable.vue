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
      <v-card color="dark card-shadow" white>
        <v-card-text class="pt-1 px-6" :class="$vuetify.breakpoint.lgAndUp ? 'pb-4' : 'pb-5'">
          <v-layout align-center>
            <v-flex class="pt-4" :class="$vuetify.breakpoint.xsOnly ? 'xs12 text-center' : $vuetify.breakpoint.lgAndUp ? 'xs8' : 'xs9'">
              <div class="body-1 font-weight-bold">Welcome to Torus</div>
              <div :class="$vuetify.breakpoint.lgAndUp ? 'body-2' : 'caption'">Win up to 10,000 USD at our online hackathon!</div>
              <div>
                <v-btn color="primary" depressed class="px-12 py-1 mt-4 white--text" href="http://torus4everyone2019.devpost.com" target="_blank">
                  Register Now
                </v-btn>
              </div>
            </v-flex>
            <v-flex xs4 pt-4 class="text-right hidden-xs-only">
              <img :src="require(`../../../../public/images/learn-more.svg`)" style="height: 100px" />
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-flex>

    <!-- <v-flex class="xs12 sm6 px-4 my-4" v-if="!isFreshAccount" style="order: 1">
      <v-card color="dark card-shadow" white>
        <v-card-text class="pt-1 px-6" :class="$vuetify.breakpoint.lgAndUp ? 'pb-4' : 'pb-5'">
          <v-layout align-center>
            <v-flex class="pt-4" :class="$vuetify.breakpoint.xsOnly ? 'xs12 text-center' : $vuetify.breakpoint.lgAndUp ? 'xs8' : 'xs9'">
              <div class="body-1 font-weight-bold">Check out the latest Dapp</div>
              <div :class="$vuetify.breakpoint.lgAndUp ? 'body-2' : 'caption'">Visit Etheremon and start using ETH.</div>
              <div>
                <v-btn color="primary" depressed class="px-12 py-1 mt-4 white--text" href="https://www.etheremon.com" target="_blank">Play Now</v-btn>
              </div>
            </v-flex>
            <v-flex pt-4 class="text-right hidden-xs-only" :class="$vuetify.breakpoint.lgAndUp ? 'xs4' : 'xs3'">
              <img :src="require(`../../../../public/images/etheremon.png`)" style="width: 100%" />
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-flex> -->

    <v-flex class="xs12 sm6 px-4 my-4" v-if="isFreshAccount">
      <v-card color="dark card-shadow" white>
        <v-card-text class="pt-1 pb-4 px-6">
          <v-layout>
            <v-flex class="pt-4" :class="$vuetify.breakpoint.xsOnly ? 'xs12 text-center' : 'xs8'">
              <span class="body-1 font-weight-bold">Welcome to Torus.</span>
              <br />
              <span class="body-2">Learn more about your wallet today.</span>
              <v-dialog v-model="dialog" max-width="700">
                <template v-slot:activator="{ on }">
                  <v-btn color="primary" depressed class="px-12 py-1 mt-4" v-on="on">Learn more</v-btn>
                </template>
                <LearnMore @onClose="dialog = false" />
              </v-dialog>
            </v-flex>
            <v-flex xs4 pt-4 class="text-right hidden-xs-only">
              <img :src="require(`../../../../public/images/learn-more.svg`)" style="height: 100px" />
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import LearnMore from '../LearnMore'

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
@import 'TokenBalancesTable.scss';
</style>
