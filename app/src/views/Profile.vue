<template>
  <v-container fill-height grid-list-sm>
    <v-layout v-if="loggedIn">
      <v-layout v-if="!loggedIn" align-center justify-center>
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
          <span>{{ this.significantDigits(parseFloat(balance).toFixed(5)) || 0 }} ETH</span>
        </v-flex>
        <v-flex xs6>
          <v-btn outline color="#75b4fd" class="font-weight-medium mb-4" @click="sendEthExpand = !sendEthExpand">Send ETH</v-btn>
          <v-expand-transition>
            <v-form ref="form" v-model="valid" lazy-validation v-show="sendEthExpand">
              <v-text-field
                id="toAddress"
                placeholder="Enter address to send ether to"
                aria-label="box"
                solo
                v-model="toAddress"
                :rules="[rules.toAddress, rules.required]"
                height="15px"
                class="input-width"
              ></v-text-field>
              <v-text-field
                id="amount"
                placeholder="Enter ether amount to send"
                aria-label="box"
                solo
                v-model="amount"
                height="15px"
                :rules="[rules.required]"
                class="input-width"
              ></v-text-field>
              <v-btn color="#75b4fd" :disabled="!valid" class="white--text" v-on:click="sendEth">Send</v-btn>
            </v-form>
          </v-expand-transition>
        </v-flex>
        <v-flex xs6>
          <v-btn outline color="#75b4fd" class="font-weight-medium mb-4" @click="depositETHOption">Deposit ETH</v-btn>
        </v-flex>
        <v-flex xs12 justify-space-around>
          <v-btn color="#75b4fd" class="white--text mb-4" v-on:click="getTokenBalances">Get Token Balances</v-btn>
          <v-expand-transition>
            <div v-show="tokenBalances.length > 0 && fetchedTokenBalances">
              <v-card>
                <v-card-title>
                  Token Balances
                  <v-spacer />
                  <v-text-field
                    class="input-width-200 text-lg-right"
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
                    <td class="text-xs-left">
                      <a :href="props.item.etherscanLink" target="_blank" rel="noreferrer noopener">{{ props.item.name }}</a>
                    </td>
                    <td class="text-xs-left">{{ props.item.balance }}</td>
                    <td class="text-xs-left">
                      <v-dialog v-model="props.item.dialog" persistent max-width="600px">
                        <template v-slot:activator="{ on }">
                          <v-btn color="#75b4fd" v-on="on" class="white--text mb-4">Transfer</v-btn>
                        </template>
                        <v-form ref="tokenForm" v-model="tokenFormValid" lazy-validation>
                          <v-card>
                            <v-card-title>
                              <span class="headline">Send Token: {{ props.item.ticker }}</span>
                            </v-card-title>
                            <v-card-text>
                              <v-container grid-list-md>
                                <v-layout wrap>
                                  <v-flex xs12 sm12 md12>
                                    <v-text-field
                                      id="tokenToAddress"
                                      placeholder="Enter address to send token to"
                                      aria-label="box"
                                      solo
                                      required
                                      v-model="tokenToAddress"
                                      :rules="[rules.toAddress, rules.required]"
                                      height="15px"
                                      class="input-width"
                                    ></v-text-field>
                                  </v-flex>
                                  <v-flex xs12 sm12 md12>
                                    <v-text-field
                                      id="amount"
                                      placeholder="Enter token amount to send"
                                      aria-label="box"
                                      solo
                                      required
                                      v-model="tokenAmount"
                                      height="15px"
                                      :rules="[rules.required]"
                                      class="input-width"
                                    ></v-text-field>
                                  </v-flex>
                                </v-layout>
                              </v-container>
                            </v-card-text>
                            <v-card-actions>
                              <v-btn color="blue darken-1" large flat @click="props.item.dialog = false">Close</v-btn>
                              <v-spacer></v-spacer>
                              <v-btn color="blue darken-1" large flat :disabled="!tokenFormValid" @click="onTransferToken(props.item)">Send</v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-form>
                      </v-dialog>
                    </td>
                  </template>
                  <v-alert v-slot:no-results :value="true" color="error" icon="warning"> Your search for "{{ search }}" found no results. </v-alert>
                </v-data-table>
              </v-card>
            </div>
          </v-expand-transition>
          <v-expand-transition>
            <div v-show="fetchedTokenBalances && tokenBalances.length === 0" class="font-weight-medium">
              You don't hold any ERC-20 tokens
            </div>
          </v-expand-transition>
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
      widget: {},
      tokenToAddress: '',
      amount: '',
      tokenAmount: '',
      valid: true,
      sendEthExpand: false,
      depositEthExpand: false,
      tokenFormValid: true,
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
        { text: 'Transfer', value: 'transfer' }
      ],
      rules: {
        toAddress: value => window.web3.utils.isAddress(value) || 'Invalid Eth Address',
        required: value => !!value || 'Required'
      }
    }
  },
  computed: mapState({
    balance: state => window.web3.utils.fromWei(state.weiBalance || '0'),
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
    depositETHOption: function() {
      this.depositEthExpand = !this.depositEthExpand
      this.widget.open()
    },
    onTransferToken: function(item) {
      if (this.$refs.tokenForm.validate()) {
        const web3 = window.web3
        const contractInstance = new web3.eth.Contract(
          [
            {
              constant: false,
              inputs: [
                {
                  name: '_to',
                  type: 'address'
                },
                {
                  name: '_value',
                  type: 'uint256'
                }
              ],
              name: 'transfer',
              outputs: [
                {
                  name: 'success',
                  type: 'bool'
                }
              ],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'function'
            }
          ],
          item.address
        )
        contractInstance.methods.transfer(this.tokenToAddress, this.tokenAmount).send({
          from: this.selectedAddress
        })
        item.dialog = false
      }
    },
    sendEth: function() {
      if (this.$refs.form.validate()) {
        window.web3.eth.sendTransaction({
          from: this.selectedAddress,
          to: this.toAddress,
          value: window.web3.utils.toWei(this.amount)
        })
      }
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
            balances[element.tokenSymbol] = balances[element.tokenSymbol]
              ? balances[element.tokenSymbol]
              : { balance: 0, name: '', ticker: '', etherscanLink: '' }
            const value = parseFloat(element.value) / 10 ** parseInt(element.tokenDecimal, 10)
            balances[element.tokenSymbol].balance += element.from === selectedAddress ? -value : +value
            balances[element.tokenSymbol].name = element.tokenName
            balances[element.tokenSymbol].ticker = element.tokenSymbol
            balances[element.tokenSymbol].address = element.contractAddress
            balances[element.tokenSymbol].etherscanLink = `https://etherscan.io/address/${element.contractAddress}`
            balances[element.tokenSymbol].dialog = false
          }
          const finalBalances = []
          Object.keys(balances).map(item => {
            if (balances[item].balance > 0) finalBalances.push({ ...balances[item], balance: this.significantDigits(balances[item].balance) })
          })
          this.tokenBalances = finalBalances
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
    // window.web3 = window.web3
    // window.Web3 = window.web3
    window.web3 = window.web3
    let sendWyreScript = document.createElement('script')
    sendWyreScript.setAttribute('src', 'https://verify.sendwyre.com/js/widget-loader.js')
    document.head.appendChild(sendWyreScript)
    sendWyreScript.onload = function() {
      this.widget = new window.Wyre.Widget({
        env: 'test',
        accountId: 'AC_26U73M3RTCT',
        auth: { type: 'metamask' },
        operation: {
          type: 'onramp',
          destCurrency: 'ETH'
        }
      })
    }.bind(this)
  }
}
</script>

<style>
.input-width {
  max-width: 400px;
}
.input-width-200 {
  max-width: 200px;
}
</style>
