<template>
  <div>
    <template v-if="type === TX_TRANSACTION">
      <v-layout pa-6 class="elevation-1">
        <v-flex text-center xs12>
          <img class="home-link mr-1" alt="Torus Logo" :height="getLogo.isExternal ? 70 : 24" :src="getLogo.logo" />
          <div class="display-1 text_2--text">{{ t('dappTransfer.confirmation') }}</div>
        </v-flex>
      </v-layout>
      <v-layout wrap align-center mx-6 my-3>
        <v-flex xs12>
          <NetworkDisplay :minimal="true" class="mb-4" :store-network-type="network"></NetworkDisplay>
        </v-flex>
        <v-flex v-if="transactionCategory === COLLECTIBLE_METHOD_SAFE_TRANSFER_FROM || transactionCategory === TOKEN_METHOD_APPROVE" xs12>
          <v-flex v-if="transactionCategory === TOKEN_METHOD_APPROVE" xs12 mb-2>
            <span class="headline text_2--text">
              {{ `${t('dappPermission.allow')} ${origin.hostname} ${t('dappTransfer.toSpend')} ${selectedToken} ${t('dappTransfer.onYourBehalf')}?` }}
            </span>
          </v-flex>
          <ShowToolTip :address="amountTo">
            <div class="caption">{{ t('dappTransfer.to') }}: {{ amountTo }}</div>
          </ShowToolTip>
        </v-flex>
        <v-flex v-else xs12>
          <ShowToolTip
            v-if="[TOKEN_METHOD_APPROVE, TOKEN_METHOD_TRANSFER, TOKEN_METHOD_TRANSFER_FROM].indexOf(transactionCategory) >= 0"
            :address="amountTo"
          >
            <div class="caption">{{ t('dappTransfer.to') }}: {{ amountTo }}</div>
          </ShowToolTip>
          <ShowToolTip v-else-if="[SEND_ETHER_ACTION_KEY, CONTRACT_INTERACTION_KEY].indexOf(transactionCategory) >= 0" :address="receiver">
            <div class="caption">{{ t('dappTransfer.to') }}: {{ receiver }}</div>
          </ShowToolTip>
          <div v-else class="caption">{{ t('dappTransfer.to') }}: {{ displayAmountTo }}</div>
        </v-flex>
      </v-layout>
      <v-divider class="mx-6 my-4"></v-divider>
      <v-layout mx-6 my-4 wrap>
        <v-flex xs3 class="pt-3">
          <div class="caption">
            {{
              ((contractType === CONTRACT_TYPE_ERC721 || contractType === CONTRACT_TYPE_ERC1155) &&
                transactionCategory === COLLECTIBLE_METHOD_SAFE_TRANSFER_FROM) ||
              (isSpecialContract && transactionCategory === TOKEN_METHOD_TRANSFER)
                ? t('walletTransfer.collectibleId')
                : t('walletTransfer.totalCost')
            }}
          </div>
        </v-flex>
        <v-flex xs9>
          <v-text-field v-model="displayAmountValue" :hint="displayAmountConverted" outlined persistent-hint readonly></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout mx-6 my-4 wrap>
        <TransactionSpeedSelect
          :nonce="nonce"
          :gas="gasEstimate"
          :display-amount="contractType === CONTRACT_TYPE_ERC20 ? amountValue : value"
          :active-gas-price-confirm="gasPrice"
          :selected-currency="selectedCurrency"
          :currency-multiplier="currencyMultiplier"
          :currency-multiplier-eth="currencyMultiplier"
          :contract-type="contractType"
          :network-ticker="network.ticker"
          :symbol="SEND_ETHER_ACTION_KEY === transactionCategory ? network.ticker : selectedToken"
          :is-confirm="true"
          :network-host="network.host"
          @onSelectSpeed="onSelectSpeed"
        />
      </v-layout>
      <v-divider class="mt-10 my-4"></v-divider>
      <v-layout mx-6 mt-4 pb-10 wrap>
        <v-flex xs3 class="pt-3">
          <div class="caption">{{ t('dappTransfer.youSend') }}</div>
        </v-flex>
        <v-flex xs9>
          <v-text-field
            :value="`${costOfTransaction} ${
              isOtherToken && transactionCategory !== TOKEN_METHOD_APPROVE ? '+ ' + significantDigits(gasCost) + network.ticker : ''
            }`"
            :hint="costOfTransactionConverted"
            outlined
            persistent-hint
            readonly
          ></v-text-field>
        </v-flex>
        <v-flex xs12 mb-3 mt-3>
          <v-dialog v-model="detailsDialog" width="600px">
            <template #activator="{ on }">
              <div id="more-details-link" class="text-subtitle-2 float-right dialog-launcher primary--text" v-on="on">
                {{ t('dappTransfer.moreDetails') }}
              </div>
            </template>
            <v-card class="pa-4 more-details-container">
              <v-card-text class="text_1--text">
                <v-layout wrap>
                  <v-flex xs4 sm2>
                    {{ t('dappTransfer.rate') }}
                    <span class="float-right mr-4">:</span>
                  </v-flex>
                  <v-flex id="currency-rate" xs8 sm10 class="text_2--text">{{ getCurrencyRate }}</v-flex>
                  <v-flex xs4 sm2>
                    {{ t('dappTransfer.network') }}
                    <span class="float-right mr-4">:</span>
                  </v-flex>
                  <v-flex xs8 sm10 class="text_2--text">
                    <span id="network" class="text-capitalize">{{ network.networkName || network.host }}</span>
                  </v-flex>
                  <v-flex xs4 sm2>
                    {{ t('dappTransfer.type') }}
                    <span class="float-right mr-4">:</span>
                  </v-flex>
                  <v-flex id="type" xs8 sm10 class="text_2--text">{{ header }}</v-flex>
                  <v-flex v-if="txData || txDataParams !== ''" xs2>
                    {{ t('dappTransfer.data') }}
                    <span class="float-right mr-4">:</span>
                  </v-flex>
                  <v-flex xs12 mt-1>
                    <v-card v-if="txDataParams !== ''" flat color="background_3">
                      <v-card-text>
                        <pre>{{ txDataParams }}</pre>
                      </v-card-text>
                    </v-card>
                  </v-flex>
                  <v-flex v-if="txData" xs12 mt-4>
                    <div class="mb-1">Hex {{ t('dappTransfer.data') }}:</div>
                    <v-card flat color="background_3" :style="{ 'word-break': 'break-all' }">
                      <v-card-text>{{ txData }}</v-card-text>
                    </v-card>
                  </v-flex>
                </v-layout>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn id="less-details-link" color="primary" text @click="detailsDialog = false">
                  {{ t('dappTransfer.lessDetails') }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-flex>
        <v-flex v-if="topUpErrorShow || canShowError" xs12 mb-4 class="text-right">
          <div class="caption error--text">{{ errorMsg === 'dappTransfer.insufficientFunds' ? t('dappTransfer.insufficientFunds') : errorMsg }}</div>
          <div v-if="topUpErrorShow" class="caption mt-1">
            {{ t('dappTransfer.pleaseTopup1') }}
            <v-btn color="primary" class="mx-1 px-2 caption" small outlined @click="topUp">{{ t('dappTransfer.pleaseTopup2') }}</v-btn>
            {{ t('dappTransfer.pleaseTopup3') }}
          </div>
        </v-flex>
        <v-flex v-if="transactionCategory === TOKEN_METHOD_APPROVE" xs12 mb-4>
          <div class="caption error--text">{{ `${t('dappTransfer.byConfirming1')} ${displayAmountValue} ${t('dappTransfer.byConfirming2')}.` }}</div>
        </v-flex>
        <v-flex xs12 mt-4>
          <v-layout mx-n2>
            <v-flex xs6 px-2>
              <v-btn block text large class="text_2--text" @click="triggerDeny">{{ t('dappTransfer.cancel') }}</v-btn>
            </v-flex>
            <v-flex xs6 px-2>
              <v-btn
                id="confirm-btn"
                :disabled="topUpErrorShow || canShowError"
                block
                depressed
                large
                color="torusBrand1"
                class="white--text"
                @click="triggerSign"
              >
                {{ t('dappTransfer.confirm') }}
              </v-btn>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </template>

    <template
      v-if="
        type === TX_PERSONAL_MESSAGE || type === TX_MESSAGE || type === TX_TYPED_MESSAGE || type === TX_GET_ENCRYPTION_KEY || type === TX_ETH_DECRYPT
      "
    >
      <v-layout py-6 class="elevation-1">
        <v-flex xs12 text-center>
          <img class="home-link mr-1" alt="Torus Logo" :height="getLogo.isExternal ? 70 : 24" :src="getLogo.logo" />
          <div class="display-1 text_2--text">
            {{
              type === TX_GET_ENCRYPTION_KEY
                ? t('dappProvider.encryptionRequest')
                : type === TX_ETH_DECRYPT
                ? t('dappProvider.decryptionRequest')
                : t('dappTransfer.permission')
            }}
          </div>
        </v-flex>
      </v-layout>
      <v-layout v-if="type === TX_GET_ENCRYPTION_KEY" wrap my-10>
        <v-flex xs12 mx-6>
          <div class="text_2--text headline">{{ t('dappProvider.allowCompose').replace(/\{dappname\}/gi, origin.hostname) }}</div>
        </v-flex>
      </v-layout>
      <v-layout v-if="type === TX_ETH_DECRYPT" wrap my-10>
        <v-flex xs12 mx-6>
          <div class="text_2--text headline">{{ t('dappProvider.allowRead').replace(/\{dappname\}/gi, origin.hostname) }}</div>
        </v-flex>
      </v-layout>
      <v-layout wrap align-center mx-6 my-6>
        <v-flex xs12 mb-2>
          <div class="caption mb-2 text_2--text">{{ t('dappProvider.requestFrom') }}:</div>

          <v-card flat class="lighten-3" :class="$vuetify.theme.isDark ? '' : 'grey'">
            <v-card-text>
              <div class="d-flex request-from align-center">
                <a :href="origin.href" target="_blank" rel="noreferrer noopener" class="caption font-weight-medium torusBrand1--text">
                  {{ origin.hostname }}
                </a>
                <v-btn
                  x-small
                  :color="$vuetify.theme.isDark ? 'torusBlack2' : 'white'"
                  class="link-icon ml-auto"
                  :href="origin.href"
                  target="_blank"
                  rel="noreferrer noopener"
                  :aria-label="`Open ${origin.hostname} Link`"
                >
                  <img src="../../../assets/img/icons/open-in-new-grey.svg" class="card-upper-icon" alt="Origin Link Icon" />
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
      <v-layout v-if="type === TX_ETH_DECRYPT" mx-6 my-6 wrap>
        <v-flex xs12 mb-2>
          <v-card v-if="showEncrypted" flat class="lighten-3" :class="$vuetify.theme.isDark ? '' : 'grey'">
            <v-card-text>
              <div class="caption text_2--text" :style="{ height: '100px' }">{{ encryptedMessage }}</div>
            </v-card-text>
          </v-card>
          <v-card v-else flat class="lighten-3" :class="$vuetify.theme.isDark ? '' : 'grey'">
            <div class="message_cover" :class="$vuetify.theme.isDark ? 'is-dark' : ''"></div>
            <div class="message_cover-lock" :class="$vuetify.theme.isDark ? 'is-dark' : ''" @click="decryptInline">
              <v-icon size="16" class="text_2--text mr-1">$vuetify.icons.lock_filled</v-icon>
              <div class="message-lock-text">{{ t('dappProvider.decryptMessage') }}</div>
            </div>
            <v-card-text>
              <div class="caption text_2--text" :style="{ height: '100px' }">{{ message }}</div>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex v-if="showEncrypted" xs12 mb-2 class="text-right">
          <ShowToolTip :address="encryptedMessage">
            <v-btn small class="copy-encrypted-btn" aria-label="Copy encrypted message">
              <v-icon class="caption text_2--text" left size="12" v-text="'$vuetify.icons.copy'" />
              <span class="caption text_2--text">{{ t('dappProvider.copyEncrypted') }}</span>
            </v-btn>
          </ShowToolTip>
        </v-flex>
      </v-layout>
      <v-layout v-if="type !== TX_GET_ENCRYPTION_KEY && type !== TX_ETH_DECRYPT" wrap>
        <v-flex xs12 mt-0 mb-2 mx-6>
          <div class="d-flex align-center">
            <div class="mr-2 note-list__icon">
              <v-icon v-if="$store.state.whiteLabel.isActive" small class="torusBrand1--text">$vuetify.icons.check_circle</v-icon>
              <img v-else src="../../../assets/img/icons/check-circle-primary.svg" width="12" alt="Data Icon" />
            </div>
            <div class="caption text_2--text text-capitalize">{{ t('dappTransfer.data') }}</div>
          </div>
        </v-flex>
        <v-flex xs12 mb-4 mx-6>
          <v-list class="note-list lighten-3" :class="$vuetify.theme.isDark ? '' : 'grey'">
            <v-list-item class="pa-0">
              <v-list-item-content flat class="pa-1" :class="[$vuetify.theme.dark ? 'lighten-4' : 'background lighten-3']">
                <v-card flat class="caption text-left pa-2 word-break typedMessageBox">
                  <v-expansion-panels v-if="type === TX_PERSONAL_MESSAGE || type === TX_MESSAGE">
                    <p :class="$vuetify.theme.dark ? '' : 'text_2--text'" :style="{ 'text-align': 'left' }">{{ message }}</p>
                  </v-expansion-panels>

                  <v-expansion-panels v-else-if="type === TX_TYPED_MESSAGE && !Array.isArray(typedMessages)">
                    <v-expansion-panel
                      v-for="(typedMessage, index) in typedMessages"
                      :key="index"
                      :class="$vuetify.theme.isDark ? 'dark--theme' : ''"
                    >
                      <v-expansion-panel-header>{{ index }}</v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <VueJsonPretty :path="'res'" :data="typedMessage" :showline="true" :deep="5"></VueJsonPretty>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>

                  <v-expansion-panels v-else-if="type === TX_TYPED_MESSAGE && Array.isArray(typedMessages)">
                    <v-expansion-panel :class="$vuetify.theme.isDark ? 'dark--theme' : ''">
                      <v-expansion-panel-header>{{ t('dappTransfer.dataSmall') }}</v-expansion-panel-header>
                      <v-expansion-panel-content v-for="(typedMessage, index) in typedMessages" :key="index">
                        <VueJsonPretty :path="'res'" :data="typedMessage" :showline="true" :deep="5"></VueJsonPretty>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-card>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-flex>
      </v-layout>
      <v-layout wrap>
        <v-flex xs12 mt-8 mx-6>
          <v-layout mx-n2>
            <v-flex xs6 px-2>
              <v-btn block text large class="text_2--text" @click="triggerDeny">
                {{ type === TX_ETH_DECRYPT || type === TX_ETH_DECRYPT ? t('dappProvider.deny') : t('dappProvider.cancel') }}
              </v-btn>
            </v-flex>
            <v-flex xs6 px-2>
              <v-btn block depressed large class="torus-btn1 white--text" color="torusBrand1" @click="triggerSign">
                {{ type === TX_ETH_DECRYPT || type === TX_ETH_DECRYPT ? t('dappProvider.allow') : t('dappProvider.confirm') }}
              </v-btn>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </template>
  </div>
</template>

<script>
import BigNumber from 'bignumber.js'
import log from 'loglevel'
import VueJsonPretty from 'vue-json-pretty'
import { mapActions, mapGetters } from 'vuex'
import { fromWei, hexToNumber, toChecksumAddress } from 'web3-utils'

import {
  COLLECTIBLE_METHOD_SAFE_TRANSFER_FROM,
  CONTRACT_INTERACTION_KEY,
  CONTRACT_TYPE_ERC20,
  CONTRACT_TYPE_ERC721,
  CONTRACT_TYPE_ERC1155,
  CONTRACT_TYPE_ETH,
  DEPLOY_CONTRACT_ACTION_KEY,
  SEND_ETHER_ACTION_KEY,
  TOKEN_METHOD_APPROVE,
  TOKEN_METHOD_TRANSFER,
  TOKEN_METHOD_TRANSFER_FROM,
  TX_ETH_DECRYPT,
  TX_GET_ENCRYPTION_KEY,
  TX_MESSAGE,
  TX_PERSONAL_MESSAGE,
  TX_TRANSACTION,
  TX_TYPED_MESSAGE,
} from '../../../utils/enums'
import { get } from '../../../utils/httpHelpers'
import { addressSlicer, isMain, significantDigits } from '../../../utils/utils'
import NetworkDisplay from '../../helpers/NetworkDisplay'
import ShowToolTip from '../../helpers/ShowToolTip'
import TransactionSpeedSelect from '../../helpers/TransactionSpeedSelect'

const weiInGwei = new BigNumber('10').pow(new BigNumber('9'))

export default {
  name: 'Confirm',
  components: {
    VueJsonPretty,
    TransactionSpeedSelect,
    NetworkDisplay,
    ShowToolTip,
  },
  props: {
    currentConfirmModal: {
      type: Object,
      default() {
        return {}
      },
    },
    isConfirmModal: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      confirmDialog: false,
      detailsDialog: false,
      type: 'none',
      origin: { href: '', hostname: '' },
      balance: new BigNumber('0'),
      gasPrice: new BigNumber('10'),
      value: new BigNumber('0'),
      amountTo: '',
      amountValue: '',
      tokenPrice: new BigNumber('0'),
      amountTokenValueConverted: new BigNumber('0'),
      currencyRateDate: '',
      receiver: 'unknown',
      message: '',
      selectedToken: '',
      gasCost: new BigNumber('0'),
      gasEstimate: new BigNumber('0'),
      gasEstimateDefault: new BigNumber('0'),
      txData: '',
      txDataParams: '',
      sender: '',
      totalUsdCost: new BigNumber('0'),
      totalEthCost: new BigNumber('0'),
      totalEthCostDisplay: '',
      errorMsg: '',
      topUpErrorShow: false,
      canShowError: false,
      txFees: new BigNumber('0'),
      network: {
        networkName: '',
        host: '',
        chainId: '',
      },
      transactionCategory: '',
      dollarValue: new BigNumber('0'),
      speed: '',
      typedMessages: {},
      id: 0,
      isNonFungibleToken: false,
      assetDetails: {},
      channel: '',
      selectedCurrency: '',
      currencyData: {},
      COLLECTIBLE_METHOD_SAFE_TRANSFER_FROM,
      TOKEN_METHOD_APPROVE,
      TOKEN_METHOD_TRANSFER,
      TOKEN_METHOD_TRANSFER_FROM,
      SEND_ETHER_ACTION_KEY,
      CONTRACT_INTERACTION_KEY,
      TX_TRANSACTION,
      TX_TYPED_MESSAGE,
      TX_PERSONAL_MESSAGE,
      TX_MESSAGE,
      TX_GET_ENCRYPTION_KEY,
      TX_ETH_DECRYPT,
      userInfo: {},
      contractType: CONTRACT_TYPE_ETH,
      CONTRACT_TYPE_ERC20,
      CONTRACT_TYPE_ERC721,
      CONTRACT_TYPE_ERC1155,
      nonce: -1,
      decryptedData: {},
      encryptedMessage: '',
      showEncrypted: false,
      isSpecialContract: false,
    }
  },
  computed: {
    ...mapGetters(['getLogo']),
    header() {
      switch (this.transactionCategory) {
        case DEPLOY_CONTRACT_ACTION_KEY:
          // return 'Contract Deployment'
          return this.t('dappTransfer.deploy')
        case CONTRACT_INTERACTION_KEY:
          return this.getHeaderByDapp()
        case COLLECTIBLE_METHOD_SAFE_TRANSFER_FROM:
          // return 'ERC721 SafeTransferFrom'
          return this.t('dappTransfer.collectibleSafe')
        case TOKEN_METHOD_APPROVE:
          // return 'ERC20 Approve'
          return this.t('dappTransfer.approve')
        case TOKEN_METHOD_TRANSFER:
        case SEND_ETHER_ACTION_KEY:
          // return 'ERC2O Transfer'
          // return 'Send Ether'
          return this.t('dappTransfer.transfer')
        case TOKEN_METHOD_TRANSFER_FROM:
          // return 'ERC2O Transfer From'
          return this.t('dappTransfer.transferFrom')
        default:
          // return 'Transaction Request'
          return this.t('dappTransfer.transaction')
      }
    },
    isLightHeader() {
      return [DEPLOY_CONTRACT_ACTION_KEY, CONTRACT_INTERACTION_KEY].includes(this.transactionCategory)
    },
    displayAmountTo() {
      switch (this.transactionCategory) {
        case TOKEN_METHOD_APPROVE:
        case TOKEN_METHOD_TRANSFER:
        case TOKEN_METHOD_TRANSFER_FROM:
          return `${this.t('dappTransfer.to')}: ${this.slicedAddress(this.amountTo)}`
        case SEND_ETHER_ACTION_KEY:
        case CONTRACT_INTERACTION_KEY:
          return `${this.t('dappTransfer.to')}: ${this.slicedAddress(this.receiver)}`
        case DEPLOY_CONTRACT_ACTION_KEY:
          return this.t('dappTransfer.newContract')
        default:
          return this.t('dappTransfer.transactionRequest')
      }
    },
    displayAmountValue() {
      switch (this.transactionCategory) {
        case TOKEN_METHOD_APPROVE:
        case TOKEN_METHOD_TRANSFER:
        case TOKEN_METHOD_TRANSFER_FROM:
          return `${this.amountDisplay(this.amountValue)} ${this.selectedToken}`
        case COLLECTIBLE_METHOD_SAFE_TRANSFER_FROM:
          return `ID: ${this.amountValue} ${this.selectedToken}`
        case SEND_ETHER_ACTION_KEY:
        case CONTRACT_INTERACTION_KEY:
          return `${this.amountDisplay(this.value)} ${this.network.ticker}`
        case DEPLOY_CONTRACT_ACTION_KEY:
          return this.t('dappTransfer.notApplicable')
        default:
          return this.t('dappTransfer.transactionRequest')
      }
    },
    displayAmountConverted() {
      switch (this.transactionCategory) {
        case TOKEN_METHOD_APPROVE:
        case TOKEN_METHOD_TRANSFER:
        case TOKEN_METHOD_TRANSFER_FROM:
          return `~ ${significantDigits(this.amountTokenValueConverted)} ${this.selectedCurrency}`
        case SEND_ETHER_ACTION_KEY:
        case CONTRACT_INTERACTION_KEY:
          return `~ ${this.dollarValue} ${this.selectedCurrency}`
        case DEPLOY_CONTRACT_ACTION_KEY:
          return ''
        default:
          return ''
      }
    },
    costOfTransaction() {
      if ([TOKEN_METHOD_TRANSFER, TOKEN_METHOD_TRANSFER_FROM].includes(this.transactionCategory)) {
        return `${this.displayAmountValue}`
      }
      return `${this.totalEthCostDisplay} ${this.network.ticker}`
    },
    isOtherToken() {
      return [TOKEN_METHOD_APPROVE, TOKEN_METHOD_TRANSFER, TOKEN_METHOD_TRANSFER_FROM].includes(this.transactionCategory)
      // `+ ${significantDigits(this.gasCost)}`
    },
    costOfTransactionConverted() {
      let cost = this.totalUsdCost
      if (this.transactionCategory !== TOKEN_METHOD_APPROVE) cost += this.amountTokenValueConverted.toNumber()

      const totalCost = this.isOtherToken ? significantDigits(cost, false, 5) : this.totalUsdCost
      return `~ ${totalCost} ${this.selectedCurrency}`
    },
    currencyMultiplier() {
      const currencyMultiplierNumber = this.selectedCurrency !== 'ETH' ? this.currencyData[this.selectedCurrency.toLowerCase()] || 1 : 1
      return new BigNumber(currencyMultiplierNumber)
    },
    getCurrencyRate() {
      const ethConverted = this.currencyMultiplier
      const tokenPriceConverted = this.isOtherToken ? this.tokenPrice.times(ethConverted) : ethConverted
      const selectedToken = this.isOtherToken ? this.selectedToken : this.network.ticker
      return `1 ${selectedToken} = ${significantDigits(tokenPriceConverted)} ${this.selectedCurrency} @ ${this.currencyRateDate}`
    },
  },
  watch: {
    gasPrice(newGasPrice, oldGasPrice) {
      if (!newGasPrice.eq(oldGasPrice)) {
        this.calculateTransaction()
      }
    },
    currentConfirmModal(newValue, oldValue) {
      if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
        this.updateConfirmModal()
      }
    },
  },
  mounted() {
    window.$crisp.push(['do', 'chat:hide'])
    this.updateConfirmModal()
  },
  methods: {
    ...mapActions(['decryptMessage']),
    async updateConfirmModal() {
      if (!this.currentConfirmModal) return
      const { type, msgParams, txParams, origin, balance, selectedCurrency, tokenRates, currencyData, network } = this.currentConfirmModal || {}
      this.selectedCurrency = selectedCurrency
      this.currencyData = currencyData
      this.balance = new BigNumber(balance)
      log.info({ msgParams, txParams })
      this.origin = origin || this.origin
      if (type === TX_ETH_DECRYPT) {
        const { msgParams: { data, from } = {}, id = '' } = msgParams || {}
        this.id = id
        this.message = data
        this.sender = from
      } else if (type !== TX_TRANSACTION) {
        const { msgParams: { message, typedMessages } = {}, id = '' } = msgParams || {}
        let finalTypedMessages = typedMessages
        try {
          finalTypedMessages = typedMessages && JSON.parse(typedMessages)
        } catch (error) {
          log.error(error)
        }
        this.id = id
        this.message = message
        this.typedMessages = finalTypedMessages
      } else {
        let finalValue = new BigNumber('0')
        const { simulationFails, id, transactionCategory, methodParams, contractParams, txParams: txObject, userInfo } = txParams || {}
        const { value, to, data, from: sender, gas, gasPrice } = txObject || {}
        const { reason = '' } = simulationFails || {}
        if (value) {
          finalValue = new BigNumber(fromWei(value.toString()))
        }
        let txDataParameters = ''
        if (contractParams.isSpecial && transactionCategory.toLowerCase() === TOKEN_METHOD_TRANSFER) {
          txDataParameters = methodParams
          this.contractType = CONTRACT_TYPE_ERC721
          this.isSpecialContract = true
        } else if (contractParams.erc1155) {
          txDataParameters = methodParams
          this.contractType = CONTRACT_TYPE_ERC1155
        } else if (contractParams.erc721) {
          txDataParameters = methodParams
          this.contractType = CONTRACT_TYPE_ERC721
        } else if (contractParams.erc20) {
          txDataParameters = methodParams
          this.contractType = CONTRACT_TYPE_ERC20
        }

        // Get Params from method type ABI
        let amountTo
        let amountValue
        if (methodParams && Array.isArray(methodParams)) {
          if (transactionCategory === TOKEN_METHOD_TRANSFER_FROM || transactionCategory === COLLECTIBLE_METHOD_SAFE_TRANSFER_FROM) {
            ;[, amountTo, amountValue] = methodParams || []
          } else [amountTo, amountValue] = methodParams || []
        }
        log.info(methodParams, 'params')
        const checkSummedTo = toChecksumAddress(to)
        const tokenObject = contractParams
        const decimals = new BigNumber(tokenObject.decimals || '0')
        this.userInfo = userInfo
        this.selectedToken = tokenObject.symbol || 'ERC20'
        this.id = id
        this.network = network
        this.transactionCategory = transactionCategory
        const gweiGasPrice = new BigNumber(hexToNumber(gasPrice)).div(weiInGwei)
        // sending to who
        this.amountTo = amountTo ? amountTo.value : checkSummedTo
        // sending what value
        this.amountValue = amountValue ? new BigNumber(amountValue.value).div(new BigNumber(10).pow(new BigNumber(decimals))) : new BigNumber('0')
        // Get token and collectible info
        if (methodParams && contractParams.erc20) {
          let tokenRateMultiplier = tokenRates[checkSummedTo.toLowerCase()]
          if (!tokenRateMultiplier) {
            const pairs = checkSummedTo
            const query = `contract_addresses=${pairs}&vs_currencies=eth`
            let prices = {}
            try {
              prices = await get(`https://api.coingecko.com/api/v3/simple/token_price/ethereum?${query}`)
              const lowerCheckSum = checkSummedTo.toLowerCase()
              tokenRateMultiplier = prices[lowerCheckSum] && prices[lowerCheckSum].eth ? prices[lowerCheckSum].eth : 0 // token price in eth
            } catch (error) {
              log.info(error)
            }
          }
          this.tokenPrice = new BigNumber(tokenRateMultiplier)
          this.amountTokenValueConverted = this.tokenPrice.times(this.amountValue).times(this.currencyMultiplier)
        } else if (methodParams && contractParams.erc721) {
          log.info(methodParams, contractParams)
          this.isNonFungibleToken = true
        } else if (methodParams && contractParams.erc1155) {
          log.info(methodParams, contractParams)
          this.isNonFungibleToken = true
        }
        this.currencyRateDate = this.getDate()
        this.receiver = this.amountTo
        this.value = finalValue // value of eth sending
        this.dollarValue = significantDigits(finalValue.times(this.currencyMultiplier))
        this.gasPrice = gweiGasPrice // gas price in gwei
        this.balanceUsd = significantDigits(this.balance.times(this.currencyMultiplier)) // in usd
        this.gasEstimate = new BigNumber(hexToNumber(gas)) // gas number
        this.gasEstimateDefault = new BigNumber(hexToNumber(gas)) // gas number
        this.txData = data // data hex
        this.txDataParams = txDataParameters !== '' ? JSON.stringify(txDataParameters, null, 2) : ''
        this.sender = sender // address of sender
        this.gasCost = gweiGasPrice.times(this.gasEstimate).div(new BigNumber('10').pow(new BigNumber('9')))
        this.txFees = this.gasCost.times(this.currencyMultiplier)
        const ethCost = finalValue.plus(this.gasCost)
        this.totalEthCost = ethCost // significantDigits(ethCost.toFixed(5), false, 3) || 0
        const gasCostLength = Math.max(significantDigits(this.gasCost).toString().length, significantDigits(ethCost).toString().length)
        this.totalEthCostDisplay = significantDigits(ethCost, false, gasCostLength - 2 < 0 ? 0 : gasCostLength - 2)
        this.totalUsdCost = significantDigits(ethCost.times(this.currencyMultiplier))
        if (reason) {
          this.errorMsg = reason
          this.canShowError = true
          window.$crisp.push(['do', 'chat:show'])
        }
        if (this.balance.lt(ethCost) && !this.canShowError) {
          this.errorMsg = 'dappTransfer.insufficientFunds'
          this.topUpErrorShow = true
          window.$crisp.push(['do', 'chat:show'])
        }
      }
      this.type = type // type of tx
    },
    slicedAddress(user) {
      return addressSlicer(user) || '0x'
    },
    triggerSign() {
      const gasPriceHex = `0x${this.gasPrice.times(weiInGwei).toString(16)}`
      const gasHex = this.gasEstimate.eq(new BigNumber('0')) ? undefined : `0x${this.gasEstimate.toString(16)}`
      const customNonceValue = this.nonce >= 0 ? `0x${this.nonce.toString(16)}` : undefined
      if (this.isConfirmModal) {
        this.$emit('triggerSign', {
          id: this.id,
          txType: this.type,
          gasPrice: gasPriceHex,
          gas: gasHex,
          customNonceValue,
          approve: true,
        })
      } else {
        this.$emit('triggerSign', {
          id: this.id,
          gasPrice: gasPriceHex,
          gas: gasHex,
          customNonceValue,
        })
      }
    },
    triggerDeny() {
      if (this.isConfirmModal) {
        this.$emit('triggerDeny', {
          id: this.id,
          txType: this.type,
          approve: false,
        })
      } else {
        this.$emit('triggerDeny', {
          id: this.id,
        })
      }
    },
    topUp() {
      if (isMain) {
        this.$router.push({ path: '/wallet/topup' }).catch((_) => {})
      } else {
        this.$store.dispatch('showWalletPopup', { path: '/topup' })
      }
    },
    onSelectSpeed(data) {
      this.speedSelected = data.speedSelected
      this.gasPrice = data.activeGasPrice
      this.speed = data.speed
      this.gasEstimate = data.gas
      this.nonce = data.nonce || -1

      if (data.isReset) {
        this.nonce = -1
        this.gasEstimate = this.gasEstimateDefault
        this.gasPrice = this.speedSelected === '' ? '' : this.gasPrice
      }
      this.calculateTransaction()
    },
    getDate() {
      const currentDateTime = new Date()
      let hours = currentDateTime.getHours()
      const minutes = currentDateTime.getMinutes()
      const seconds = currentDateTime.getSeconds()
      const ampm = hours >= 12 ? 'PM' : 'AM'

      hours %= 12
      hours = hours || 12
      return `${hours}:${minutes}:${seconds} ${ampm}`
    },
    amountDisplay(amount) {
      return significantDigits(amount || new BigNumber('0'))
    },
    significantDigits,
    getHeaderByDapp() {
      return this.t('dappTransfer.contractInteraction')
    },
    calculateTransaction() {
      this.gasCost = this.gasPrice.times(this.gasEstimate).div(new BigNumber('10').pow(new BigNumber('9')))
      this.txFees = this.gasCost.times(this.currencyMultiplier)
      const ethCost = this.value.plus(this.gasCost)
      this.totalEthCost = ethCost // significantDigits(ethCost.toFixed(5), false, 3) || 0
      const gasCostLength = Math.max(significantDigits(this.gasCost).toString().length, significantDigits(ethCost).toString().length)
      this.totalEthCostDisplay = significantDigits(ethCost, false, gasCostLength - 2 < 0 ? 0 : gasCostLength - 2)
      this.totalUsdCost = significantDigits(ethCost.times(this.currencyMultiplier))
      if (this.balance.lt(ethCost) && !this.canShowError) {
        this.errorMsg = 'dappTransfer.insufficientFunds'
        this.topUpErrorShow = true
        window.$crisp.push(['do', 'chat:show'])
      }
    },
    async decryptInline() {
      try {
        this.encryptedMessage = await this.decryptMessage({
          id: this.id,
          data: this.message,
          from: this.sender,
        })
        this.showEncrypted = true
      } catch (error) {
        log.error(error)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'ConfirmForm.scss';
</style>
