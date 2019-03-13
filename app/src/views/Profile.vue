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
          <div v-if="tokenBalances.length > 0 && fetchedTokenBalances">
            <v-card>
              <v-card-title>
                Token Balances
                <v-spacer />
                <v-text-field
                  class="input-width text-lg-right"
                  v-model="search"
                  append-icon="search"
                  label="Search"
                  single-line
                  hide-details
                ></v-text-field>
              </v-card-title>
              <v-data-table :headers="headers" :items="tokenBalances" :search="search">
                <template v-slot:items="props">
                  <td>{{ props.item.ticker }}</td>
                  <td class="text-xs-left">{{ props.item.name }}</td>
                  <td class="text-xs-left">{{ props.item.balance }}</td>
                  <td class="text-xs-left">
                    <a :href="props.item.etherscanLink" class="btn" target="_blank" rel="noreferrer noopener">View On Etherscan</a>
                  </td>
                </template>
                <v-alert v-slot:no-results :value="true" color="error" icon="warning"> Your search for "{{ search }}" found no results. </v-alert>
              </v-data-table>
            </v-card>
          </div>
          <div v-else-if="fetchedTokenBalances" class="font-weight-medium">
            You don't hold any ERC-20 tokens
          </div>
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
      tokenBalances: [],
      fetchedTokenBalances: false,
      search: '',
      headers: [
        {
          text: 'Ticker',
          align: 'left',
          value: 'ticker'
        },
        { text: 'Name', value: 'name' },
        { text: 'Balance', value: 'balance' },
        { text: 'Etherscan', value: 'etherscanLink' }
      ],
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
    significantDigits: function(number, perc = false, len = 2) {
      let input = number
      if (input === 0) return input
      if (perc) {
        input *= 100
      }
      let depth
      if (input >= 1) {
        depth = 2
      } else {
        depth = len - 1 + Math.ceil(Math.log10(1 / input))
      }
      const shift = Math.pow(10, depth)
      const roundedNum = Math.round(shift * input) / shift
      return roundedNum
    },
    getTokenBalances: function() {
      let selectedAddress = this.selectedAddress
      selectedAddress = '0x5cc494843e3f4ac175a5e730c300b011fabf2cea'
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
            balances[element.tokenSymbol] = balances[element.tokenSymbol]
              ? balances[element.tokenSymbol]
              : { balance: 0, name: '', ticker: '', etherscanLink: '' }
            const value = parseFloat(element.value) / 10 ** parseInt(element.tokenDecimal, 10)
            balances[element.tokenSymbol].balance += element.from === selectedAddress ? -value : +value
            balances[element.tokenSymbol].name = element.tokenName
            balances[element.tokenSymbol].ticker = element.tokenSymbol
            balances[element.tokenSymbol].etherscanLink = `https://etherscan.io/address/${element.contractAddress}`
          }
          this.tokenBalances = Object.keys(balances).map(item => {
            return { ...balances[item], balance: this.significantDigits(balances[item].balance) }
          })
          this.fetchedTokenBalances = true
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
