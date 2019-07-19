<template>
  <v-card class="advance-option">
    <v-card-text class="torus_text--text">
      <v-container>
        <v-layout mt-3 row wrap class="wallet-dapp-permission">
          <v-flex xs12 px-3 class="title-container mb-3">
            <div class="title">
              <div class="d-inline text-black font-weight-bold headline">Dapp Permision</div>
              <p class="text">
                <small>
                  As a form of security, all transactions require your signature for validation. You may add and allow certain Dapps to transact under
                  certain circumstances.
                </small>
              </p>
            </div>

            <v-btn color="primary">
              <img width="20" height="20" :src="require('../../public/img/icons/add.svg')" class="mr-1" />
              Add a new List
            </v-btn>
          </v-flex>

          <v-flex xs12 px-3>
            <v-card>
              <v-container fluid>
                <v-layout>
                  <v-flex xs2>
                    <img width="34" height="34" :src="require('../../public/img/icons/tag.svg')" />
                  </v-flex>
                  <v-flex xs9>
                    <!-- <v-container fluid> -->
                    <v-layout row wrap>
                      <v-flex xs8>
                        <v-text-field
                          class="custom-text-input"
                          placeholder="Enter New Dapp Website Here E.g. www.etheremon.com"
                          solo
                          v-model="dappWebsite"
                        ></v-text-field>
                      </v-flex>
                    </v-layout>
                    <!-- </v-container> -->
                  </v-flex>

                  <v-flex xs2 class="text-xs-right">
                    <small class="section-note text-gray">Now</small>
                  </v-flex>
                </v-layout>

                <hr class="mt-2 mb-4" />

                <v-layout>
                  <v-flex xs2>
                    <small class="font-weight-bold text-gray">Type:</small>
                  </v-flex>
                  <v-flex xs9>
                    <!-- <v-container fluid> -->
                    <v-layout row wrap>
                      <v-flex xs4>
                        <div class="mb-4">
                          <div>
                            <input type="checkbox" v-model="type.deployment" name="ontractDeployment" id="test-simplex" />
                            <label for="contractDeployment" class="ml-2">
                              <small>Contract Deployment</small>
                            </label>
                          </div>
                        </div>
                        <div class="mb-4">
                          <div>
                            <input type="checkbox" v-model="type.interaction" name="ontractDeployment" id="test-simplex" />
                            <label for="contractDeployment" class="ml-2">
                              <small>Contract Interaction</small>
                            </label>
                          </div>
                        </div>
                      </v-flex>

                      <v-flex xs4>
                        <div class="mb-4">
                          <div>
                            <input type="checkbox" v-model="type.ercTransaction" name="ontractDeployment" id="test-simplex" />
                            <label for="contractDeployment" class="ml-2">
                              <small>ERC 20 Transactions</small>
                            </label>
                          </div>
                        </div>
                        <div class="mb-4">
                          <div>
                            <input type="checkbox" v-model="type.changeNetwork" name="ontractDeployment" id="test-simplex" />
                            <label for="contractDeployment" class="ml-2">
                              <small>Change of Network</small>
                            </label>
                          </div>
                        </div>
                      </v-flex>

                      <v-flex xs4>
                        <div class="mb-4">
                          <div>
                            <input type="checkbox" v-model="type.sendEth" name="ontractDeployment" id="test-simplex" />
                            <label for="contractDeployment" class="ml-2">
                              <small>Send ETH</small>
                            </label>
                          </div>
                        </div>
                      </v-flex>
                    </v-layout>
                    <!-- </v-container> -->
                  </v-flex>

                  <v-flex xs2 class="text-xs-right">
                    <small class="section-note">Please choose the type(s)</small>
                  </v-flex>
                </v-layout>

                <hr class="mt-2 mb-4" />

                <v-layout>
                  <v-flex xs2>
                    <small class="font-weight-bold text-gray">Amount:</small>
                  </v-flex>
                  <v-flex xs9>
                    <!-- <v-container fluid> -->
                    <v-layout row wrap>
                      <v-flex xs4>
                        <div class="mb-0">
                          <div>
                            <input type="checkbox" v-model="amount.maxTenUsd" name="ontractDeployment" id="test-simplex" />
                            <label for="contractDeployment" class="ml-2">
                              <small>Max 10.00 USD</small>
                            </label>
                          </div>
                        </div>
                        <div class="mb-4">
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
                        <div class="mb-4">
                          <div>
                            <input type="checkbox" v-model="amount.maxHundredThousandUsd" name="ontractDeployment" id="test-simplex" />
                            <label for="contractDeployment" class="ml-2">
                              <small>Max 100.00 USD</small>
                            </label>
                          </div>
                        </div>
                      </v-flex>
                    </v-layout>
                    <!-- </v-container> -->
                  </v-flex>

                  <v-flex xs2 class="text-xs-right">
                    <small class="font-weight-bold">10.00 USD</small>
                  </v-flex>
                </v-layout>

                <hr class="mt-2 mb-4" />

                <v-layout>
                  <v-flex xs2>
                    <small class="font-weight-bold section-note text-gray">Period of Validity:</small>
                  </v-flex>
                  <v-flex xs9>
                    <!-- <v-container fluid> -->
                    <v-layout row wrap>
                      <v-flex xs4>
                        <div class="mb-4">
                          <div>
                            <input type="checkbox" v-model="validity.oneHour" name="ontractDeployment" id="test-simplex" />
                            <label for="contractDeployment" class="ml-2">
                              <small>Within 1 Hour</small>
                            </label>
                          </div>
                        </div>
                        <div class="mb-4">
                          <div class="other-input">
                            <input type="checkbox" v-model="validity.oneMonth" value name="ontractDeployment" id="test-simplex" />
                            <label for="contractDeployment" class="mx-2">
                              <small>Within 1 Month</small>
                            </label>
                          </div>
                        </div>
                      </v-flex>

                      <v-flex xs4>
                        <div class="mb-4">
                          <div>
                            <input type="checkbox" v-model="validity.oneWeek" name="ontractDeployment" id="test-simplex" />
                            <label for="contractDeployment" class="ml-2">
                              <small>Within 1 Week</small>
                            </label>
                          </div>
                        </div>
                        <div class="mb-4">
                          <div class="other-input">
                            <input type="checkbox" v-model="validity.oneYear" value name="ontractDeployment" id="test-simplex" />
                            <label for="contractDeployment" class="mx-2">
                              <small>Within 1 Year</small>
                            </label>
                          </div>
                        </div>
                      </v-flex>
                    </v-layout>
                    <!-- </v-container> -->
                  </v-flex>

                  <v-flex xs2 class="text-xs-right">
                    <small class="section-note">Please select a period</small>
                  </v-flex>
                </v-layout>

                <hr class="mt-2 mb-4" />

                <v-flex class="save-container">
                  <v-btn color="white" class="px-5 py-1 mt-3 mr-3 btn-cancel text-gray">Cancel</v-btn>
                  <v-btn color="primary" class="px-5 py-1 mt-3">Save</v-btn>
                </v-flex>
              </v-container>
            </v-card>
          </v-flex>
        </v-layout>
        <v-layout mt-3 pr-3 row>
          <v-spacer></v-spacer>
          <v-btn large text @click="onClose">Close</v-btn>
        </v-layout>
      </v-container>
    </v-card-text>
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
    onClose() {
      this.$emit('onClose')
    }
  }
}
</script>

<style lang="scss">
.wallet-dapp-permission {
  .btn-cancel {
    box-shadow: none;
  }
  .title-container {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .title {
      max-width: 70%;
    }
  }
  .text {
    font-size: 1rem;
    line-height: 20px;
    font-weight: normal;
  }
  .chevron-icon {
    transition: ease 0.2s;
  }

  .icon-button {
    background-color: transparent;
    box-shadow: none !important;
    height: auto !important;
  }

  .custom-text-input {
    font-size: 0.7rem;
    .v-input__slot {
      background: transparent !important;
      box-shadow: none !important;
      border: 1px solid #d3d5e2 !important;
    }
  }

  .other-input {
    display: flex;
    align-items: center;

    .max-transaction-input {
      font-size: 0.7rem;
      label {
        font-size: 0.7rem;
      }
    }
  }

  .section-note {
    font-size: 0.7rem;
  }

  .text-gray {
    color: #5c6c7f;
  }

  .save-container {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}
</style>
