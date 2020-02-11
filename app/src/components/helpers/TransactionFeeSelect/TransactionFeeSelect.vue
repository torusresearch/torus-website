<template>
  <v-layout wrap>
    <v-flex xs4>
      <div :class="'text_2--text'" class="caption mt-4">Transaction Fee</div>
    </v-flex>
    <v-flex xs8>
      <v-layout mx-n2>
        <v-flex xs6 mx-2>
          <v-btn class="button-speed" block large depressed>
            <span>~ 30Mins Pay</span>
            <span>0.12 USD</span>
          </v-btn>
        </v-flex>
        <v-flex xs6 mx-2>
          <v-btn class="button-speed" block large depressed>
            <span>~ 30Mins Pay</span>
            <span>0.12 USD</span>
          </v-btn>
        </v-flex>
      </v-layout>
    </v-flex>
    <v-flex xs12 class="text-right">
      <span>Edit</span>
    </v-flex>
    <!-- <v-flex xs6>
      <span :class="$vuetify.theme.dark ? 'text_3--text' : 'text_2--text'" class="caption mb-2">
        Transaction Fee
      </span>
    </v-flex>
    <v-flex xs6 class="text-right">
      <span :class="$vuetify.theme.dark ? 'text_3--text' : 'text_2--text'" class="caption mb-2">
        Edit
      </span>
    </v-flex>
    <v-flex xs12 v-if="freeTransaction" class="others-pay">
      <v-menu transition="slide-y-transition" bottom>
        <template v-slot:activator="{ on }">
          <v-chip class="others-pay-selected" label outlined v-on="on">
            <span>FREE (paid by DApp) (~ 10mins)</span>
          </v-chip>
        </template>
        <v-list>
          <v-list-item>
            <v-list-item-icon class="ml-8 mr-1">
              <v-icon small left class="mr-2">$vuetify.icons.collectibles</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              ETH
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-flex>
    <v-flex v-else>
      <v-layout mx-n2>
        <v-flex xs6 mx-2>
          <v-btn class="button-speed" block large depressed>
            <span>~ 30Mins Pay</span>
            <span>0.12 USD</span>
          </v-btn>
        </v-flex>
        <v-flex xs6 mx-2>
          <v-btn class="button-speed" block large depressed>
            <span>~ 30Mins Pay</span>
            <span>0.12 USD</span>
          </v-btn>
        </v-flex>
      </v-layout>
    </v-flex> -->
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      freeTransaction: true
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'TransactionFeeSelect.scss';
</style>
