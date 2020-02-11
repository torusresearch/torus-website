<template>
  <v-container pa-0 class="smart-contract-confirm-container">
    <v-layout wrap>
      <v-flex class="card-shadow text-center" py-10 mb-4 xs12>
        <img :src="require(`../../../public/images/torus-logo-blue.svg`)" width="115" />
        <div :class="$vuetify.theme.dark ? 'text_3--text' : 'text_2--text'" class="headline font-weight-bold">
          Confirm Transaction
        </div>
      </v-flex>
      <v-flex mx-6 mb-4 xs12>
        <v-layout align="top" no-gutters>
          <v-flex xs3 style="position: relative">
            <div class="logo-container d-flex align-center justify-center float-right">
              <!-- Update with proper logo -->
              <img class="logo-padded" :src="require(`../../../public/img/icons/google-dark.svg`)" />
            </div>
            <br />
            <br />
            <div
              :class="$vuetify.theme.dark ? 'text_3--text' : 'text_2--text'"
              class="float-right caption text-center logo-label"
              title="carlos@tor.us"
            >
              carlos.lastres@tor.us
            </div>
          </v-flex>
          <v-flex xs6>
            <div :class="$vuetify.theme.dark ? 'text_3--text' : 'text_2--text'" class="pt-2 network-container">
              <v-icon size="12" v-text="'$vuetify.icons.network'"></v-icon>
              <span class="">{{ selectedNetwork }}</span>
            </div>
          </v-flex>
          <v-flex xs3>
            <!-- Update with proper target -->
            <div class="logo-container d-flex align-center justify-center float-left">
              <v-icon size="20">$vuetify.icons.smart_contract</v-icon>
            </div>
            <br />
            <br />
            <div
              :class="$vuetify.theme.dark ? 'text_3--text' : 'text_2--text'"
              class="float-left caption text-center logo-label logo-label--right"
              title="23898023"
            >
              23898023
            </div>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex mx-6 mb-4 xs12>
        <v-layout wrap>
          <v-flex xs4 mb-4>
            <div :class="'text_2--text'" class="caption mt-4">You Pay</div>
          </v-flex>
          <v-flex xs8 mb-4>
            <v-text-field
              value="0.1938 ETH"
              id="total-cost"
              :hint="`~23.54 USD`"
              persistent-hint
              type="number"
              outlined
              required
              aria-label="Total Cost"
            />
          </v-flex>
          <v-flex xs12 mb-4>
            <transaction-fee-select></transaction-fee-select>
          </v-flex>

          <v-flex xs4 mb-4>
            <div :class="'text_2--text'" class="caption mt-4">Total Cost</div>
          </v-flex>
          <v-flex xs8 mb-4>
            <v-text-field id="total-cost" :hint="`~23.54 USD`" persistent-hint type="number" outlined required aria-label="Total Cost">
              <template v-slot:append>
                <v-btn small>
                  ETH
                </v-btn>
                <v-btn small>
                  USD
                </v-btn>
              </template>
            </v-text-field>
          </v-flex>

          <v-flex mb-4 xs12>
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
import AddFunds from '../../components/helpers/AddFunds'

export default {
  components: { TransactionFeeSelect, AddFunds },
  data() {
    return {
      addMoreFundsDialoag: false
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
