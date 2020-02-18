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
    <template v-else>
      <v-layout wrap>
        <v-flex xs12 md6>
          <v-btn id="create-contract-btn" color="primary" depressed class="py-1" @click="createWallet()">
            Create Smart Contract Wallet
          </v-btn>
        </v-flex>
      </v-layout>
    </template>
  </div>
</template>

<script>
export default {
  name: 'smartContractSettings',
  data() {
    return {
      smartContractStatus: 'pending',
      ensName: ''
    }
  },
  methods: {
    async createWallet() {
      const reqObj = {
        ens: this.ensName,
        owner: this.$store.state.selectedEOA
      }
      try {
        const response = await post(`${config.relayer}/createWallet`, reqObj)
        console.log(response)
      } catch (e) {
        console.error(e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'SmartContract.scss';
</style>
