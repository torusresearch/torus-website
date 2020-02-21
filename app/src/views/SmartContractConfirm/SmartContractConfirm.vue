<template>
  <v-container pa-0 class="smart-contract-confirm-container torus-v8" :class="{ 'theme--dark': $vuetify.theme.dark }">
    <v-layout wrap>
      <v-flex class="card-shadow text-center" py-6 mb-4 xs12>
        <img :src="require(`../../../public/images/torus-logo-${$vuetify.theme.dark ? 'white' : 'blue'}.svg`)" width="115" />
        <div :class="$vuetify.theme.dark ? 'text_3--text' : 'text_2--text'" class="title font-weight-bold">
          Confirm Transaction
        </div>
      </v-flex>
      <v-flex mx-6 mb-4 xs12>
        <v-layout align="top" no-gutters>
          <v-flex xs3 style="position: relative">
            <div :class="{ 'logo-container--dark': $vuetify.theme.dark }" class="logo-container d-flex align-center justify-center float-right">
              <!-- Update with proper logo -->
              <img class="logo-padded" :src="require(`../../../public/img/icons/google-dark.svg`)" />
            </div>
            <br />
            <br />
            <div :class="$vuetify.theme.dark ? 'text_3--text' : 'text_2--text'" class="float-right caption text-center logo-label" :title="from">
              {{ from }}
            </div>
          </v-flex>
          <v-flex xs6>
            <div :class="$vuetify.theme.dark ? 'text_3--text' : 'text_2--text'" class="pt-2 network-container">
              <v-icon size="10" v-text="'$vuetify.icons.network'" style="margin-top: -2px"></v-icon>
              <span class="">{{ selectedNetwork }}</span>
            </div>
          </v-flex>
          <v-flex xs3>
            <!-- Update with proper target -->
            <div :class="{ 'logo-container--dark': $vuetify.theme.dark }" class="logo-container d-flex align-center justify-center float-left">
              <v-icon size="20">$vuetify.icons.smart_contract</v-icon>
            </div>
            <br />
            <br />
            <div
              :class="$vuetify.theme.dark ? 'text_3--text' : 'text_2--text'"
              class="float-left caption text-center logo-label logo-label--right"
              :title="to"
            >
              {{ to }}
            </div>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex mx-6 mb-4 xs12>
        <v-divider class="mb-4"></v-divider>
        <v-layout wrap class="mb-4">
          <v-flex xs4 mb-4>
            <div :class="'text_1--text'" class="caption mt-2">You Pay</div>
          </v-flex>
          <v-flex xs8 mb-4>
            <v-text-field class="text_1--text caption you-pay" value="522.54 ETH" :hint="`~23.54 USD`" persistent-hint outlined readonly />
          </v-flex>
          <v-flex xs4>
            <div :class="'text_1--text'" class="caption mt-2">Transaction Fee</div>
          </v-flex>
          <v-flex xs8>
            <v-text-field class="text_1--text caption you-pay" hide-details value="FREE (paid by Torus)" outlined readonly />
          </v-flex>
        </v-layout>
        <v-divider class="mb-4"></v-divider>
        <v-layout wrap>
          <v-flex xs4 mb-4>
            <div :class="'text_1--text'" class="caption mt-2">Total Cost</div>
          </v-flex>
          <v-flex xs8 mb-4>
            <v-text-field class="text_1--text caption total-cost" value="522.54 ETH" :hint="`~23.54 USD`" persistent-hint outlined readonly />
          </v-flex>
          <v-flex mb-2 xs12>
            <add-funds></add-funds>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex mb-4 mx-6 xs12>
        <v-layout px-2>
          <v-flex xs6>
            <v-btn block text large :class="$vuetify.theme.dark ? 'text_3--text' : 'text_2--text'">
              Cancel
            </v-btn>
          </v-flex>
          <v-flex xs6>
            <v-btn block depressed large color="primary" class="ml-2">Confirm</v-btn>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { SUPPORTED_NETWORK_TYPES } from '../../utils/enums'
import TransactionFeeSelect from '../../components/helpers/TransactionFeeSelect'
import TransactionSpeedSelect from '../../components/helpers/TransactionSpeedSelect'
import AddFunds from '../../components/helpers/AddFunds'

export default {
  components: { AddFunds },
  data() {
    return {
      from: 'sampleemail@gmail.com',
      to: '12345678'
    }
  },
  computed: {
    selectedNetwork() {
      let finalNetwork = ''

      if (this.network) {
        return SUPPORTED_NETWORK_TYPES[this.network].networkName
      }

      finalNetwork =
        !this.$store.state.networkType.networkName || this.$store.state.networkType.networkName === ''
          ? this.$store.state.networkType.host
          : this.$store.state.networkType.networkName
      return finalNetwork
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'SmartContractConfirm.scss';
</style>
