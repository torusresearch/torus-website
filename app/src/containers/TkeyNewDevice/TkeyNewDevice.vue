<template>
  <div>
    <v-container class="pa-4">
      <v-layout class="justify-center">
        <v-flex class="xs7">
          <div class="new-device-container elevation-1 pa-10">
            <div v-if="scenario === SCENARIO_FORGET_PASSWORD" class="text-center mb-2">
              <img src="../../assets/images/ob-verification-forget.svg" alt="Verification Required" class="mr-2" />
            </div>
            <div v-else-if="scenario === SCENARIO_DEVICE_DETECTED" class="text-center mb-2">
              <img src="../../assets/images/ob-verification-done.svg" alt="Verification Required" class="mr-2" />
            </div>
            <div v-else-if="verifiedPassword || verifiedLogin" class="text-center mb-10">
              <img src="../../assets/images/ob-verification-done.svg" alt="Verification Required" class="mr-2" />
            </div>
            <div v-else class="text-center mb-10">
              <img src="../../assets/images/ob-verification.svg" alt="Verification Required" class="mr-2" />
            </div>

            <div v-if="scenario === SCENARIO_FORGET_PASSWORD || scenario === SCENARIO_WITHOUT_PASSWORD" class="text-center mb-6">
              <div class="display-1 text_1--text mb-4">Verification methods</div>
              <div class="headline font-weight-regular text_2--text">You require 1 verification to access your 2FA Wallet.</div>
              <div class="headline font-weight-regular text_2--text">
                <span class="font-weight-bold">Verify your identity</span>
                with any of the following:
              </div>
            </div>
            <div v-else-if="scenario === SCENARIO_LOGIN_DETECTED" class="text-center mb-6">
              <template v-if="verifiedLogin">
                <div class="display-1 text_1--text mb-4">Identity verified</div>
                <div class="headline font-weight-regular text_2--text mb-15">Return to your new platform to continue with the login</div>
              </template>
              <template v-else>
                <div class="display-1 text_1--text mb-4">New login detected</div>
                <div class="headline font-weight-regular text_2--text">A new login is trying to access your 2FA Wallet.</div>
                <div class="headline font-weight-regular text_2--text">
                  <span class="font-weight-bold">Match the Reference ID</span>
                  and confirm this is you:
                </div>
              </template>
            </div>
            <div v-else-if="scenario === SCENARIO_DEVICE_DETECTED">
              <div v-if="verifiedDevice" class="text-center mb-6">
                <div class="display-1 text_1--text mb-4">New device and browser added</div>
                <div class="headline font-weight-regular text_2--text">The following has been added as an authenticator.</div>
                <div class="headline font-weight-regular text_2--text">You can edit it from the ‘Settings’ page.</div>
              </div>
              <div v-else class="text-center mb-6">
                <div class="display-1 text_1--text mb-4">Verified</div>
                <div class="headline font-weight-regular text_2--text">Confirm your browser and device details.</div>
                <div class="headline font-weight-regular text_2--text">Store it for future access into your 2FA Wallet.</div>
              </div>
            </div>
            <template v-else>
              <div v-if="verifiedPassword" class="text-center mb-6">
                <div class="display-1 text_1--text mb-4">Verified</div>
                <div class="headline font-weight-regular text_2--text">Confirm your browser and device details.</div>
                <div class="headline font-weight-regular text_2--text">Store it for future access into your 2FA Wallet.</div>
              </div>
              <div v-else class="text-center mb-6">
                <div class="display-1 text_1--text mb-4">Verification required</div>
                <div class="headline font-weight-regular text_2--text">You are accessing your 2FA Wallet from a new platform.</div>
                <div class="headline font-weight-regular text_2--text">
                  <span class="font-weight-bold">Verify your identity</span>
                  with your password:
                </div>
              </div>
            </template>

            <!-- Scenarios -->
            <!-- Returning user
            New device
            with password set up
            rmb password
            2/3, 2/4 -->
            <div v-if="scenario === SCENARIO_WITH_PASSWORD">
              <div v-if="verifiedPassword">
                <div class="d-flex info-box py-3 px-6 mb-2">
                  <div class="grow font-weight-bold body-2 text_2--text">Browser</div>
                  <div class="ml-auto text-right caption text_2--text">Chrome V82.04103.61</div>
                </div>
                <v-select outlined placeholder="Please specify device"></v-select>
              </div>
              <v-form v-else v-model="validVerifyPasswordForm">
                <v-text-field
                  v-model="verifyPassword"
                  :append-icon="showVerifyPassword ? '$vuetify.icons.visibility_on' : '$vuetify.icons.visibility_off'"
                  :type="showVerifyPassword ? 'text' : 'password'"
                  :rules="[rules.required]"
                  outlined
                  placeholder="Enter Password here"
                  @click:append="showVerifyPassword = !showVerifyPassword"
                />
                <v-layout class="mx-n2 mb-12 align-center">
                  <v-flex class="xs4 px-2"></v-flex>
                  <v-flex class="xs4 px-2">
                    <a class="caption" href="#" :style="{ textDecoration: 'none' }">Verify via another method</a>
                  </v-flex>
                  <v-flex class="xs4 px-2">
                    <v-btn :disabled="!validVerifyPasswordForm" block large color="torusBrand1" class="white--text" @click="verifiedPassword = true">
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
            <div v-if="scenario === SCENARIO_WITHOUT_PASSWORD">
              <v-expansion-panels multiple>
                <v-expansion-panel class="mb-2">
                  <v-expansion-panel-header class="py-2">
                    <div class="grow font-weight-bold body-2 text_2--text">
                      <v-icon class="mr-1">$vuetify.icons.device_detailed</v-icon>
                      Device - Mac OS
                    </div>
                    <v-icon small class="d-inline-flex ml-auto success--text shrink" v-text="'$vuetify.icons.check_circle_filled'" />
                  </v-expansion-panel-header>
                  <v-expansion-panel-content class="pa-5">
                    <div class="body-2 text_2--text mb-4">
                      Login to app.tor.us from the stored browser below to verify your identity.
                    </div>

                    <div class="d-flex info-box py-3 px-6 mb-2 align-center">
                      <div class="grow font-weight-bold body-2 text_2--text">
                        <v-icon class="mr-1">$vuetify.icons.device</v-icon>
                        Chrome V82.04103.61
                      </div>
                      <div class="ml-auto text-right caption text_2--text">Reference ID: 1323</div>
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
              <div class="caption text-right text_2--text">Skip, go to my Google Wallet first</div>
            </div>

            <div v-if="scenario === SCENARIO_FORGET_PASSWORD">
              <v-expansion-panels multiple>
                <v-expansion-panel class="mb-2">
                  <v-expansion-panel-header class="py-2">
                    <div class="grow font-weight-bold body-2 text_2--text">
                      <v-icon class="mr-1">$vuetify.icons.device_detailed</v-icon>
                      Device - Mac OS
                    </div>
                    <v-icon small class="d-inline-flex ml-auto shrink" v-text="'$vuetify.icons.select'" />
                    <v-icon small class="d-inline-flex ml-auto success--text shrink" v-text="'$vuetify.icons.check_circle_filled'" />
                  </v-expansion-panel-header>
                  <v-expansion-panel-content class="pa-5">
                    <div class="body-2 text_2--text mb-4">
                      Login to app.tor.us from the stored browser below to verify your identity.
                    </div>

                    <div class="d-flex info-box py-3 px-6 mb-2 align-center">
                      <div class="grow font-weight-bold body-2 text_2--text">
                        <v-icon class="mr-1">$vuetify.icons.device</v-icon>
                        Chrome V82.04103.61
                      </div>
                      <div class="ml-auto text-right caption text_2--text">Reference ID: 1323</div>
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel class="mb-2">
                  <v-expansion-panel-header class="py-2">
                    <div class="grow font-weight-bold body-2 text_2--text">
                      <v-icon class="mr-1">$vuetify.icons.password</v-icon>
                      Recovery Password
                    </div>
                    <v-icon small class="d-inline-flex ml-auto shrink" v-text="'$vuetify.icons.select'" />
                    <v-icon small class="d-inline-flex ml-auto success--text shrink" v-text="'$vuetify.icons.check_circle_filled'" />
                  </v-expansion-panel-header>
                  <v-expansion-panel-content class="pa-5">
                    <div class="body-2 text_2--text mb-4">
                      Login to app.tor.us from the stored browser below to verify your identity.
                    </div>

                    <div class="d-flex info-box py-3 px-6 mb-2 align-center">
                      <div class="grow font-weight-bold body-2 text_2--text">
                        <v-icon class="mr-1">$vuetify.icons.device</v-icon>
                        Chrome V82.04103.61
                      </div>
                      <div class="ml-auto text-right caption text_2--text">Reference ID: 1323</div>
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
              <div class="caption text-right text_2--text">Skip, go to my Google Wallet first</div>
            </div>

            <div v-if="scenario === SCENARIO_LOGIN_DETECTED && !verifiedLogin">
              <div class="d-flex info-box py-3 px-6">
                <div class="grow font-weight-bold body-2 text_2--text">Chrome V82.04103.61</div>
                <div class="ml-auto text-right caption text_2--text">Reference ID: 1323</div>
              </div>
              <v-layout class="mx-n2 mb-12 align-center">
                <v-flex class="xs4 px-2"></v-flex>
                <v-flex class="xs4 px-2"></v-flex>
                <v-flex class="xs4 px-2">
                  <v-btn block large color="torusBrand1" class="white--text" @click="verifiedLogin = true">
                    Confirm
                  </v-btn>
                </v-flex>
              </v-layout>
            </div>

            <div v-if="scenario === SCENARIO_DEVICE_DETECTED">
              <div class="d-flex info-box py-3 px-6 mb-2">
                <div class="grow font-weight-bold body-2 text_2--text">Browser</div>
                <div class="ml-auto text-right caption text_2--text">Chrome V82.04103.61</div>
              </div>
              <v-expansion-panels multiple>
                <v-expansion-panel class="mb-2" :disabled="verifiedDevice">
                  <v-expansion-panel-header class="py-2">
                    <div class="grow font-weight-bold body-2 text_2--text">
                      Your Macbook
                    </div>
                    <v-icon v-if="!verifiedDevice" small class="d-inline-flex ml-auto shrink" v-text="'$vuetify.icons.select'" />
                  </v-expansion-panel-header>
                  <v-expansion-panel-content class="pa-5">
                    <div class="d-flex info-box py-3 px-6 mb-2 align-center">
                      <div class="grow font-weight-bold body-2 text_2--text">
                        <v-icon class="mr-1">$vuetify.icons.device</v-icon>
                        Chrome V82.04103.61
                      </div>
                      <div class="ml-auto text-right caption text_2--text">Reference ID: 1323</div>
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
              <v-layout class="mx-n2 mb-12 align-center">
                <v-flex class="xs4 px-2"></v-flex>
                <v-flex class="xs4 px-2 text-center">
                  <a v-if="!verifiedDevice" class="caption" href="#" :style="{ textDecoration: 'none' }">Do not add browser</a>
                </v-flex>
                <v-flex class="xs4 px-2">
                  <v-btn block large color="torusBrand1" class="white--text" @click="verifiedDevice = true">
                    Confirm and Add
                  </v-btn>
                </v-flex>
              </v-layout>
            </div>

            <div class="tkey-footer">
              <hr class="mb-2" />
              <v-layout class="px-5">
                <v-flex class="x6">
                  <div class="d-flex align-center">
                    <v-icon x-small class="mr-1">$vuetify.icons.lock</v-icon>
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
const SCENARIO_WITHOUT_PASSWORD = 'without_password'
const SCENARIO_FORGET_PASSWORD = 'forget_password'
const SCENARIO_LOGIN_DETECTED = 'login_detected'
const SCENARIO_DEVICE_DETECTED = 'new_device_detected'

export default {
  data() {
    return {
      scenario: SCENARIO_FORGET_PASSWORD,
      verifiedPassword: false,
      validVerifyPasswordForm: true,
      verifyPassword: '',
      showVerifyPassword: false,
      verifiedLogin: false,
      verifiedDevice: false,
      rules: {
        required: (value) => !!value || 'Required.',
      },
      SCENARIO_WITH_PASSWORD,
      SCENARIO_WITHOUT_PASSWORD,
      SCENARIO_FORGET_PASSWORD,
      SCENARIO_LOGIN_DETECTED,
      SCENARIO_DEVICE_DETECTED,
    }
  },
}
</script>

<style lang="scss" scoped>
@import 'TkeyNewDevice.scss';
</style>
