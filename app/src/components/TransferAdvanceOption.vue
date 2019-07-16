<template>
  <v-card class="advance-option">
    <v-card-text class="torus_text--text">
      <v-container>
        <v-layout wrap row>
          <v-flex xs12 px-3>
            <div class="font-weight-bold headline">Transfer Details</div>
            <div class="font-weight-bold subtitle-2">AdjustGas</div>
          </v-flex>
          <v-flex xs12 mt-3>
            <v-form ref="advanceOptionForm" v-model="advanceOptionFormValid" @submit.prevent="saveOptions" lazy-validation>
              <v-layout row wrap>
                <v-flex xs12 sm6 px-3>
                  <span class="subtitle-2">Gas Price (GWEI)</span>
                  <v-select outlined placeholder="Select Value" class="subtitle-2 form-selector" append-icon="$vuetify.icons.select"></v-select>
                </v-flex>
                <v-flex xs12 sm6 px-3>
                  <span class="subtitle-2">Gas Value</span>
                  <v-select outlined placeholder="Select Limit" class="subtitle-2 form-selector" append-icon="$vuetify.icons.select"></v-select>
                </v-flex>
                <v-flex xs12 sm6 px-3>
                  <span class="subtitle-2">Send Amount</span>
                  <v-text-field outlined readonly></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 px-3>
                  <span class="subtitle-2">Transaction Fee</span>
                  <v-text-field outlined readonly></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 px-3>
                  <span class="subtitle-2">New Total</span>
                  <v-text-field outlined readonly></v-text-field>
                </v-flex>
              </v-layout>
            </v-form>
          </v-flex>
        </v-layout>
        <v-layout mt-3 pr-3 row>
          <v-spacer></v-spacer>
          <v-btn large text @click="onCancel">Cancel</v-btn>
          <v-btn large color="primary" class="ml-3" type="submit">Save</v-btn>
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
