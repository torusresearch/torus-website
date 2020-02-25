<template>
  <div>
    <navbar />
    <hr v-if="!$vuetify.theme.dark" class="navbar-line" />
    <v-container>
      <router-view></router-view>
    </v-container>
    <v-dialog :value="smartContractAccount && !smartContractAccount.notified" max-width="375" persistent>
      <message-modal
        @onClose="closeSmartContractModal"
        :modal-type="messageModalType"
        :title="'Your Smart Contract Wallet is ready'"
        :detail-text="'Click on your Account on the top right to access your Smart Contract Wallet'"
      >
        <template v-slot:link>
          <div class="mb-10">
            <v-btn text large class="account-link" @click="markAsRead(smartContractAccount)">
              <v-icon left v-text="'$vuetify.icons.person_circle'" />
              <span>Your Account</span>
            </v-btn>
          </div>
        </template>
      </message-modal>
    </v-dialog>
  </div>
</template>

<script>
import Navbar from '../../components/helpers/Navbar'
import MessageModal from '../../components/WalletTransfer/MessageModal'
import { MESSAGE_MODAL_TYPE_SUCCESS } from '../../utils/enums'

export default {
  data() {
    return {
      messageModalType: MESSAGE_MODAL_TYPE_SUCCESS
    }
  },
  components: {
    Navbar,
    MessageModal
  },
  computed: {
    smartContractAccount() {
      let { wallet: storeWallet } = this.$store.state || {}
      const wallet = Object.keys(storeWallet).reduce((accts, x) => {
        if (storeWallet[x].type === 'SC' && storeWallet[x].network === this.$store.state.networkType.host)
          accts.push({ address: x, ...storeWallet[x] })
        return accts
      }, [])
      return wallet[0]
    }
  },
  methods: {
    markAsRead(smartContractAccount) {
      this.$store.dispatch('updateWalletNotified', smartContractAccount)
    },
    closeSmartContractModal() {
      // this.$store.dispatch('updateWalletNotified', this.selectedTheme.name)
      console.log('closeSmartContractModal', smartContractAccount)
    }
  }
}
</script>

<style lang="scss">
@import 'Wallet.scss';
</style>
