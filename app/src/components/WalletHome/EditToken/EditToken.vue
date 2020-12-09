<template>
  <v-dialog v-model="addTokenDialog" max-width="375" persistent>
    <template v-slot:activator="{ on }">
      <v-btn v-if="isHideMode" icon x-small v-on="on">
        <v-icon class="white--text" x-small>$vuetify.icons.minus</v-icon>
      </v-btn>
      <a v-else class="torusBrand1--text caption font-weight-medium gtm-add-token-cta" v-on="on">{{ t('homeToken.addTokenHere') }}</a>
    </template>
    <v-card class="add-token">
      <v-tabs-items v-model="tab" touchless>
        <v-tab-item>
          <v-layout class="card-header" wrap>
            <v-flex text-center xs12 py-10 px-6>
              <div class="display-1">{{ isHideMode ? 'Hide Tokens' : t('homeToken.addTokens') }}</div>
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
              <div class="display-1">{{ isHideMode ? 'Hide Tokens' : t('homeToken.addTokens') }}</div>
              <v-btn class="close-btn" icon aria-label="Close Add Token" title="Close Add Token" @click="closeForm">
                <v-icon>$vuetify.icons.close</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
          <v-layout mx-6 pt-6 pb-4 wrap>
            <v-flex xs12>
              <div class="title">{{ isHideMode ? 'Would you like to hide this Token?' : t('homeToken.likeToAddToken') }}</div>
            </v-flex>
          </v-layout>
          <v-divider></v-divider>
          <v-layout mb-8 mx-6 pt-6 wrap class="align-center">
            <v-flex xs8 mb-3>
              <div class="body-2 font-weight-bold">{{ t('homeToken.token') }}</div>
            </v-flex>
            <v-flex xs4 text-right mb-3>
              <div class="body-2 font-weight-bold">{{ t('homeToken.balance') }}</div>
            </v-flex>
            <v-flex xs8>
              <div class="d-flex align-center">
                <img
                  :src="`${logosUrl}/${token.logo}`"
                  class="inline-small d-inline-flex"
                  onerror="if (!this.src.includes('images/logos/eth.svg')) this.src = '/images/logos/eth.svg';"
                  :alt="token.logo"
                  height="36"
                />
                <div class="ml-2 body-1">{{ token.name }}</div>
              </div>
            </v-flex>
            <v-flex xs4 text-right>
              <div class="body-2">{{ token.formattedBalance }}</div>
            </v-flex>
          </v-layout>
          <v-layout v-if="isHideMode" mb-15 mx-6 wrap>
            <v-flex xs12>
              <div class="body-2 text_2--text">You can add this Token back in the future by clicking on “Add Token” in the wallet homepage.</div>
            </v-flex>
          </v-layout>
          <v-layout wrap mx-6 :class="isHideMode ? '' : 'pt-15'">
            <v-flex xs12 my-10>
              <v-layout mx-n2>
                <v-flex xs6 px-2>
                  <v-btn v-if="isHideMode" block large text @click="closeForm">{{ t('homeToken.cancel') }}</v-btn>
                  <v-btn v-else block large text @click="tab = 0">{{ t('homeToken.back') }}</v-btn>
                </v-flex>
                <v-flex xs6 px-2>
                  <v-btn v-if="isHideMode" block large color="torusBrand1" class="white--text" type="button" @click="deleteToken">Hide Token</v-btn>
                  <v-btn v-else block large color="torusBrand1" class="white--text" type="button" @click="addToken">
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
import config from '../../../config'

export default {
  props: {
    isHideMode: {
      type: Boolean,
      default: false,
    },
    deleteToken: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  data() {
    return {
      tab: 0,
      addTokenDialog: false,
      addTokenFormValid: false,
      customAddress: '',
      customSymbol: '',
      customDecimals: 0,
      token: {
        logo: '',
      },
      rules: {
        required: (value) => !!value || this.t('walletSettings.required'),
      },
      logosUrl: config.logosUrl,
    }
  },
  mounted() {
    if (this.isHideMode) {
      this.tab = 1
      this.token = this.deleteToken
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
      if (!this.isHideMode) {
        this.$refs.addTokenForm.reset()
        this.tab = 0
      }
      this.addTokenDialog = false
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'EditToken.scss';
</style>
