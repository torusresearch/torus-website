<template>
  <div id='torusModal'>
    <div v-if="$route.params.type === 'message'">
      <div id='torusModal-content' >
        <div id="torusModal-header">
          <span id="close">&times;</span>
          <h2>New Message</h2>
        </div>
        <div id="torusModal-body">
          <p>Sign message from {{ $route.params.origin }}?</p>
          <button v-on:click="triggerDeny" style='width:50%'> Deny </button>
          <button v-on:click="triggerSign" style='width:50%'> Sign </button>
        </div>
      </div>
    </div>
    <div v-else-if="$route.params.type === 'transaction'"> 
      <div id='torusModal-content' >
        <div id="torusModal-header">
          <span id="close">&times;</span>
          <h2>New Transaction</h2>
        </div>
        <div id="torusModal-body">
          <p> Origin: {{ $route.params.origin }} </p>
          <p>Send {{ $route.params.value }} ETH to {{ $route.params.receiver }}?</p>
          <p> Your balance: {{ $route.params.balance }} ETH </p>
          <button v-on:click="triggerDeny" style='width:50%'> Deny </button>
          <button v-on:click="triggerSign" style='width:50%'> Send </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'

  export default {
    name: "confirm",
    methods: {
      triggerSign: function (event) {
        var bc = new BroadcastChannel('torus_channel');
        bc.postMessage('confirm-transaction');
        window.close();
      },
      triggerDeny: function (event) {
        var bc = new BroadcastChannel('torus_channel');
        bc.postMessage('deny-transaction');
        window.close();
      },
      ...mapActions({
        hidePopup: 'hidePopup'
      })
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
    background-color: rgb(0,0,0); /* Fallback color */
    background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
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