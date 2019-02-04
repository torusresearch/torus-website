<template>
  <v-container ma-0 pa-0>
    <v-layout row justify-center>
      <v-dialog v-model="dialog" persistent fullscreen="true">
        <div v-if="this.type === 'message'">
          <v-card height="100vh">
            <v-card-title class="headline">New Message</v-card-title>

            <v-card-text>Sign message from {{ this.origin }} ?</v-card-text>

            <v-card-actions>
              <v-btn large color="error" flat @click="triggerDeny">Disagree</v-btn>
              <v-spacer></v-spacer>
              <v-btn large color="blue" flat @click="triggerSign">Agree</v-btn>
            </v-card-actions>
          </v-card>
        </div>
        <div v-else-if="this.type === 'transaction'">
          <v-card height="100vh">
            <v-card-title class="headline">New Transaction</v-card-title>

            <v-card-text>
              <p>Origin: {{ this.origin }}</p>
              <p>Send {{ this.value }} ETH to {{ this.receiver }} ?</p>
              <p>Your balance: {{ this.balance }} ETH</p>
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

export default {
  name: 'confirm',
  data() {
    return {
      type: 'none',
      origin: 'unknown',
      balance: 0,
      value: 0,
      receiver: 'unknown',
      dialog: true
    }
  },
  methods: {
    triggerSign: function(event) {
      var bc = new BroadcastChannel('torus_channel')
      bc.postMessage('confirm-transaction')
      bc.close()
      window.close()
    },
    triggerDeny: function(event) {
      var bc = new BroadcastChannel('torus_channel')
      bc.postMessage('deny-transaction')
      bc.close()
      window.close()
    },
    ...mapActions({
      hidePopup: 'hidePopup'
    })
  },
  mounted() {
    const that = this
    var bc = new BroadcastChannel('torus_channel')
    bc.onmessage = function(ev) {
      if (ev.origin === 'https://localhost:3000' || ev.origin === 'https://tor.us') {
        if (ev.data.type === 'message') {
          that.origin = ev.data.origin
          that.type = ev.data.type
        } else if (ev.data.type === 'transaction') {
          that.origin = ev.data.origin
          that.type = ev.data.type
          that.receiver = ev.data.receiver
          that.value = ev.data.value
          that.balance = ev.data.balance
        }
        bc.close()
      }
    }
    bc.postMessage('popup-loaded')
  }
}
</script>

<style>
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

<!--
<template>
  <v-dialog persistent>
    <div v-if="this.type === 'message'">
      <v-container>
        <v-layout row wrap>
          <v-flex xs12 sm6 md3 id="torusModal-header">
            <span id="close">&times;</span>
            <h2>New Message</h2>
          </v-flex>
        </v-layout>
        <v-layout row wrap id="torusModal-body">
          <v-flex xs12 sm6 md3>
            <p>Sign message from {{ this.origin }}?</p>
            <v-btn color="error" v-on:click="triggerDeny" style="width:50%">Deny</v-btn>
            <v-btn color="blue" v-on:click="triggerSign" style="width:50%">Sign</v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </div>
    <div v-else-if="this.type === 'transaction'">
      <v-container>
        <v-layout row wrap>
          <v-flex xs12 sm6 md3 id="torusModal-header">
            <span id="close">&times;</span>
            <h2>New Transaction</h2>
          </v-flex>
        </v-layout>
        <v-layout row wrap id="torusModal-body">
          <v-flex xs12 sm6 md3>
            <p>Origin: {{ this.origin }}</p>
            <p>Send {{ this.value }} ETH to {{ this.receiver }}?</p>
            <p>Your balance: {{ this.balance }} ETH</p>
            <v-btn color="error" class="white--text" v-on:click="triggerDeny" style="width:50%">Deny</v-btn>
            <v-btn color="blue" class="white--text" v-on:click="triggerSign" style="width:50%">Sign</v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </div>
  </v-dialog>
</template>

      <div v-if="this.type === 'message'">
        <div id="torusModal-content">
          <div id="torusModal-header">
            <span id="close">&times;</span>
            <h2>New Message</h2>
          </div>
          <div id="torusModal-body">
            <p>Sign message from {{ this.origin }}?</p>
            <button v-on:click="triggerDeny" style="width:50%">Deny</button>
            <button v-on:click="triggerSign" style="width:50%">Sign</button>
          </div>
        </div>
      </div>
      <div v-else-if="this.type === 'transaction'">
        <div id="torusModal-content">
          <div id="torusModal-header">
            <span id="close">&times;</span>
            <h2>New Transaction</h2>
          </div>
          <div id="torusModal-body">
            <p>Origin: {{ this.origin }}</p>
            <p>Send {{ this.value }} ETH to {{ this.receiver }}?</p>
            <p>Your balance: {{ this.balance }} ETH</p>
            <button v-on:click="triggerDeny" style="width:50%">Deny</button>
            <button v-on:click="triggerSign" style="width:50%">Send</button>
          </div>
        </div>
      </div>
-->
