<template>
  <div class="setup-wallet-container" :class="[$vuetify.breakpoint.xsOnly ? 'pa-6' : 'pa-10', { 'is-dark': $vuetify.theme.dark }]">
    <div class="text-center mb-6">
      <div class="headline mb-2" :class="$vuetify.theme.dark ? 'torusFont1--text' : 'text_1--text'">{{ t('tkeyCreateSetup.walletAuth') }}</div>
      <div class="body-2" :class="$vuetify.theme.dark ? 'torusFont1--text' : 'text_2--text'">
        {{ t('tkeyCreateSetup.youWouldRequire1') }}
        <span class="font-weight-bold">{{ t('tkeyCreateSetup.youWouldRequire2') }}</span>
        {{ t('tkeyCreateSetup.youWouldRequire3') }}
      </div>
    </div>
    <div class="mb-8">
      <div class="d-flex align-center mb-2">
        <div class="caption" :class="$vuetify.theme.dark ? 'torusFont1--text' : 'text_2--text'">{{ t('tkeyCreateSetup.authFactors') }} (2/3)</div>
        <div class="ml-auto caption" :style="{ color: '#FBBC05' }">Average</div>
      </div>
      <v-progress-linear class="mb-2" color="warning" rounded value="15" background-color="torusGray3"></v-progress-linear>
      <div class="caption" :class="$vuetify.theme.dark ? 'torusFont1--text' : 'text_2--text'">
        {{ t('tkeyCreateSetup.youNeedToBackup') }}
      </div>
    </div>
    <div>
      <v-expansion-panels multiple :class="$vuetify.breakpoint.xsOnly ? 'is-mobile' : ''">
        <v-expansion-panel class="mb-2" disabled>
          <v-expansion-panel-header class="py-2">
            <v-icon small class="d-inline-flex mr-2 success--text shrink" v-text="'$vuetify.icons.check_circle_filled'" />
            <div class="grow font-weight-bold body-2" :class="$vuetify.theme.dark ? 'torusFont1--text' : 'text_2--text'">Google Login</div>
            <div class="ml-auto text-right caption" :class="$vuetify.theme.dark ? 'torusFont1--text' : 'text_2--text'">
              <v-icon small class="mr-2">$vuetify.icons.google</v-icon>
              youremailhere@gmail.com
            </div>
          </v-expansion-panel-header>
        </v-expansion-panel>
        <v-expansion-panel class="mb-2">
          <v-expansion-panel-header class="py-2">
            <v-icon small class="d-inline-flex mr-2 success--text shrink" v-text="'$vuetify.icons.check_circle_filled'" />
            <div class="grow font-weight-bold body-2" :class="$vuetify.theme.dark ? 'torusFont1--text' : 'text_2--text'">Browser</div>
            <div class="ml-auto text-right caption" :class="$vuetify.theme.dark ? 'torusFont1--text' : 'text_2--text'">
              <v-icon small class="mr-2">$vuetify.icons.device_detailed</v-icon>
              Chrome V82.04103.61
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content class="pa-5">
            <div class="body-2 mb-4" :class="$vuetify.theme.dark ? 'torusFont1--text' : 'text_2--text'">
              {{ t('tkeyCreateSetup.authViaBrowser1') }} {{ t('tkeyCreateSetup.authViaBrowser2') }}
              <span class="font-weight-bold">{{ t('tkeyCreateSetup.authViaBrowser3') }}</span>
              .
            </div>
            <div class="text-right">
              <v-badge :bordered="!$vuetify.theme.dark" color="warning" content="!" overlap>
                <v-btn large outlined :color="$vuetify.theme.dark ? 'white' : 'torusBrand1'">{{ t('tkeyCreateSetup.backupOnDevice') }}</v-btn>
              </v-badge>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel class="mb-2">
          <v-expansion-panel-header class="py-2">
            <v-icon
              small
              class="d-inline-flex mr-2 shrink"
              :class="$vuetify.theme.dark ? 'torusGray3--text' : 'text_2--text'"
              v-text="'$vuetify.icons.check_circle_filled'"
            />
            <div class="grow font-weight-bold body-2" :class="$vuetify.theme.dark ? 'torusFont1--text' : 'text_2--text'">
              {{ t('tkeyCreateSetup.recoveryPass') }}
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content class="pa-5">
            <v-form v-model="validPasswordForm">
              <v-text-field
                v-model="recoveryPassword"
                :append-icon="showRecoveryPassword ? '$vuetify.icons.visibility_off' : '$vuetify.icons.visibility_on'"
                :type="showRecoveryPassword ? 'text' : 'password'"
                :rules="[rules.required]"
                outlined
                :placeholder="t('tkeyCreateSetup.minAlphaNumeric')"
                @click:append="showRecoveryPassword = !showRecoveryPassword"
              />
              <div class="text-right">
                <v-btn :disabled="!validPasswordForm" color="torusBrand1" class="torusFont1--text">{{ t('tkeyNew.confirm') }}</v-btn>
              </div>
            </v-form>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
    <v-layout class="mx-n2 mt-9 mb-12">
      <v-flex class="xs6 px-2">
        <v-btn
          block
          :x-large="!$vuetify.breakpoint.xsOnly"
          :class="$vuetify.breakpoint.xsOnly ? 'caption' : ''"
          outlined
          :color="$vuetify.theme.dark ? 'white' : 'torusBrand1'"
        >
          {{ t('tkeyCreateSetup.cancel') }}
        </v-btn>
      </v-flex>
      <v-flex class="xs6 px-2">
        <v-btn
          block
          :x-large="!$vuetify.breakpoint.xsOnly"
          :class="$vuetify.breakpoint.xsOnly ? 'caption' : ''"
          color="torusBrand1"
          class="white--text"
          @click="next"
        >
          {{ t('tkeyCreateSetup.createWallet') }}
        </v-btn>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
export default {
  data() {
    return {
      validPasswordForm: true,
      recoveryPassword: '',
      showRecoveryPassword: false,
      rules: {
        required: (value) => !!value || this.t('tkeyNew.required'),
      },
    }
  },
  methods: {
    next() {
      this.$emit('next')
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'SetupWallet.scss';
</style>
