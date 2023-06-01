<template>
  <v-container class="pt-6" :class="$vuetify.breakpoint.xsOnly ? 'px-4' : ''">
    <div class="d-flex flex-wrap align-center justify-end">
      <NetworkDisplay :store-network-type="networkType" :is-network-pill="true" />
      <QuickAddress />
    </div>

    <v-container class="dapp-parent d-flex flex-column justify-start align-center pt-6" :class="$vuetify.breakpoint.xsOnly ? 'xs-parent px-4' : ''">
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-card class="swap-container elevation-1 pa-4">
          <div class="font-weight-bold mb-2">{{ t('walletSwap.swap') }}</div>
          <v-card flat outlined class="mb-2 pa-1">
            <v-row class="align-center" no-gutters>
              <v-col>
                <v-text-field
                  class="swap-amount"
                  :value="fromValue"
                  hide-details
                  outlined
                  type="number"
                  :rules="[rules.required]"
                  @change="fromValueChanged"
                />
              </v-col>
              <v-col cols="3">
                <v-combobox
                  :value="fromToken"
                  class="swap-token"
                  flat
                  outlined
                  hide-details
                  solo
                  :items="tokenList"
                  item-text="symbol"
                  item-value="symbol"
                  :rules="[rules.required]"
                  @change="fromTokenChanged"
                ></v-combobox>
              </v-col>
            </v-row>
          </v-card>
          <v-card flat outlined class="pa-1 mb-4">
            <v-row class="align-center" no-gutters>
              <v-col>
                <v-text-field class="swap-amount" :value="toValue" hide-details outlined type="number" @change="toValueChanged" />
              </v-col>
              <v-col cols="3">
                <v-combobox
                  :value="toToken"
                  class="swap-token"
                  flat
                  outlined
                  hide-details
                  solo
                  :items="tokenList"
                  item-text="symbol"
                  item-value="symbol"
                  :rules="[rules.required]"
                  @change="toTokenChanged"
                ></v-combobox>
              </v-col>
            </v-row>
          </v-card>
          <div v-if="!!currentSwapQuote">
            <div>{{ t('walletSwap.expectedOutput') }}: {{ toValue }} {{ toToken }}</div>
            <div>{{ t('walletSwap.priceImpact') }}: {{ priceImpact }} %</div>
            <div>{{ t('walletSwap.networkFee') }}: {{ gasFees }} USD</div>
          </div>
          <div v-else-if="!currentSwapQuote && valid && fetchingQuote">
            <div>{{ t('walletSwap.fetching') }}</div>
          </div>
          <v-btn class="text-h6 mt-2" color="primary" x-large block :disabled="!currentSwapQuote" @click.stop="confirmationModalShow = true">
            {{ t('walletSwap.swap') }}
          </v-btn>
        </v-card>
      </v-form>

      <v-dialog v-model="messageModalShow" max-width="375" persistent>
        <MessageModal
          :detail-text="messageModalDetails"
          :modal-type="messageModalType"
          :title="messageModalTitle"
          :no-close="messageModalType === MESSAGE_MODAL_TYPE_SUCCESS"
          @onClose="messageModalShow = false"
        >
          <template v-if="messageModalType === MESSAGE_MODAL_TYPE_SUCCESS" #link>
            <div class="mb-4">
              <v-btn text class="share-btn" :href="etherscanLink" target="_blank">
                <span class="body-2 font-weight-bold">{{ t('walletSwap.viewEtherscan') }}</span>
              </v-btn>
            </div>
          </template>
        </MessageModal>
      </v-dialog>

      <v-dialog v-model="confirmationModalShow" max-width="375">
        <v-card>
          <v-card-title>Confirm swap</v-card-title>
          <v-card-text>{{ confirmSwapDetailText }}</v-card-text>
          <v-card-actions>
            <v-btn class="text-h6 mb-4" color="primary" x-large block :disabled="!currentSwapQuote" :loading="sendingTx" @click="sendTx">
              {{ t('walletSwap.swap') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </v-container>
</template>
<script>
import TokenList from '@uniswap/default-token-list'
import log from 'loglevel'
import { mapState } from 'vuex'

import NetworkDisplay from '../../components/helpers/NetworkDisplay/NetworkDisplay.vue'
import QuickAddress from '../../components/helpers/QuickAddress/QuickAddress.vue'
import MessageModal from '../../components/WalletTransfer/MessageModal'
import config from '../../config'
import { getQuoteFromBackend } from '../../plugins/uniswap'
import torus from '../../torus'
import { MESSAGE_MODAL_TYPE_FAIL, MESSAGE_MODAL_TYPE_SUCCESS } from '../../utils/enums'
import { getEtherScanHashLink } from '../../utils/utils'

export default {
  name: 'WalletDiscover',
  components: { MessageModal, NetworkDisplay, QuickAddress },
  data() {
    return {
      fromValue: '0.01',
      toValue: '0',
      fromToken: '',
      toToken: '',
      rules: {
        required: (v) => !!v || this.t('walletSwap.valueRequired'),
      },
      currentSwapQuote: null,
      valid: false,
      priceImpact: 0,
      gasFees: 0,
      sendingTx: false,
      messageModalShow: false,
      confirmationModalShow: false,
      messageModalType: '',
      messageModalTitle: '',
      messageModalDetails: '',
      MESSAGE_MODAL_TYPE_SUCCESS,
      etherscanLink: '',
      fetchingQuote: false,
    }
  },
  computed: {
    ...mapState({
      networkType: 'networkType',
      selectedAddress: 'selectedAddress',
    }),
    chainId() {
      return Number.parseInt(this.networkType.chainId, 10)
    },
    nativeToken() {
      return {
        chainId: this.chainId,
        name: this.networkType.tickerName,
        symbol: this.networkType.ticker,
        logoURI: this.networkType.logo,
        decimals: this.networkType.decimals || 18,
      }
    },
    tokenList() {
      return [this.nativeToken, ...TokenList.tokens.filter((x) => x.chainId === this.chainId)]
    },
    confirmSwapDetailText() {
      return `Are you sure you wish to swap ${this.fromValue} ${this.fromToken} for ${this.toValue} ${this.toToken}?`
    },
    networkUrl() {
      return torus.torusController.networkController.getCurrentNetworkUrl()
    },
  },
  async mounted() {
    this.fromToken = this.nativeToken.symbol
    this.getSwapQuote()
  },
  methods: {
    fromTokenChanged(value) {
      log.info('fromTokenChanged', value)
      this.fromToken = value.symbol
      this.getSwapQuote()
    },
    toTokenChanged(value) {
      log.info('toTokenChanged', value)
      this.toToken = value.symbol
      this.getSwapQuote()
    },
    fromValueChanged(value) {
      this.fromValue = value
      this.getSwapQuote()
    },
    toValueChanged(value) {
      this.toValue = value
      this.getSwapQuote(true)
    },
    async getSwapQuote(reverse = false) {
      try {
        const valid = this.$refs.form.validate()
        log.info('getting swap quote after validation', valid)
        if (!valid) return

        // reset values
        this.fetchingQuote = true
        this.currentSwapQuote = null
        this.priceImpact = 0
        this.gasFees = 0

        log.info(this.chainId, 'chainId')
        const result = await getQuoteFromBackend({
          fromToken: this.fromToken,
          toToken: this.toToken,
          fromValue: this.fromValue,
          toValue: this.toValue,
          chainId: this.chainId,
          recipient: this.selectedAddress,
          reverse,
          networkUrl: this.networkUrl,
        })
        log.info(result)
        log.info(`Quote Exact In: ${result.quote}`)
        log.info(`Gas Adjusted Quote In: ${result.priceImpact}`)
        log.info(`Gas Used USD: ${result.gasPrice}`)
        if (reverse) {
          this.fromValue = result.quote
        } else {
          this.toValue = result.quote
        }
        this.priceImpact = result.priceImpact
        this.gasFees = result.gasPrice
        this.currentSwapQuote = result.currentSwapQuote
      } catch (error) {
        log.error(error)
      } finally {
        this.fetchingQuote = false
      }
    },
    async sendTx() {
      try {
        log.info('sendTx')
        if (!this.currentSwapQuote) {
          return
        }
        this.sendingTx = true
        const transaction = {
          data: this.currentSwapQuote.methodParameters.calldata,
          to: config.uniswapContractAddress,
          value: this.currentSwapQuote.methodParameters.value,
          from: this.selectedAddress,
          gasPrice: this.currentSwapQuote.gasPriceWei,
        }
        const txHash = await torus.ethersProvider.send('eth_sendTransaction', [transaction])
        this.messageModalShow = true
        this.messageModalType = MESSAGE_MODAL_TYPE_SUCCESS
        this.messageModalTitle = this.t('walletSwap.swapSuccessTitle')
        this.messageModalDetails = ''
        this.etherscanLink = getEtherScanHashLink(txHash, this.networkType.host)
      } catch (error) {
        log.error(error)
        this.messageModalShow = true
        this.messageModalType = MESSAGE_MODAL_TYPE_FAIL
        this.messageModalTitle = this.t('walletSwap.swapFailTitle')
        this.messageModalDetails = this.t('walletSwap.swapFailMessage')
      } finally {
        this.sendingTx = false
        this.confirmationModalShow = false
      }
    },
  },
}
</script>
<style lang="scss" scoped>
@import 'WalletSwap.scss';
</style>
