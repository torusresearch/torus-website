<template>
  <v-flex xs12 sm6 mb-3 px-3>
    <v-card class="mb-2">
      <v-container fluid class="py-2">
        <v-layout row wrap>
          <div class="provider torus_text--text text--lighten-4">
            <div class="provider-checkbox">
              <input type="radio" v-model="provider" value="simplex" name="test-radio" id="test-simplex" />
              <img :src="require(`../../public/images/logos/simplex-logo.png`)" class="provider-logo" />
            </div>
            <div class="provider-description">
              <small class="d-block">Pay with Credit Card</small>
              <small class="d-block">
                <span class="font-weight-bold">Simplex Servcice Fee:</span>
                5% or 10 USD
              </small>
              <small class="d-block">(whichever higher)</small>
            </div>
          </div>
        </v-layout>
      </v-container>
    </v-card>

    <v-tooltip right>
      <template v-slot:activator="{ on }">
        <v-card class="coming-soon mb-2" v-on="on">
          <v-container fluid class="py-2">
            <v-layout row wrap>
              <div class="provider">
                <div class="provider-checkbox">
                  <input type="radio" disabled v-model="provider" value="wyre" name="test-radio" id="test-simplex" />
                  <img :src="require(`../../public/images/logos/wyre-logo.svg`)" class="provider-logo" />
                </div>
                <div class="provider-description">
                  <small class="d-block">Pay with Credit Card or Wire Transfer</small>
                  <small class="d-block">
                    <span class="font-weight-bold">Wyre Service Fee :</span>
                    Varies
                  </small>
                </div>
              </div>
            </v-layout>
          </v-container>
        </v-card>
      </template>
      <span>Coming Soon</span>
    </v-tooltip>

    <v-tooltip right>
      <template v-slot:activator="{ on }">
        <v-card class="coming-soon mb-2" v-on="on">
          <v-container fluid class="py-2">
            <v-layout row wrap>
              <div class="provider">
                <div class="provider-checkbox">
                  <input type="radio" disabled v-model="provider" value="wyre" name="test-radio" id="test-simplex" />
                  <img :src="require(`../../public/images/logos/crypto-logo.png`)" class="provider-logo" />
                </div>
                <div class="provider-description">
                  <small class="d-block">Pay with Credit Card or Wire Transfer</small>
                  <small class="d-block">
                    <span class="font-weight-bold">crypto.com Service Fee :</span>
                    Varies
                  </small>
                </div>
              </div>
            </v-layout>
          </v-container>
        </v-card>
      </template>
      <span>Coming Soon</span>
    </v-tooltip>

    <v-tooltip right>
      <template v-slot:activator="{ on }">
        <v-card class="coming-soon mb-2" v-on="on">
          <v-container fluid class="py-2">
            <v-layout row wrap>
              <div class="provider">
                <div class="provider-checkbox">
                  <input type="radio" disabled v-model="provider" value="wyre" name="test-radio" id="test-simplex" />
                  <img :src="require(`../../public/images/logos/moon-pay-logo.svg`)" class="provider-logo" />
                </div>
                <div class="provider-description">
                  <small class="d-block">Pay with Credit Card</small>
                  <small class="d-block">
                    <span class="font-weight-bold">MoonPay Service Fee :</span>
                    4.5% or 5 USD
                  </small>
                </div>
              </div>
            </v-layout>
          </v-container>
        </v-card>
      </template>
      <span>Coming Soon</span>
    </v-tooltip>

    <div class="mt-3 py-3 px-1 text-gray caption">
      <div>Prefer other mode of payment?</div>
      <div>
        <a mailto="">Write to us</a>
        and we would try out best to improve and serve you better
      </div>
    </div>
  </v-flex>
</template>

<script>
export default {
  data() {
    return {
      provider: ''
    }
  },
  watch: {
    provider() {
      this.$emit('onSelectProvider', this.provider)
    }
  }
}
</script>

<style lang="scss" scoped>
.coming-soon {
  opacity: 0.4;
}
</style>
