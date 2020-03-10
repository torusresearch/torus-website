<template>
  <div>
    <Navbar />
    <hr v-if="!$vuetify.theme.dark" class="navbar-line" />
    <v-container>
      <router-view></router-view>
    </v-container>
    <v-dialog :value="smartContractAccount && !smartContractAccount.notified" max-width="375" persistent>
      <MessageModal :no-close="true" :modal-type="messageModalType" :title="'Your Smart Contract Wallet is ready'" @onClose="closeSmartContractModal">
        <template v-slot:link>
          <div class="my-10">
            <v-btn color="success" large outlined @click="markAsRead">
              Take me to my wallet
            </v-btn>
          </div>
        </template>
      </MessageModal>
    </v-dialog>
  </div>
</template>

<script>
import Navbar from '../../components/helpers/Navbar'
import MessageModal from '../../components/WalletTransfer/MessageModal'
import { MESSAGE_MODAL_TYPE_SUCCESS } from '../../utils/enums'

export default {
  components: {
    Navbar,
    MessageModal
  },
  data() {
    return {
      messageModalType: MESSAGE_MODAL_TYPE_SUCCESS
    }
  },
  computed: {
    smartContractAccount() {
      const { wallet: storeWallet } = this.$store.state || {}
      const wallet = Object.keys(storeWallet).reduce((accts, x) => {
        if (storeWallet[x].type === 'SC' && storeWallet[x].type !== 'PROCESSING' && storeWallet[x].network === this.$store.state.networkType.host)
          accts.push({ address: x, ...storeWallet[x] })
        return accts
      }, [])
      return wallet[0]
    }
  },
  methods: {
    async markAsRead() {
      this.$store.dispatch('updateWalletNotified', this.smartContractAccount)
      await this.$store.dispatch('changeAccount', { selectedAddress: this.smartContractAccount.address })
      this.$router.push({ name: 'walletHome' })
    },
    closeSmartContractModal() {
      this.$store.dispatch('updateWalletNotified', this.smartContractAccount)
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'Wallet.scss';
</style>
