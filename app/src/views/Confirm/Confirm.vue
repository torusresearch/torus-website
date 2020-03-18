<template>
  <v-container px-0 py-6 class="confirm-container">
    <template v-if="type === TX_TRANSACTION">
      <v-layout wrap align-center mx-6 mb-6>
        <v-flex xs12 class="text_1--text font-weight-bold headline float-left" :class="isLightHeader ? 'text--lighten-3' : ''">
          {{ t('dappTransfer.permission') }}
        </v-flex>
        <v-flex xs12>
          <NetworkDisplay :store-network-type="network"></NetworkDisplay>
        </v-flex>
      </v-layout>
      <v-layout wrap>
        <template v-if="transactionCategory === COLLECTIBLE_METHOD_SAFE_TRANSFER_FROM">
          <v-flex xs12 mb-4 mx-6>
            <div class="subtitle-2">{{ t('dappTransfer.sendTo') }}</div>
            <v-divider></v-divider>
            <div>
              <span class="subtitle-2 float-left text_2--text">{{ amountTo }}</span>
            </div>
          </v-flex>
          <v-flex xs12 mb-4 mx-6>
            <div class="subtitle-2">{{ t('dappTransfer.youSend') }}</div>
            <v-divider class="mb-1"></v-divider>
            <div>
              <img class="mr-2 float-left" :src="assetDetails.logo" height="35px" />
              <span class="subtitle-2 float-left text_2--text asset-name">{{ assetDetails.name }}</span>
            </div>
          </v-flex>
        </template>
        <v-flex v-else xs12 mb-4 mx-6>
          <div class="subtitle-2">{{ t('dappTransfer.amount') }}</div>
          <v-divider></v-divider>
          <div>
            <span class="subtitle-2 float-left text_2--text">
              <ShowToolTip
                v-if="[TOKEN_METHOD_APPROVE, TOKEN_METHOD_TRANSFER, TOKEN_METHOD_TRANSFER_FROM].indexOf(transactionCategory) >= 0"
                :address="amountTo"
              >
                {{ displayAmountTo }}
              </ShowToolTip>
              <ShowToolTip v-else-if="[SEND_ETHER_ACTION_KEY, CONTRACT_INTERACTION_KEY].indexOf(transactionCategory) >= 0" :address="receiver">
                {{ displayAmountTo }}
              </ShowToolTip>
              <span v-else class="subtitle-2 float-left text_2--text">{{ displayAmountTo }}</span>
            </span>
            <span class="subtitle-2 float-right">{{ displayAmountValue }}</span>
          </div>
          <div class="caption float-right clearfix">{{ displayAmountConverted }}</div>
        </v-flex>
        <v-flex px-2>
          <TransactionSpeedSelect
            :gas="gasEstimate"
            :display-amount="value"
            :active-gas-price-confirm="gasPrice"
            :selected-currency="selectedCurrency"
            :currency-multiplier="getCurrencyMultiplier"
            :symbol="'ETH'"
            @onSelectSpeed="onSelectSpeed"
          />
        </v-flex>
        <v-flex xs12 px-6 mt-4 mb-1>
          <div class="subtitle-1 font-weight-bold">{{ t('dappTransfer.total') }}</div>
          <v-divider></v-divider>
          <div>
            <span class="subtitle-2">{{ t('dappTransfer.constOfTrans') }}</span>
            <span class="subtitle-1 float-right torus_brand1--text font-weight-bold">{{ costOfTransaction }}</span>
          </div>
          <div v-if="isOtherToken" class="clearfix">
            <span class="subtitle-1 float-right torus_brand1--text font-weight-bold">+ {{ significantDigits(gasCost) }} ETH</span>
          </div>
          <div class="caption float-right clearfix">{{ costOfTransactionConverted }}</div>
        </v-flex>
        <v-flex xs12 mb-3 mt-3>
          <v-dialog v-model="detailsDialog" width="600px">
            <template v-slot:activator="{ on }">
              <div id="more-details-link" class="subtitle-2 float-right dialog-launcher torus_brand1--text mx-6" v-on="on">
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
                    <v-card flat color="background_3" style="word-break: break-all">
                      <v-card-text>{{ txData }}</v-card-text>
                    </v-card>
                  </v-flex>
                </v-layout>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn id="less-details-link" color="torus_brand1" text @click="detailsDialog = false">{{ t('dappTransfer.lessDetails') }}</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-flex>
        <v-flex v-if="topUpErrorShow || canShowError" xs12 px-6 mb-6 class="text-right">
          <div class="caption error--text">{{ errorMsg }}</div>
          <div v-if="topUpErrorShow" class="caption mt-1">
            {{ t('dappTransfer.pleaseTopup1') }}
            <v-btn color="torus_brand1" class="mx-1 px-2 caption" small outlined @click="topUp">{{ t('dappTransfer.pleaseTopup2') }}</v-btn>
            {{ t('dappTransfer.pleaseTopup3') }}
          </div>
        </v-flex>
        <v-flex v-if="transactionCategory === TOKEN_METHOD_APPROVE" xs12 px-6 mb-6>
          <div class="caption error--text">{{ `${t('dappTransfer.byConfirming1')} ${displayAmountValue} ${t('dappTransfer.byConfirming2')}.` }}</div>
        </v-flex>
        <v-layout px-6>
          <v-flex xs6>
            <v-btn block text large class="text_2--text" @click="triggerDeny">{{ t('dappTransfer.cancel') }}</v-btn>
          </v-flex>
          <v-flex xs6>
            <v-dialog v-model="confirmDialog" max-width="550" persistent>
              <template v-slot:activator="{ on }">
                <v-btn id="confirm-btn" :disabled="topUpErrorShow || canShowError" block depressed large color="torus_brand1" class="ml-2" v-on="on">
                  {{ t('dappTransfer.confirm') }}
                </v-btn>
              </template>
              <TransferConfirm
                :to-address="receiver"
                :converted-amount="displayAmountConverted"
                :display-amount="displayAmountValue"
                :speed-selected="speed"
                :asset-selected="assetDetails"
                :is-non-fungible-token="isNonFungibleToken"
                :transaction-fee="txFees"
                :selected-currency="selectedCurrency"
                @onClose="confirmDialog = false"
                @onConfirm="triggerSign"
              ></TransferConfirm>
            </v-dialog>
          </v-flex>
        </v-layout>
      </v-layout>
    </template>

    <template v-if="type === TX_PERSONAL_MESSAGE || type === TX_MESSAGE || type === TX_TYPED_MESSAGE">
      <!-- <permission-confirm @triggerSign="triggerSign" @triggerDeny="triggerDeny" /> -->
      <v-layout wrap align-center mx-6 mb-6>
        <v-flex xs12 class="text_1--text font-weight-bold headline float-left">{{ t('dappTransfer.permissions') }}</v-flex>
        <v-flex xs12>
          <NetworkDisplay :store-network-type="network"></NetworkDisplay>
        </v-flex>
      </v-layout>
      <v-layout wrap>
        <v-flex xs12 mb-6 mx-6>
          <div class="subtitle-2 text_2--text">{{ t('dappTransfer.requestFrom') }}:</div>

          <v-card flat class="grey lighten-3">
            <v-card-text>
              <div class="subtitle-2 torus_brand1--text request-from">
                <a :href="origin.href" target="_blank">{{ origin.hostname }}</a>
                <a :href="origin.href" target="_blank" class="float-right">
                  <img :src="require('../../../public/img/icons/open-in-new-grey.svg')" class="card-upper-icon" />
                </a>
              </div>
            </v-card-text>
          </v-card>
        </v-flex>

        <v-flex xs12 mt-0 mb-n1 mx-6 class="note-list">
          <div class="d-flex">
            <div class="mr-2 note-list__icon">
              <img :src="require(`../../../public/img/icons/check-circle-primary.svg`)" width="12" />
            </div>
            <div class="caption text_2--text">{{ t('dappTransfer.dataSmall') }}</div>
          </div>
        </v-flex>
        <v-flex xs12 mb-4 mx-6>
          <v-list class="note-list">
            <v-list-item class="pa-0">
              <v-list-item-content flat class="pa-1 background" :class="$vuetify.theme.dark ? 'lighten-4' : 'lighten-3'">
                <v-card flat class="body-2 text-left pa-2 word-break typedMessageBox">
                  <v-expansion-panels v-if="type === TX_PERSONAL_MESSAGE || type === TX_MESSAGE">
                    <p :class="$vuetify.theme.dark ? 'text_1--text' : 'text_2--text'" style="text-align:left">{{ message }}</p>
                  </v-expansion-panels>

                  <v-expansion-panels v-else-if="type === TX_TYPED_MESSAGE && !Array.isArray(typedMessages)">
                    <v-expansion-panel v-for="(typedMessage, index) in typedMessages" :key="index">
                      <v-expansion-panel-header>{{ index }}</v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <VueJsonPretty :path="'res'" :data="typedMessage" :showline="true" :deep="5"></VueJsonPretty>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>

                  <v-expansion-panels v-else-if="type === TX_TYPED_MESSAGE && Array.isArray(typedMessages)">
                    <v-expansion-panel>
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
        <v-layout px-6 mx-3>
          <v-flex xs6>
            <v-btn block text large class="text_2--text" @click.prevent="triggerDeny">{{ t('dappTransfer.cancel') }}</v-btn>
          </v-flex>
          <v-flex xs6>
            <v-btn block depressed large color="torus_brand1" class="ml-2" @click.prevent="triggerSign">{{ t('dappTransfer.confirm') }}</v-btn>
          </v-flex>
        </v-layout>
      </v-layout>
    </template>
    <template v-if="type === 'none'">
      <PopupScreenLoader />
    </template>
  </v-container>
</template>

<script>
import BigNumber from 'bignumber.js'
import { BroadcastChannel } from 'broadcast-channel'
import collectibleABI from 'human-standard-collectible-abi'
import tokenABI from 'human-standard-token-abi'
import log from 'loglevel'
import VueJsonPretty from 'vue-json-pretty'
import { fromWei, hexToNumber, toChecksumAddress } from 'web3-utils'

import TransferConfirm from '../../components/Confirm/TransferConfirm'
import NetworkDisplay from '../../components/helpers/NetworkDisplay'
import ShowToolTip from '../../components/helpers/ShowToolTip'
import TransactionSpeedSelect from '../../components/helpers/TransactionSpeedSelect'
import config from '../../config'
import { PopupScreenLoader } from '../../content-loader'
import {
  COLLECTIBLE_METHOD_SAFE_TRANSFER_FROM,
  CONTRACT_INTERACTION_KEY,
  DEPLOY_CONTRACT_ACTION_KEY,
  SEND_ETHER_ACTION_KEY,
  TOKEN_METHOD_APPROVE,
  TOKEN_METHOD_TRANSFER,
  TOKEN_METHOD_TRANSFER_FROM,
  TX_MESSAGE,
  TX_PERSONAL_MESSAGE,
  TX_TRANSACTION,
  TX_TYPED_MESSAGE
} from '../../utils/enums'
import { get } from '../../utils/httpHelpers'
// import PermissionConfirm from '../../components/Confirm/PermissionConfirm'
import { addressSlicer, broadcastChannelOptions, significantDigits } from '../../utils/utils'

const weiInGwei = new BigNumber('10').pow(new BigNumber('9'))

export default {
  name: 'Confirm',
  components: {
    VueJsonPretty,
    PopupScreenLoader,
    TransactionSpeedSelect,
    TransferConfirm,
    // PermissionConfirm,
    NetworkDisplay,
    ShowToolTip
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
        chainId: ''
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
      TX_MESSAGE
    }
  },
  computed: {
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
          return `ID: ${this.amountValue}`
        case SEND_ETHER_ACTION_KEY:
        case CONTRACT_INTERACTION_KEY:
          return `${this.amountDisplay(this.value)} ETH`
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
      if ([TOKEN_METHOD_APPROVE, TOKEN_METHOD_TRANSFER, TOKEN_METHOD_TRANSFER_FROM].includes(this.transactionCategory)) {
        return `${this.displayAmountValue}`
      }
      return `${this.totalEthCostDisplay} ETH`
    },
    isOtherToken() {
      return [TOKEN_METHOD_APPROVE, TOKEN_METHOD_TRANSFER, TOKEN_METHOD_TRANSFER_FROM].includes(this.transactionCategory)
      // `+ ${significantDigits(this.gasCost)}`
    },
    costOfTransactionConverted() {
      const totalCost = this.isOtherToken
        ? significantDigits(this.totalUsdCost + this.amountTokenValueConverted.toNumber(), false, 5)
        : this.totalUsdCost
      return `~ ${totalCost} ${this.selectedCurrency}`
    },
    imageType() {
      return this.transactionCategory === DEPLOY_CONTRACT_ACTION_KEY || this.transactionCategory === CONTRACT_INTERACTION_KEY
        ? 'images/file-signature.svg'
        : 'images/user.svg'
    },
    getCurrencyMultiplier() {
      log.info(this.selectedCurrency)
      const currencyMultiplierNumber = this.selectedCurrency !== 'ETH' ? this.currencyData[this.selectedCurrency.toLowerCase()] || 1 : 1
      return new BigNumber(currencyMultiplierNumber)
    },
    getCurrencyRate() {
      const ethConverted = this.getCurrencyMultiplier
      const tokenPriceConverted = this.isOtherToken ? this.tokenPrice.times(ethConverted) : ethConverted
      const selectedToken = this.isOtherToken ? this.selectedToken : 'ETH'
      return `1 ${selectedToken} = ${significantDigits(tokenPriceConverted)} ${this.selectedCurrency} @ ${this.currencyRateDate}`
    }
  },
  watch: {
    gasPrice(newGasPrice, oldGasPrice) {
      if (!newGasPrice.eq(oldGasPrice)) {
        this.gasCost = newGasPrice.times(this.gasEstimate).div(new BigNumber('10').pow(new BigNumber('9')))
        this.txFees = this.gasCost.times(this.getCurrencyMultiplier)
        const ethCost = this.value.plus(this.gasCost)
        this.totalEthCost = ethCost // significantDigits(ethCost.toFixed(5), false, 3) || 0
        const gasCostLength = Math.max(significantDigits(this.gasCost).toString().length, significantDigits(ethCost).toString().length)
        this.totalEthCostDisplay = significantDigits(ethCost, false, gasCostLength - 2)
        this.totalUsdCost = significantDigits(ethCost.times(this.getCurrencyMultiplier))
        if (this.balance.lt(ethCost) && !this.canShowError) {
          this.errorMsg = this.t('dappTransfer.insufficientFunds')
          this.topUpErrorShow = true
        }
      }
    }
  },
  mounted() {
    const queryParameters = new URLSearchParams(window.location.search)
    const instanceId = queryParameters.get('instanceId')
    const queryParameterId = queryParameters.get('id')
    this.channel = `torus_channel_${instanceId}`
    const bc = new BroadcastChannel(this.channel, broadcastChannelOptions)
    bc.addEventListener('message', async ev => {
      if (ev.name !== 'send-params') return
      const { type, msgParams, txParams, origin, balance, selectedCurrency, tokenRates, jwtToken, currencyData, network } = ev.data || {}
      this.selectedCurrency = selectedCurrency
      this.currencyData = currencyData
      if (txParams && txParams.id.toString() !== queryParameterId) return
      bc.close()
      this.balance = new BigNumber(balance)
      log.info({ msgParams, txParams })
      this.origin = origin
      if (type !== TX_TRANSACTION) {
        const { msgParams: { message, typedMessages } = {}, id = '' } = msgParams
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
        const { simulationFails, id, transactionCategory, methodParams, contractParams, txParams: txObject } = txParams || {}
        const { value, to, data, from: sender, gas, gasPrice } = txObject || {}
        const { reason = '' } = simulationFails || {}
        if (value) {
          finalValue = new BigNumber(fromWei(value.toString()))
        }
        // Get ABI for method
        let txDataParameters = ''
        if (contractParams.erc721) {
          txDataParameters = collectibleABI.find(item => item.name && item.name.toLowerCase() === transactionCategory) || ''
        } else if (contractParams.erc20) {
          txDataParameters = tokenABI.find(item => item.name && item.name.toLowerCase() === transactionCategory) || ''
        }
        // Get Params from method type ABI
        let amountTo
        let amountValue
        if (methodParams && Array.isArray(methodParams)) {
          if (transactionCategory === TOKEN_METHOD_TRANSFER_FROM || transactionCategory === COLLECTIBLE_METHOD_SAFE_TRANSFER_FROM) {
            ;[amountTo, amountValue] = methodParams || []
          } else [amountTo, amountValue] = methodParams || []
        }
        log.info(methodParams, 'params')
        const checkSummedTo = toChecksumAddress(to)
        const tokenObject = contractParams
        const decimals = new BigNumber(tokenObject.decimals || '0')
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
          this.amountTokenValueConverted = this.tokenPrice.times(this.amountValue).times(this.getCurrencyMultiplier)
        } else if (methodParams && contractParams.erc721) {
          log.info(methodParams, contractParams)
          this.isNonFungibleToken = true
          let assetDetails = {}
          try {
            const url = `https://api.opensea.io/api/v1/asset/${checkSummedTo}/${this.amountValue}`
            assetDetails = await get(`${config.api}/opensea?url=${url}`, {
              headers: {
                Authorization: `Bearer ${jwtToken}`
              }
            })
            this.assetDetails = {
              name: assetDetails.data.name || '',
              logo: assetDetails.data.image_thumbnail_url || ''
            }
          } catch (error) {
            log.info(error)
          }
        }
        this.currencyRateDate = this.getDate()
        this.receiver = to // address of receiver
        this.value = finalValue // value of eth sending
        this.dollarValue = significantDigits(finalValue.times(this.getCurrencyMultiplier))
        this.gasPrice = gweiGasPrice // gas price in gwei
        this.balanceUsd = significantDigits(this.balance.times(this.getCurrencyMultiplier)) // in usd
        this.gasEstimate = new BigNumber(hexToNumber(gas)) // gas number
        this.txData = data // data hex
        this.txDataParams = txDataParameters !== '' ? JSON.stringify(txDataParameters, null, 2) : ''
        this.sender = sender // address of sender
        this.gasCost = gweiGasPrice.times(this.gasEstimate).div(new BigNumber('10').pow(new BigNumber('9')))
        this.txFees = this.gasCost.times(this.getCurrencyMultiplier)
        const ethCost = finalValue.plus(this.gasCost)
        this.totalEthCost = ethCost // significantDigits(ethCost.toFixed(5), false, 3) || 0
        const gasCostLength = Math.max(significantDigits(this.gasCost).toString().length, significantDigits(ethCost).toString().length)
        this.totalEthCostDisplay = significantDigits(ethCost, false, gasCostLength - 2)
        this.totalUsdCost = significantDigits(ethCost.times(this.getCurrencyMultiplier))
        if (reason) {
          this.errorMsg = reason
          this.canShowError = true
        }
        if (this.balance.lt(ethCost) && !this.canShowError) {
          this.errorMsg = this.t('dappTransfer.insufficientFunds')
          this.topUpErrorShow = true
        }
      }
      this.type = type // type of tx
    })
    bc.postMessage({ name: 'popup-loaded', data: { id: queryParameterId } })
  },
  methods: {
    slicedAddress(user) {
      return addressSlicer(user) || '0x'
    },
    async triggerSign() {
      const bc = new BroadcastChannel(this.channel, broadcastChannelOptions)
      const gasHex = `0x${this.gasPrice.times(weiInGwei).toString(16)}`
      await bc.postMessage({
        name: 'tx-result',
        data: { type: 'confirm-transaction', gasPrice: gasHex, id: this.id, txType: this.type }
      })
      bc.close()
    },
    async triggerDeny() {
      const bc = new BroadcastChannel(this.channel, broadcastChannelOptions)
      await bc.postMessage({ name: 'tx-result', data: { type: 'deny-transaction', id: this.id, txType: this.type } })
      bc.close()
    },
    topUp() {
      this.$router.push({ path: '/wallet/topup' }).catch(_ => {})
    },
    onSelectSpeed(data) {
      this.speedSelected = data.speedSelected
      this.gasPrice = data.activeGasPrice
      this.speed = data.speed
      this.gas = data.gas

      if (data.isReset) {
        this.gasPrice = this.speedSelected === '' ? '' : this.gasPrice
      }
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
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'Confirm.scss';
</style>
