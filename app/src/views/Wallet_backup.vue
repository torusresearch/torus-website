<template>
  <v-container fill-height align-content-center>
    <wallet-logged-in />
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import PageLoader from '../components/PageLoader.vue'
import WalletLoggedIn from '../containers/WalletLoggedIn.vue'
import { addressSlicer, significantDigits } from '../utils/utils'
import torus from '../torus'

export default {
  name: 'wallet',
  components: { PageLoader, WalletLoggedIn },
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
