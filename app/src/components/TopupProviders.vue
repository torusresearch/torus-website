<template>
  <v-flex xs12 sm6 mb-4 px-4 class="topup-providers">
    <v-card class="mb-2" @click="provider = 'simplex'">
      <v-container fluid class="py-2">
        <v-layout wrap>
          <div class="provider torus_text--text text--lighten-4">
            <div class="provider-checkbox">
              <v-icon color="primary" v-if="provider === 'simplex'">$vuetify.icons.radio_checked</v-icon>
              <v-icon color="grey" v-else>$vuetify.icons.radio_unchecked</v-icon>
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
            <v-layout wrap>
              <div class="provider">
                <div class="provider-checkbox">
                  <input type="radio" disabled v-model="provider" value="wyre" name="test-radio" />
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
            <v-layout wrap>
              <div class="provider">
                <div class="provider-checkbox">
                  <input type="radio" disabled v-model="provider" value="wyre" name="test-radio" />
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
            <v-layout wrap>
              <div class="provider">
                <div class="provider-checkbox">
                  <input type="radio" disabled v-model="provider" value="wyre" name="test-radio" />
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

    <div class="mt-4 py-4 px-1 text-gray caption">
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
.topup-providers {
  .coming-soon {
    opacity: 0.4;
  }

  .provider {
    min-height: 63px;
    width: 100%;

    &-checkbox {
      display: flex;
      align-items: center;
    }

    &-description {
      padding-left: 3rem;
    }

    &-logo {
      max-height: 40px;
      margin-bottom: 20px;
      margin-left: 10px;
    }
  }

  @media screen and (min-width: 768px) {
    .provider {
      display: flex;
      align-items: center;
      justify-content: space-between;

      &-description {
        text-align: right;
        padding-left: 0;
      }

      &-logo {
        margin-bottom: 0;
      }
    }
  }
}

.v-tooltip__content {
  background: #fff;
  border: 1px solid var(--v-primary-base);
  color: var(--v-primary-base);
  &::after {
    content: ' ';
    position: absolute;
    transform: rotate(90deg);
    top: 50%;
    left: 0%;
    margin-left: -10px;
    margin-top: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: var(--v-primary-base) transparent transparent transparent;
  }
}
</style>
