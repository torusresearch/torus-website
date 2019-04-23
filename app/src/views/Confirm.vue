<template>
  <v-container grid-list-sm>
    <v-layout row justify-center>
      <v-dialog v-model="dialog" persistent fullscreen>
        <div v-if="type === 'message'">
          <v-card height="100vh">
            <v-card-title class="headline text-bluish">Requesting Signature</v-card-title>
            <hr />
            <v-card-text>
              <v-layout row wrap>
                <v-flex ml-3 mt-3>
                  <div class="mb-3">
                    From: <span class="text-bluish">{{ origin }}</span>
                  </div>
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
              <v-layout row wrap class="mt-5">
                <v-flex xs8 sm4>
                  <v-btn large light color="#959595" flat @click="triggerDeny">Reject</v-btn>
                </v-flex>
                <v-flex xs8 sm4>
                  <v-btn large light color="#56ab7f" class="white--text rounded-btn" @click="triggerSign">Accept</v-btn>
                </v-flex>
                <img src="images/torus_logo.png" class="bcg-logo hidden-xs-and-down" />
              </v-layout>
            </v-card-text>
          </v-card>
        </div>
        <div v-else-if="type === 'transaction'">
          <v-card :elevation="0" flat height="100vh">
            <v-card-title class="headline text-bluish">Transaction Request</v-card-title>
            <h6 class="ml-3 title">
              From: <span class="text-bluish">{{ origin }}</span>
            </h6>
            <hr />
            <v-card-text>
              <v-layout row wrap>
                <v-flex sm5 ml-3 mt-3>
                  <div>
                    Balance: <span class="text-bluish">{{ computedBalance }} ETH </span>
                    <v-icon color="green" small @click="openWallet">account_balance_wallet</v-icon>
                  </div>
                  <div>
                    Total Cost: <span class="text-bluish">{{ totalEthCost }} ETH </span>
                    <span class="text-grayish">($ {{ totalUsdCost }}) </span>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-icon color="#aaa" small v-on="on">info</v-icon>
                      </template>
                      <span>Approximate Cost</span>
                    </v-tooltip>
                  </div>
                </v-flex>
              </v-layout>
              <div v-if="!open" class="text-xs-center">
                <v-btn @click="openBottom" flat color="grey">
                  <div>More Details</div>
                  <v-icon>expand_more</v-icon>
                </v-btn>
              </div>
              <BottomSheet :show.sync="open" :on-close="closeBottom">
                <v-knob-control
                  v-model="gasKnob"
                  :min="min"
                  :max="max"
                  :primary-color="color"
                  :size="150"
                  :value-display-function="showGasPrice"
                ></v-knob-control>
              </BottomSheet>
            </v-card-text>
          </v-card>
          <v-card class="higherZ" :elevation="0" flat>
            <v-card-text>
              <v-btn large light color="#959595" flat @click="triggerDeny">Reject</v-btn>
              <v-btn class="white--text rounded-btn" large light color="#56ab7f" @click="triggerSign">Accept</v-btn>
            </v-card-text>
          </v-card>
        </div>
      </v-dialog>
    </v-layout>
  </v-container>
</template>

<script>
import BottomSheet from '../components/BottomSheet.vue'
import { mapActions } from 'vuex'
import BroadcastChannel from 'broadcast-channel'
import torus from '../torus'
import { significantDigits, calculateGasKnob, calculateGasPrice } from '../utils/utils'

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
      txFees: 0
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
    computedBalance: function() {
      return significantDigits(parseFloat(this.balance).toFixed(5)) || 0
    }
  },
  watch: {
    gasPrice: function(newGasPrice, oldGasPrice) {
      const gasCost = newGasPrice * this.gasEstimate * 10 ** -9
      this.txFees = gasCost * this.$store.state.currencyRate
      const ethCost = parseFloat(this.value) + gasCost
      this.totalEthCost = significantDigits(ethCost.toFixed(5))
      this.totalUsdCost = significantDigits(ethCost * this.$store.state.currencyRate)
    },
    gasKnob: function(newGasKnob, oldGasKnob) {
      this.gasPrice = calculateGasPrice(newGasKnob)
    }
  },
  methods: {
    closeBottom() {
      this.open = false
    },
    openBottom() {
      this.open = true
    },
    triggerSign: function(event) {
      var bc = new BroadcastChannel(`torus_channel_${new URLSearchParams(window.location.search).get('instanceId')}`)
      var gasHex = torus.web3.utils.numberToHex(this.gasPrice * weiInGwei)
      bc.postMessage({
        data: { type: 'confirm-transaction', gasPrice: gasHex }
      })
      bc.close()
      window.close()
    },
    triggerDeny: function(event) {
      var bc = new BroadcastChannel(`torus_channel_${new URLSearchParams(window.location.search).get('instanceId')}`)
      bc.postMessage({ data: { type: 'deny-transaction' } })
      bc.close()
      window.close()
    },
    openWallet: function() {
      this.$store.dispatch('showProfilePopup')
    },
    showGasPrice: function(val) {
      return `Tx Fee: $ ${significantDigits(parseFloat(this.txFees).toFixed(2))}`
    },
    ...mapActions({})
  },
  mounted() {
    var bc = new BroadcastChannel(`torus_channel_${new URLSearchParams(window.location.search).get('instanceId')}`)
    let counter = 0
    bc.onmessage = ev => {
      const { type, msgParams, txParams, origin, balance } = ev.data || {}
      if (type === 'message') {
        const { message, typedMessages } = msgParams || {}
        this.message = message
        this.typedMessages = typedMessages
        this.messageType = typedMessages ? 'typed' : 'normal'
        this.origin = origin
        this.type = type
      } else if (type === 'transaction') {
        const web3Utils = torus.web3.utils
        let finalValue = 0
        const { value, to, data, from: sender, gas, gasPrice } = txParams.txParams || {}
        const { simulationFails } = txParams || {}
        const { reason } = simulationFails || {}
        if (value) {
          finalValue = web3Utils.fromWei(value.toString())
        }
        var gweiGasPrice = web3Utils.hexToNumber(gasPrice) / weiInGwei
        this.origin = origin // origin of tx: website url
        this.type = type // type of tx
        this.receiver = to // address pf receiver
        this.value = finalValue // value of eth sending
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
        this.errorMsg = reason
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

<style>
/* Portrait phones and smaller */
@media (max-width: 576px) {
  .bcg-logo {
    display: none;
  }

  .bcg {
    display: none;
  }
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
  color: #187bd1;
}

.text-grayish {
  color: #aaa;
}

.bcg {
  position: fixed;
  right: 0;
}

.bcg-top10 {
  top: 10%;
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

hr {
  margin-top: 0px;
  margin-bottom: 0px;
}
#close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

#close:hover,
#close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

#torusModal {
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
}

#torusModal-content {
  background-color: #fefefe;
  margin: 15% auto; /* 15% from the top and centered */
  border: 1px solid #888;
  width: 80%; /* Could be more or less, depending on screen size */
}

#torusModal-header {
  width: 100%; /* Full width */
  padding: 2px 16px;
  background-color: #5cb8b0;
  color: white;
}

#torusModal-body {
  padding: 4px;
  padding-top: 20px;
}
</style>
