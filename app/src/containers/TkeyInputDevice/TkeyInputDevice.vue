<template>
  <div>
    <v-container :class="[$vuetify.breakpoint.xsOnly ? 'pa-0' : 'pa-4']">
      <v-layout class="justify-center">
        <v-flex :class="[$vuetify.breakpoint.xsOnly ? 'xs12' : 'xs7']">
          <div class="new-device-container" :class="[$vuetify.breakpoint.xsOnly ? 'is-mobile' : '', { 'is-dark': $vuetify.theme.dark }]">
            <!-- IMAGE -->
            <div class="text-center" :class="[hasPasswordSetUp ? 'mb-2' : 'mb-10']">
              <img v-if="hasPasswordSetUp" src="../../assets/images/ob-verification-methods.svg" alt="Verification Methods" class="mr-2" />
              <img v-else src="../../assets/images/ob-verification.svg" alt="Verification Required" class="mr-2" />
            </div>

            <!-- TITLE -->
            <div class="text-center new-device-header">
              <template v-if="hasPasswordSetUp">
                <div class="new-device-header__title">{{ t('tkeyNew.verificationMethods') }}</div>
                <div class="new-device-header__description">
                  {{ t('tkeyNew.youRequireNum') }}
                </div>
                <div class="new-device-header__description">
                  <span class="font-weight-bold">{{ t('tkeyNew.verifyYourIdentity') }}</span>
                  {{ t('tkeyNew.verifyWithAny') }}:
                </div>
              </template>
              <template v-else>
                <div class="new-device-header__title">{{ t('tkeyNew.verificationReq') }}</div>
                <div class="new-device-header__description">
                  {{ t('tkeyNew.youAreAccessing') }}
                </div>
                <div class="new-device-header__description">
                  <span class="font-weight-bold">{{ t('tkeyNew.verifyYourIdentity') }}</span>
                  {{ t('tkeyNew.verifyWithTheFf') }}:
                </div>
              </template>
            </div>

            <!-- BODY -->
            <!-- Refirects after verification with old browser -->
            <div>
              <v-expansion-panels>
                <v-expansion-panel v-for="device in deviceShares" :key="device.index" class="mb-2">
                  <v-expansion-panel-header class="py-2">
                    <div class="grow font-weight-bold body-2 text_2--text">
                      <v-icon class="mr-1">$vuetify.icons.device_detailed</v-icon>
                      {{ device.groupTitle }}
                    </div>
                    <v-icon
                      v-if="verifiedWithDevice(device.index)"
                      small
                      class="d-inline-flex ml-auto success--text shrink"
                      v-text="'$vuetify.icons.check_circle_filled'"
                    />
                    <v-icon v-else small class="d-inline-flex ml-auto shrink" v-text="'$vuetify.icons.select'" />
                  </v-expansion-panel-header>
                  <v-expansion-panel-content class="pa-5">
                    <div class="body-2 text_2--text mb-4">
                      {{ t('tkeyNew.loginToTorus') }}
                    </div>

                    <div v-for="browser in device.browsers" :key="browser.dateAdded" class="d-flex info-box py-3 px-6 mb-2 align-center">
                      <div class="grow font-weight-bold body-2">
                        <v-icon class="mr-1">$vuetify.icons.browser</v-icon>
                        {{ browser.title }}
                      </div>
                      <v-icon v-if="isAccountRecovery" small v-text="'$vuetify.icons.download'" />
                      <div v-else class="ml-auto text-right caption">{{ t('tkeyNew.refId') }}: {{ browser.dateAdded }}</div>
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel v-if="isAccountRecovery" class="mb-2" disabled>
                  <v-expansion-panel-header class="py-2">
                    <div class="grow font-weight-bold body-2 text_2--text">
                      <v-icon class="mr-2" size="18">$vuetify.icons.upload</v-icon>
                      {{ t('tkeyNew.uploadFile') }}
                    </div>
                    <div v-if="isAccountRecovery" class="ml-auto text-right">
                      <a class="text-decoration-none caption" href="#">{{ t('tkeyNew.uploadAFile') }}</a>
                    </div>
                    <v-icon
                      v-else-if="recoveredPassword"
                      small
                      class="d-inline-flex ml-auto success--text shrink"
                      v-text="'$vuetify.icons.check_circle_filled'"
                    />
                    <v-icon v-else small class="d-inline-flex ml-auto shrink" v-text="'$vuetify.icons.select'" />
                  </v-expansion-panel-header>
                </v-expansion-panel>
                <!-- If user has password setup -->
                <v-expansion-panel v-if="hasPasswordSetUp || isAccountRecovery" :disabled="recoveredPassword" class="mb-2">
                  <v-expansion-panel-header class="py-2">
                    <div class="grow font-weight-bold body-2 text_2--text">
                      <v-icon class="mr-1">$vuetify.icons.password</v-icon>
                      {{ t('tkeyNew.recoveryPass') }}
                    </div>
                    <div v-if="isAccountRecovery" class="ml-auto text-right">
                      <a class="text-decoration-none caption" href="#">{{ t('tkeyNew.typeInPass') }}</a>
                    </div>
                    <v-icon
                      v-else-if="recoveredPassword"
                      small
                      class="d-inline-flex ml-auto success--text shrink"
                      v-text="'$vuetify.icons.check_circle_filled'"
                    />
                    <v-icon v-else small class="d-inline-flex ml-auto shrink" v-text="'$vuetify.icons.select'" />
                  </v-expansion-panel-header>
                  <v-expansion-panel-content class="pa-5">
                    <v-form v-model="validRecoveryPasswordForm" @submit.prevent="onRecoverPassword">
                      <v-text-field
                        v-model="recoveryPassword"
                        :append-icon="showRecoveryPassword ? '$vuetify.icons.visibility_off' : '$vuetify.icons.visibility_on'"
                        :type="showRecoveryPassword ? 'text' : 'password'"
                        :rules="[rules.required]"
                        outlined
                        :placeholder="t('tkeyNew.enterPassword')"
                        @click:append="showRecoveryPassword = !showRecoveryPassword"
                      />
                      <v-layout class="mx-n2 align-center">
                        <v-flex v-if="!$vuetify.breakpoint.xsOnly" class="xs4 px-2"></v-flex>
                        <v-flex class="px-2 text-center" :class="$vuetify.breakpoint.xsOnly ? 'xs6' : 'xs4'"></v-flex>
                        <v-flex class="px-2" :class="$vuetify.breakpoint.xsOnly ? 'xs6' : 'xs4'">
                          <v-btn :disabled="!validRecoveryPasswordForm" block large color="torusBrand1" class="white--text" type="submit">
                            {{ t('tkeyNew.confirm') }}
                          </v-btn>
                        </v-flex>
                      </v-layout>
                    </v-form>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
              <div class="caption text-right text_2--text">{{ t('tkeyNew.skip') }}</div>
            </div>

            <div class="tkey-footer">
              <hr class="mb-2" />
              <v-layout>
                <v-flex class="x6">
                  <div class="d-flex align-center">
                    <v-icon x-small class="mr-1">$vuetify.icons.lock_filled</v-icon>
                    <div class="caption">{{ t('tkeyNew.secureTorus') }}</div>
                  </div>
                </v-flex>
                <v-flex class="x6 caption text-right">
                  {{ t('tkeyNew.contactSupport') }}
                </v-flex>
              </v-layout>
            </div>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  data() {
    return {
      // verify device
      verifyDeviceForm: true,
      confirmedDevice: false,
      verifiedDevice: false,
      verifiedDeviceSelected: '',
      // recover password
      validRecoveryPasswordForm: true,
      recoveryPassword: '',
      showRecoveryPassword: false,
      recoveredPassword: false,
      rules: {
        required: (value) => !!value || this.t('tkeyNew.required'),
      },
    }
  },
  computed: {
    ...mapState(['tKeyStore']),
    deviceShares() {
      if (!this.tKeyStore.settingsPageData) return []
      return this.tKeyStore.settingsPageData.allDeviceShares
    },
    hasPasswordSetUp() {
      return true
    },
    isAccountRecovery() {
      return false
    },
  },
  methods: {
    ...mapActions(['setSecurityQuestionShareFromUserInput']),
    onVerifyPassword() {
      this.setSecurityQuestionShareFromUserInput({
        id: this.$route.query.id,
        password: this.verifyPassword,
      })
    },
    onRecoverPassword() {
      this.recoveredPassword = true
    },
    verifiedWithDevice() {
      return false
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'TkeyInputDevice.scss';
</style>
