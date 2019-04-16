<template>
  <v-container grid-list-sm>
    <v-layout row justify-center>
      <v-dialog v-model="dialog" persistent fullscreen>
        <div v-if="type === 'message'">
          <v-card height="100vh">
            <v-card-title class="headline text-bluish">Requesting Signature</v-card-title>
            <hr />
            <v-card-text>
              <v-layout column>
                <v-flex xs6 ml-3 mt-3>
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
              </v-layout>
              <v-layout column>
                <img src="images/signature.png" class="bcg hidden-xs-and-down" />
              </v-layout>
            </v-card-text>

            <v-card-actions class="mt-5">
              <v-btn large light color="#959595" flat @click="triggerDeny">Reject</v-btn>
              <v-btn large light color="#56ab7f" class="white--text rounded-btn" @click="triggerSign">Accept</v-btn>
            </v-card-actions>
            <img src="images/torus_logo.png" class="bcg-logo hidden-xs-and-down push--top-10" />
          </v-card>
        </div>
        <div v-else-if="type === 'transaction'">
          <v-card>
            <v-card-title class="headline">Transaction</v-card-title>
            <v-card-text>
              <p>Origin: {{ origin }}</p>
              <p>Send {{ value }} ETH to {{ receiver }} ?</p>
              <p>Your balance: {{ balance }} ETH</p>

              <!-- <v-toolbar card dense>
              <v-toolbar-title>
                <span class="subheading">Gas Costs</span>
              </v-toolbar-title>
              <v-spacer></v-spacer>
              </v-toolbar>-->

              <v-layout justify-space-between mb-3>
                <v-flex text-xs-left>
                  <span class="display-2 font-weight-light" v-text="gasPrice"></span>
                  <span class="subheading font-weight-light mr-1">Gas Price (GWei)</span>
                </v-flex>
              </v-layout>

              <v-slider v-model="gasPrice" :color="color" always-dirty :min="min" :max="max">
                <!-- <v-icon slot="prepend" :color="color" @click="decrement">
                  mdi-minus
                </v-icon>

                <v-icon slot="append" :color="color" @click="increment">
                  mdi-plus
                </v-icon>-->
              </v-slider>
            </v-card-text>

            <v-card-actions>
              <v-btn large color="error" flat @click="triggerDeny">Disagree</v-btn>
              <v-spacer></v-spacer>
              <v-btn large color="blue" flat @click="triggerSign">Agree</v-btn>
            </v-card-actions>
          </v-card>
        </div>
      </v-dialog>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'
import BroadcastChannel from 'broadcast-channel'
import torus from '../torus'

const weiInGwei = 1000000000

export default {
  name: 'confirm',
  data() {
    return {
      type: 'none',
      origin: 'unknown',
      gasPrice: 10,
      min: 1,
      max: 50,
      balance: 0,
      value: 0,
      receiver: 'unknown',
      dialog: true,
      message: ''
    }
  },
  computed: {
    color() {
      if (this.gasPrice < 5) return 'indigo'
      if (this.gasPrice < 10) return 'teal'
      if (this.gasPrice < 20) return 'green'
      if (this.gasPrice < 35) return 'orange'
      return 'red'
    }
  },
  methods: {
    triggerSign: function(event) {
      var bc = new BroadcastChannel(`torus_channel_${new URLSearchParams(window.location.search).get('instanceId')}`)
      var gasHex = torus.web3.utils.numberToHex(this.$data.gasPrice * weiInGwei)
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
    ...mapActions({})
  },
  mounted() {
    var bc = new BroadcastChannel(`torus_channel_${new URLSearchParams(window.location.search).get('instanceId')}`)
    bc.onmessage = function(ev) {
      if (ev.data.type === 'message') {
        if (ev.data.msgParams) {
          this.message = ev.data.msgParams.message
          this.typedMessages = ev.data.msgParams.typedMessages
          this.messageType = this.typedMessages ? 'typed' : 'normal'
        }
        this.origin = ev.data.origin
        this.type = ev.data.type
      } else if (ev.data.type === 'transaction') {
        var web3Utils = torus.web3.utils
        var txParams = ev.data.txParams
        var value
        if (txParams.value) {
          value = web3Utils.fromWei(txParams.value.toString())
        } else {
          value = 0
        }
        var gweiGasPrice = web3Utils.hexToNumber(txParams.gasPrice) / weiInGwei
        this.origin = ev.data.origin
        this.type = ev.data.type
        this.receiver = txParams.to
        this.value = value
        this.gasPrice = gweiGasPrice
        this.balance = ev.data.balance
      }
      bc.close()
      bc.close()
    }.bind(this)
    bc.postMessage({ data: 'popup-loaded' })
  }
}
</script>

<style>
/* Portrait phones and smaller */
@media (max-width: 480px) {
  .bcg-logo {
    display: none;
  }

  .bcg {
    display: none;
  }
}

.text-bluish {
  color: #187bd1;
}

.bcg {
  position: fixed;
  right: 0;
  top: 10%;
}

.push--top-10 {
  margin-top: -10px;
}

.bcg-logo {
  position: fixed;
  right: 0;
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
