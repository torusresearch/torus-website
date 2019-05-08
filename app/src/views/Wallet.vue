<template>
  <v-container fill-height grid-list-sm>
    <template v-if="gapiLoaded">
      <v-layout xs12 row wrap justify-center>
        <v-flex xs12>
          <wallet-logged-in />
        </v-flex>
        <v-flex xs12 v-if="loggedIn">
          <v-layout row wrap justify-center align-space-between fill-height>
            <v-flex xs12>
              <show-tool-tip>
                {{ slicedAddress }}
              </show-tool-tip>
            </v-flex>
            <v-flex xs12 sm6 d-flex>
              <v-select :items="networks" v-model="selectedNetwork" @change="networkChanged" label="Network"></v-select>
            </v-flex>
            <v-flex xs12 font-weight-medium>
              <span>ETH Balance: </span>
              <span>{{ computedBalance }} ETH</span>
            </v-flex>
            <v-flex xs12>
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
                  <v-btn color="#75b4fd" :disabled="!valid" class="white--text" @click="sendEth">Send</v-btn>
                </v-form>
              </v-expand-transition>
            </v-flex>
            <!-- <v-flex xs6>
          <v-btn outline color="#75b4fd" class="font-weight-medium mb-4" @click="depositETHOption">Deposit ETH</v-btn>
        </v-flex> -->
            <v-flex xs12 justify-space-around>
              <v-btn color="#75b4fd" class="white--text mb-4" @click="getTokenBalances">Get Token Balances</v-btn>
              <v-expand-transition>
                <div v-if="tokenBalances.length > 0 && fetchedTokenBalances">
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
                                  <v-btn color="blue darken-1" large flat :disabled="!tokenFormValid" @click="onTransferToken(props.item)"
                                    >Send</v-btn
                                  >
                                </v-card-actions>
                              </v-card>
                            </v-form>
                          </v-dialog>
                        </td>
                      </template>
                      <v-alert v-slot:no-results :value="true" color="error" icon="warning">
                        Your search for "{{ search }}" found no results.
                      </v-alert>
                    </v-data-table>
                  </v-card>
                </div>
              </v-expand-transition>
              <v-expand-transition>
                <div v-if="fetchedTokenBalances && tokenBalances.length === 0" class="font-weight-medium">
                  You don't hold any ERC-20 tokens
                </div>
              </v-expand-transition>
            </v-flex>
          </v-layout>
        </v-flex>
        <template v-else>
          <wallet-welcome />
        </template>
      </v-layout>
    </template>
    <template v-else>
      <page-loader />
    </template>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import PageLoader from '../components/PageLoader.vue'
import ShowToolTip from '../components/ShowToolTip.vue'
import WalletWelcome from '../components/WalletWelcome.vue'
import WalletLoggedIn from '../components/WalletLoggedIn.vue'
import { addressSlicer, significantDigits } from '../utils/utils'
import torus from '../torus'

export default {
  name: 'wallet',
  components: { PageLoader, WalletWelcome, ShowToolTip, WalletLoggedIn },
  data: function() {
    return {
      selectedNetwork: '',
      networks: ['mainnet', 'rinkeby', 'ropsten', 'kovan'],
      toAddress: '',
      widget: {},
      tokenToAddress: '',
      amount: '',
      tokenAmount: '',
      valid: true,
      sendEthExpand: false,
      // depositEthExpand: false,
      tokenFormValid: true,
      tokenBalances: [],
      fetchedTokenBalances: false,
      search: '',
      gapiLoaded: false,
      headers: [
        {
          text: 'Symbol',
          align: 'left',
          value: 'symbol'
        },
        { text: 'Name', value: 'name' },
        { text: 'Balance', value: 'balance' },
        { text: 'Transfer', value: 'transfer' }
      ],
      rules: {
        toAddress: value => torus.web3.utils.isAddress(value) || 'Invalid Eth Address',
        required: value => !!value || 'Required'
      }
    }
  },
  computed: mapState({
    balance: state => torus.web3.utils.fromWei(state.weiBalance || '0'),
    selectedAddress: 'selectedAddress',
    slicedAddress: state => addressSlicer(state.selectedAddress) || '0x',
    loggedIn: state => {
      return state.selectedAddress !== ''
    },
    computedBalance: function() {
      return significantDigits(parseFloat(this.balance).toFixed(5)) || 0
    }
  }),
  methods: {
    networkChanged: function() {
      this.$store.dispatch('setProviderType', { network: this.selectedNetwork })
    },
    // depositETHOption: function() {
    //   this.depositEthExpand = !this.depositEthExpand
    //   this.widget.open()
    // },
    onTransferToken: function(item) {
      if (this.$refs.tokenForm.validate()) {
        const contractInstance = new torus.web3.eth.Contract(
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
          item.tokenAddress
        )
        contractInstance.methods.transfer(this.tokenToAddress, (this.tokenAmount * 10 ** item.decimals).toString()).send({
          from: this.selectedAddress
        })
        item.dialog = false
      }
    },
    sendEth: function() {
      if (this.$refs.form.validate()) {
        torus.web3.eth.sendTransaction({
          from: this.selectedAddress,
          to: this.toAddress,
          value: torus.web3.utils.toWei(this.amount)
        })
      }
    },
    getTokenBalances: function() {
      this.tokenBalances = this.$store.state.tokenData
      this.fetchedTokenBalances = true
    }
  },
  mounted() {
    this.selectedNetwork = localStorage.getItem('torus_network_type') || 'mainnet'

    // setup google auth sdk
    const interval = setInterval(() => {
      if (window.gapi) {
        window.gapi.load('auth2', () => {
          window.auth2 = window.gapi.auth2.init({
            client_id: '876733105116-i0hj3s53qiio5k95prpfmj0hp0gmgtor.apps.googleusercontent.com'
          })
          this.gapiLoaded = true
          clearInterval(interval)
        })
      }
    }, 2000)
  }
}
</script>

<style lang="scss">
.input-width {
  max-width: 400px;
}
.input-width-200 {
  max-width: 200px;
}
</style>
