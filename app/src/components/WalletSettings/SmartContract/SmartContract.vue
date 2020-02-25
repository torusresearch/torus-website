<template>
  <div :class="$vuetify.breakpoint.xsOnly ? '' : 'py-4 px-12'">
    <template v-if="smartContractStatus === 'pending'">
      <div class="body-2 text_1--text mb-2 px-1">Your smart contract wallet is still being created</div>
      <v-layout wrap>
        <v-flex xs12 md6 px-1 mb-1>
          <v-layout align-center wrap>
            <v-flex xs1>
              <span class="body-2 text_1--text">Status</span>
            </v-flex>
            <v-flex xs6 px-2>
              <v-progress-linear background-color="#EEF2F4" color="#C4C4C4" class="mt-1" height="6" value="15"></v-progress-linear>
            </v-flex>
            <v-flex xs1>
              <span class="status-text text_2--text">Pending</span>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </template>
    <template v-else-if="smartContractAccount">
      <div class="body-2 text_1--text mb-2">Your Smart Contract Wallet</div>
      <v-layout wrap>
        <v-flex xs12 md6 class="body-2 text_2--text">
          <span class="account-list__address">{{ smartContractAccount.address }}</span>
          <span class="float-right" style="margin-top: -3px">
            <show-tool-tip :address="smartContractAccount.address">
              <v-icon size="14" :class="{ 'text_2--text': !$vuetify.theme.dark }" v-text="'$vuetify.icons.copy'" />
            </show-tool-tip>
            <export-qr-code :customAddress="smartContractAccount.address">
              <v-icon size="14" v-text="'$vuetify.icons.qr'" />
            </export-qr-code>
          </span>
        </v-flex>
      </v-layout>
    </template>
    <template v-else>
      <div class="body-2 text_1--text mb-8 px-1">Create a Smart Contract Wallet to transact withouth fee</div>
      <v-layout wrap>
        <v-flex xs12 md6 class="text-right">
          <v-btn id="create-contract-btn" color="primary" depressed class="py-1" @click="createWallet()">
            Create Smart Contract Wallet
          </v-btn>
        </v-flex>
      </v-layout>
    </template>
    <v-dialog v-model="messageModalShow" max-width="375" persistent>
      <message-modal
        @onClose="messageModalShow = false"
        :modal-type="messageModalType"
        :title="messageModalTitle"
        :detail-text="messageModalDetails"
      />
    </v-dialog>
  </div>
</template>

<script>
import MessageModal from '../../../components/WalletTransfer/MessageModal'
import ShowToolTip from '../../helpers/ShowToolTip'
import ExportQrCode from '../../helpers/ExportQrCode'
import config from '../../../config'
import { post } from '../../../utils/httpHelpers'
import { MESSAGE_MODAL_TYPE_SUCCESS, MESSAGE_MODAL_TYPE_FAIL, MESSAGE_MODAL_TYPE_PENDING } from '../../../utils/enums'
const randomId = require('@chaitanyapotti/random-id')

export default {
  name: 'smartContractSettings',
  components: { MessageModal, ShowToolTip, ExportQrCode },
  data() {
    return {
      smartContractStatus: '',
      ensName: '',
      messageModalShow: false,
      messageModalType: '',
      messageModalTitle: '',
      messageModalDetails: ''
    }
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
    async createWallet() {
      const reqObj = {
        ens: randomId(),
        owner: this.$store.state.selectedEOA
      }

      post(`${config.relayer}/createWallet`, reqObj)
      this.messageModalShow = true
      this.messageModalType = MESSAGE_MODAL_TYPE_PENDING
      this.messageModalTitle = 'Your request has been submitted'
      this.messageModalDetails = 'It will take sometime to create your Smart Contract Wallet. You will be notified when it is ready'
      this.smartContractStatus = 'pending'
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'SmartContract.scss';
</style>
