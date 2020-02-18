<template>
  <v-dialog v-model="addMoreFundsDialoag" fullscreen width="400">
    <template v-slot:activator="{ on }">
      <v-btn block depressed class="add-funds-btn" outlined v-on="on">
        Add more funds
      </v-btn>
    </template>
    <v-card class="torus-v8">
      <v-layout wrap style="height: 100%">
        <v-flex class="card-shadow text-center" py-10 xs12>
          <img :src="require(`../../../../public/images/torus-logo-blue.svg`)" width="115" />
          <div :class="$vuetify.theme.dark ? 'text_3--text' : 'text_2--text'" class="title font-weight-bold">
            Confirm Transaction
          </div>
        </v-flex>
        <v-flex mx-6 mb-4 xs12 class="preferred-method-container">
          <div class="text_2--text title font-weight-bold text-center mb-6">
            Select your preferred method
          </div>
          <v-btn block depressed class="preferred-method-btn mb-6" outlined>
            Top up from providers
          </v-btn>
          <v-dialog v-model="fundsFromWalletDialog" fullscreen width="400">
            <template v-slot:activator="{ on }">
              <v-btn block depressed class="preferred-method-btn" outlined v-on="on">
                Use my other wallet
              </v-btn>
            </template>
            <v-card class="torus-v8">
              <v-layout wrap style="height: 100%">
                <v-flex class="card-shadow text-center" py-10 mb-4 xs12>
                  <img :src="require(`../../../../public/images/torus-logo-blue.svg`)" width="115" />
                  <div :class="$vuetify.theme.dark ? 'text_3--text' : 'text_2--text'" class="title font-weight-bold">
                    Confirm Transaction
                  </div>
                </v-flex>
                <v-flex mx-6 mb-4 xs12>
                  <div class="text_2--text title font-weight-bold text-center mb-6">
                    Please select your wallet
                  </div>
                  <v-card class="card-shadow wallet-item mb-4">
                    <v-layout pa-4>
                      <v-flex xs8>
                        <div class="caption">carlos.lastres.sancho@gmail.com</div>
                        <div class="wallet-item__details">0xCC00De14EaF13008EBdC12C18a4679E837ab8E50</div>
                      </v-flex>
                      <v-flex xs4 class="text-right">
                        <div class="caption">1,000.23 USD</div>
                        <div class="wallet-item__details">4.75ETH</div>
                      </v-flex>
                    </v-layout>
                  </v-card>
                  <v-card class="card-shadow wallet-item mb-4">
                    <v-layout pa-4>
                      <v-flex xs8>
                        <div class="caption">carlos.lastres.sancho@gmail.com</div>
                        <div class="wallet-item__details">0xCC00De14EaF13008EBdC12C18a4679E837ab8E50</div>
                      </v-flex>
                      <v-flex xs4 class="text-right">
                        <div class="caption">1,000.23 USD</div>
                        <div class="wallet-item__details">4.75ETH</div>
                      </v-flex>
                    </v-layout>
                  </v-card>
                  <v-card class="card-shadow wallet-item mb-4">
                    <v-layout pa-4>
                      <v-flex xs8>
                        <div class="caption">carlos.lastres.sancho@gmail.com</div>
                        <div class="wallet-item__details">0xCC00De14EaF13008EBdC12C18a4679E837ab8E50</div>
                      </v-flex>
                      <v-flex xs4 class="text-right">
                        <div class="caption">1,000.23 USD</div>
                        <div class="wallet-item__details">4.75ETH</div>
                      </v-flex>
                    </v-layout>
                  </v-card>
                </v-flex>
                <v-flex class="return">
                  <div class="text-center">
                    <v-btn class="return__btn" text @click="fundsFromWalletDialog = false">Return</v-btn>
                  </div>
                </v-flex>
              </v-layout>
            </v-card>
          </v-dialog>
        </v-flex>
        <v-flex class="return">
          <div class="text-center">
            <v-btn class="return__btn" text @click="addMoreFundsDialoag = false">Return</v-btn>
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
