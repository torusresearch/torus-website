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

    <v-flex class="xs12 sm6 px-4 my-4" v-for="(event, i) in isFreshAccount ? [] : events" :key="`event-${i}`" style="order: 1">
      <promotion-card
        :title="event.EventName"
        :image-path="event.ImageUrl"
        :subtitle="event.Description"
        :details-link="event.CallToActionLink"
        :details-text="event.CallToActionText"
      ></promotion-card>
    </v-flex>

    <v-flex class="xs12 sm6 px-4 my-4" v-if="isFreshAccount" style="order: 1">
      <v-card class="card-shadow">
        <v-card-text class="pt-0" :class="$vuetify.breakpoint.lgAndUp ? 'pb-2 px-8' : 'pb-3 px-6'">
          <v-layout>
            <v-flex class="text_1--text pt-4" :class="$vuetify.breakpoint.xsOnly ? 'xs12 text-center' : $vuetify.breakpoint.lgAndUp ? 'xs8' : 'xs9'">
              <div class="body-1 font-weight-bold">Welcome to Torus.</div>
              <v-dialog v-model="dialog" max-width="700">
                <template v-slot:activator="{ on }">
                  <div class="body-2'">
                    <a id="learn-more-btn" class="primary--text font-weight-bold" v-on="on">Learn more</a>
                    about your wallet today.
                  </div>
                </template>
                <LearnMore @onClose="dialog = false" />
              </v-dialog>
            </v-flex>
            <v-flex xs4 pt-4 class="text-right hidden-xs-only">
              <img :src="require(`../../../../public/images/${$vuetify.theme.dark ? 'home-illustration' : 'learn-more'}.svg`)" style="height: 90px" />
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import LearnMore from '../LearnMore'
import PromotionCard from '../PromotionCard'
import config from '../../../config'
import { get } from '../../../utils/httpHelpers'
const baseRoute = config.baseRoute

export default {
  props: ['tokenBalances', 'selected', 'isFreshAccount'],
  data() {
    return {
      pagination: {
        sortBy: 'name'
      },
      events: [],
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
    },
    fetchEvents(apikey) {
      const currentUrl = new URL(baseRoute)
      const subdomain = currentUrl.hostname === 'localhost' ? 'develop' : currentUrl.hostname.split('.')[0]

      const url = new URL('https://api.airtable.com/v0/appVd9rIDGbdmcnPj/Billboard')
      url.searchParams.append('filterByFormula', `AND(Domain = '${subdomain}', NOT(IS_BEFORE(TODAY(), DateLive)))`)
      get(url, {
        headers: {
          Authorization: `Bearer ${apikey}`
        }
      }).then(events => {
        this.events = events.records.map(event => {
          event.fields.ImageUrl =
            event.fields.Image.length > 0 && false
              ? event.fields.Image[0].url
              : require(`../../../../public/images/${this.$vuetify.theme.dark ? 'home-illustration' : 'learn-more'}.svg`)
          return event.fields
        })
      })
    }
  },
  created() {
    const jwtToken = this.$store.state.jwtToken

    get(`${config.api}/keys/airtable`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`
      }
    }).then(resp => {
      this.fetchEvents(resp.data)
    })
  }
}
</script>

<style lang="scss" scoped>
@import 'TokenBalancesTable.scss';
</style>
