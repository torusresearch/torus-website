<template>
  <v-flex xs12 sm8 mt-3 mb-3>
    <div class="d-flex has-border">
      <v-select single-line solo flat :items="accounts" :value="selectedAddress" label="Selected Account" @change="onAccountChange"></v-select>
    </div>
    <div class="d-flex has-border">
      <span class="body-2">Public Address</span>
      <span class="text-xs-right">
        <show-tool-tip :address="selectedAddress">
          {{ slicedAddress }}
        </show-tool-tip>
      </span>
    </div>
    <div class="d-flex has-border">
      <span class="body-2">Private Key</span>
      <span class="text-xs-right">
        <show-tool-tip :address="selectedKey">
          {{ slicedKey }}
        </show-tool-tip>
      </span>
    </div>
    <a :href="walletJson" :class="[{ disable: !downloadable }]" :download="name">Download wallet</a>
  </v-flex>
</template>

<script>
import ShowToolTip from '../components/ShowToolTip.vue'
import { addressSlicer } from '../utils/utils'
const Wallet = require('ethereumjs-wallet')
const ethUtil = require('ethereumjs-util')

export default {
  name: 'walletAccounts',
  components: { ShowToolTip },
  data() {
    return {
      keyStorePassword: '',
      walletJson: '',
      name: '',
      downloadable: true
    }
  },
  computed: {
    selectedAddress() {
      return this.$store.state.selectedAddress
    },
    selectedKey() {
      return this.$store.state.wallet[this.selectedAddress]
    },
    slicedAddress() {
      return addressSlicer(this.selectedAddress)
    },
    slicedKey() {
      return addressSlicer(this.selectedKey)
    },
    accounts() {
      return Object.keys(this.$store.state.wallet)
    }
  },
  methods: {
    onAccountChange(newAddress) {
      this.$store.dispatch('updateSelectedAddress', { selectedAddress: newAddress })
    },
    exportKeyStoreFile() {
      const _wallet = this.createWallet(this.keyStorePassword)
      this.walletJson = this.createBlob('mime', _wallet.walletJson)
      this.name = _wallet.name.toString()
    },
    createWallet(password) {
      const createdWallet = {}
      const wallet = this.generateWallet(this.selectedKey)
      createdWallet.walletJson = wallet.toV3(password)
      createdWallet.name = wallet.getV3Filename()
      return createdWallet
    },
    generateWallet(privateKey) {
      const stripped = ethUtil.stripHexPrefix(privateKey)
      const buffer = Buffer.from(stripped, 'hex')
      const wallet = Wallet.fromPrivateKey(buffer)
      return wallet
    },
    createBlob(mime, str) {
      const string = typeof str === 'object' ? JSON.stringify(str) : str
      if (string === null) return ''
      const blob = new Blob([string], {
        type: mime
      })
      return window.URL.createObjectURL(blob)
    }
  },
  mounted() {
    this.exportKeyStoreFile()
  }
}
</script>

<style lang="scss" scoped>
.selected-account {
  cursor: pointer;
  padding: 5px 15px;
  border-radius: 10px;
  max-width: 120px;
  &:hover {
    background-color: var(--v-torus_reject_mild-base);
    opacity: 0.5;
    color: #fff;
  }
  &.active {
    background-color: var(--v-torus_active-base);
  }
}

.has-border {
  // border: 2px solid var(--v-torus_reject-base);
  border-radius: 5px;
  padding: 15px;
  margin: 15px;
}

.disable {
  background-color: var(--v-torus_svg_bcg-base);
  cursor: default;
  pointer-events: none;
}
</style>
