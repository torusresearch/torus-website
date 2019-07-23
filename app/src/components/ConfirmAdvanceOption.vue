<template>
  <v-card class="advance-option">
    <v-card-text class="torus_text--text">
      <v-container>
        <v-layout wrap row>
          <v-flex xs12 px-3>
            <div class="text-black font-weight-bold headline mb-2">
              Transaction
              <img :src="require('../../public/img/icons/transaction.svg')" class="ml-2" />
            </div>
            <div class="font-weight-bold subtitle-2">Customize Gas</div>
          </v-flex>
          <v-flex xs12 mt-3>
            <v-form ref="advanceOptionForm" v-model="advanceOptionFormValid" @submit.prevent="saveOptions" lazy-validation>
              <v-layout row wrap>
                <v-flex xs12 px-3>
                  <span class="subtitle-2">Gas Price (GWEI)</span>
                  <v-select outlined placeholder="Select Value" class="subtitle-2 form-selector" append-icon="$vuetify.icons.select"></v-select>
                </v-flex>
                <v-flex xs12 px-3>
                  <span class="subtitle-2">Gas Value</span>
                  <v-select outlined placeholder="Select Limit" class="subtitle-2 form-selector" append-icon="$vuetify.icons.select"></v-select>
                </v-flex>

                <v-flex xs12 px-3>
                  <v-layout>
                    <v-flex xs6>
                      <span class="subtitle-2">Send Amount</span>
                    </v-flex>
                    <v-flex xs6 class="text-xs-right">
                      1.00 ETH
                    </v-flex>
                  </v-layout>
                  <v-divider class="my-1"></v-divider>
                  <v-layout>
                    <v-flex xs6>
                      <span class="subtitle-2">Transaction Fee</span>
                    </v-flex>
                    <v-flex xs6 class="text-xs-right">
                      0.00 ETH
                    </v-flex>
                  </v-layout>
                  <v-divider class="my-1"></v-divider>
                  <v-layout mt-5>
                    <v-flex xs6>
                      <span class="subtitle-2">New Total</span>
                    </v-flex>
                    <v-flex xs6 class="title font-weight-bold primary--text text-xs-right">
                      1.00 ETH
                    </v-flex>
                  </v-layout>
                  <v-divider class="my-1"></v-divider>
                </v-flex>
              </v-layout>
            </v-form>
          </v-flex>
        </v-layout>
        <v-layout mt-3>
          <v-flex xs6>
            <v-btn block text large @click="onCancel">
              Cancel
            </v-btn>
          </v-flex>
          <v-flex xs6>
            <v-btn block depressed large color="primary" class="ml-2" @click="submit">
              Save
            </v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  methods: {
    onCancel(step) {
      this.$emit('onClose')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../scss/nav-selector.mixin';

.advance-option {
  .form-selector {
    @include navSelector();
    display: flex;
  }
}
</style>
