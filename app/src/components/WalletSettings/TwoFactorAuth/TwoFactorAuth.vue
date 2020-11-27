<template>
  <div class="two-factor-auth-container" :class="[$vuetify.breakpoint.xsOnly ? 'pt-5' : 'py-5 px-4', { 'is-dark': $vuetify.theme.dark }]">
    <!-- <div class="mb-12">
      <div class="text_1--text font-weight-bold body-1">{{ t('tkeySettings.authThreshold') }}</div>
      <div class="settings-container pa-4 mb-4">
        <div class="text_1--text body-2 mb-4">{{ t('tkeySettings.selectThreshold') }}</div>
        <v-select v-model="authTreshholdSelected" class="mb-6" outlined hide-details :items="authTreshholds" append-icon="$vuetify.icons.select">
          <template v-slot:item="{ item }">
            {{ actualFactor(item) }}
          </template>
          <template v-slot:selection="{ item }">{{ actualFactor(item) }}</template>
        </v-select>
        <v-layout wrap>
          <v-flex class="ml-auto xs12 text-right">
            <v-btn large class="torus-btn1 py-1 torusBrand1--text" type="submit">
              {{ t('tkeySettings.save') }}
            </v-btn>
          </v-flex>
        </v-layout>
      </div>
    </div> -->
    <div class="settings-container pa-4 mb-10">
      <div class="text_1--text font-weight-bold body-2">{{ t('tkeySettings.authThreshold') }} - {{ authenticationThreshold }}</div>
    </div>

    <div class="mb-12">
      <div class="text_1--text font-weight-bold body-1 mb-2">{{ t('tkeySettings.listOfAuth') }}</div>
      <div class="settings-container pa-4 mb-10">
        <div class="text_1--text body-2 mb-4">{{ t('tkeySettings.network') }}</div>
        <v-list dense outlined class="pa-0 factor-list mb-4">
          <v-list-item v-for="account in torusShareAccounts" :key="account.verifier" class="pl-0 pr-1">
            <v-list-item-avatar class="ma-0">
              <v-icon size="16" class="torusGray1--text">$vuetify.icons.{{ account.verifier }}</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="font-weight-regular caption">
                <span class="text_1--text">{{ userEmail }}</span>
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action class="ma-0"></v-list-item-action>
          </v-list-item>
        </v-list>
        <!-- <v-layout wrap>
          <v-flex class="ml-auto xs12 text-right">
            <v-btn large class="torus-btn1 py-1 torusBrand1--text" type="submit" @click="loginDialog = true">
              {{ t('tkeySettings.addNewLogin') }}
            </v-btn>
          </v-flex>
        </v-layout> -->
      </div>

      <div v-for="device in deviceShares" :key="device.index" class="settings-container pa-4 mb-10">
        <div class="text_1--text d-flex align-center body-2 mb-4">
          <div>{{ device.groupTitle }}</div>
          <v-btn class="download-btn ml-auto" color="torusBrand1" icon small :aria-label="`Download`" @click="downloadShare(device.index)">
            <v-icon x-small>$vuetify.icons.download</v-icon>
          </v-btn>
        </div>
        <v-list dense outlined class="pa-0 factor-list mb-2">
          <v-list-item v-for="browser in device.browsers" :key="browser.dateAdded" class="pl-0 pr-1">
            <v-list-item-avatar class="ma-0">
              <v-icon size="16" class="torusGray1--text">$vuetify.icons.browser</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="font-weight-regular caption">
                <div>
                  <div class="text_1--text">
                    <span class="font-weight-bold">{{ browser.title }}</span>
                    <span v-if="browser.isCurrent" class="font-italic">({{ t('tkeySettings.current') }})</span>
                  </div>
                  <div class="caption-3">{{ browser.dateFormatted }}</div>
                </div>
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action class="ma-0">
              <!-- <div>
                <v-btn class="delete-btn" color="text_2" icon small :aria-label="`Delete`">
                  <v-icon x-small>$vuetify.icons.trash</v-icon>
                </v-btn>
              </div> -->
            </v-list-item-action>
          </v-list-item>
        </v-list>
        <div class="caption text_3--text mb-4">
          {{ t('tkeySettings.note') }}: {{ t('tkeySettings.clearing') }}. {{ t('tkeySettings.clickThe') }} "
          <v-icon size="10" class="torusBrand1--text">$vuetify.icons.download</v-icon>
          " {{ t('tkeySettings.iconToAllow') }}.
        </div>
        <!-- <v-layout wrap>
          <v-flex class="ml-auto xs12 text-right">
            <v-btn large class="torus-btn1 py-1 torusBrand1--text" type="submit">
              {{ t('tkeySettings.addBrowser') }}
            </v-btn>
          </v-flex>
        </v-layout> -->
      </div>

      <div v-if="!hasPassword || isChangePassword" class="settings-container pa-4 mb-10">
        <div class="text_1--text body-2 mb-4">{{ t('tkeySettings.accountPass') }}</div>
        <v-form v-model="validPasswordForm" @submit.prevent="setPassword">
          <v-text-field
            v-model="recoveryPassword"
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
          <v-layout wrap>
            <v-flex class="ml-auto xs12 text-right">
              <v-btn :disabled="!validPasswordForm" large class="torus-btn1 py-1 torusBrand1--text" :loading="settingPassword" type="submit">
                {{ t('tkeyNew.setPassword') }}
              </v-btn>
            </v-flex>
          </v-layout>
        </v-form>
      </div>
      <div v-else class="settings-container pa-4 mb-10">
        <div class="text_1--text body-2 mb-4">{{ t('tkeySettings.accountPass') }}</div>
        <v-text-field disabled outlined type="password" placeholder="*************"></v-text-field>
        <v-layout wrap>
          <v-flex class="ml-auto xs12 text-right">
            <v-btn large class="torus-btn1 py-1 torusBrand1--text" @click="isChangePassword = true">
              {{ t('tkeySettings.changePass') }}
            </v-btn>
          </v-flex>
        </v-layout>
      </div>

      <!-- <div class="settings-container pa-4 mb-10">
        <div class="text_1--text body-2 mb-4">{{ t('tkeySettings.securityQuestion') }}</div>
        <v-select outlined hide-details placeholder="What is the name of your High School?"></v-select>
        <v-text-field outlined type="password" placeholder="*************"></v-text-field>
        <v-layout wrap>
          <v-flex class="ml-auto xs12 text-right">
            <v-btn large class="torus-btn1 py-1 torusBrand1--text" type="submit">
              {{ t('tkeySettings.changeQuestion') }}
            </v-btn>
          </v-flex>
        </v-layout>
      </div>

      <div class="settings-container pa-4 mb-10">
        <div class="text_1--text body-2 mb-4">{{ t('tkeySettings.selectFactor') }}</div>
        <v-select
          v-model="authFactorSelected"
          outlined
          hide-details
          class="mb-6"
          :items="authFactors"
          item-value="type"
          item-text="label"
          :placeholder="t('tkeySettings.selectFromList')"
        ></v-select>
        <v-layout wrap>
          <v-flex class="ml-auto xs12 text-right">
            <v-btn large class="torus-btn1 py-1 torusBrand1--text" type="submit">
              {{ t('tkeySettings.addFactor') }}
            </v-btn>
          </v-flex>
        </v-layout>
      </div> -->
    </div>
    <PopupLogin :login-dialog="loginDialog" :is-link-account="true" @closeDialog="loginDialog = false" @accountLinked="accountLinked" />
    <LinkingCompleted :linking-dialog="linkingDialog" :is-successfull="isLinkingSuccessfull" @closeDialog="linkingDialog = false" />
  </div>
</template>

<script>
import log from 'loglevel'
import { mapActions, mapState } from 'vuex'

import PopupLogin from '../../../containers/Popup/PopupLogin'
import { getUserEmail, passwordValidation } from '../../../utils/utils'
import LinkingCompleted from '../LinkingCompleted'

const AUTH_FACTORS = [
  {
    type: 'torus_network',
    label: 'Torus Network',
  },
  {
    type: 'device',
    label: 'Device',
  },
  {
    type: 'account_password',
    label: 'Account Password',
  },
]
export default {
  name: 'TwoFactorAuthSettings',
  components: { PopupLogin, LinkingCompleted },
  data() {
    return {
      authTreshholdSelected: 2,
      authTreshholds: [1, 2, 3, 4, 5],
      authFactorSelected: '',
      authFactors: AUTH_FACTORS,
      userAuthFactors: [],
      loginDialog: false,
      linkingDialog: false,
      isLinkingSuccessfull: true,
      validPasswordForm: true,
      recoveryPassword: '',
      showRecoveryPassword: false,
      isChangePassword: false,
      recoveryPasswordConfirm: '',
      showRecoveryPasswordConfirm: false,
      rules: {
        required: (value) => !!value || this.t('tkeyNew.required'),
        minLength: (v) => passwordValidation(v) || this.t('tkeyCreateSetup.passwordRules'),
      },
      settingPassword: false,
    }
  },
  computed: {
    ...mapState({
      wallets: 'wallet',
      userInfo: 'userInfo',
      tKeyStore: 'tKeyStore',
      loginConfig: (state) => state.embedState.loginConfig,
    }),
    torusShareAccounts() {
      return [
        {
          verifier: this.userInfo.typeOfLogin,
          verifierId: this.userInfo.verifierId,
        },
      ]
    },
    deviceShares() {
      if (!this.tKeyStore.settingsPageData) return []
      return this.tKeyStore.settingsPageData.allDeviceShares
    },
    hasPassword() {
      if (!this.tKeyStore.settingsPageData) return false
      return this.tKeyStore.settingsPageData.passwordShare.available
    },
    authenticationThreshold() {
      if (!this.tKeyStore.settingsPageData) return ''
      return this.tKeyStore.settingsPageData.threshold
    },
    userEmail() {
      return getUserEmail(this.userInfo, this.loginConfig, this.t('accountMenu.wallet'))
    },
    equalToPassword() {
      return this.recoveryPasswordConfirm === this.recoveryPassword || this.t('tkeyCreateSetup.passwordMatch')
    },
  },
  mounted() {
    log.info('this.tKeyStore', this.tKeyStore)
  },
  methods: {
    ...mapActions(['addPassword', 'changePassword', 'downloadShare']),
    accountLinked() {
      // TODO check linking successfull
      this.linkingDialog = true
      this.loginDialog = false
    },
    actualFactor(item) {
      return this.t('tkeySettings.actualFactor')
        .replace(/{actualfactor}/gi, item)
        .replace(/{maxfactor}/gi, this.authTreshholds.length)
    },
    async setPassword() {
      this.settingPassword = true
      if (this.hasPassword) await this.changePassword(this.recoveryPassword)
      else await this.addPassword(this.recoveryPassword)
      this.isChangePassword = false
      this.settingPassword = false
      this.recoveryPassword = ''
      this.recoveryPasswordConfirm = ''
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'TwoFactorAuth.scss';
</style>
