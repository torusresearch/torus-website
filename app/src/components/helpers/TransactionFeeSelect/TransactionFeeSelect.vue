<template>
  <v-layout wrap>
    <v-flex xs4>
      <div class="text_1--text caption mt-2">Transaction Fee</div>
    </v-flex>
    <v-flex xs8>
      <v-layout v-if="freeTransaction">
        <v-flex xs12 class="others-pay">
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
      </v-layout>
      <v-layout mx-n2 v-else>
        <v-flex xs6 mx-2>
          <v-chip class="button-speed active" label v-on="on">
            <img :src="require(`../../../../public/img/icons/speed-bicycle.svg`)" />
            <div class="text-center">
              <div class="font-weight-bold button-speed__speed">~ 30Mins</div>
              <div class="text_2--text">0.12 USD</div>
            </div>
          </v-chip>
        </v-flex>
        <v-flex xs6 mx-2>
          <v-chip class="button-speed" label v-on="on">
            <img :src="require(`../../../../public/img/icons/speed-car.svg`)" />
            <div class="text-center">
              <div class="font-weight-bold button-speed__speed">~ 30Mins</div>
              <div class="text_2--text">0.12 USD</div>
            </div>
          </v-chip>
        </v-flex>
      </v-layout>
    </v-flex>
    <v-flex xs12 class="text-right mt-1 button-speed__edit">
      <span>Edit</span>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      freeTransaction: false
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'TransactionFeeSelect.scss';
</style>
