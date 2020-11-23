<template>
  <div>
    <v-container :class="[$vuetify.breakpoint.xsOnly ? 'pa-0' : 'pa-4']">
      <v-layout class="justify-center">
        <v-flex :class="[$vuetify.breakpoint.xsOnly ? 'xs12' : 'xs7']">
          <div class="new-device-container" :class="[$vuetify.breakpoint.xsOnly ? 'is-mobile' : '', { 'is-dark': $vuetify.theme.dark }]">
            <!-- IMAGE -->
            <div
              class="text-center"
              :class="$vuetify.breakpoint.xsOnly ? 'mb-7' : 'mb-4'"
              :style="{ height: $vuetify.breakpoint.xsOnly ? '66px' : '100px' }"
            >
              <img
                src="../../../assets/images/ob-verification-methods.svg"
                :height="$vuetify.breakpoint.xsOnly ? '82' : '125'"
                alt="Verification Methods"
                class="mr-2"
              />
            </div>

            <!-- TITLE -->
            <div class="text-center new-device-header">
              <template>
                <div class="new-device-header__title">
                  {{ t('tkeyNew.newLoginDetected') }}
                </div>
                <div class="new-device-header__description">
                  {{ t('tkeyNew.itSeems1') }}
                </div>
                <div class="new-device-header__description">
                  {{ t('tkeyNew.itSeems2') }}
                  <span class="font-weight-bold">{{ t('tkeyNew.itSeems3') }}</span>
                  {{ t('tkeyNew.itSeems4').replace('{num}', requiredShares) }}:
                </div>
              </template>
            </div>

            <div>
              <v-expansion-panels :value="panels" multiple>
                <!-- If user has password setup -->
                <v-expansion-panel v-if="securityQuestions.show" class="mb-2">
                  <v-expansion-panel-header class="py-2">
                    <div class="grow font-weight-bold body-2">
                      <v-icon class="mr-2" :class="$vuetify.theme.dark ? 'torusFont1--text' : 'text_1--text'">$vuetify.icons.shield_lock</v-icon>
                      <span :class="$vuetify.theme.dark ? 'torusFont1--text' : 'text_1--text'">{{ t('tkeyNew.recoveryPass') }}</span>
                    </div>
                    <v-icon
                      v-if="securityQuestions.finished"
                      small
                      class="d-inline-flex ml-auto success--text shrink"
                      v-text="'$vuetify.icons.check_circle_filled'"
                    />
                    <v-icon v-else small class="d-inline-flex ml-auto shrink" v-text="'$vuetify.icons.select'" />
                  </v-expansion-panel-header>
                  <v-expansion-panel-content class="pa-5">
                    <v-form v-model="validVerifyPasswordForm" @submit.prevent="onVerifyPassword">
                      <v-text-field
                        v-model="verifyPassword"
                        :append-icon="showVerifyPassword ? '$vuetify.icons.visibility_off' : '$vuetify.icons.visibility_on'"
                        :type="showVerifyPassword ? 'text' : 'password'"
                        :rules="[rules.required, passwordError]"
                        outlined
                        :readonly="securityQuestions.finished"
                        autocomplete="current-password"
                        :placeholder="t('tkeyNew.enterPassword')"
                        @click:append="showVerifyPassword = !showVerifyPassword"
                        @keydown="passwordEntered = false"
                      />
                      <div v-if="!securityQuestions.finished" class="text-right">
                        <v-btn
                          type="submit"
                          :disabled="!validVerifyPasswordForm"
                          class="caption white--text font-weight-bold px-10"
                          color="torusBrand1"
                        >
                          {{ t('tkeyNew.confirm') }}
                        </v-btn>
                      </div>
                    </v-form>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel v-for="device in devices" :key="device.index" :disabled="verifiedWithDevice(device.index)" class="mb-2">
                  <v-expansion-panel-header class="py-2">
                    <div class="grow font-weight-bold body-2">
                      <v-icon class="mr-2" :class="$vuetify.theme.dark ? 'torusFont1--text' : 'text_1--text'">
                        $vuetify.icons.device_{{ device.icon }}
                      </v-icon>
                      <span class="text-capitalize" :class="$vuetify.theme.dark ? 'torusFont1--text' : 'text_1--text'">
                        {{ t('tkeyNew.device') }} - {{ device.icon }}
                      </span>
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
                      {{
                        t('tkeyNew.loginToTorus').replace(
                          '{deviceLink}',
                          device.module === CHROME_EXTENSION_STORAGE_MODULE_KEY ? STORAGE_MAP[CHROME_EXTENSION_STORAGE_MODULE_KEY] : 'app.tor.us'
                        )
                      }}
                    </div>

                    <div
                      v-for="browser in device.browsers"
                      :key="browser.dateAdded"
                      class="d-flex info-box px-6 mb-2 align-center"
                      :class="[$vuetify.breakpoint.xsOnly ? 'py-4' : 'py-3']"
                    >
                      <div class="grow d-flex align-center">
                        <v-icon :size="$vuetify.breakpoint.xsOnly ? '16' : ''" class="text_2--text mr-2">$vuetify.icons.browser</v-icon>
                        <div>
                          <div class="font-weight-bold text_2--text" :class="$vuetify.breakpoint.xsOnly ? 'caption' : 'body-2'">
                            <div>{{ browser.title }}</div>
                            <div class="font-weight-regular caption-3">{{ browser.dateFormatted }}</div>
                          </div>
                          <div v-if="$vuetify.breakpoint.xsOnly" class="text_2--text caption-3">
                            {{ t('tkeyNew.refId') }}: {{ device.indexShort }}
                          </div>
                        </div>
                      </div>
                      <div v-if="!$vuetify.breakpoint.xsOnly" class="ml-auto text-right text_2--text caption">
                        {{ t('tkeyNew.refId') }}: {{ device.indexShort }}
                      </div>
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
              <div class="text-right">
                <a class="caption torusBrand1--text" @click="skipLogin">{{ t('tkeyNew.skip').replace(/\{verifier\}/gi, verifierName) }}</a>
              </div>
            </div>
            <NewDeviceFooter />
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import { CHROME_EXTENSION_STORAGE_MODULE_KEY, STORAGE_MAP } from '../../../utils/enums'
import NewDeviceFooter from '../NewDeviceFooter'

export default {
  components: { NewDeviceFooter },
  props: {
    allDeviceShares: {
      type: Object,
      default() {
        return {}
      },
    },
    requiredShares: {
      type: Number,
      default: 0,
    },
    securityQuestions: {
      type: Object,
      default() {
        return {}
      },
    },
    incorrectPassword: {
      type: Boolean,
      default: false,
    },
    verifierName: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      validVerifyPasswordForm: true,
      verifyPassword: '',
      showVerifyPassword: false,
      passwordEntered: false,
      rules: {
        required: (value) => !!value || this.t('tkeyNew.required'),
      },
      CHROME_EXTENSION_STORAGE_MODULE_KEY,
      STORAGE_MAP,
    }
  },
  computed: {
    devices() {
      return Object.keys(this.allDeviceShares)
        .map((x) => {
          const share = this.allDeviceShares[x]
          const dateFormated = new Date(share.dateAdded).toLocaleString()
          share.browserList = share.browsers.map((browser) => browser.browserName).join(', ')
          share.dateFormated = dateFormated
          return share
        })
        .sort((a, b) => b.dateAdded - a.dateAdded)
    },
    passwordError() {
      if (!this.passwordEntered || !this.incorrectPassword) return true
      return this.t('tkeyNew.errorIncorrectPass')
    },
    panels() {
      const panels = []
      for (let i = 0; i < this.devices.length + 1; i += 1) panels.push(i)
      return panels
    },
  },
  methods: {
    onVerifyPassword() {
      this.passwordEntered = true
      this.$emit('setPasswordInput', this.verifyPassword)
    },
    verifiedWithDevice() {
      return false
    },
    skipLogin() {
      this.$emit('skipLogin', { rejected: true })
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'TkeyInputView.scss';
</style>
