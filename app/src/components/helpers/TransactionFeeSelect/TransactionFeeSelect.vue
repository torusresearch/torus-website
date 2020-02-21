<template>
  <v-layout wrap>
    <v-flex :class="isWalletTransfer ? 'xs12' : 'xs4 sm12'">
      <span class="text_1--text body-2">Transfer Fee</span>
    </v-flex>
    <v-flex :class="isWalletTransfer ? 'xs12' : 'xs8 sm12'">
      <v-layout class="mb-3">
        <v-flex xs12 class="others-pay">
          <v-chip class="others-pay-selected caption" :class="isWalletTransfer ? 'others-pay-selected--transfer' : ''" label large>
            <span>FREE (paid by Torus)</span>
          </v-chip>
          <!-- <v-menu transition="slide-y-transition" bottom>
            <template v-slot:activator="{ on }">
              <v-chip class="others-pay-selected" label large v-on="on">
                <span>FREE (paid by DApp)</span>
                <div class="flex-grow-1 text-right pr-2">
                  <v-icon right>$vuetify.icons.select</v-icon>
                </div>
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
          </v-menu> -->
        </v-flex>
      </v-layout>
      <!-- <v-layout mx-n2>
        <v-flex xs6 mx-2>
          <v-chip class="button-speed active text-center" :class="isWalletTransfer ? 'button-speed--transfer' : ''" label>
            <img :src="require(`../../../../public/img/icons/speed-bicycle.svg`)" class="mr-2" />
            <div>
              <div class="font-weight-bold button-speed__speed">~ 30Mins</div>
              <div class="text_2--text">0.12 USD</div>
            </div>
          </v-chip>
        </v-flex>
        <v-flex xs6 mx-2>
          <v-chip class="button-speed text-center" :class="isWalletTransfer ? 'button-speed--transfer' : ''" label>
            <img :src="require(`../../../../public/img/icons/speed-car.svg`)" class="mr-2" />
            <div>
              <div class="font-weight-bold button-speed__speed">~ 30Mins</div>
              <div class="text_2--text">0.12 USD</div>
            </div>
          </v-chip>
        </v-flex>
      </v-layout> -->
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  props: ['isWalletTransfer'],
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
