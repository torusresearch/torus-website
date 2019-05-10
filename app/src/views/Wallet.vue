<template>
  <div :class="[{ 'background-login': !loggedIn }, 'default']">
    <v-container fill-height align-content-center>
      <template v-if="gapiLoaded">
        <template v-if="loggedIn">
          <wallet-logged-in />
        </template>
        <template v-else>
          <wallet-welcome />
        </template>
      </template>
      <template v-else>
        <page-loader />
      </template>
    </v-container>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import PageLoader from '../components/PageLoader.vue'
import WalletWelcome from '../containers/WalletWelcome.vue'
import WalletLoggedIn from '../containers/WalletLoggedIn.vue'
import { addressSlicer, significantDigits } from '../utils/utils'
import torus from '../torus'

export default {
  name: 'wallet',
  components: { PageLoader, WalletWelcome, WalletLoggedIn },
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

.background-login {
  position: relative;
  background-image: url(/images/background_login.png);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  @extend .default;
}

.default {
  height: 100%;
}

body,
html {
  height: 100%;
  overflow-y: hidden;
}
</style>
