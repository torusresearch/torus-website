<template>
  <v-dialog v-model="addTokenDialog" max-width="375" persistent>
    <template v-slot:activator="{ on }">
      <a class="torusBrand1--text caption font-weight-medium gtm-add-token-cta" v-on="on">{{ t('homeToken.addTokenHere') }}</a>
    </template>
    <v-card class="add-token">
      <v-tabs-items v-model="tab" touchless>
        <v-tab-item>
          <v-layout class="card-header" wrap>
            <v-flex text-center xs12 py-10 px-6>
              <div class="display-1">{{ t('homeToken.addTokens') }}</div>
              <v-btn class="close-btn" icon aria-label="Close Add Token" title="Close Add Token" @click="closeForm">
                <v-icon>$vuetify.icons.close</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
          <v-form ref="addTokenForm" v-model="addTokenFormValid" lazy-validation @submit.prevent="nextTab">
            <v-layout mx-6 py-6 wrap>
              <v-flex xs12>
                <div class="body-2 mb-2">{{ t('homeToken.contract') }}</div>
                <v-text-field v-model="customAddress" :rules="[rules.required]" outlined></v-text-field>
              </v-flex>
              <v-flex xs12>
                <div class="body-2 mb-2">{{ t('homeToken.symbol') }}</div>
                <v-text-field v-model="customSymbol" :rules="[rules.required]" outlined></v-text-field>
              </v-flex>
              <v-flex xs12>
                <div class="body-2 mb-2">{{ t('homeToken.decimal') }}</div>
                <v-text-field v-model="customDecimals" :rules="[rules.required]" type="number" outlined></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout wrap mx-6>
              <v-flex xs12 my-10>
                <v-layout mx-n2>
                  <v-flex xs6 px-2>
                    <v-btn block large text @click="closeForm">{{ t('homeToken.cancel') }}</v-btn>
                  </v-flex>
                  <v-flex xs6 px-2>
                    <v-btn block large color="torusBrand1" class="white--text" type="submit" :disabled="!addTokenFormValid">
                      {{ t('homeToken.next') }}
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-form>
        </v-tab-item>
        <v-tab-item>
          <v-layout class="card-header" wrap>
            <v-flex text-center xs12 py-10 px-6>
              <div class="display-1">{{ t('homeToken.addTokens') }}</div>
              <v-btn class="close-btn" icon aria-label="Close Add Token" title="Close Add Token" @click="closeForm">
                <v-icon>$vuetify.icons.close</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
          <v-layout mx-6 pt-6 pb-4 wrap>
            <v-flex xs12>
              <div class="title">{{ t('homeToken.likeToAddToken') }}</div>
            </v-flex>
          </v-layout>
          <v-divider></v-divider>
          <v-layout mb-15 mx-6 py-6 wrap class="align-center">
            <v-flex xs8 mb-3>
              <div class="body-2 font-weight-bold">{{ t('homeToken.token') }}</div>
            </v-flex>
            <v-flex xs4 text-right mb-3>
              <div class="body-2 font-weight-bold">{{ t('homeToken.balance') }}</div>
            </v-flex>
            <v-flex xs8>
              <div class="d-flex align-center">
                <img
                  src="https://images.toruswallet.io/usdt.svg"
                  onerror="if (!this.src.includes('images/logos/eth.svg')) this.src = '/images/logos/eth.svg';"
                  alt="usdt.svg"
                  width="36"
                />
                <div class="ml-2 body-1">Tether USD</div>
              </div>
            </v-flex>
            <v-flex xs4 text-right>
              <div class="body-2">4.047 USDT</div>
            </v-flex>
          </v-layout>
          <v-layout wrap mx-6>
            <v-flex xs12 my-10>
              <v-layout mx-n2>
                <v-flex xs6 px-2>
                  <v-btn block large text @click="tab = 0">{{ t('homeToken.back') }}</v-btn>
                </v-flex>
                <v-flex xs6 px-2>
                  <v-btn block large color="torusBrand1" class="white--text" type="button" :disabled="!addTokenFormValid" @click="addToken">
                    {{ t('homeToken.addToken') }}
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      tab: 0,
      addTokenDialog: false,
      addTokenFormValid: false,
      customAddress: '',
      customSymbol: '',
      customDecimals: 0,
      rules: {
        required: (value) => !!value || this.t('walletSettings.required'),
      },
    }
  },
  methods: {
    addToken() {
      // eslint-disable-next-line no-console
      console.log('🚀 ~ addToken ~ trigger add token action')
      this.closeForm()
    },
    nextTab() {
      if (this.$refs.addTokenForm.validate()) {
        this.tab = 1
      }
    },
    closeForm() {
      this.addTokenDialog = false
      this.tab = 0
      this.$refs.addTokenForm.reset()
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'AddToken.scss';
</style>
