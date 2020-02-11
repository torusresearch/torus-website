<template>
  <v-dialog v-model="addMoreFundsDialoag" fullscreen width="400">
    <template v-slot:activator="{ on }">
      <v-btn block depressed outlined color="primary" small v-on="on">
        Add more funds
      </v-btn>
    </template>
    <v-card>
      <div class="text-right"><v-btn small text @click="addMoreFundsDialoag = false">x</v-btn></div>
      <v-layout>
        <v-flex py-12 xs12 class="text-center">
          <div class="title mb-10">Select you preferred method</div>
          <div class="mb-2">
            <v-btn depressed outlined color="primary">Top up from providers</v-btn>
          </div>
          <div class="mb-2 body-2">or</div>
          <div>
            <v-dialog v-model="fundsFromWalletDialog" fullscreen width="400">
              <template v-slot:activator="{ on }">
                <v-btn depressed outlined color="primary" v-on="on">Use my other wallet</v-btn>
              </template>
              <v-card>
                <div class="text-right"><v-btn small text @click="fundsFromWalletDialog = false">x</v-btn></div>
                <v-layout>
                  <v-flex py-12 xs12 px-5 class="text-center">
                    <div class="title mb-10">Please select your wallet</div>
                    <v-card>
                      <v-layout pa-4>
                        <v-flex xs6>
                          <div>carlos.lastres.sancho@gmail.com</div>
                          <div>0x069a0fa242707754078c6d649acc3c8e6bff76c3aecd169bf23818cd5b558d33</div>
                        </v-flex>
                        <v-flex xs6>
                          <div>1,000.23 USD</div>
                          <div>4.75 ETH</div>
                        </v-flex>
                      </v-layout>
                    </v-card>
                  </v-flex>
                </v-layout>
              </v-card>
            </v-dialog>
          </div>
        </v-flex>
      </v-layout>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      addMoreFundsDialoag: false,
      fundsFromWalletDialog: false
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'AddFunds.scss';
</style>
