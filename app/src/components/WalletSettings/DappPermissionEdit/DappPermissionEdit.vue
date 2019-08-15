<template>
  <v-card class="mb-4">
    <v-container fluid>
      <v-layout>
        <v-flex xs2>
          <img width="34" height="34" :src="require('../../../../public/img/icons/tag.svg')" />
        </v-flex>
        <v-flex xs9>
          <v-layout wrap>
            <v-flex xs8>
              <v-text-field
                class="custom-text-input"
                placeholder="Enter New Dapp Website Here E.g. www.etheremon.com"
                solo
                v-model="dappWebsite"
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-flex>

        <v-flex xs2 class="text-right">
          <small class="section-note text-gray">Now</small>
        </v-flex>
      </v-layout>

      <hr class="mt-2 mb-6" />

      <v-layout>
        <v-flex xs2>
          <small class="font-weight-bold text-gray">Type:</small>
        </v-flex>
        <v-flex xs9>
          <v-layout wrap>
            <v-flex xs4>
              <div class="mb-6">
                <div>
                  <input type="checkbox" v-model="type.deployment" name="ontractDeployment" id="test-simplex" />
                  <label for="contractDeployment" class="ml-2">
                    <small>Contract Deployment</small>
                  </label>
                </div>
              </div>
              <div class="mb-6">
                <div>
                  <input type="checkbox" v-model="type.interaction" name="ontractDeployment" id="test-simplex" />
                  <label for="contractDeployment" class="ml-2">
                    <small>Contract Interaction</small>
                  </label>
                </div>
              </div>
            </v-flex>

            <v-flex xs4>
              <div class="mb-6">
                <div>
                  <input type="checkbox" v-model="type.ercTransaction" name="ontractDeployment" id="test-simplex" />
                  <label for="contractDeployment" class="ml-2">
                    <small>ERC 20 Transactions</small>
                  </label>
                </div>
              </div>
              <div class="mb-6">
                <div>
                  <input type="checkbox" v-model="type.changeNetwork" name="ontractDeployment" id="test-simplex" />
                  <label for="contractDeployment" class="ml-2">
                    <small>Change of Network</small>
                  </label>
                </div>
              </div>
            </v-flex>

            <v-flex xs4>
              <div class="mb-6">
                <div>
                  <input type="checkbox" v-model="type.sendEth" name="ontractDeployment" id="test-simplex" />
                  <label for="contractDeployment" class="ml-2">
                    <small>Send ETH</small>
                  </label>
                </div>
              </div>
            </v-flex>
          </v-layout>
        </v-flex>

        <v-flex xs2 class="text-right">
          <small class="section-note">Please choose the type(s)</small>
        </v-flex>
      </v-layout>

      <hr class="mt-2 mb-6" />

      <v-layout>
        <v-flex xs2>
          <small class="font-weight-bold text-gray">Amount:</small>
        </v-flex>
        <v-flex xs9>
          <v-layout wrap>
            <v-flex xs4>
              <div class="mb-0">
                <div>
                  <input type="checkbox" v-model="amount.maxTenUsd" name="ontractDeployment" id="test-simplex" />
                  <label for="contractDeployment" class="ml-2">
                    <small>Max 10.00 USD</small>
                  </label>
                </div>
              </div>
              <div class="mb-6">
                <div class="other-input">
                  <input type="checkbox" v-model="amount.other" name="contractDeployment" id="test-simplex" />
                  <label for="contractDeployment" class="mx-2">
                    <small>Others:</small>
                  </label>

                  <v-text-field
                    :disabled="!amount.other"
                    single-line
                    text
                    type="text"
                    name="max-transaction"
                    label="Enter Max Transaction Limit"
                    class="max-transaction-input"
                    v-model="amount.customMaxTransaction"
                  ></v-text-field>
                </div>
              </div>
            </v-flex>

            <v-flex xs4>
              <div class="mb-6">
                <div>
                  <input type="checkbox" v-model="amount.maxHundredThousandUsd" name="ontractDeployment" id="test-simplex" />
                  <label for="contractDeployment" class="ml-2">
                    <small>Max 100.00 USD</small>
                  </label>
                </div>
              </div>
            </v-flex>
          </v-layout>
        </v-flex>

        <v-flex xs2 class="text-right">
          <small class="font-weight-bold">10.00 USD</small>
        </v-flex>
      </v-layout>

      <hr class="mt-2 mb-6" />

      <v-layout>
        <v-flex xs2>
          <small class="font-weight-bold section-note text-gray">Period of Validity:</small>
        </v-flex>
        <v-flex xs9>
          <v-layout wrap>
            <v-flex xs4>
              <div class="mb-6">
                <div>
                  <input type="checkbox" v-model="validity.oneHour" name="ontractDeployment" id="test-simplex" />
                  <label for="contractDeployment" class="ml-2">
                    <small>Within 1 Hour</small>
                  </label>
                </div>
              </div>
              <div class="mb-6">
                <div class="other-input">
                  <input type="checkbox" v-model="validity.oneMonth" value name="ontractDeployment" id="test-simplex" />
                  <label for="contractDeployment" class="mx-2">
                    <small>Within 1 Month</small>
                  </label>
                </div>
              </div>
            </v-flex>

            <v-flex xs4>
              <div class="mb-6">
                <div>
                  <input type="checkbox" v-model="validity.oneWeek" name="ontractDeployment" id="test-simplex" />
                  <label for="contractDeployment" class="ml-2">
                    <small>Within 1 Week</small>
                  </label>
                </div>
              </div>
              <div class="mb-6">
                <div class="other-input">
                  <input type="checkbox" v-model="validity.oneYear" value name="ontractDeployment" id="test-simplex" />
                  <label for="contractDeployment" class="mx-2">
                    <small>Within 1 Year</small>
                  </label>
                </div>
              </div>
            </v-flex>
          </v-layout>
        </v-flex>

        <v-flex xs2 class="text-right">
          <small class="section-note">Please select a period</small>
        </v-flex>
      </v-layout>

      <hr class="mt-2 mb-6" />

      <v-flex class="save-container">
        <v-btn color="white" class="px-12 py-1 mt-4 mr-4 btn-cancel text-gray" @click="onCancel">Cancel</v-btn>
        <v-btn color="primary" class="px-12 py-1 mt-4">Save</v-btn>
      </v-flex>
    </v-container>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      checkbox: false,
      customMaxTransaction: '',
      dappWebsite: '',
      type: {
        deployment: false,
        interaction: false,
        ercTransactions: false,
        changeNetwork: false,
        sendEth: false
      },
      amount: {
        maxTenUsd: false,
        maxHundredThousandUsd: false,
        other: false,
        customMaxValue: ''
      },
      validity: {
        oneHour: false,
        oneWeek: false,
        oneMonth: false,
        oneYear: false
      }
    }
  },
  methods: {
    onCancel() {
      this.$emit('onCancel')
    }
  }
}
</script>
