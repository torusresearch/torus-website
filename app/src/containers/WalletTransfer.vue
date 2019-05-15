<template>
  <v-container fill-height>
    <v-layout row wrap align-start align-content-start justify-center>
      <v-flex xs12 offset-sm2>
        <span>
          <span class="spanWrapSvgStyle">
            <img :src="require('../../public/images/coins.svg')" alt="Wallet" class="svg-setting-small" />
          </span>
          <span class="headline"> Transaction Request</span>
        </span>
      </v-flex>
      <v-flex offset-sm2 sm8>
        <v-card flat :color="$vuetify.theme.torus_bcg" class="fill-height">
          <v-container fill-height align-content-space-around>
            <v-layout row align-center justify-center>
              <v-flex xs12 sm6>
                <span class="body-2">Selected Coin </span>
              </v-flex>
              <v-flex xs8 sm4 align-self-center>
                <v-select
                  single-line
                  solo
                  flat
                  :items="finalBalancesArray"
                  :value="selectedItem"
                  label="Coin"
                  class="setheight"
                  id="selectBox"
                  @change="selectedItemChanged"
                >
                  <template v-slot:item="props">
                    <v-layout row wrap align-center justify-center>
                      <v-flex xs2>
                        <img
                          :src="require(`../../public/images/logos/${props.item.logo}`)"
                          class="inline-small"
                          onerror="if (this.src != 'eth.svg') this.src = 'images/logos/eth.svg';"
                        />
                      </v-flex>
                      <v-flex xs10 align-self-center> {{ props.item.name }} </v-flex>
                    </v-layout>
                  </template>
                  <template v-slot:selection="props">
                    <v-layout row wrap align-bottom justify-center>
                      <v-flex xs2>
                        <img
                          :src="require(`../../public/images/logos/${props.item.logo}`)"
                          class="inline-small"
                          onerror="if (this.src != 'eth.svg') this.src = 'images/logos/eth.svg';"
                        />
                      </v-flex>
                      <v-flex xs10 align-self-end> {{ props.item.name }} </v-flex>
                    </v-layout>
                  </template>
                </v-select>
              </v-flex>
              <v-flex xs4 sm2>
                <span style="margin-left: 5px;">{{ selectedItem && selectedItem.currencyRateText }}</span>
              </v-flex>
              <v-flex xs12 sm6>
                <span class="body-2">Enter to Address</span>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field
                  placeholder="Enter address to send token to"
                  aria-label="to Address"
                  v-model="toAddress"
                  solo
                  required
                  :rules="[rules.toAddress, rules.required]"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <span class="body-2">Enter Amount</span>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field
                  id="amount"
                  placeholder="Enter token amount to send"
                  aria-label="quantity"
                  solo
                  required
                  v-model="amount"
                  :rules="[rules.required]"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import torus from '../torus'

export default {
  name: 'walletTransfer',
  props: ['address'],
  data() {
    return {
      tokenAddress: '0x',
      amount: '',
      toAddress: '',
      rules: {
        toAddress: value => torus.web3.utils.isAddress(value) || 'Invalid Eth Address',
        required: value => !!value || 'Required'
      }
    }
  },
  computed: {
    finalBalancesArray() {
      return this.$store.getters.tokenBalances.finalBalancesArray || []
    },
    selectedItem() {
      const foundElement = this.finalBalancesArray.find(x => x.tokenAddress === this.selectedAddress)
      return foundElement
    },
    selectedAddress() {
      if (this.tokenAddress === '0x' || !torus.web3.utils.isAddress(this.tokenAddress)) return '0x'
      return torus.web3.utils.toChecksumAddress(this.tokenAddress)
    }
  },
  methods: {
    selectedItemChanged(value) {
      console.log(value)
      this.tokenAddress = value.tokenAddress
    }
  },
  created() {
    this.tokenAddress = this.address
    console.log(this.address)
  }
}
</script>

<style lang="scss">
@mixin svg-size($args...) {
  @each $name, $size in keywords($args) {
    .svg-setting-#{$name} {
      width: $size;
      height: $size;
    }
  }
}

@include svg-size($tiny: 18px, $small: 24px, $medium: 38px, $large: 80px);

.spanWrapSvgStyle {
  display: inline-flex;
  @extend %justify-align;
}

%justify-align {
  justify-content: start;
  align-items: center;
}

.text-bluish {
  color: var(--v-torus_blue-base);
}

.inline-small {
  width: 25px;
  height: 25px;
  display: inline-block;
  vertical-align: middle;
}

.v-text-field--solo .v-input__slot,
.v-text-field--outline .v-input__slot {
  min-height: auto !important;
  display: flex !important;
  align-items: flex-end !important;
  border-radius: 17px !important;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.16);
  margin-bottom: 0px;
}

.v-text-field.v-text-field--solo .v-input__control {
  min-height: auto !important;
}

.v-text-field__details {
  display: none;
}
</style>
