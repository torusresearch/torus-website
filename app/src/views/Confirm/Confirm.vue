<template>
  <v-container py-6 px-0 class="confirm-container">
    <template v-if="type === 'transaction'">
      <v-layout wrap align-center mx-6 mb-6>
        <v-flex xs12 class="text_1--text font-weight-bold headline float-left" :class="isLightHeader ? 'text--lighten-3' : ''">{{ header }}</v-flex>
        <v-flex xs12>
          <network-display></network-display>
        </v-flex>
      </v-layout>
      <v-layout wrap>
        <template v-if="transactionCategory === COLLECTIBLE_METHOD_SAFE_TRANSFER_FROM">
          <v-flex xs12 mb-4 mx-6>
            <div class="subtitle-2">Send to</div>
            <v-divider></v-divider>
            <div>
              <span class="subtitle-2 float-left text_2--text">{{ amountTo }}</span>
            </div>
          </v-flex>
          <v-flex xs12 mb-4 mx-6>
            <div class="subtitle-2">You send</div>
            <v-divider class="mb-1"></v-divider>
            <div>
              <img class="mr-2 float-left" :src="assetDetails.logo" height="35px" />
              <span class="subtitle-2 float-left text_2--text asset-name">{{ assetDetails.name }}</span>
            </div>
          </v-flex>
        </template>
        <v-flex v-else xs12 mb-4 mx-6>
          <div class="subtitle-2">Amount</div>
          <v-divider></v-divider>
          <div>
            <span class="subtitle-2 float-left text_2--text">{{ displayAmountTo }}</span>
            <span class="subtitle-2 float-right">{{ displayAmountValue }}</span>
          </div>
          <div class="caption float-right clearfix">{{ displayAmountConverted }}</div>
        </v-flex>
        <v-flex px-2>
          <TransactionSpeedSelect
            :gas="gasEstimate"
            :displayAmount="value"
            :activeGasPriceConfirm="gasPrice"
            @onSelectSpeed="onSelectSpeed"
            :symbol="'ETH'"
          />
        </v-flex>
        <v-flex xs12 px-6 mt-4 mb-1>
          <div class="subtitle-1 font-weight-bold">Total</div>
          <v-divider></v-divider>
          <div>
            <span class="subtitle-2">Cost of Transaction</span>
            <span class="subtitle-1 float-right primary--text font-weight-bold">{{ costOfTransaction }}</span>
          </div>
          <div v-if="isOtherToken" class="clearfix">
            <span class="subtitle-1 float-right primary--text font-weight-bold">+ {{ significantDigits(this.gasCost) }} ETH</span>
          </div>
          <div class="caption float-right clearfix">{{ costOfTransactionConverted }}</div>
        </v-flex>
        <v-flex xs12 mb-3 mt-3>
          <v-dialog v-model="detailsDialog" width="600px">
            <template v-slot:activator="{ on }">
              <div id="more-details-link" class="subtitle-2 float-right primary--text mx-6" v-on="on">More Details</div>
            </template>
            <v-card class="pa-4 more-details-container">
              <v-card-text class="text_1--text">
                <v-layout wrap>
                  <v-flex xs4 sm2>
                    Rate
                    <span class="float-right mr-4">:</span>
                  </v-flex>
                  <v-flex id="currency-rate" xs8 sm10 class="text_2--text">{{ getCurrencyRate }}</v-flex>
                  <v-flex xs4 sm2>
                    Network
                    <span class="float-right mr-4">:</span>
                  </v-flex>
                  <v-flex xs8 sm10 class="text_2--text">
                    <span id="network" class="text-capitalize">{{ networkName }}</span>
                  </v-flex>
                  <v-flex xs4 sm2>
                    Type
                    <span class="float-right mr-4">:</span>
                  </v-flex>
                  <v-flex id="type" xs8 sm10 class="text_2--text">{{ header }}</v-flex>
                  <v-flex xs2 v-if="txData || txDataParams !== ''">
                    Data
                    <span class="float-right mr-4">:</span>
                  </v-flex>
                  <v-flex xs12 mt-1>
                    <v-card flat color="background_3" v-if="txDataParams !== ''">
                      <v-card-text>
                        <pre>{{ txDataParams }}</pre>
                      </v-card-text>
                    </v-card>
                  </v-flex>
                  <v-flex x12 mt-4 v-if="txData">
                    <div class="mb-1">Hex Data:</div>
                    <v-card flat color="background_3" style="word-break: break-all">
                      <v-card-text>{{ txData }}</v-card-text>
                    </v-card>
                  </v-flex>
                </v-layout>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn id="less-details-link" color="primary" text @click="detailsDialog = false">Less Details</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-flex>
        <v-flex xs12 px-6 mb-6 class="text-right" v-if="canShowError">
          <div class="caption error--text">{{ errorMsg }}</div>
          <div class="caption mt-1" v-if="topUpErrorShow">
            Please
            <v-btn color="primary" class="mx-1 px-2 caption" small outlined @click="topUp">Top up</v-btn>
            your wallet
          </div>
        </v-flex>
        <v-flex xs12 px-6 mb-6 v-if="showConfirmMessage">
          <div class="caption error--text">
            By confirming this, you grant permission for this contract to spend up to {{ displayAmountValue }} of your tokens.
          </div>
        </v-flex>
        <v-layout px-6>
          <v-flex xs6>
            <v-btn block text large class="text_2--text" @click="triggerDeny">Cancel</v-btn>
          </v-flex>
          <v-flex xs6>
            <v-dialog v-model="confirmDialog" max-width="550" persistent>
              <template v-slot:activator="{ on }">
                <v-btn id="confirm-btn" :disabled="!canApprove" block depressed large color="primary" class="ml-2" v-on="on">Confirm</v-btn>
              </template>
              <transfer-confirm
                :toAddress="receiver"
                :convertedAmount="displayAmountConverted"
                :displayAmount="displayAmountValue"
                :speedSelected="speed"
                :transactionFee="txFees"
                :selectedCurrency="selectedCurrency"
                @onClose="confirmDialog = false"
                @onConfirm="triggerSign"
              ></transfer-confirm>
            </v-dialog>
          </v-flex>
        </v-layout>
      </v-layout>
    </template>

    <template v-if="type === 'message'">
      <v-layout wrap align-center mx-6 mb-6>
        <v-flex xs12 class="text_1--text font-weight-bold headline float-left">Permissions</v-flex>
        <v-flex xs12>
          <network-display></network-display>
        </v-flex>
      </v-layout>
      <v-layout wrap>
        <v-flex xs12 mb-6 mx-6>
          <div class="subtitle-2 text_2--text">Request from:</div>

          <v-card flat class="background lighten-3">
            <v-card-text>
              <div class="subtitle-2 primary--text">{{ origin }}</div>
            </v-card-text>
            <img :src="require('../../../public/img/icons/open-in-new-grey.svg')" class="card-upper-icon" />
          </v-card>
        </v-flex>

        <v-flex xs12 mb-4 mx-6>
          <v-list class="note-list">
            <v-list-item class="pa-0">
              <v-list-item-icon class="ma-1">
                <img :src="require(`../../../public/img/icons/check-circle-primary.svg`)" width="12" />
              </v-list-item-icon>
              <v-list-item-content class="pa-1">
                <div class="caption text_2--text">This application is requesting for your digital signature.</div>
              </v-list-item-content>
            </v-list-item>
            <v-list-item class="pa-0">
              <v-list-item-content flat class="pa-1 background lighten-3">
                <v-card flat class="body-2 text-left pa-2 word-break typedMessageBox">
                  <v-expansion-panels v-if="typeof message === 'string'">
                    <p :class="$vuetify.theme.dark ? 'text_1--text' : 'text_2--text'" style="text-align:left">{{ message }}</p>
                  </v-expansion-panels>

                  <v-expansion-panels v-else-if="!Array.isArray(typedMessages)">
                    <v-expansion-panel v-for="(value, index) in typedMessages" :key="index">
                      <v-expansion-panel-header>{{ index }}</v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <vue-json-pretty :path="'res'" :data="value" :showline="true" :deep="5"></vue-json-pretty>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>

                  <v-expansion-panels v-else-if="Array.isArray(typedMessages)">
                    <v-expansion-panel>
                      <v-expansion-panel-header>data</v-expansion-panel-header>
                      <v-expansion-panel-content v-for="value in typedMessages" :key="value">
                        <vue-json-pretty :path="'res'" :data="value" :showline="true" :deep="5"></vue-json-pretty>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-card>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-flex>
        <!-- <v-flex xs12 mt-12 mb-5 mx-7>
          <div class="caption text_2--text">
            Note : You may re-adjust the dapp permission later under ‘Settings > Dapp Permission’
          </div>
        </v-flex>-->
        <v-layout px-6 mx-3>
          <v-flex xs6>
            <v-btn block text large class="text_2--text" @click="triggerDeny">Cancel</v-btn>
          </v-flex>
          <v-flex xs6>
            <v-btn block depressed large color="primary" class="ml-2" @click="triggerSign">Confirm</v-btn>
          </v-flex>
        </v-layout>
      </v-layout>
    </template>
    <template v-if="type === 'none'">
      <page-loader />
    </template>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex' // Maybe dispatch a bc to show popup from that instance
import VueJsonPretty from 'vue-json-pretty'
import { BroadcastChannel } from 'broadcast-channel'
import { numberToHex, fromWei, toChecksumAddress, hexToNumber } from 'web3-utils'
import ShowToolTip from '../../components/helpers/ShowToolTip'
import PageLoader from '../../components/helpers/PageLoader'
import TransactionSpeedSelect from '../../components/helpers/TransactionSpeedSelect'
import TransferConfirm from '../../components/Confirm/TransferConfirm'
import NetworkDisplay from '../../components/helpers/NetworkDisplay'
import torus from '../../torus'
import {
  significantDigits,
  calculateGasKnob,
  calculateGasPrice,
  addressSlicer,
  isSmartContractAddress,
  broadcastChannelOptions
} from '../../utils/utils'
import { get } from '../../utils/httpHelpers'
import config from '../../config'
import { isArray } from 'util'

const tokenABI = require('human-standard-token-abi')
const collectibleABI = require('human-standard-collectible-abi')
const contracts = require('eth-contract-metadata')
const log = require('loglevel')

const {
  RPC,
  RPC_DISPLAY_NAME,
  CONTRACT_INTERACTION_KEY,
  DEPLOY_CONTRACT_ACTION_KEY,
  TOKEN_METHOD_APPROVE,
  TOKEN_METHOD_TRANSFER,
  TOKEN_METHOD_TRANSFER_FROM,
  COLLECTIBLE_METHOD_SAFE_TRANSFER_FROM,
  SEND_ETHER_ACTION_KEY,
  SUPPORTED_NETWORK_TYPES,
  OLD_ERC721_LIST
} = require('../../utils/enums')

const weiInGwei = 10 ** 9

export default {
  name: 'confirm',
  components: {
    PageLoader,
    TransactionSpeedSelect,
    TransferConfirm,
    VueJsonPretty,
    NetworkDisplay
  },
  data() {
    return {
      confirmDialog: false,
      detailsDialog: false,
      dialogAdvanceOptions: false,
      open: false,
      type: 'none',
      origin: 'unknown',
      gasPrice: 10,
      gasKnob: 10,
      min: 100,
      max: 4000,
      balance: 0,
      value: 0,
      amountTo: '',
      amountValue: '',
      tokenPrice: 0,
      amountTokenValueConverted: 0,
      currencyRateDate: '',
      receiver: 'unknown',
      dialog: true,
      message: '',
      selectedToken: '',
      gasCost: 0,
      gasEstimate: 0,
      txData: '',
      txDataParams: '',
      sender: '',
      totalUsdCost: 0,
      totalEthCost: 0,
      totalEthCostDisplay: '',
      errorMsg: '',
      topUpErrorShow: '',
      txFees: 0,
      network: '',
      networkName: '',
      transactionCategory: '',
      dollarValue: 0,
      canApprove: true,
      canShowError: false,
      selectedSpeed: '',
      speed: '',
      typedMessages: {},
      id: 0,
      assetDetails: {},
      COLLECTIBLE_METHOD_SAFE_TRANSFER_FROM: COLLECTIBLE_METHOD_SAFE_TRANSFER_FROM,
      networks: [
        ...Object.values(SUPPORTED_NETWORK_TYPES),
        {
          networkName: RPC_DISPLAY_NAME,
          host: RPC,
          chainId: ''
        }
      ]
    }
  },
  computed: {
    selectedCurrency() {
      return this.$store.state.selectedCurrency
    },
    color() {
      if (this.gasPrice < 5) return 'indigo'
      if (this.gasPrice < 10) return 'teal'
      if (this.gasPrice < 30) return 'green'
      if (this.gasPrice < 50) return 'orange'
      return 'red'
    },
    computedBalance() {
      return significantDigits(parseFloat(this.balance).toFixed(5)) || 0
    },
    header() {
      switch (this.transactionCategory) {
        case DEPLOY_CONTRACT_ACTION_KEY:
          // return 'Contract Deployment'
          return 'Deploy'
          break
        case CONTRACT_INTERACTION_KEY:
          return this.getHeaderByDapp()
          break
        case COLLECTIBLE_METHOD_SAFE_TRANSFER_FROM:
          // return 'ERC721 SafeTransferFrom'
          return 'Collectible Safe Transfer From'
          break
        case TOKEN_METHOD_APPROVE:
          // return 'ERC20 Approve'
          return 'Approve'
          break
        case TOKEN_METHOD_TRANSFER:
        case SEND_ETHER_ACTION_KEY:
          // return 'ERC2O Transfer'
          // return 'Send Ether'
          return 'Transfer'
          break
        case TOKEN_METHOD_TRANSFER_FROM:
          // return 'ERC2O Transfer From'
          return 'Transfer From'
          break
        default:
          // return 'Transaction Request'
          return 'Transaction'
          break
      }
    },
    isLightHeader() {
      return [DEPLOY_CONTRACT_ACTION_KEY, CONTRACT_INTERACTION_KEY].indexOf(this.transactionCategory) >= 0
    },
    displayAmountTo() {
      switch (this.transactionCategory) {
        case TOKEN_METHOD_APPROVE:
        case TOKEN_METHOD_TRANSFER:
        case TOKEN_METHOD_TRANSFER_FROM:
          return `To: ${this.slicedAddress(this.amountTo)}`
          break
        case SEND_ETHER_ACTION_KEY:
        case CONTRACT_INTERACTION_KEY:
          return `To: ${this.slicedAddress(this.receiver)}`
          break
        case DEPLOY_CONTRACT_ACTION_KEY:
          return 'New Contract'
          break
        default:
          return 'Transaction Request'
          break
      }
    },
    displayAmountValue() {
      switch (this.transactionCategory) {
        case TOKEN_METHOD_APPROVE:
        case TOKEN_METHOD_TRANSFER:
        case TOKEN_METHOD_TRANSFER_FROM:
          return `${this.amountDisplay(this.amountValue)} ${this.selectedToken}`
          break
        case COLLECTIBLE_METHOD_SAFE_TRANSFER_FROM:
          return `ID: ${this.amountValue}`
          break
        case SEND_ETHER_ACTION_KEY:
        case CONTRACT_INTERACTION_KEY:
          return `${this.amountDisplay(this.value)} ETH`
          break
        case DEPLOY_CONTRACT_ACTION_KEY:
          return 'Not Applicable'
          break
        default:
          return 'Transaction Request'
          break
      }
    },
    displayAmountConverted() {
      switch (this.transactionCategory) {
        case TOKEN_METHOD_APPROVE:
        case TOKEN_METHOD_TRANSFER:
        case TOKEN_METHOD_TRANSFER_FROM:
          return `~ ${significantDigits(this.amountTokenValueConverted)} ${this.selectedCurrency}`
          break
        case SEND_ETHER_ACTION_KEY:
        case CONTRACT_INTERACTION_KEY:
          return `~ ${this.dollarValue} ${this.selectedCurrency}`
          break
        case DEPLOY_CONTRACT_ACTION_KEY:
          return ''
          break
        default:
          return ''
          break
      }
    },
    showConfirmMessage() {
      return this.transactionCategory === TOKEN_METHOD_APPROVE
    },
    costOfTransaction() {
      if ([TOKEN_METHOD_APPROVE, TOKEN_METHOD_TRANSFER, TOKEN_METHOD_TRANSFER_FROM].indexOf(this.transactionCategory) >= 0) {
        return `${this.displayAmountValue}`
      } else {
        return `${this.totalEthCostDisplay} ETH`
      }
    },
    isOtherToken() {
      return [TOKEN_METHOD_APPROVE, TOKEN_METHOD_TRANSFER, TOKEN_METHOD_TRANSFER_FROM].indexOf(this.transactionCategory) >= 0
      //`+ ${significantDigits(this.gasCost)}`
    },
    costOfTransactionConverted() {
      const totalCost = this.isOtherToken ? significantDigits(this.totalUsdCost + this.amountTokenValueConverted, false, 5) : this.totalUsdCost
      return `~ ${totalCost} ${this.selectedCurrency}`
    },
    imageType() {
      return this.transactionCategory === DEPLOY_CONTRACT_ACTION_KEY || this.transactionCategory === CONTRACT_INTERACTION_KEY
        ? 'images/file-signature.svg'
        : 'images/user.svg'
    },
    getCurrencyMultiplier() {
      const { selectedCurrency, currencyData } = this.$store.state || {}
      let currencyMultiplier = 1
      if (selectedCurrency !== 'ETH') currencyMultiplier = currencyData[selectedCurrency.toLowerCase()] || 1
      return currencyMultiplier
    },
    getCurrencyRate() {
      const ethConverted = this.$store.state.currencyData[this.selectedCurrency.toLowerCase()]
      const tokenPriceConverted = this.isOtherToken ? this.tokenPrice * ethConverted : ethConverted
      const selectedToken = this.isOtherToken ? this.selectedToken : 'ETH'
      return `1 ${selectedToken} = ${significantDigits(tokenPriceConverted)} ${this.selectedCurrency} @ ${this.currencyRateDate}`
    }
  },
  watch: {
    gasPrice: function(newGasPrice, oldGasPrice) {
      this.gasCost = newGasPrice * this.gasEstimate * 10 ** -9
      this.txFees = this.gasCost * this.$store.state.currencyData[this.selectedCurrency.toLowerCase()]
      const ethCost = parseFloat(this.value) + this.gasCost
      this.totalEthCost = ethCost // significantDigits(ethCost.toFixed(5), false, 3) || 0
      const gasCostLength = Math.max(significantDigits(this.gasCost).toString().length, significantDigits(ethCost).toString().length)
      this.totalEthCostDisplay = significantDigits(ethCost, false, gasCostLength - 2)
      this.totalUsdCost = significantDigits(ethCost * this.$store.state.currencyData[this.selectedCurrency.toLowerCase()] || 0)
      if (parseFloat(this.balance) < ethCost && !this.canShowError) {
        this.errorMsg = 'Insufficient Funds'
        this.canApprove = false
        this.topUpErrorShow = true
      }
    },
    gasKnob: function(newGasKnob, oldGasKnob) {
      this.gasPrice = calculateGasPrice(newGasKnob)
    },
    errorMsg: function(newErrorMsg, oldErrorMsg) {
      if (newErrorMsg !== oldErrorMsg) {
        const boolean = newErrorMsg && newErrorMsg !== ''
        this.canShowError = boolean
        this.canApprove = !boolean
      }
    }
  },
  methods: {
    slicedAddress(user) {
      return addressSlicer(user) || '0x'
    },
    closeBottom() {
      this.open = false
    },
    openBottom() {
      this.open = true
    },
    async triggerSign(event) {
      var bc = new BroadcastChannel(`torus_channel_${new URLSearchParams(window.location.search).get('instanceId')}`, broadcastChannelOptions)
      var gasHex = numberToHex(this.gasPrice * weiInGwei)
      await bc.postMessage({
        data: { type: 'confirm-transaction', gasPrice: gasHex, id: this.id }
      })
      bc.close()
      window.close()
    },
    async triggerDeny(event) {
      var bc = new BroadcastChannel(`torus_channel_${new URLSearchParams(window.location.search).get('instanceId')}`, broadcastChannelOptions)
      await bc.postMessage({ data: { type: 'deny-transaction', id: this.id } })
      bc.close()
      window.close()
    },
    topUp() {
      this.openWallet()
    },
    openWallet() {
      this.$store.dispatch('showWalletPopup')
    },
    showGasPrice(val) {
      return `Fee: $ ${significantDigits(parseFloat(this.txFees).toFixed(3))}`
    },
    getGasDisplayString(speed, fastGasPrice) {
      const currencyMultiplier = this.getCurrencyMultiplier
      const ethFee = this.gasEstimate * fastGasPrice * 10 ** -9
      const currencyFee = ethFee * currencyMultiplier
      return `${significantDigits(currencyFee)} ${this.$store.state.selectedCurrency}`
    },
    onSelectSpeed(data) {
      this.speedSelected = data.speedSelected
      this.gasPrice = data.activeGasPrice
      this.speed = data.speed
      this.gas = data.gas

      if (data.isReset) {
        this.gasPrice = calculateGasPrice(this.gasPrice)
      }
    },
    getNetworkName(targetNetwork) {
      const foundNetwork = this.networks.find(network => network.host === targetNetwork)
      if (!foundNetwork || foundNetwork === -1) return 'UnKnown Network'
      return Object.prototype.hasOwnProperty.call(foundNetwork, 'networkName') ? foundNetwork.networkName : 'UnKnown Network'
    },
    getDate() {
      const currentDateTime = new Date()
      let hours = currentDateTime.getHours()
      let minutes = currentDateTime.getMinutes()
      let seconds = currentDateTime.getSeconds()
      const ampm = hours >= 12 ? 'PM' : 'AM'

      hours = hours % 12
      hours = hours || 12
      return `${hours}:${minutes}:${seconds} ${ampm}`
    },
    amountDisplay(amount) {
      return significantDigits(parseFloat(amount).toFixed(5)) ? significantDigits(parseFloat(amount).toFixed(5)) : parseFloat('0.00').toFixed(2)
    },
    significantDigits: significantDigits,
    getHeaderByDapp() {
      // For partner integration
      if (this.origin === 'www.etheremon.com') {
        return 'Claim a Mon'
      }
      return 'Contract Interaction'
    },
    ...mapActions({})
  },
  mounted() {
    var bc = new BroadcastChannel(`torus_channel_${new URLSearchParams(window.location.search).get('instanceId')}`, broadcastChannelOptions)
    bc.onmessage = async ev => {
      const { type, msgParams, txParams, origin, balance } = ev.data || {}
      let url = { hostname: '' }
      try {
        url = new URL(origin)
      } catch (err) {
        log.info(err)
      }
      log.info(txParams)
      this.origin = url.hostname // origin of tx: website url
      if (type === 'message') {
        var { message, typedMessages } = msgParams.msgParams || {}
        if (typedMessages) {
          try {
            typedMessages = JSON.parse(typedMessages)
          } catch (e) {
            log.error(e)
          }
        }
        const { id } = msgParams || {}
        this.id = id
        this.message = message
        this.typedMessages = typedMessages
        this.messageType = typedMessages ? 'typed' : 'normal'
      } else if (type === 'transaction') {
        let finalValue = 0
        const { value, to, data, from: sender, gas, gasPrice } = txParams.txParams || {}
        let { simulationFails, network, id, transactionCategory, methodParams, contractParams } = txParams || {}
        const { reason } = simulationFails || {}
        if (value) {
          finalValue = fromWei(value.toString())
        }
        this.origin = this.origin.trim().length === 0 ? 'Wallet' : this.origin
        // GET data params
        let txDataParams = ''
        if (contractParams.erc721) {
          txDataParams = collectibleABI.find(item => item.name && item.name.toLowerCase() === transactionCategory) || ''
        } else if (contractParams.erc20) {
          txDataParams = collectibleABI.find(item => item.name && item.name.toLowerCase() === transactionCategory) || ''
        }
        // log.info(methodParams, 'params')
        let amountTo, amountValue, amountFrom
        if (methodParams && isArray(methodParams)) {
          if (transactionCategory === TOKEN_METHOD_TRANSFER_FROM || transactionCategory === COLLECTIBLE_METHOD_SAFE_TRANSFER_FROM)
            [amountFrom, amountTo, amountValue] = methodParams || []
          else [amountTo, amountValue] = methodParams || []
        }
        log.info(methodParams, 'params')
        const checkSummedTo = toChecksumAddress(to)

        if (OLD_ERC721_LIST.includes(checkSummedTo.toLowerCase())) {
          transactionCategory = COLLECTIBLE_METHOD_SAFE_TRANSFER_FROM
          contractParams.erc721 = true
          contractParams.erc20 = false
          contractParams.symbol = 'ERC721'
          contractParams.decimals = 0
        }

        const tokenObj = contractParams
        const decimals = tokenObj.decimals || 0
        this.selectedToken = tokenObj.symbol || 'ERC20'
        this.id = id
        this.network = network
        this.networkName = this.getNetworkName(network)
        this.transactionCategory = transactionCategory
        var gweiGasPrice = hexToNumber(gasPrice) / weiInGwei
        this.amountTo = amountTo ? amountTo.value : checkSummedTo
        this.amountValue = amountValue ? parseFloat(amountValue.value) / 10 ** parseFloat(decimals) : ''
        if (methodParams && contractParams.erc20) {
          const pairs = checkSummedTo
          const query = `contract_addresses=${pairs}&vs_currencies=eth`
          let prices = {}
          try {
            prices = await get(`https://api.coingecko.com/api/v3/simple/token_price/ethereum?${query}`)
          } catch (error) {
            log.info(error)
          }
          const tokenPrice = //token price in eth
            prices[checkSummedTo.toLowerCase()] && prices[checkSummedTo.toLowerCase()].eth ? prices[checkSummedTo.toLowerCase()].eth : 0
          this.tokenPrice = tokenPrice
          this.amountTokenValueConverted =
            tokenPrice * parseFloat(this.amountValue) * this.$store.state.currencyData[this.selectedCurrency.toLowerCase()]
        } else if (methodParams && contractParams.erc721) {
          log.info(methodParams, contractParams)
          let assetDetails = {}
          try {
            const url = `https://api.opensea.io/api/v1/asset/${checkSummedTo}/${this.amountValue}`
            assetDetails = await get(`${config.api}/opensea?url=${url}`, {
              headers: {
                Authorization: `Bearer ${this.$store.state.jwtToken}`
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
        this.dollarValue = significantDigits(parseFloat(finalValue) * this.$store.state.currencyData[this.selectedCurrency.toLowerCase()])
        this.gasPrice = gweiGasPrice // gas price in gwei
        this.gasKnob = calculateGasKnob(gweiGasPrice)
        this.balance = balance // in eth
        this.balanceUsd = significantDigits(parseFloat(balance) * this.$store.state.currencyData[this.selectedCurrency.toLowerCase()]) // in usd
        this.gasEstimate = hexToNumber(gas) // gas number
        this.txData = data // data hex
        this.txDataParams = txDataParams !== '' ? JSON.stringify(txDataParams, null, 2) : ''
        this.sender = sender // address of sender
        this.gasCost = gweiGasPrice * this.gasEstimate * 10 ** -9
        this.txFees = this.gasCost * this.$store.state.currencyData[this.selectedCurrency.toLowerCase()]
        const ethCost = parseFloat(finalValue) + this.gasCost
        this.totalEthCost = ethCost // significantDigits(ethCost.toFixed(5), false, 3) || 0
        const gasCostLength = Math.max(significantDigits(this.gasCost).toString().length, significantDigits(ethCost).toString().length)
        this.totalEthCostDisplay = significantDigits(ethCost, false, gasCostLength - 2)
        this.totalUsdCost = significantDigits(ethCost * this.$store.state.currencyData[this.selectedCurrency.toLowerCase()] || 0)
        if (reason) this.errorMsg = reason
        if (parseFloat(this.balance) < ethCost && !this.canShowError) {
          this.errorMsg = 'Insufficient Funds'
          this.canApprove = false
          this.topUpErrorShow = true
        }
      }
      this.type = type // type of tx
      bc.close()
    }
    bc.postMessage({ data: 'popup-loaded' })
  }
}
</script>

<style lang="scss" scoped>
@import 'Confirm.scss';
</style>
