<template>
  <div>
    <v-container :class="[$vuetify.breakpoint.xsOnly ? 'pa-0' : 'pa-4']">
      <v-layout class="justify-center">
        <v-flex :class="[$vuetify.breakpoint.xsOnly ? 'xs12' : 'xs7']">
          <div class="new-device-container" :class="[$vuetify.breakpoint.xsOnly ? 'is-mobile' : '', { 'is-dark': $vuetify.theme.dark }]">
            <!-- IMAGE -->
            <div v-if="scenario === SCENARIO_DEVICE_DETECTED || (scenario === SCENARIO_LOGIN_DETECTED && verifiedLogin)" class="text-center mb-2">
              <img src="../../assets/images/ob-verification-done.svg" alt="Verified" class="mr-2" />
            </div>
            <div v-if="scenario === SCENARIO_WITH_PASSWORD" class="text-center mb-10">
              <img src="../../assets/images/ob-verification.svg" alt="Verification Required" class="mr-2" />
            </div>
            <div
              v-if="scenario === SCENARIO_WITH_DEVICE || scenario === SCENARIO_ACCOUNT_RECOVERY"
              class="text-center"
              :class="[hasPasswordSetUp ? 'mb-2' : 'mb-10']"
            >
              <img v-if="hasPasswordSetUp" src="../../assets/images/ob-verification-methods.svg" alt="Verification Methods" class="mr-2" />
              <img v-else src="../../assets/images/ob-verification.svg" alt="Verification Required" class="mr-2" />
            </div>

            <!-- TITLE -->
            <div v-if="scenario === SCENARIO_WITH_PASSWORD" class="text-center new-device-header">
              <div class="new-device-header__title">Verification required</div>
              <div class="new-device-header__description">
                You are accessing your 2FA Wallet from a new platform.
              </div>
              <div class="new-device-header__description">
                <span class="font-weight-bold">Verify your identity</span>
                with your password:
              </div>
            </div>

            <div v-if="scenario === SCENARIO_ACCOUNT_RECOVERY" class="text-center new-device-header">
              <div class="new-device-header__title">Account Recovery</div>
              <div class="new-device-header__description">
                You require min 2 verifications to access your 2FA Wallet.
              </div>
              <div class="new-device-header__description">
                <span class="font-weight-bold">Verify your identity</span>
                with any of the following:
              </div>
            </div>

            <div v-if="scenario === SCENARIO_WITH_DEVICE" class="text-center new-device-header">
              <template v-if="hasPasswordSetUp">
                <div class="new-device-header__title">Verification methods</div>
                <div class="new-device-header__description">
                  You require 1 verification to access your 2FA Wallet.
                </div>
                <div class="new-device-header__description">
                  <span class="font-weight-bold">Verify your identity</span>
                  with any of the following:
                </div>
              </template>
              <template v-else>
                <div class="new-device-header__title">Verification required</div>
                <div class="new-device-header__description">
                  You are accessing your 2FA Wallet from a new platform.
                </div>
                <div class="new-device-header__description">
                  <span class="font-weight-bold">Verify your identity</span>
                  with the following:
                </div>
              </template>
            </div>

            <div v-if="scenario === SCENARIO_LOGIN_DETECTED" class="text-center new-device-header">
              <template v-if="verifiedLogin">
                <div class="new-device-header__title">Identity verified</div>
                <div class="header__description mb-15">Return to your new platform to continue with the login</div>
              </template>
              <template v-else>
                <div class="new-device-header__title">New login detected</div>
                <div class="new-device-header__description">A new login is trying to access your 2FA Wallet.</div>
                <div class="new-device-header__description">
                  <span class="font-weight-bold">Match the Reference ID</span>
                  and confirm this is you:
                </div>
              </template>
            </div>

            <div v-if="scenario === SCENARIO_DEVICE_DETECTED">
              <div v-if="verifiedDevice" class="text-center new-device-header">
                <div class="new-device-header__title">New device and browser added</div>
                <div class="new-device-header__description">The following has been added as an authenticator.</div>
                <div class="new-device-header__description">You can edit it from the ‘Settings’ page.</div>
              </div>
              <div v-else class="text-center new-device-header">
                <div class="new-device-header__title">Verified</div>
                <div class="new-device-header__description">Confirm your browser and device details.</div>
                <div class="new-device-header__description">Store it for future access into your 2FA Wallet.</div>
              </div>
            </div>

            <!-- Scenarios -->
            <!-- Returning user
            New device
            with password set up
            rmb password
            2/3, 2/4 -->
            <div v-if="scenario === SCENARIO_WITH_PASSWORD">
              <v-form v-model="validVerifyPasswordForm">
                <v-text-field
                  v-model="verifyPassword"
                  :append-icon="showVerifyPassword ? '$vuetify.icons.visibility_off' : '$vuetify.icons.visibility_on'"
                  :type="showVerifyPassword ? 'text' : 'password'"
                  :rules="[rules.required]"
                  outlined
                  placeholder="Enter Password here"
                  @click:append="showVerifyPassword = !showVerifyPassword"
                />
                <v-layout class="mx-n2 mb-12 align-center">
                  <v-flex v-if="!$vuetify.breakpoint.xsOnly" class="xs4 px-2"></v-flex>
                  <v-flex class="px-2 text-center" :class="$vuetify.breakpoint.xsOnly ? 'xs6' : 'xs4'">
                    <a
                      class="caption text-decoration-none"
                      :class="$vuetify.theme.dark ? 'torusFont1--text' : 'torusBrand1'"
                      @click="onAnotherMethod"
                    >
                      Verify via another method
                    </a>
                  </v-flex>
                  <v-flex class="px-2" :class="$vuetify.breakpoint.xsOnly ? 'xs6' : 'xs4'">
                    <v-btn :disabled="!validVerifyPasswordForm" block large color="torusBrand1" class="white--text" @click="onVerifyPassword">
                      Confirm
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-form>
            </div>

            <!-- Returning user
              New device
              no password set up
              2/2 -->
            <!-- Refirects after verification with old browser -->
            <div v-if="scenario === SCENARIO_WITH_DEVICE || scenario === SCENARIO_ACCOUNT_RECOVERY">
              <v-expansion-panels>
                <v-expansion-panel v-for="device in devices" :key="device.id" class="mb-2">
                  <v-expansion-panel-header class="py-2">
                    <div class="grow font-weight-bold body-2 text_2--text">
                      <v-icon class="mr-1">$vuetify.icons.device_detailed</v-icon>
                      {{ device.name }}
                    </div>
                    <v-icon
                      v-if="verifiedWithDevice(device.id)"
                      small
                      class="d-inline-flex ml-auto success--text shrink"
                      v-text="'$vuetify.icons.check_circle_filled'"
                    />
                    <v-icon v-else small class="d-inline-flex ml-auto shrink" v-text="'$vuetify.icons.select'" />
                  </v-expansion-panel-header>
                  <v-expansion-panel-content class="pa-5">
                    <div class="body-2 text_2--text mb-4">
                      Login to app.tor.us from the stored browser below to verify your identity.
                    </div>

                    <div v-for="browser in device.browsers" :key="browser.id" class="d-flex info-box py-3 px-6 mb-2 align-center">
                      <div class="grow font-weight-bold body-2">
                        <v-icon class="mr-1">$vuetify.icons.device</v-icon>
                        {{ browser.name }}
                      </div>
                      <v-icon v-if="scenario === SCENARIO_ACCOUNT_RECOVERY" small v-text="'$vuetify.icons.download'" />
                      <div v-else class="ml-auto text-right caption">Reference ID: {{ browser.id }}</div>
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel v-if="scenario === SCENARIO_ACCOUNT_RECOVERY" class="mb-2" disabled>
                  <v-expansion-panel-header class="py-2">
                    <div class="grow font-weight-bold body-2 text_2--text">
                      <v-icon class="mr-2" size="18">$vuetify.icons.upload</v-icon>
                      Upload File
                    </div>
                    <div v-if="scenario === SCENARIO_ACCOUNT_RECOVERY" class="ml-auto text-right">
                      <a class="text-decoration-none caption" href="#">Upload a file</a>
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
                <v-expansion-panel v-if="hasPasswordSetUp || scenario === SCENARIO_ACCOUNT_RECOVERY" :disabled="recoveredPassword" class="mb-2">
                  <v-expansion-panel-header class="py-2">
                    <div class="grow font-weight-bold body-2 text_2--text">
                      <v-icon class="mr-1">$vuetify.icons.password</v-icon>
                      Recovery Password
                    </div>
                    <div v-if="scenario === SCENARIO_ACCOUNT_RECOVERY" class="ml-auto text-right">
                      <a class="text-decoration-none caption" href="#">Type in password</a>
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
                    <v-form v-model="validRecoveryPasswordForm">
                      <v-text-field
                        v-model="recoveryPassword"
                        :append-icon="showRecoveryPassword ? '$vuetify.icons.visibility_off' : '$vuetify.icons.visibility_on'"
                        :type="showRecoveryPassword ? 'text' : 'password'"
                        :rules="[rules.required]"
                        outlined
                        placeholder="Enter Password here"
                        @click:append="showRecoveryPassword = !showRecoveryPassword"
                      />
                      <v-layout class="mx-n2 align-center">
                        <v-flex v-if="!$vuetify.breakpoint.xsOnly" class="xs4 px-2"></v-flex>
                        <v-flex class="px-2 text-center" :class="$vuetify.breakpoint.xsOnly ? 'xs6' : 'xs4'"></v-flex>
                        <v-flex class="px-2" :class="$vuetify.breakpoint.xsOnly ? 'xs6' : 'xs4'">
                          <v-btn
                            :disabled="!validRecoveryPasswordForm"
                            block
                            large
                            color="torusBrand1"
                            class="white--text"
                            @click="onRecoverPassword"
                          >
                            Confirm
                          </v-btn>
                        </v-flex>
                      </v-layout>
                    </v-form>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
              <div class="caption text-right text_2--text">Skip, go to my Google Wallet first</div>
            </div>

            <div v-if="scenario === SCENARIO_LOGIN_DETECTED && !verifiedLogin">
              <div class="d-flex info-box py-3 px-6 mb-6">
                <div class="grow font-weight-bold body-2">Chrome V82.04103.61</div>
                <div class="ml-auto text-right caption">Reference ID: 1323</div>
              </div>
              <v-layout class="mx-n2 mb-12 align-center">
                <v-flex v-if="!$vuetify.breakpoint.xsOnly" class="xs4 px-2"></v-flex>
                <v-flex class="px-2 text-center" :class="$vuetify.breakpoint.xsOnly ? 'xs6' : 'xs4'">
                  <a class="caption" href="#" :style="{ textDecoration: 'none' }">Report, this is not me</a>
                </v-flex>
                <v-flex class="px-2" :class="$vuetify.breakpoint.xsOnly ? 'xs6' : 'xs4'">
                  <v-btn block large color="torusBrand1" class="white--text" @click="verifiedLogin = true">
                    Confirm
                  </v-btn>
                </v-flex>
              </v-layout>
            </div>

            <v-form v-if="scenario === SCENARIO_DEVICE_DETECTED" v-model="verifyDeviceForm">
              <div class="d-flex info-box py-3 px-6 mb-2 align-center">
                <div class="grow font-weight-bold body-2">Browser</div>
                <div class="ml-auto text-right caption">
                  <v-icon small class="mr-1">$vuetify.icons.device_detailed</v-icon>
                  Chrome V82.04103.61
                </div>
              </div>
              <v-select
                v-if="!verifiedDevice"
                v-model="verifiedDeviceSelected"
                class="font-weight-bold"
                outlined
                :items="devices"
                item-text="name"
                item-value="name"
                placeholder="Please specify device"
                append-icon="$vuetify.icons.select"
                :rules="[rules.required]"
              ></v-select>
              <div v-else class="d-flex info-box py-3 px-6 mb-2 align-center">
                <div class="grow font-weight-bold body-2">{{ verifiedDeviceSelected }}</div>
              </div>

              <v-layout v-if="!verifiedDevice" class="mx-n2 mb-12 align-center">
                <v-flex v-if="!$vuetify.breakpoint.xsOnly" class="xs4 px-2"></v-flex>
                <v-flex class="px-2 text-center" :class="$vuetify.breakpoint.xsOnly ? 'xs6' : 'xs4'">
                  <a class="caption text-decoration-none" :class="$vuetify.theme.dark ? 'torusFont1--text' : 'torusBrand1'">Do not add browser</a>
                </v-flex>
                <v-flex class="px-2" :class="$vuetify.breakpoint.xsOnly ? 'xs6' : 'xs4'">
                  <v-btn :disabled="!verifyDeviceForm" block large color="torusBrand1" class="white--text" @click="verifiedDevice = true">
                    Confirm and Add
                  </v-btn>
                </v-flex>
              </v-layout>
              <v-layout v-else class="mx-n2 mb-12 align-center">
                <v-flex v-if="!$vuetify.breakpoint.xsOnly" class="xs4 px-2"></v-flex>
                <v-flex class="px-2 text-center" :class="$vuetify.breakpoint.xsOnly ? 'xs6' : 'xs4'"></v-flex>
                <v-flex class="px-2" :class="$vuetify.breakpoint.xsOnly ? 'xs6' : 'xs4'">
                  <v-btn block large color="torusBrand1" class="white--text">
                    Return Home
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-form>

            <div class="tkey-footer">
              <hr class="mb-2" />
              <v-layout>
                <v-flex class="x6">
                  <div class="d-flex align-center">
                    <v-icon x-small class="mr-1">$vuetify.icons.lock_filled</v-icon>
                    <div class="caption">Secure Torus sign in</div>
                  </div>
                </v-flex>
                <v-flex class="x6 caption text-right">
                  Contact support
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
const SCENARIO_WITH_PASSWORD = 'with_password'
const SCENARIO_WITH_DEVICE = 'with_device'
const SCENARIO_LOGIN_DETECTED = 'login_detected'
const SCENARIO_DEVICE_DETECTED = 'new_device_detected'
const SCENARIO_ACCOUNT_RECOVERY = 'account_recovery'

export default {
  data() {
    return {
      scenario: SCENARIO_ACCOUNT_RECOVERY,
      // verify password
      validVerifyPasswordForm: true,
      verifyPassword: '',
      showVerifyPassword: false,
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
      // verified
      verifiedLogin: false,
      rules: {
        required: (value) => !!value || 'Required.',
      },
      SCENARIO_WITH_PASSWORD,
      SCENARIO_WITH_DEVICE,
      SCENARIO_LOGIN_DETECTED,
      SCENARIO_DEVICE_DETECTED,
      SCENARIO_ACCOUNT_RECOVERY,
    }
  },
  computed: {
    devices() {
      return [
        {
          id: 1,
          name: 'My Macbook',
          browsers: [
            {
              id: 1320,
              name: 'Chrome V82.04103.61',
            },
          ],
        },
        {
          id: 2,
          name: 'My Android',
          browsers: [
            {
              id: 1330,
              name: 'Chrome V82.04103.61',
            },
          ],
        },
        {
          id: 3,
          name: 'My Iphone',
          browsers: [
            {
              id: 1340,
              name: 'Chrome V82.04103.61',
            },
          ],
        },
      ]
    },
    hasPasswordSetUp() {
      return true
    },
  },
  methods: {
    onVerifyPassword() {
      if (this.devices.length > 1) {
        this.scenario = SCENARIO_WITH_DEVICE
        this.recoveredPassword = true
      } else {
        this.scenario = SCENARIO_DEVICE_DETECTED
      }
    },
    onAnotherMethod() {
      this.scenario = SCENARIO_WITH_DEVICE
    },
    onRecoverPassword() {
      this.recoveredPassword = true
    },
    verifiedWithDevice(deviceId) {
      // from backend
      // eslint-disable-next-line no-console
      console.log('device', deviceId)
      return false
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'TkeyNewDevice.scss';
</style>
