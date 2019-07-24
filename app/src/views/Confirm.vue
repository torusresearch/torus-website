<template>
  <v-container py-4 px-0>
    <v-layout mx-3 mb-4>
      <v-flex x12>
        <img :src="require('../../public/img/icons/t-fill.svg')" width="30" />
      </v-flex>
    </v-layout>
    <template v-if="type === 'transaction'">
      <v-layout align-center mx-4 mb-4>
        <div class="text-black font-weight-bold headline left">{{ header }}</div>
        <img :src="require('../../public/img/icons/transaction.svg')" class="ml-2" />
      </v-layout>
      <v-layout wrap mb-4>
        <v-flex xs12 mb-4 mx-4>
          <div class="subtitle-2 grey--text">You are transacting with:</div>

          <v-card flat class="grey lighten-3">
            <v-card-text>
              <div class="subtitle-2 blue--text">{{ origin }}</div>
              <div class="caption grey--text">{{ receiver }}</div>
            </v-card-text>
            <img :src="require('../../public/img/icons/open-in-new-grey.svg')" class="card-upper-icon" />
          </v-card>
        </v-flex>
        <v-flex xs12 mb-3 mx-4>
          <div class="subtitle-2">Amount</div>
          <v-divider></v-divider>
          <div>
            <span class="subtitle-2 left grey--text">Ethereum</span>
            <span class="subtitle-2 right">{{ value }} ETH</span>
          </div>
          <div class="caption right clearfix">{{ dollarValue }} USD</div>
        </v-flex>
        <v-flex xs12 mb-3 mx-4>
          <div class="subtitle-2">Your Wallet Balance</div>
          <v-divider></v-divider>
          <div>
            <span class="caption left key-item grey--text">{{ sender }}</span>
            <span class="subtitle-2 right">{{ computedBalance }} ETH</span>
          </div>
          <div class="caption right clearfix">2.45 USD</div>
        </v-flex>
        <v-flex px-2>
          <TransactionSpeedSelect :gas="gasEstimate" :displayAmount="value" :activeGasPriceConfirm="gasPrice" @onSelectSpeed="onSelectSpeed" />
        </v-flex>
        <v-flex xs12 px-4 mt-3 mb-1>
          <div class="subtitle-1 font-weight-bold">Total</div>
          <v-divider></v-divider>
          <div>
            <span class="subtitle-2">Cost of Transaction</span>
            <span class="subtitle-1 right blue--text font-weight-bold">{{ totalEthCost }} ETH</span>
          </div>
          <div class="caption right clearfix">{{ totalUsdCost }} USD</div>
        </v-flex>
        <v-flex xs12 mb-4>
          <v-dialog v-model="detailsDialog" width="600px">
            <template v-slot:activator="{ on }">
              <div class="subtitle-2 right blue--text mx-4" v-on="on">More Details</div>
            </template>
            <v-card class="pa-3" color="background_2">
              <v-card-text class="torus_text--text">
                <v-layout row wrap>
                  <v-flex xs2>
                    Rate
                    <span class="right mr-3">:</span>
                  </v-flex>
                  <v-flex xs10 class="torus_text--text text--lighten-4">{{ getCurrencyRate }}</v-flex>
                  <v-flex xs2>
                    Network
                    <span class="right mr-3">:</span>
                  </v-flex>
                  <v-flex xs10 class="torus_text--text text--lighten-4">
                    <span class="text-capitalize">{{ networkName }}</span>
                  </v-flex>
                  <v-flex xs2>
                    Type
                    <span class="right mr-3">:</span>
                  </v-flex>
                  <v-flex xs10 class="torus_text--text text--lighten-4">
                    {{ header }}
                  </v-flex>
                  <v-flex xs2>
                    Data
                    <span class="right mr-3">:</span>
                  </v-flex>
                  <v-flex xs12 mt-1>
                    <v-card flat color="background_3">
                      <v-card-text>
                        <pre>
  Parameters
  [
    {
      "type": "address"
    },
    {
      "type": "unit256"
    }
  ]
                        </pre>
                      </v-card-text>
                    </v-card>
                  </v-flex>
                  <v-flex x12 mt-3>
                    <div class="mb-1">HEX DATA: 68 BYTES</div>
                    <v-card flat color="background_3" style="word-break: break-all">
                      <v-card-text>0x81821c71e3971fA0394211e7ad27d9038696cC920x81821c71e3971fA0394211e7ad27d9038696cC92</v-card-text>
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
        <v-layout px-4>
          <v-flex xs6>
            <v-btn block text large class="grey--text" @click="triggerDeny">
              Cancel
            </v-btn>
          </v-flex>
          <v-flex xs6>
            <v-btn block depressed large color="primary" class="ml-2" @click="triggerSign">
              Confirm
            </v-btn>
          </v-flex>
        </v-layout>
      </v-layout>
    </template>

    <template v-if="type === 'message'">
      <v-layout align-center mx-4 mb-4>
        <div class="text-black font-weight-bold headline left">Signature</div>
        <img :src="require('../../public/img/icons/pen-solid-grey.svg')" width="16" class="ml-2" />
      </v-layout>
      <v-layout wrap mb-4>
        <v-flex xs12 mb-4 mx-4>
          <div class="subtitle-2 grey--text">You are getting a signature from:</div>

          <v-card flat class="grey lighten-3">
            <v-card-text>
              <div class="subtitle-2 blue--text">{{ origin }}</div>
            </v-card-text>
            <img :src="require('../../public/img/icons/open-in-new-grey.svg')" class="card-upper-icon" />
          </v-card>
        </v-flex>

        <v-flex xs12 mb-3 mx-4>
          <v-textarea outlined auto-grow rows="3" placeholder="To authenticate you are are owner."></v-textarea>
        </v-flex>
        <v-layout px-4>
          <v-flex xs6>
            <v-btn block text large class="grey--text" @click="triggerDeny">
              Cancel
            </v-btn>
          </v-flex>
          <v-flex xs6>
            <v-btn block depressed large color="primary" class="ml-2" @click="triggerSign">
              Confirm
            </v-btn>
          </v-flex>
        </v-layout>
      </v-layout>
    </template>
    <template v-if="type === 'none' && false">
      <page-loader />
    </template>
    <!-- Disabled old implementation -->
    <template v-if="type === 'message' && false">
      <v-card text :color="$vuetify.theme.torus_bcg" class="fill-height" style="width: 100%;">
        <v-card-text>
          <v-layout row wrap align-start justify-center>
            <v-flex xs12 mt-3 sm7>
              <div class="headline mb-5">Requesting Signature</div>
              <p class="mb-3 subheading">
                From:
                <span class="text-bluish">{{ origin }}</span>
              </p>
              <div v-if="messageType === 'normal'">{{ message }}</div>
              <div v-else-if="messageType === 'typed'" v-for="typedMessage in typedMessages" :key="typedMessage.name">
                Type: {{ typedMessage.type }}
                <br />
                Name: {{ typedMessage.name }}
                <br />
                Message: {{ typedMessage.value }}
                <br />
              </div>
            </v-flex>
            <v-flex xs12 sm5 class="bcg">
              <img src="images/signature.png" />
            </v-flex>
          </v-layout>
          <div class="hide-xs mt-5">
            <v-layout row wrap align-center justify-center>
              <v-flex xs12 sm4 class="text-xs-center">
                <v-btn class="btnStyle" :color="$vuetify.theme.torus_reject" large light text @click="triggerDeny">Reject</v-btn>
              </v-flex>
              <v-flex xs12 sm4 class="text-xs-center">
                <v-btn large light :color="$vuetify.theme.torus_accept" class="btnStyle white--text rounded-btn" @click="triggerSign">Approve</v-btn>
              </v-flex>
              <v-flex sm4 class="text-xs-center" pt-1>
                <img src="images/torus_logo.png" class="bcg-logo" />
              </v-flex>
            </v-layout>
          </div>
        </v-card-text>
      </v-card>
      <v-card class="higherZ hidden-sm-and-up" text :color="$vuetify.theme.torus_bcg">
        <v-card-text>
          <v-layout row wrap align-center>
            <v-flex xs6 sm4>
              <v-btn class="btnStyle" large light :color="$vuetify.theme.torus_reject" text @click="triggerDeny">Reject</v-btn>
            </v-flex>
            <v-flex xs6 sm4>
              <v-btn large light :color="$vuetify.theme.torus_accept" class="white--text btnStyle rounded-btn" @click="triggerSign">Approve</v-btn>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </template>
    <template v-else-if="type === 'transaction' && false">
      <v-card text :color="$vuetify.theme.torus_bcg">
        <v-card-text>
          <v-layout row wrap align-start justify-center>
            <v-flex xs12>
              <div class="headline mb-3">{{ header }}</div>
              <p class="mb-3 subheading">
                From:
                <span class="text-bluish">{{ origin }}</span>
              </p>
            </v-flex>
            <v-flex mt-3 xs12 sm4 align-self-top text-sm-center text-xs-left>
              <v-layout row wrap>
                <v-flex xs6 sm12>
                  <div class="divWrapSvgStyle">
                    <img src="images/wallet.svg" alt="Wallet" class="svg-setting-medium" />
                  </div>
                </v-flex>
                <v-flex xs6 sm12 mt-3>
                  <div class="font-weight-medium subheading">My Wallet</div>
                  <div>
                    <span class="text-bluish">Address:</span>
                    <show-tool-tip :address="sender">{{ slicedAddress(sender) }}</show-tool-tip>
                  </div>
                  <div>
                    <span class="text-bluish">Balance:</span>
                    <span>{{ computedBalance }} ETH</span>
                  </div>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex mt-3 xs12 sm4 align-self-top text-sm-center text-xs-left>
              <v-layout row wrap>
                <v-flex xs6 sm12>
                  <div class="divWrap">
                    <img src="images/blue_arrow_right.svg" alt="Arrow" class="svg-setting-large hidden-xs-only" />
                    <img src="images/blue_arrow_down.svg" alt="Arrow" class="svg-setting-large hidden-sm-and-up" />
                  </div>
                </v-flex>
                <v-flex xs6 sm12 mt-2>
                  <div class="font-weight-medium subheading">{{ !doesSendEther ? 'Network Fee' : 'Amount' }}</div>
                  <div class="text-bluish">{{ totalUsdCost }} USD</div>
                  <div class="text-bluish">({{ totalEthCost }} ETH)</div>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex mt-3 xs12 sm4 align-self-top text-sm-center text-xs-left>
              <v-layout row wrap>
                <v-flex xs6 sm12>
                  <div class="divWrapSvgStyle">
                    <img :src="imageType" alt="User" class="svg-setting-medium" />
                  </div>
                </v-flex>
                <v-flex xs6 sm12 mt-3>
                  <div class="font-weight-medium subheading">Payee's Wallet</div>
                  <div>
                    <span class="text-bluish">Address:</span>
                    <show-tool-tip :address="receiver">{{ slicedAddress(receiver) }}</show-tool-tip>
                  </div>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
          <v-layout row wrap fill-height>
            <v-flex text-xs-left mb-1 mt-2>
              <template v-if="canShowError">
                <span class="red--text">Error: {{ errorMsg }}</span>
              </template>
            </v-flex>
          </v-layout>
          <div class="text-xs-center mb-4">
            <v-btn @click="openBottom" text>
              <span class="text-grayish font-weight-bold text-uppercase">More Details</span>
              <v-icon :color="$vuetify.theme.torus_reject">expand_more</v-icon>
            </v-btn>
          </div>
          <bottom-sheet :show.sync="open" :on-close="closeBottom">
            <v-layout row wrap justify-center align-center text-xs-center>
              <v-flex xs12 sm3 v-if="doesSendEther">
                <div class="font-weight-medium subheading">Amount To Transfer</div>
                <div class="text-bluish font-weight-medium">$ {{ dollarValue }}</div>
                <div class="text-bluish font-weight-medium">({{ value }} ETH)</div>
              </v-flex>
              <v-flex xs12 sm1 v-if="doesSendEther">
                <img src="images/plus.svg" alt="Add" class="svg-setting-small" />
              </v-flex>
              <v-flex mt-3 xs12 sm4 align-self-top text-xs-center>
                <v-knob-control
                  v-model="gasKnob"
                  :min="min"
                  :max="max"
                  :primary-color="color"
                  :size="150"
                  :value-display-function="showGasPrice"
                  :animation="{
                    animated: true,
                    animateValue: true,
                    animationDuration: '5000',
                    animationFunction: 'linear'
                  }"
                ></v-knob-control>
              </v-flex>
              <v-flex xs12 sm1>
                <!-- v-if="doesSendEther" -->
                <img src="images/equal.svg" alt="Equals" class="svg-setting-small" />
              </v-flex>
              <v-flex xs12 sm3>
                <!-- v-if="doesSendEther" -->
                <div class="font-weight-medium subheading">Total Cost</div>
                <div class="text-bluish">$ {{ totalUsdCost }}</div>
                <div class="text-bluish">({{ totalEthCost }} ETH)</div>
              </v-flex>
            </v-layout>
            <v-layout row wrap mt-2>
              <v-flex xs12>
                <span class="font-weight-medium">Network Used:</span>
                <span class="text-bluish font-weight-medium text-capitalize">{{ network }}</span>
              </v-flex>
              <v-flex xs12 v-if="!doesSendEther || isContractInteraction || isDeployContract">
                <span class="font-weight-medium">Raw Data:</span>
                <span class="font-weight-medium">
                  {{ slicedAddress(txData) }}
                  <show-tool-tip :address="txData">
                    <v-icon :color="$vuetify.theme.torus_reject" size="18">file_copy</v-icon>
                  </show-tool-tip>
                </span>
              </v-flex>
            </v-layout>
          </bottom-sheet>
        </v-card-text>
      </v-card>
      <v-card class="higherZ" text :color="$vuetify.theme.torus_bcg" style="width: 100%;">
        <v-card-text>
          <v-layout row wrap align-center justify-center>
            <v-flex xs6 sm4 class="text-xs-center">
              <v-btn large light class="btnStyle" :color="$vuetify.theme.torus_reject" text @click="triggerDeny">Reject</v-btn>
            </v-flex>
            <v-flex xs6 sm4 class="text-xs-center">
              <v-btn
                light
                large
                :disabled="!canApprove"
                :color="$vuetify.theme.torus_accept"
                class="white--text btnStyle rounded-btn"
                @click="triggerSign"
              >
                Approve
              </v-btn>
            </v-flex>
            <v-flex sm4 class="text-xs-center" pt-1>
              <img src="images/torus_logo.png" class="bcg-logo" />
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </template>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex' // Maybe dispatch a bc to show popup from that instance
import BroadcastChannel from 'broadcast-channel'
import BottomSheet from '../components/BottomSheet.vue'
import ShowToolTip from '../components/ShowToolTip.vue'
import PageLoader from '../components/PageLoader.vue'
import TransactionSpeedSelect from '../components/TransactionSpeedSelect'
import torus from '../torus'
import { significantDigits, calculateGasKnob, calculateGasPrice, addressSlicer, isSmartContractAddress } from '../utils/utils'

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
  RPC_DISPLAY_NAME
} = require('../utils/enums')

const weiInGwei = 10 ** 9

export default {
  name: 'confirm',
  components: {
    BottomSheet,
    ShowToolTip,
    PageLoader,
    TransactionSpeedSelect
  },
  data() {
    return {
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
      sender: '',
      totalUsdCost: 0,
      totalEthCost: 0,
      errorMsg: '',
      txFees: 0,
      isDeployContract: false,
      isContractInteraction: false,
      doesSendEther: false,
      network: '',
      networkName: '',
      transactionCategory: '',
      dollarValue: 0,
      canApprove: true,
      canShowError: false,
      selectedSpeed: '',
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
      return this.isDeployContract ? 'Contract Deployment' : this.isContractInteraction ? 'Contract Interaction' : 'Transaction Request'
    },
    imageType() {
      return this.isDeployContract || this.isContractInteraction ? 'images/file-signature.svg' : 'images/user.svg'
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
        if (this.transactionCategory === 'sentEther') {
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
      this.totalEthCost = significantDigits(ethCost.toFixed(5), false, 3) || 0
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
        const { simulationFails, network, id, transactionCategory } = txParams || {}
        const { reason } = simulationFails || {}
        if (value) {
          finalValue = web3Utils.fromWei(value.toString())
        }

        this.origin = this.origin.trim().length === 0 ? 'Account Address' : this.origin

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
        this.gasEstimate = web3Utils.hexToNumber(gas) // gas number
        this.txData = data // data hex
        this.sender = sender // address of sender
        const gasCost = gweiGasPrice * this.gasEstimate * 10 ** -9
        this.txFees = gasCost * this.$store.state.currencyData['usd']
        const ethCost = parseFloat(finalValue) + gasCost
        this.totalEthCost = significantDigits(ethCost.toFixed(5), false, 3) || 0
        this.totalUsdCost = significantDigits(ethCost * this.$store.state.currencyData['usd'] || 0)
        if (reason) this.errorMsg = reason
        if (!to) this.isDeployContract = true
        else this.isContractInteraction = await isSmartContractAddress(to, torus.web3)
        this.doesSendEther = parseFloat(finalValue) !== 0
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
</style>
