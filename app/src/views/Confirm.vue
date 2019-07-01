<template>
  <v-container fill-height>
    <template v-if="type === 'message'">
      <v-card flat :color="$vuetify.theme.torus_bcg" class="fill-height" style="width: 100%;">
        <v-card-text>
          <v-layout row wrap align-start justify-center>
            <v-flex xs12 mt-3 sm7>
              <div class="headline mb-5">Requesting Signature</div>
              <p class="mb-3 subheading">
                From: <span class="text-bluish">{{ origin }}</span>
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
                <v-btn class="btnStyle" :color="$vuetify.theme.torus_reject" large light flat @click="triggerDeny">Reject</v-btn>
              </v-flex>
              <v-flex xs12 sm4 class="text-xs-center">
                <v-btn large light :color="$vuetify.theme.torus_accept" class="btnStyle white--text rounded-btn" @click="triggerSign">
                  Approve
                </v-btn>
              </v-flex>
              <v-flex sm4 class="text-xs-center" pt-1>
                <img src="images/torus_logo.png" class="bcg-logo" />
              </v-flex>
            </v-layout>
          </div>
        </v-card-text>
      </v-card>
      <v-card class="higherZ hidden-sm-and-up" flat :color="$vuetify.theme.torus_bcg">
        <v-card-text>
          <v-layout row wrap align-center>
            <v-flex xs6 sm4>
              <v-btn class="btnStyle" large light :color="$vuetify.theme.torus_reject" flat @click="triggerDeny">Reject</v-btn>
            </v-flex>
            <v-flex xs6 sm4>
              <v-btn large light :color="$vuetify.theme.torus_accept" class="white--text btnStyle rounded-btn" @click="triggerSign">Approve</v-btn>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </template>
    <template v-else-if="type === 'transaction'">
      <v-card flat :color="$vuetify.theme.torus_bcg">
        <v-card-text>
          <v-layout row wrap align-start justify-center>
            <v-flex xs12>
              <div class="headline mb-3">{{ header }}</div>
              <p class="mb-3 subheading">
                From: <span class="text-bluish">{{ origin }}</span>
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
                    <show-tool-tip :address="sender">
                      {{ slicedAddress(sender) }}
                    </show-tool-tip>
                  </div>
                  <div>
                    <span class="text-bluish"> Balance: </span><span>{{ computedBalance }} ETH</span>
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
                  <div class="font-weight-medium subheading">
                    {{ !doesSendEther ? 'Network Fee' : 'Amount' }}
                  </div>
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
                    <show-tool-tip :address="receiver">
                      {{ slicedAddress(receiver) }}
                    </show-tool-tip>
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
            <v-btn @click="openBottom" flat>
              <span class="text-grayish font-weight-bold text-uppercase">More Details</span>
              <v-icon :color="$vuetify.theme.torus_reject">expand_more</v-icon>
            </v-btn>
          </div>
          <bottom-sheet :show.sync="open" :on-close="closeBottom">
            <v-layout row wrap justify-center align-center text-xs-center>
              <v-flex xs12 sm3 v-if="doesSendEther">
                <div class="font-weight-medium subheading">
                  Amount To Transfer
                </div>
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
                <div class="font-weight-medium subheading">
                  Total Cost
                </div>
                <div class="text-bluish">$ {{ totalUsdCost }}</div>
                <div class="text-bluish">({{ totalEthCost }} ETH)</div>
              </v-flex>
            </v-layout>
            <v-layout row wrap mt-2>
              <v-flex xs12>
                <span class="font-weight-medium">Network Used: </span>
                <span class="text-bluish font-weight-medium text-capitalize">{{ network }} </span>
              </v-flex>
              <v-flex xs12 v-if="!doesSendEther || isContractInteraction || isDeployContract">
                <span class="font-weight-medium">Raw Data: </span>
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
      <v-card class="higherZ" flat :color="$vuetify.theme.torus_bcg" style="width: 100%;">
        <v-card-text>
          <v-layout row wrap align-center justify-center>
            <v-flex xs6 sm4 class="text-xs-center">
              <v-btn large light class="btnStyle" :color="$vuetify.theme.torus_reject" flat @click="triggerDeny">Reject</v-btn>
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
import psl from 'psl'
import BroadcastChannel from 'broadcast-channel'
import BottomSheet from '../components/BottomSheet.vue'
import ShowToolTip from '../components/ShowToolTip.vue'
import torus from '../torus'
import { significantDigits, calculateGasKnob, calculateGasPrice, addressSlicer, isSmartContractAddress, extractHostname } from '../utils/utils'

const weiInGwei = 10 ** 9

export default {
  name: 'confirm',
  components: {
    BottomSheet,
    ShowToolTip
  },
  data() {
    return {
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
      dollarValue: 0,
      canApprove: true,
      canShowError: false
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
        data: { type: 'confirm-transaction', gasPrice: gasHex }
      })
      bc.close()
      window.close()
    },
    triggerDeny(event) {
      var bc = new BroadcastChannel(`torus_channel_${new URLSearchParams(window.location.search).get('instanceId')}`)
      bc.postMessage({ data: { type: 'deny-transaction' } })
      bc.close()
      window.close()
    },
    openWallet() {
      this.$store.dispatch('showWalletPopup')
    },
    showGasPrice(val) {
      return `Fee: $ ${significantDigits(parseFloat(this.txFees).toFixed(3))}`
    },
    ...mapActions({})
  },
  mounted() {
    var bc = new BroadcastChannel(`torus_channel_${new URLSearchParams(window.location.search).get('instanceId')}`)
    let counter = 0
    bc.onmessage = async ev => {
      const { type, msgParams, txParams, origin, balance } = ev.data || {}
      this.origin = psl.get(extractHostname(origin)) // origin of tx: website url
      this.type = type // type of tx
      if (type === 'message') {
        const { message, typedMessages } = msgParams || {}
        this.message = message
        this.typedMessages = typedMessages
        this.messageType = typedMessages ? 'typed' : 'normal'
      } else if (type === 'transaction') {
        const web3Utils = torus.web3.utils
        let finalValue = 0
        const { value, to, data, from: sender, gas, gasPrice } = txParams.txParams || {}
        const { simulationFails, network } = txParams || {}
        const { reason } = simulationFails || {}
        if (value) {
          finalValue = web3Utils.fromWei(value.toString())
        }
        this.network = network
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
      if (type === 'message' || (txParams.gas && type === 'transaction') || counter > 9) {
        bc.close()
        counter = 0
      } else {
        counter++
      }
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

/deep/.knob-control__text-display {
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
</style>
