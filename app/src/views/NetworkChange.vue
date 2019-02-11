<template>
  <v-container ma-0 pa-0>
    <v-layout row justify-center>
      <v-dialog v-model="dialog" persistent fullscreen="true">
        <div>
          <v-card height="100vh">
            <v-card-title class="headline">Network Change Request</v-card-title>

            <v-card-text>Change network to {{ this.network }}?</v-card-text>

            <v-card-actions>
              <v-btn large color="error" flat @click="triggerDeny">No</v-btn>
              <v-spacer></v-spacer>
              <v-btn large color="blue" flat @click="triggerSign">Yes</v-btn>
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
  name: 'networkChange',
  data() {
    return {
      network: 'none',
      origin: 'unknown',
      dialog: true
    }
  },
  methods: {
    triggerSign: function(event) {
      var bc = new BroadcastChannel('torus_network_channel')
      bc.postMessage({ approve: true, network: this.$data.network })
      bc.close()
      window.close()
    },
    triggerDeny: function(event) {
      var bc = new BroadcastChannel('torus_network_channel')
      bc.postMessage({ approve: false })
      bc.close()
      window.close()
    },
    ...mapActions({})
  },
  mounted() {
    const that = this
    var bc = new BroadcastChannel('torus_network_channel')
    bc.onmessage = function(ev) {
      if (ev.origin === 'https://localhost:3000' || ev.origin === 'https://tor.us') {
        that.origin = ev.data.origin
        that.network = ev.data.network
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
