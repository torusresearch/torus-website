<template>
  <v-container fill-height grid-list-sm>
    <v-layout v-if="loggedIn">
      <v-layout v-if="balance === '0'" align-center justify-center>
        <v-flex d-flex xs12 sm12 md12>
          <div class="text-xs-center">
            <v-progress-circular indeterminate color="#75b4fd"></v-progress-circular>
          </div>
        </v-flex>
      </v-layout>
      <v-layout v-else row wrap justify-center>
        <v-flex xs12>
          <v-btn color="#75b4fd" class="white--text" v-on:click="logout">Logout</v-btn>
        </v-flex>
        <v-flex xs12 font-weight-medium>
          <span>ETH Balance: </span>
          <span>{{ parseFloat(balance).toFixed(5) }} ETH</span>
        </v-flex>
        <v-flex xs12>
          <v-text-field
            id="toAddress"
            placeholder="Enter address to send to"
            aria-label="box"
            solo
            v-model="toAddress"
            :rules="[rules.toAddress, rules.required]"
            height="15px"
            class="input-width"
          ></v-text-field>
          <v-text-field
            id="amount"
            placeholder="Enter Amount to send"
            aria-label="box"
            solo
            v-model="amount"
            height="15px"
            :rules="[rules.required]"
            class="input-width"
          ></v-text-field>
          <v-btn color="#75b4fd" class="white--text" v-on:click="sendEth">Send</v-btn>
        </v-flex>
        <v-flex xs12>
          <v-btn color="#75b4fd" class="white--text" v-on:click="getTokenBalances">Get Token Balances</v-btn>
          <div v-for="(value, key) in tokenBalances" :key="key">{{ key }}: {{ parseFloat(value).toFixed(5) }}</div>
        </v-flex>
      </v-layout>
    </v-layout>
    <v-layout v-else align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-10">
          <v-card-text>
            <div class="title">
              Welcome back!
            </div>
            <v-spacer></v-spacer>
            <div class="subheading">The decentralized web awaits</div>
            <v-spacer></v-spacer>
          </v-card-text>
          <v-card-actions>
            <v-btn color="#75b4fd" class="white--text ml-auto" v-on:click="triggerLogin" id="googleAuthBtnf">Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'profile',
  data: function() {
    return {
      toAddress: '',
      amount: '',
      tokenBalances: {},
      rules: {
        toAddress: value => window.Vue.torus.web3.utils.isAddress(value) || 'Invalid Eth Address',
        required: value => !!value || 'Required'
      }
    }
  },
  computed: mapState({
    balance: state => window.Vue.torus.web3.utils.fromWei(state.weiBalance || '0'),
    selectedAddress: 'selectedAddress',
    loggedIn: state => {
      return state.selectedAddress !== ''
    }
  }),
  methods: {
    ...mapActions({
      triggerLogin: 'triggerLogin'
    }),
    logout: function() {
      window.Vue.$store.dispatch('resetStore')
    },
    sendEth: function() {
      window.Vue.torus.web3.eth.sendTransaction({
        from: this.selectedAddress,
        to: this.toAddress,
        value: window.Vue.torus.web3.utils.toWei(this.amount)
      })
    },
    getTokenBalances: function() {
      let selectedAddress = this.selectedAddress
      // selectedAddress = '0x5cc494843e3f4ac175a5e730c300b011fabf2cea'
      fetch(
        // eslint-disable-next-line max-len
        `https://api.etherscan.io/api?module=account&action=tokentx&address=${selectedAddress}&startblock=0&endblock=999999999&sort=asc&apikey=99M2SA7ZXJYC6N74Z4XRKCY28TFDVZKN4D`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          }
        }
      )
        .then(res => res.json())
        .then(res => {
          const balances = {}
          for (let index = 0; index < res.result.length; index++) {
            const element = res.result[index]
            balances[element.tokenSymbol] = balances[element.tokenSymbol] ? balances[element.tokenSymbol] : 0
            const value = parseFloat(element.value) / 10 ** parseInt(element.tokenDecimal, 10)
            balances[element.tokenSymbol] += element.from === selectedAddress ? -value : +value
          }
          this.tokenBalances = balances
        })
        .catch(err => {
          console.error(err)
        })
    }
  },
  mounted() {
    // setup google auth sdk
    window.gapi.load('auth2', function() {
      window.auth2 = window.gapi.auth2.init({
        client_id: '876733105116-i0hj3s53qiio5k95prpfmj0hp0gmgtor.apps.googleusercontent.com'
      })
    })
  }
}
</script>

<style>
.input-width {
  max-width: 400px;
}
</style>
