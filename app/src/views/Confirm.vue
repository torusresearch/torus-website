<template>
  <v-container grid-list-xs fill-height>
    <v-layout row wrap align-top>
      <div v-if="type === 'message'">
        <v-card flat>
          <v-card-title class="headline text-bluish">Requesting Signature</v-card-title>
          <hr />
          <v-card-text>
            <v-layout row wrap>
              <v-flex mt-3>
                <h6 class="mb-3">
                  From: <span class="text-bluish">{{ origin }}</span>
                </h6>
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
              <img src="images/signature.png" class="bcg bcg-top10 hidden-xs-and-down" />
            </v-layout>
            <div class="hide-xs">
              <v-layout row wrap>
                <v-flex xs12 sm6>
                  <v-btn large light :color="$vuetify.theme.torus_reject" flat @click="triggerDeny">Reject</v-btn>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-btn large light :color="$vuetify.theme.torus_accept" class="white--text rounded-btn" @click="triggerSign">Approve</v-btn>
                </v-flex>
              </v-layout>
            </div>
            <img src="images/torus_logo.png" class="bcg-logo" />
          </v-card-text>
        </v-card>
        <v-card class="higherZ hidden-sm-and-up" flat>
          <v-card-text>
            <v-layout row wrap>
              <v-flex xs5>
                <v-btn large light :color="$vuetify.theme.torus_reject" flat @click="triggerDeny">Reject</v-btn>
              </v-flex>
              <v-flex xs5>
                <v-btn large light :color="$vuetify.theme.torus_accept" class="white--text rounded-btn" @click="triggerSign">Approve</v-btn>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </div>
      <div v-else-if="type === 'transaction'">
        <v-card flat>
          <v-card-title class="headline text-bluish">{{ header }}</v-card-title>
          <hr />
          <v-card-text>
            <v-layout row wrap>
              <v-flex xs12>
                <h6 class="mb-3">
                  From: <span class="text-bluish">{{ origin }}</span>
                </h6>
              </v-flex>
              <v-flex mt-3 xs12 sm4 align-self-top text-sm-center text-xs-left>
                <v-layout row wrap>
                  <v-flex xs6 sm12>
                    <div class="divWrapSvgStyle">
                      <img src="images/wallet.svg" alt="Wallet" class="svg-setting-medium" />
                    </div>
                  </v-flex>
                  <v-flex xs6 sm12>
                    <div class="text-grayish font-weight-bold text-uppercase">Your Wallet</div>
                    <div>
                      Address:
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <span
                            class="selected-account font-weight-medium"
                            :color="$vuetify.theme.torus_accept"
                            size="18"
                            v-on="on"
                            @click="copyToClip(sender)"
                          >
                            {{ slicedAddress(sender) }}
                          </span>
                        </template>
                        <span v-if="copied">Copied!</span>
                        <span v-else>Copy to clipboard</span>
                      </v-tooltip>
                    </div>
                    <div>
                      Balance: <span class="text-bluish font-weight-medium">{{ computedBalance }} ETH</span>
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
                  <v-flex xs6 sm12>
                    <div class="text-grayish font-weight-bold text-uppercase">
                      {{ !doesSendEther ? 'Network Fee' : 'Amount' }}
                    </div>
                    <div class="text-bluish font-weight-medium">{{ totalUsdCost }} USD</div>
                    <div class="text-bluish font-weight-medium">({{ totalEthCost }} ETH)</div>
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex mt-3 xs12 sm4 align-self-top text-sm-center text-xs-left>
                <v-layout row wrap>
                  <v-flex xs6 sm12>
                    <div class="divWrapSvgStyle">
                      <img src="images/user.svg" alt="User" class="svg-setting-medium" />
                    </div>
                  </v-flex>
                  <v-flex xs6 sm12>
                    <div class="text-grayish font-weight-bold text-uppercase">Payee's Wallet</div>
                    <div>
                      Address:
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <span
                            class="selected-account font-weight-medium"
                            :color="$vuetify.theme.torus_accept"
                            size="18"
                            v-on="on"
                            @click="copyToClip(receiver)"
                          >
                            {{ slicedAddress(receiver) }}
                          </span>
                        </template>
                        <span v-if="copied">Copied!</span>
                        <span v-else>Copy to clipboard</span>
                      </v-tooltip>
                    </div>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
            <v-layout row wrap fill-height>
              <v-flex text-xs-left mb-2 mt-2>
                <div v-if="canShowError" class="red--text">Error: {{ errorMsg }}</div>
              </v-flex>
            </v-layout>
            <div class="text-xs-center mb-5">
              <v-btn @click="openBottom" flat>
                <span class="text-grayish font-weight-bold text-uppercase">More Details</span>
                <v-icon :color="$vuetify.theme.torus_reject">expand_more</v-icon>
              </v-btn>
            </div>
            <BottomSheet :show.sync="open" :on-close="closeBottom">
              <v-layout row wrap justify-center align-center text-xs-center>
                <v-flex xs12 sm3 v-if="doesSendEther">
                  <div class="text-grayish font-weight-bold text-uppercase">
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
                  ></v-knob-control>
                </v-flex>
                <v-flex xs12 sm1>
                  <!-- v-if="doesSendEther" -->
                  <img src="images/equal.svg" alt="Equals" class="svg-setting-small" />
                </v-flex>
                <v-flex xs12 sm3>
                  <!-- v-if="doesSendEther" -->
                  <div class="text-grayish font-weight-bold text-uppercase">
                    Total Cost
                  </div>
                  <div class="text-bluish font-weight-medium">$ {{ totalUsdCost }}</div>
                  <div class="text-bluish font-weight-medium">({{ totalEthCost }} ETH)</div>
                </v-flex>
              </v-layout>
              <v-layout row wrap>
                <v-flex xs12>
                  <span class="text-grayish font-weight-bold">Network Used: </span>
                  <span class="text-capitalize text-bluish font-weight-medium">{{ network }} </span>
                </v-flex>
                <v-flex xs12 v-if="!doesSendEther || isContractInteraction || isDeployContract">
                  <span class="text-grayish font-weight-bold">Raw Data: </span>
                  <span class="text-bluish font-weight-medium">
                    {{ slicedAddress(txData) }}
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-icon class="selected-account" :color="$vuetify.theme.torus_accept" size="18" v-on="on" @click="copyToClip(txData)">
                          file_copy
                        </v-icon>
                      </template>
                      <span v-if="copied">Copied!</span>
                      <span v-else>Copy to clipboard</span>
                    </v-tooltip>
                  </span>
                </v-flex>
              </v-layout>
            </BottomSheet>
          </v-card-text>
        </v-card>
        <v-card class="higherZ" flat>
          <v-card-text>
            <v-layout row wrap>
              <v-flex xs5>
                <v-btn large light :color="$vuetify.theme.torus_reject" flat @click="triggerDeny">Reject</v-btn>
              </v-flex>
              <v-flex xs5>
                <v-btn large light :disabled="!canApprove" :color="$vuetify.theme.torus_accept" class="white--text rounded-btn" @click="triggerSign">
                  Approve
                </v-btn>
              </v-flex>
            </v-layout>
            <img src="images/torus_logo.png" class="bcg-logo" />
          </v-card-text>
        </v-card>
      </div>
    </v-layout>
  </v-container>
</template>

<script>
import BottomSheet from '../components/BottomSheet.vue'
import { mapActions } from 'vuex'
import copyToClipboard from 'copy-to-clipboard'
import psl from 'psl'
import BroadcastChannel from 'broadcast-channel'
import torus from '../torus'
import { significantDigits, calculateGasKnob, calculateGasPrice, addressSlicer, isSmartContractAddress, extractHostname } from '../utils/utils'

const weiInGwei = 10 ** 9

export default {
  name: 'confirm',
  components: {
    BottomSheet
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
      copied: false,
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
    }
  },
  watch: {
    gasPrice: function(newGasPrice, oldGasPrice) {
      const gasCost = newGasPrice * this.gasEstimate * 10 ** -9
      this.txFees = gasCost * this.$store.state.currencyRate
      const ethCost = parseFloat(this.value) + gasCost
      this.totalEthCost = significantDigits(ethCost.toFixed(5), false, 3)
      this.totalUsdCost = significantDigits(ethCost * this.$store.state.currencyRate)
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
    copyToClip(address) {
      this.copied = true
      copyToClipboard(address)
      setTimeout(() => {
        this.copied = false
      }, 2500)
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
      this.$store.dispatch('showProfilePopup')
    },
    showGasPrice(val) {
      return `Fee: $ ${significantDigits(parseFloat(this.txFees).toFixed(2))}`
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
        this.receiver = to // address pf receiver
        this.value = finalValue // value of eth sending
        this.dollarValue = significantDigits(parseFloat(finalValue) * this.$store.state.currencyRate)
        this.gasPrice = gweiGasPrice // gas price in gwei
        this.gasKnob = calculateGasKnob(gweiGasPrice)
        this.balance = balance // in eth
        this.gasEstimate = web3Utils.hexToNumber(gas) // gas number
        this.txData = data // data hex
        this.sender = sender // address of sender
        const gasCost = gweiGasPrice * this.gasEstimate * 10 ** -9
        this.txFees = gasCost * this.$store.state.currencyRate
        const ethCost = parseFloat(finalValue) + gasCost
        this.totalEthCost = significantDigits(ethCost.toFixed(5))
        this.totalUsdCost = significantDigits(ethCost * this.$store.state.currencyRate)
        if (reason) this.errorMsg = reason
        if (!to) this.isDeployContract = true
        else this.isContractInteraction = await isSmartContractAddress(to, torus.web3)
        this.doesSendEther = parseFloat(finalValue) !== 0
        if (parseFloat(this.balance) < ethCost && !this.canShowError) {
          this.errorMsg = 'Insufficient Funds'
          this.canApprove = false
        }
      }
      if (type === 'message' || (counter === 3 && type === 'transaction')) {
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

<style lang="scss">
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
  opacity: 0.5;
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

.divWrap {
  display: block;
  @extend %justify-align;
}

.divWrapSvgStyle {
  @extend .svg-bcg-color;
  display: inline-flex;
  @extend %justify-align;
  border-radius: 50%;
  @extend .svg-setting-large;
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

.bcg-top10 {
  left: 70px;
  bottom: 50px;
}

.bcg-logo {
  position: fixed;
  right: 0;
  bottom: 10px;
}

hr {
  display: block;
  height: 1px;
  border: 0;
  border-top: 1px solid #ccc;
  margin: 0% 35% 0% 15px;
  padding: 0;
}

.rounded-btn {
  border-radius: 8px !important;
}

.knob-control__text-display {
  font-size: 0.7rem !important;
  text-align: center;
}
</style>
