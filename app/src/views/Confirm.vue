<template>
  <v-container py-6 px-0>
    <template v-if="type === 'transaction'">
      <v-layout align-center mx-6 mb-6>
        <div class="text-black font-weight-bold headline float-left">{{ header }}</div>
        <img :src="require('../../public/img/icons/transaction.svg')" class="ml-2" />
      </v-layout>
      <v-layout wrap>
        <!-- <v-flex xs12 mb-6 mx-6>
          <div class="subtitle-2 grey--text">You are transacting with:</div>

          <v-card flat class="grey lighten-3">
            <v-card-text>
              <div class="subtitle-2 blue--text">{{ origin }}</div>
              <div class="caption grey--text">{{ receiver }}</div>
            </v-card-text>
            <img :src="require('../../public/img/icons/open-in-new-grey.svg')" class="card-upper-icon" />
          </v-card>
        </v-flex>-->
        <!-- <v-flex xs12 mb-4 mx-6>
          <div class="subtitle-2">Amount</div>
          <v-divider></v-divider>
          <div>
            <span class="subtitle-2 float-left grey--text">Ethereum</span>
            <span class="subtitle-2 float-right">{{ value }} ETH</span>
          </div>
          <div class="caption float-right clearfix">{{ dollarValue }} USD</div>
        </v-flex>-->
        <v-flex xs12 mb-4 mx-6>
          <div class="subtitle-2">Amount</div>
          <v-divider></v-divider>
          <div>
            <span class="subtitle-2 float-left grey--text">To: {{ slicedAddress(receiver) }}</span>
            <span class="subtitle-2 float-right">{{ amountDisplay(value) }} ETH</span>
          </div>
          <div class="caption float-right clearfix">~ {{ dollarValue }} USD</div>
        </v-flex>
        <!-- <v-flex xs12 mb-4 mx-6>
          <div class="subtitle-2">Your Wallet Balance</div>
          <v-divider></v-divider>
          <div>
            <span class="caption float-left key-item grey--text">{{ sender }}</span>
            <span class="subtitle-2 float-right">{{ amountDisplay(computedBalance) }} ETH</span>
          </div>
          <div class="caption float-right clearfix">{{ balanceUsd }} USD</div>
        </v-flex>-->
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
            <span class="subtitle-1 float-right blue--text font-weight-bold">{{ totalEthCostDisplay }} ETH</span>
          </div>
          <div class="caption float-right clearfix">~ {{ totalUsdCost }} USD</div>
        </v-flex>
        <v-flex xs12 mb-3 mt-3>
          <v-dialog v-model="detailsDialog" width="600px">
            <template v-slot:activator="{ on }">
              <div class="subtitle-2 float-right blue--text mx-6" v-on="on">More Details</div>
            </template>
            <v-card class="pa-4" color="background_2">
              <v-card-text class="torus_text--text">
                <v-layout wrap>
                  <v-flex xs4 sm2>
                    Rate
                    <span class="float-right mr-4">:</span>
                  </v-flex>
                  <v-flex xs8 sm10 class="torus_text--text text--lighten-4">{{ getCurrencyRate }}</v-flex>
                  <v-flex xs4 sm2>
                    Network
                    <span class="float-right mr-4">:</span>
                  </v-flex>
                  <v-flex xs8 sm10 class="torus_text--text text--lighten-4">
                    <span class="text-capitalize">{{ networkName }}</span>
                  </v-flex>
                  <v-flex xs4 sm2>
                    Type
                    <span class="float-right mr-4">:</span>
                  </v-flex>
                  <v-flex xs8 sm10 class="torus_text--text text--lighten-4">{{ header }}</v-flex>
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
                <v-btn color="primary" text @click="detailsDialog = false">Less Details</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-flex>
        <v-flex xs12 px-6 mb-6 v-if="canShowError">
          <div class="red--text">Error: {{ errorMsg }}</div>
        </v-flex>
        <v-layout px-6>
          <v-flex xs6>
            <v-btn block text large class="grey--text" @click="triggerDeny">Cancel</v-btn>
          </v-flex>
          <v-flex xs6>
            <v-dialog v-model="confirmDialog" max-width="550" persistent>
              <template v-slot:activator="{ on }">
                <v-btn :disabled="!canApprove" block depressed large color="primary" class="ml-2" v-on="on">Confirm</v-btn>
              </template>
              <transfer-confirm
                :toAddress="receiver"
                :selectedCoin="'ETH'"
                :convertedAmount="dollarValue"
                :displayAmount="amountDisplay(value)"
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
      <v-layout align-center mx-6 mb-6>
        <div class="text-black font-weight-bold headline float-left">Permissions</div>
        <img :src="require('../../public/img/icons/lock.svg')" width="16" class="ml-2" />
      </v-layout>
      <v-layout wrap>
        <v-flex xs12 mb-6 mx-6>
          <div class="subtitle-2 grey--text">Request from:</div>

          <v-card flat class="grey lighten-3">
            <v-card-text>
              <div class="subtitle-2 blue--text">{{ origin }}</div>
            </v-card-text>
            <img :src="require('../../public/img/icons/open-in-new-grey.svg')" class="card-upper-icon" />
          </v-card>
        </v-flex>

        <v-flex xs12 mb-4 mx-6>
          <v-list class="note-list">
            <v-list-item class="pa-0">
              <v-list-item-icon class="ma-1">
                <img :src="require(`../../public/img/icons/check-circle-primary.svg`)" width="12" />
              </v-list-item-icon>
              <v-list-item-content class="pa-1">
                <div class="caption torus_text--text text--lighten-3">This application is requesting for your digital signature.</div>
              </v-list-item-content>
            </v-list-item>
            <v-list-item class="pa-0">
              <v-list-item-content flat class="pa-1 grey lighten-3">
                <v-card flat color="background_3" class="body-2 text-left pa-2 ma-3">
                  <div v-if="messageType === 'normal'">{{ message }}</div>
                  <div v-else-if="messageType === 'typed'" v-for="typedMessage in typedMessages" :key="typedMessage.name">
                    Type: {{ typedMessage.type }}
                    <br />
                    Name: {{ typedMessage.name }}
                    <br />
                    Message: {{ typedMessage.value }}
                    <br />
                  </div>
                </v-card>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-flex>
        <!-- <v-flex xs12 mt-12 mb-5 mx-7>
          <div class="caption torus_text--text text--lighten-3">
            Note : You may re-adjust the dapp permission later under ‘Settings > Dapp Permission’
          </div>
        </v-flex>-->
        <v-layout px-6 mx-3>
          <v-flex xs6>
            <v-btn block text large class="grey--text" @click="triggerDeny">Cancel</v-btn>
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
import BroadcastChannel from 'broadcast-channel'
import BottomSheet from '../components/BottomSheet.vue'
import ShowToolTip from '../components/ShowToolTip.vue'
import PageLoader from '../components/PageLoader.vue'
import TransactionSpeedSelect from '../components/helpers/TransactionSpeedSelect'
import TransferConfirm from '../components/TransferConfirm'
import torus from '../torus'
import { significantDigits, calculateGasKnob, calculateGasPrice, addressSlicer, isSmartContractAddress } from '../utils/utils'
const abiDecoder = require('../utils/abiDecoder')
const abi = require('human-standard-token-abi')

const {
  ROPSTEN,
  RINKEBY,
  KOVAN,
  MAINNET,
  LOCALHOST,
  GOERLI,
  RPC,
  ROPSTEN_DISPLAY_NAME,
  RINKEBY_DISPLAY_NAME,
  KOVAN_DISPLAY_NAME,
  MAINNET_DISPLAY_NAME,
  LOCALHOST_DISPLAY_NAME,
  GOERLI_DISPLAY_NAME,
  RPC_DISPLAY_NAME,
  CONTRACT_INTERACTION_KEY,
  DEPLOY_CONTRACT_ACTION_KEY,
  TOKEN_METHOD_APPROVE,
  TOKEN_METHOD_TRANSFER,
  TOKEN_METHOD_TRANSFER_FROM,
  SEND_ETHER_ACTION_KEY
} = require('../utils/enums')

const weiInGwei = 10 ** 9

export default {
  name: 'confirm',
  components: {
    PageLoader,
    TransactionSpeedSelect,
    TransferConfirm
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
      receiver: 'unknown',
      dialog: true,
      message: '',
      gasEstimate: 0,
      txData: '',
      txDataParams: '',
      sender: '',
      totalUsdCost: 0,
      totalEthCost: 0,
      totalEthCostDisplay: '',
      errorMsg: '',
      txFees: 0,
      network: '',
      networkName: '',
      transactionCategory: '',
      dollarValue: 0,
      canApprove: true,
      canShowError: false,
      selectedSpeed: '',
      speed: '',
      id: 0,
      networks: [
        {
          name: MAINNET_DISPLAY_NAME,
          value: MAINNET
        },
        {
          name: ROPSTEN_DISPLAY_NAME,
          value: ROPSTEN
        },
        {
          name: RINKEBY_DISPLAY_NAME,
          value: RINKEBY
        },
        {
          name: KOVAN_DISPLAY_NAME,
          value: KOVAN
        },
        {
          name: GOERLI_DISPLAY_NAME,
          value: GOERLI
        },
        {
          name: LOCALHOST_DISPLAY_NAME,
          value: LOCALHOST
        },
        {
          name: RPC_DISPLAY_NAME,
          value: RPC
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
          return 'Contract Deployment'
          break
        case CONTRACT_INTERACTION_KEY:
          return 'Contract Interaction'
          break
        case TOKEN_METHOD_APPROVE:
          return 'ERC20 Approve'
          break
        case TOKEN_METHOD_TRANSFER:
          return 'ERC2O Transfer'
          break
        case TOKEN_METHOD_TRANSFER_FROM:
          return 'ERC2O Transfer From'
          break
        case SEND_ETHER_ACTION_KEY:
          return 'Send Ether'
          break
        default:
          return 'Transaction Request'
          break
      }
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
    finalBalancesArray() {
      return this.$store.getters.tokenBalances.finalBalancesArray || []
    },
    getCurrencyRate() {
      const targetBalance = this.finalBalancesArray.find(balance => {
        if (this.transactionCategory === SEND_ETHER_ACTION_KEY) {
          return balance.id === 'ETH'
        }
        return false
      })

      if (targetBalance) return `${targetBalance.currencyRateText} @ ${this.getDate()}`

      return ''
      // console.log(txParams)
      // console.log(this.finalBalancesArray)
    }
  },
  watch: {
    gasPrice: function(newGasPrice, oldGasPrice) {
      const gasCost = newGasPrice * this.gasEstimate * 10 ** -9
      this.txFees = gasCost * this.$store.state.currencyData['usd']
      const ethCost = parseFloat(this.value) + gasCost
      this.totalEthCost = ethCost // significantDigits(ethCost.toFixed(5), false, 3) || 0
      const gasCostLength = Math.max(significantDigits(gasCost).toString().length, significantDigits(ethCost).toString().length)
      this.totalEthCostDisplay = significantDigits(ethCost, false, gasCostLength - 2)
      this.totalUsdCost = significantDigits(ethCost * this.$store.state.currencyData['usd'] || 0)
      if (parseFloat(this.balance) < ethCost && !this.canShowError) {
        this.errorMsg = 'Insufficient Funds'
        this.canApprove = false
      }
    },
    gasKnob: function(newGasKnob, oldGasKnob) {
      this.gasPrice = calculateGasPrice(newGasKnob)
    },
    errorMsg: function(newErrorMsg, oldErrorMsg) {
      if (newErrorMsg !== oldErrorMsg) this.canShowError = newErrorMsg && newErrorMsg !== ''
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
    triggerSign(event) {
      var bc = new BroadcastChannel(`torus_channel_${new URLSearchParams(window.location.search).get('instanceId')}`)
      var gasHex = torus.web3.utils.numberToHex(this.gasPrice * weiInGwei)
      bc.postMessage({
        data: { type: 'confirm-transaction', gasPrice: gasHex, id: this.id }
      })
      bc.close()
      window.close()
    },
    triggerDeny(event) {
      var bc = new BroadcastChannel(`torus_channel_${new URLSearchParams(window.location.search).get('instanceId')}`)
      bc.postMessage({ data: { type: 'deny-transaction', id: this.id } })
      bc.close()
      window.close()
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
      const networkName = this.networks.find(network => {
        return network.value === targetNetwork
      })

      return networkName.name
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
    ...mapActions({})
  },
  mounted() {
    var bc = new BroadcastChannel(`torus_channel_${new URLSearchParams(window.location.search).get('instanceId')}`)
    bc.onmessage = async ev => {
      const { type, msgParams, txParams, origin, balance } = ev.data || {}
      let url = { hostname: '' }
      try {
        url = new URL(origin)
      } catch (err) {
        console.log(err)
      }
      console.log(txParams)
      this.origin = url.hostname // origin of tx: website url
      if (type === 'message') {
        const { message, typedMessages } = msgParams.msgParams || {}
        const { id } = msgParams || {}
        this.id = id
        this.message = message
        this.typedMessages = typedMessages
        this.messageType = typedMessages ? 'typed' : 'normal'
      } else if (type === 'transaction') {
        const web3Utils = torus.web3.utils
        let finalValue = 0
        const { value, to, data, from: sender, gas, gasPrice } = txParams.txParams || {}
        const { simulationFails, network, id, transactionCategory, methodParams } = txParams || {}
        const { reason } = simulationFails || {}
        if (value) {
          finalValue = web3Utils.fromWei(value.toString())
        }

        this.origin = this.origin.trim().length === 0 ? 'Wallet' : this.origin
        // GET data params
        const txDataParams = abi.find(item => item.name && item.name.toLowerCase() === transactionCategory) || ''
        console.log(methodParams, 'params')
        this.id = id
        this.network = network
        this.networkName = this.getNetworkName(network)
        this.transactionCategory = transactionCategory
        var gweiGasPrice = web3Utils.hexToNumber(gasPrice) / weiInGwei
        this.receiver = to // address of receiver
        this.value = finalValue // value of eth sending
        this.dollarValue = significantDigits(parseFloat(finalValue) * this.$store.state.currencyData['usd'])
        this.gasPrice = gweiGasPrice // gas price in gwei
        this.gasKnob = calculateGasKnob(gweiGasPrice)
        this.balance = balance // in eth
        this.balanceUsd = significantDigits(parseFloat(balance) * this.$store.state.currencyData['usd']) // in usd
        this.gasEstimate = web3Utils.hexToNumber(gas) // gas number
        this.txData = data // data hex
        this.txDataParams = txDataParams !== '' ? JSON.stringify(txDataParams, null, 2) : ''
        this.sender = sender // address of sender
        const gasCost = gweiGasPrice * this.gasEstimate * 10 ** -9
        this.txFees = gasCost * this.$store.state.currencyData['usd']
        const ethCost = parseFloat(finalValue) + gasCost
        this.totalEthCost = ethCost // significantDigits(ethCost.toFixed(5), false, 3) || 0
        const gasCostLength = Math.max(significantDigits(gasCost).toString().length, significantDigits(ethCost).toString().length)
        this.totalEthCostDisplay = significantDigits(ethCost, false, gasCostLength - 2)
        this.totalUsdCost = significantDigits(ethCost * this.$store.state.currencyData['usd'] || 0)
        if (reason) this.errorMsg = reason
        if (parseFloat(this.balance) < ethCost && !this.canShowError) {
          this.errorMsg = 'Insufficient Funds'
          this.canApprove = false
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
/* Portrait phones and smaller */
@media (max-width: 598px) {
  .bcg-logo {
    display: none;
  }

  .bcg {
    display: none;
  }

  .hide-xs {
    display: none;
  }
}

.selected-account {
  cursor: pointer;
  @extend .text-bluish;

  &:hover {
    background-color: var(--v-torus_reject_mild-base);
    opacity: 0.5;
    color: #fff;
  }

  &.active {
    background-color: var(--v-torus_active-base);
  }
}

.svg-bcg-color {
  background-color: var(--v-torus_svg_bcg-base);
}

@mixin svg-size($args...) {
  @each $name, $size in keywords($args) {
    .svg-setting-#{$name} {
      width: $size;
      height: $size;
    }
  }
}

@include svg-size($small: 24px, $medium: 38px, $large: 80px);

%justify-align {
  justify-content: center;
  align-items: center;
}

%justify-align-start {
  justify-content: start;
  align-items: center;
}

.divWrap {
  display: block;
  @extend %justify-align;
}

.divWrapSvgStyle {
  @extend .svg-bcg-color;
  display: inline-flex;
  @extend %justify-align;
  border-radius: 50%;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.16);
  @extend .svg-setting-large;
}

.spanWrap {
  display: inline-flex;
  @extend %justify-align-start;
}

.higherZ {
  position: fixed;
  z-index: 100;
  bottom: 0;
  left: 0;
  right: 0;
  height: 75px;
}

.text-bluish {
  color: var(--v-torus_blue-base);
}

.text-grayish {
  color: var(--v-torus_reject-base);
}

.bcg {
  position: relative;
}

.bcg-logo {
  height: 32px;
}

.bcg-top10 {
  right: 20%;
  bottom: 50%;
}

hr {
  display: block;
  height: 1px;
  border: 0;
  border-top: 1px solid #ccc;
  margin: 0% 35% 0% 15px;
  padding: 0;
}

::v-deep .knob-control__text-display {
  font-size: 0.7rem !important;
  font-weight: 500;
  text-align: center;
}

.application--wrap {
  min-height: 0px !important;
}

.btnStyle {
  width: 141px;
  height: 41px;
  border: #fff;
  border-radius: 45px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
}

/* NEW UI */
.v-card__text {
  padding: 12px;
}
.card-upper-icon {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 12px;
  height: 12px;
}

.v-divider {
  margin: 0 0 12px;
}

.key-item {
  max-width: 200px;
  word-break: break-all;
  line-height: 1em;
  margin-top: 2px;
}

.dialog-launcher {
  cursor: pointer;
}

.note-list {
  .v-list-item {
    min-height: inherit;
  }
}
</style>
