<template>
  <div :class="$vuetify.breakpoint.xsOnly ? '' : 'py-4 px-12'">
    <template v-if="smartContractAccount">
      <template v-if="smartContractAccount.address === 'PROCESSING'">
        <div class="body-2 text_1--text mb-2 px-1">Your smart contract wallet is still being created</div>
        <v-layout wrap>
          <v-flex xs12 md6 px-1 mb-1>
            <ComponentLoader />
          </v-flex>
        </v-layout>
      </template>
      <template v-else>
        <div class="body-2 text_1--text mb-2">Your Smart Contract Wallet</div>
        <v-layout wrap>
          <v-flex xs12 md6 class="body-2 text_2--text">
            <span class="account-list__address" :title="smartContractAccount.address">{{ slicedAddress(smartContractAccount.address) }}</span>
            <span class="float-right" style="margin-top: -3px">
              <ShowToolTip :address="smartContractAccount.address">
                <v-icon size="14" :class="{ 'text_2--text': !$vuetify.theme.dark }" v-text="'$vuetify.icons.copy'" />
              </ShowToolTip>
              <ExportQrCode :custom-address="smartContractAccount.address">
                <v-icon size="14" v-text="'$vuetify.icons.qr'" />
              </ExportQrCode>
            </span>
          </v-flex>
        </v-layout>
      </template>
    </template>
    <template v-else>
      <div class="body-2 text_1--text mb-8 px-1">Create a Smart Contract Wallet to transact without fee</div>
      <v-layout wrap>
        <v-flex xs12 md6 class="text-right">
          <v-btn id="create-contract-btn" color="primary" depressed class="py-1" @click="createWallet">
            Create Smart Contract Wallet
          </v-btn>
        </v-flex>
      </v-layout>
    </template>
    <v-dialog v-model="messageModalShow" max-width="375" persistent>
      <MessageModal
        :title="messageModalTitle"
        :detail-text="messageModalDetails"
        @:modal-type="messageModalType"
        @onClose="messageModalShow = false"
      ></MessageModal>
    </v-dialog>
  </div>
</template>

<script>
import log from 'loglevel'

import { MESSAGE_MODAL_TYPE_PENDING } from '../../../utils/enums'
// import { post } from '../../../utils/httpHelpers'
import ComponentLoader from '../../helpers/ComponentLoader'
import ExportQrCode from '../../helpers/ExportQrCode'
import ShowToolTip from '../../helpers/ShowToolTip'
import MessageModal from '../../WalletTransfer/MessageModal'

export default {
  name: 'SmartContractSettings',
  components: { MessageModal, ShowToolTip, ExportQrCode, ComponentLoader },
  data() {
    return {
      ensName: '',
      messageModalShow: false,
      messageModalType: '',
      messageModalTitle: '',
      messageModalDetails: ''
    }
  },
  computed: {
    smartContractAccount() {
      const { wallet: storeWallet } = this.$store.state || {}
      const wallet = Object.keys(storeWallet).reduce((accts, x) => {
        if (storeWallet[x].type === 'SC' && storeWallet[x].network === this.$store.state.networkType.host)
          accts.push({ address: x, ...storeWallet[x] })
        return accts
      }, [])
      return wallet[0]
    }
  },
  methods: {
    slicedAddress(address) {
      return this.$vuetify.breakpoint.lgAndUp
        ? address
        : this.t(
            this.$vuetify.breakpoint.xsOnly ? `${address.slice(0, 10)}...${address.slice(-5)}` : `${address.slice(0, 20)}...${address.slice(-10)}`
          )
    },
    createWallet() {
      this.$store
        .dispatch('createSmartContractWallet')
        .then(() => {
          this.messageModalShow = true
          this.messageModalType = MESSAGE_MODAL_TYPE_PENDING
          this.messageModalTitle = 'Your request has been submitted'
          this.messageModalDetails = 'It will take sometime to create your Smart Contract Wallet. You will be notified when it is ready'
          this.smartContractStatus = 'pending'
        })
        .catch(error => {
          log.error(error)
        })
      // post(`${config.relayer}/createWallet`, reqObj)
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'SmartContract.scss';
</style>
