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
              <v-text-field class="custom-text-input" :placeholder="t('walletSettings.enterNewDapp')" solo v-model="dappWebsite"></v-text-field>
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
          <small class="font-weight-bold text-gray">{{ t('walletSettings.type') }}:</small>
        </v-flex>
        <v-flex xs9>
          <v-layout wrap>
            <v-flex xs4>
              <div class="mb-6">
                <div>
                  <input type="checkbox" v-model="type.deployment" name="contractDeployment" id="test-simplex" />
                  <label for="contractDeployment" class="ml-2">
                    <small>{{ t('walletSettings.contractDeployment') }}</small>
                  </label>
                </div>
              </div>
              <div class="mb-6">
                <div>
                  <input type="checkbox" v-model="type.interaction" name="contractDeployment" id="test-simplex" />
                  <label for="contractDeployment" class="ml-2">
                    <small>{{ t('walletSettings.contractInteraction') }}</small>
                  </label>
                </div>
              </div>
            </v-flex>

            <v-flex xs4>
              <div class="mb-6">
                <div>
                  <input type="checkbox" v-model="type.ercTransaction" name="ontractDeployment" id="test-simplex" />
                  <label for="contractDeployment" class="ml-2">
                    <small>{{ t('walletSettings.erc20Transactions') }}</small>
                  </label>
                </div>
              </div>
              <div class="mb-6">
                <div>
                  <input type="checkbox" v-model="type.changeNetwork" name="ontractDeployment" id="test-simplex" />
                  <label for="contractDeployment" class="ml-2">
                    <small>{{ t('walletSettings.changeNetwork') }}</small>
                  </label>
                </div>
              </div>
            </v-flex>

            <v-flex xs4>
              <div class="mb-6">
                <div>
                  <input type="checkbox" v-model="type.sendEth" name="ontractDeployment" id="test-simplex" />
                  <label for="contractDeployment" class="ml-2">
                    <small>{{ t('walletSettings.sendEth') }}</small>
                  </label>
                </div>
              </div>
            </v-flex>
          </v-layout>
        </v-flex>

        <v-flex xs2 class="text-right">
          <small class="section-note">{{ t('walletSettings.chooseTypes') }}</small>
        </v-flex>
      </v-layout>

      <hr class="mt-2 mb-6" />

      <v-layout>
        <v-flex xs2>
          <small class="font-weight-bold text-gray">{{ t('walletSettings.amount') }}:</small>
        </v-flex>
        <v-flex xs9>
          <v-layout wrap>
            <v-flex xs4>
              <div class="mb-0">
                <div>
                  <input type="checkbox" v-model="amount.maxTenUsd" name="ontractDeployment" id="test-simplex" />
                  <label for="contractDeployment" class="ml-2">
                    <small>{{ t('walletSettings.max10') }}</small>
                  </label>
                </div>
              </div>
              <div class="mb-6">
                <div class="other-input">
                  <input type="checkbox" v-model="amount.other" name="contractDeployment" id="test-simplex" />
                  <label for="contractDeployment" class="mx-2">
                    <small>{{ t('walletSettings.others') }}:</small>
                  </label>

                  <v-text-field
                    :disabled="!amount.other"
                    single-line
                    text
                    type="text"
                    name="max-transaction"
                    :label="t('walletSettings.enterMaxTransaction')"
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
                    <small>{{ t('walletSettings.max100') }}</small>
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
          <small class="font-weight-bold section-note text-gray">{{ t('walletSettings.periodValidity') }}:</small>
        </v-flex>
        <v-flex xs9>
          <v-layout wrap>
            <v-flex xs4>
              <div class="mb-6">
                <div>
                  <input type="checkbox" v-model="validity.oneHour" name="ontractDeployment" id="test-simplex" />
                  <label for="contractDeployment" class="ml-2">
                    <small>{{ t('walletSettings.withinOneHour') }}</small>
                  </label>
                </div>
              </div>
              <div class="mb-6">
                <div class="other-input">
                  <input type="checkbox" v-model="validity.oneMonth" value name="ontractDeployment" id="test-simplex" />
                  <label for="contractDeployment" class="mx-2">
                    <small>{{ t('walletSettings.withinOneMonth') }}</small>
                  </label>
                </div>
              </div>
            </v-flex>

            <v-flex xs4>
              <div class="mb-6">
                <div>
                  <input type="checkbox" v-model="validity.oneWeek" name="ontractDeployment" id="test-simplex" />
                  <label for="contractDeployment" class="ml-2">
                    <small>{{ t('walletSettings.withinOneWeek') }}</small>
                  </label>
                </div>
              </div>
              <div class="mb-6">
                <div class="other-input">
                  <input type="checkbox" v-model="validity.oneYear" value name="ontractDeployment" id="test-simplex" />
                  <label for="contractDeployment" class="mx-2">
                    <small>{{ t('walletSettings.withinOneYear') }}</small>
                  </label>
                </div>
              </div>
            </v-flex>
          </v-layout>
        </v-flex>

        <v-flex xs2 class="text-right">
          <small class="section-note">{{ t('walletSettings.selectPeriod') }}</small>
        </v-flex>
      </v-layout>

      <hr class="mt-2 mb-6" />

      <v-flex class="save-container">
        <v-btn color="white" class="px-12 py-1 mt-4 mr-4 btn-cancel text-gray" @click="onCancel">{{ t('walletSettings.cancel') }}</v-btn>
        <v-btn color="primary" class="px-12 py-1 mt-4">{{ t('walletSettings.save') }}</v-btn>
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
