<template>
  <div class="setup-wallet-container" :class="[$vuetify.breakpoint.xsOnly ? 'pa-6' : 'pa-10', { 'is-dark': $vuetify.theme.dark }]">
    <div class="text-center mb-6">
      <div class="headline mb-2" :class="$vuetify.theme.dark ? 'torusFont2--text' : 'text_1--text'">{{ t('tkeyCreateSetup.walletAuth') }}</div>
      <div class="body-2 text_2--text">
        {{ t('tkeyCreateSetup.youWouldRequire1') }}
        <span class="font-weight-bold">{{ t('tkeyCreateSetup.youWouldRequire2') }}</span>
        {{ t('tkeyCreateSetup.youWouldRequire3') }}
      </div>
    </div>
    <div class="mb-8">
      <div class="d-flex align-center mb-2">
        <div class="caption text_2--text">{{ t('tkeyCreateSetup.authFactors') }} ({{ ~~(progressValue / 100) }}/4)</div>
        <div class="ml-auto caption" :class="`${progressColor}--text`">{{ t(progressText) }}</div>
      </div>
      <v-progress-linear v-model="progressRate" class="mb-2" :color="progressColor" rounded background-color="torusGray3"></v-progress-linear>
      <div class="caption text_2--text">{{ t(progressDescription) }}</div>
    </div>
    <div>
      <v-expansion-panels
        v-model="panels"
        multiple
        :class="[{ 'is-mobile': $vuetify.breakpoint.xsOnly, 'is-xs-mobile': $vuetify.breakpoint.width < 350 }]"
      >
        <!-- Email Login -->
        <v-expansion-panel class="mb-4" disabled>
          <v-expansion-panel-header class="py-2">
            <v-icon class="mr-2 d-inline-flex mr-2 shrink text_2--text" size="24">$vuetify.icons.{{ typeOfLogin.toLowerCase() }}</v-icon>
            <div class="grow text-capitalize font-weight-bold body-2" :class="$vuetify.theme.dark ? 'torusFont1--text' : 'text_2--text'">
              {{ verifierName }} Login
            </div>
            <div class="ml-auto justify-end d-flex align-center">
              <div class="caption more-details text_2--text">
                {{ userEmail }}
              </div>
              <v-icon small class="ml-1 success--text" v-text="'$vuetify.icons.check_circle_filled'" />
            </div>
          </v-expansion-panel-header>
        </v-expansion-panel>
        <!-- Browser Backup -->
        <v-expansion-panel class="mb-4">
          <v-expansion-panel-header class="py-2">
            <v-icon class="d-inline-flex mr-2 shrink text_2--text" size="24">$vuetify.icons.browser</v-icon>
            <div class="grow font-weight-bold body-2 text_2--text">
              {{ t('tkeyCreateSetup.browser') }}
            </div>
            <div class="ml-auto text-right caption text_2--text">
              {{ browser }}
              <v-icon small class="m1-1 success--text" v-text="'$vuetify.icons.check_circle_filled'" />
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content class="pa-5">
            <div class="body-2 mb-4 text_2--text">
              {{ t('tkeyCreateSetup.authViaBrowser1') }} {{ t('tkeyCreateSetup.authViaBrowser2') }}
              <span class="font-weight-bold">{{ t('tkeyCreateSetup.authViaBrowser3') }}</span>
            </div>
            <div class="d-flex align-center allow-device-trigger">
              <v-icon class="wallet-checkbox clickable mr-2" :class="{ isDark: $vuetify.theme.dark }" @click="onBackupDeviceShare">
                $vuetify.icon.checkbox{{ $vuetify.theme.dark ? '_dark' : '' }}_{{ backupDeviceShare ? 'checked' : 'unchecked' }}
              </v-icon>
              <v-icon v-if="!backupDeviceShare" size="16" class="mr-1 warning--text">$vuetify.icon.alert_circle_filled</v-icon>
              <div class="body-2 text_2--text">{{ t('tkeyCreateSetup.backupOnDevice') }}</div>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <!-- Recovery Email -->
        <v-expansion-panel class="mb-4" disabled>
          <v-expansion-panel-header class="py-2">
            <v-icon class="mr-2 d-inline-flex mr-2 shrink text_2--text" size="24">$vuetify.icons.mail</v-icon>
            <div class="grow text-capitalize font-weight-bold body-2" :class="$vuetify.theme.dark ? 'torusFont1--text' : 'text_2--text'">
              {{ t('tkeyBackup.recoveryEmail') }}
            </div>
            <div class="ml-auto justify-end d-flex align-center">
              <v-icon
                small
                :class="recoveryEmailFinal ? 'success--text' : 'text_3--text'"
                class="ml-1"
                v-text="'$vuetify.icons.check_circle_filled'"
              />
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content class="pa-5">
            <v-form v-model="validRecoveryEmailForm" @submit.prevent="setRecoveryEmail">
              <div class="body-2 mb-4 text_2--text">
                {{ t('tkeyBackup.recoveryEmailDesc1') }}
                <span class="font-weight-bold">{{ t('tkeyBackup.recoveryEmailDesc2') }}</span>
                {{ t('tkeyBackup.recoveryEmailDesc3') }}
              </div>
              <v-text-field
                v-model="recoveryEmail"
                :rules="[rules.email, rules.required]"
                type="email"
                outlined
                :placeholder="t('tkeyBackup.enterEmail')"
                autocomplete="email"
                :readonly="!!recoveryEmailFinal"
              />
              <div class="text-right">
                <v-btn
                  v-if="!recoveryEmailFinal"
                  type="submit"
                  :disabled="!validRecoveryEmailForm"
                  class="caption white--text font-weight-bold px-8"
                  color="torusBrand1"
                >
                  {{ t('tkeyNew.confirm') }}
                </v-btn>
              </div>
            </v-form>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <!-- Recovery Password -->
        <v-expansion-panel class="mb-4">
          <v-expansion-panel-header class="py-2">
            <v-icon
              class="mr-2 d-inline-flex mr-2 shrink"
              size="24"
              :class="
                $vuetify.theme.dark
                  ? finalRecoveryPassword
                    ? 'text_2--text'
                    : 'torusFont1--text'
                  : finalRecoveryPassword
                  ? 'text_2--text'
                  : 'text_1--text'
              "
            >
              $vuetify.icons.shield_lock
            </v-icon>
            <div
              class="grow font-weight-bold body-2"
              :class="
                $vuetify.theme.dark
                  ? finalRecoveryPassword
                    ? 'text_2--text'
                    : 'torusFont1--text'
                  : finalRecoveryPassword
                  ? 'text_2--text'
                  : 'text_1--text'
              "
            >
              <span v-if="mandatorySecurityQuestionsWhileCreation">{{ t('tkeyCreateSetup.recoveryPass') }}*</span>
              <span v-else>{{ t('tkeyCreateSetup.recoveryPass') }}</span>
            </div>
            <div class="ml-auto text-right caption" :class="$vuetify.theme.dark ? 'torusFont1--text' : 'text_2--text'">
              <v-icon
                small
                class="ml-1"
                :class="finalRecoveryPassword ? 'success--text' : 'text_3--text'"
                v-text="'$vuetify.icons.check_circle_filled'"
              />
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content class="pa-5">
            <v-form v-model="validPasswordForm" @submit.prevent="setFinalPassword">
              <v-text-field
                v-model="recoveryPassword"
                :readonly="!!finalRecoveryPassword"
                :append-icon="showRecoveryPassword ? '$vuetify.icons.visibility_off' : '$vuetify.icons.visibility_on'"
                :type="showRecoveryPassword ? 'text' : 'password'"
                :rules="[rules.required, rules.minLength]"
                minlength="10"
                outlined
                :placeholder="t('tkeyCreateSetup.minAlphaNumeric')"
                autocomplete="new-password"
                @click:append="showRecoveryPassword = !showRecoveryPassword"
              />
              <v-text-field
                v-if="!finalRecoveryPassword"
                v-model="recoveryPasswordConfirm"
                :append-icon="showRecoveryPasswordConfirm ? '$vuetify.icons.visibility_off' : '$vuetify.icons.visibility_on'"
                :type="showRecoveryPasswordConfirm ? 'text' : 'password'"
                :rules="[rules.required, rules.minLength, equalToPassword]"
                outlined
                minlength="10"
                :placeholder="t('tkeyCreateSetup.confirmPassword')"
                autocomplete="new-password"
                @click:append="showRecoveryPasswordConfirm = !showRecoveryPasswordConfirm"
              />
              <div class="d-flex align-end">
                <span v-if="mandatorySecurityQuestionsWhileCreation" class="body-2">*{{ t('tkeyCreateSetup.passwordRequired') }}</span>
                <v-btn
                  v-if="!finalRecoveryPassword"
                  type="submit"
                  :disabled="!validPasswordForm"
                  class="caption white--text font-weight-bold ml-auto"
                  color="torusBrand1"
                >
                  {{ t('tkeyNew.setPassword') }}
                </v-btn>
              </div>
            </v-form>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <!-- Seed Phrase -->
        <!-- <v-expansion-panel class="mb-4" disabled>
          <v-expansion-panel-header class="py-2">
            <v-icon class="mr-2 d-inline-flex mr-2 shrink text_2--text" size="24">$vuetify.icons.tkey_seed_phrase</v-icon>
            <div class="grow text-capitalize font-weight-bold body-2" :class="$vuetify.theme.dark ? 'torusFont1--text' : 'text_2--text'">
              {{ t('tkeySettings.tkeySeedPhrase.title') }}
            </div>
            <div class="ml-auto justify-end d-flex align-center">
              <v-icon small :class="useSeedPhrase ? 'success--text' : 'text_3--text'" class="ml-1" v-text="'$vuetify.icons.check_circle_filled'" />
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content class="pa-5">
            <div class="body-2 mb-4 text_2--text">{{ t('tkeySettings.tkeySeedPhrase.description') }}</div>
            <div class="d-flex align-center allow-device-trigger mb-2">
              <v-icon
                class="wallet-checkbox mr-2"
                :class="{ isDark: $vuetify.theme.dark, clickable: !requireSeedPhraseWhileCreation }"
                @click="onChangeUseSeedPhrase"
              >
                $vuetify.icon.checkbox{{ $vuetify.theme.dark ? '_dark' : '' }}_{{ useSeedPhrase ? 'checked' : 'unchecked' }}
              </v-icon>
              <div class="body-2 text_2--text">{{ t('tkeySettings.tkeySeedPhrase.use') }}</div>
            </div>
            <v-textarea
              v-if="useSeedPhrase"
              v-model="seedPhrase"
              :placeholder="t('tkeySettings.tkeySeedPhrase.enterSeedPhrase')"
              hide-details
              class="font-weight-bold text_2--text"
              outlined
              rows="3"
            />
          </v-expansion-panel-content>
        </v-expansion-panel> -->
      </v-expansion-panels>
      <div class="d-flex mt-1" :class="$vuetify.breakpoint.xsOnly ? 'align-start' : 'align-center'">
        <v-icon
          class="wallet-checkbox clickable mr-4"
          :class="[{ isDark: $vuetify.theme.dark }, $vuetify.breakpoint.xsOnly ? 'mt-1' : '']"
          @click="userUnderstands = !userUnderstands"
        >
          $vuetify.icon.checkbox{{ $vuetify.theme.dark ? '_dark' : '' }}_{{ userUnderstands ? 'checked' : 'unchecked' }}
        </v-icon>
        <div class="body-2 text_2--text">{{ t('tkeyCreateSetup.iUnderstand') }}</div>
      </div>
    </div>
    <v-layout class="mx-n2 mt-9 mb-12">
      <v-flex class="xs6 px-2">
        <v-btn
          block
          :x-large="!$vuetify.breakpoint.xsOnly"
          class="body-2 font-weight-bold"
          outlined
          :color="$vuetify.theme.dark ? 'white' : 'torusBrand1'"
          @click="cancelOnboarding"
        >
          {{ t('tkeyCreateSetup.cancel') }}
        </v-btn>
      </v-flex>
      <v-flex class="xs6 px-2">
        <v-btn
          block
          :disabled="disableSubmit"
          :x-large="!$vuetify.breakpoint.xsOnly"
          color="torusBrand1"
          class="white--text body-2 font-weight-bold"
          :loading="creatingTkey"
          @click="createWallet"
        >
          {{ t('tkeyCreateSetup.createWallet') }}
        </v-btn>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
// import { generateMnemonic } from 'bip39'
import bowser from 'bowser'
import log from 'loglevel'

import config from '../../../config'
import { passwordValidation, requestQuota } from '../../../utils/utils'

export default {
  props: {
    verifierName: {
      type: String,
      default: '',
    },
    typeOfLogin: {
      type: String,
      default: '',
    },
    creatingTkey: {
      type: Boolean,
    },
    userEmail: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      validPasswordForm: true,
      recoveryPassword: '',
      finalRecoveryPassword: '',
      showRecoveryPassword: false,
      recoveryPasswordConfirm: '',
      showRecoveryPasswordConfirm: false,
      validRecoveryEmailForm: true,
      recoveryEmail: '',
      recoveryEmailFinal: '',
      rules: {
        required: (value) => !!value || this.t('tkeyNew.required'),
        minLength: (v) => passwordValidation(v) || this.t('tkeyCreateSetup.passwordRules'),
        equalToPassword: (value) => value === this.recoveryPassword || this.t('tkeyCreateSetup.passwordMatch'),
        email: (value) =>
          /^(([^\s"(),.:;<>@[\\\]]+(\.[^\s"(),.:;<>@[\\\]]+)*)|(".+"))@((\[(?:\d{1,3}\.){3}\d{1,3}])|(([\dA-Za-z-]+\.)+[A-Za-z]{2,}))$/.test(value) ||
          this.t('walletSettings.invalidEmail'),
      },
      panels: [1, 2, 3, 4],
      progressValue: 200,
      backupDeviceShare: false,
      userUnderstands: false,
      useSeedPhrase: false,
      seedPhrase: '',
      // requireSeedPhraseWhileCreation: false,
      mandatorySecurityQuestionsWhileCreation: config.mandatorySecurityQuestionsWhileCreation,
    }
  },
  computed: {
    progressColor() {
      return this.progressValue >= 300 ? 'success' : 'warning'
    },
    progressText() {
      if (this.progressValue >= 400) return 'tkeyCreateSetup.excellent'
      if (this.progressValue < 300) return 'tkeyCreateSetup.good'
      return 'tkeyCreateSetup.average'
    },
    progressDescription() {
      if (this.progressValue >= 400) return 'tkeyCreateSetup.youHaveSufficient'
      if (this.progressValue < 300) return 'tkeyCreateSetup.youNeedOneMore'
      return 'tkeyCreateSetup.youMayWantTo'
    },
    browser() {
      const browser = bowser.getParser(window.navigator.userAgent)
      const browserInfo = browser.getBrowser()

      return `${browserInfo.name} V${browserInfo.version}`
    },
    equalToPassword() {
      return this.recoveryPasswordConfirm === this.recoveryPassword || this.t('tkeyCreateSetup.passwordMatch')
    },
    progressRate() {
      return this.progressValue / 4
    },
    disableSubmit() {
      return this.progressValue < 300 || !this.userUnderstands || (this.mandatorySecurityQuestionsWhileCreation && !this.finalRecoveryPassword)
    },
  },
  mounted() {
    // if (this.requireSeedPhraseWhileCreation) {
    //   this.seedPhrase = generateMnemonic()
    // }
  },
  methods: {
    cancelOnboarding() {
      this.$emit('tKeyOnboardingCancel')
    },
    async createWallet() {
      if (this.creatingTkey) return
      this.$emit('createNewTKey', {
        password: this.finalRecoveryPassword,
        backup: this.backupDeviceShare,
        recoveryEmail: this.recoveryEmailFinal,
        useSeedPhrase: this.useSeedPhrase,
        seedPhrase: this.seedPhrase,
      })
    },
    setFinalPassword() {
      this.finalRecoveryPassword = this.recoveryPassword
      this.progressValue += 100
    },
    async onBackupDeviceShare() {
      try {
        await requestQuota()
        this.backupDeviceShare = !this.backupDeviceShare
        this.progressValue += this.backupDeviceShare ? 40 : -40
      } catch (error) {
        log.error(error)
      }
    },
    setRecoveryEmail() {
      this.recoveryEmailFinal = this.recoveryEmail
      this.progressValue += 100
    },
    // onChangeUseSeedPhrase() {
    //   if (!this.requireSeedPhraseWhileCreation) {
    //     this.useSeedPhrase = !this.useSeedPhrase
    //     this.seedPhrase = generateMnemonic()
    //   }
    // },
  },
}
</script>

<style lang="scss" scoped>
@import 'SetupWallet.scss';
</style>
