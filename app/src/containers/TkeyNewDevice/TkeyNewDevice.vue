<template>
  <div>
    <v-container class="pa-4">
      <v-layout class="justify-center">
        <v-flex class="xs7">
          <div class="elevation-1 pa-10">
            <div class="text-center mb-10">
              <img src="../../assets/images/ob-verification.svg" alt="Verification Required" class="mr-2" />
            </div>
            <div class="text-center mb-10">
              <img src="../../assets/images/ob-verification-done.svg" alt="Verification Required" class="mr-2" />
            </div>

            <div class="text-center mb-6">
              <div class="display-1 text_1--text mb-4">Verification required</div>
              <div class="headline font-weight-regular text_2--text">You are accessing your 2FA Wallet from a new platform.</div>
              <div class="headline font-weight-regular text_2--text">
                <span class="font-weight-bold">Verify your identity</span>
                with your password:
              </div>
            </div>

            <!-- Scenarios -->
            <!-- Returning user
              New device
              with password set up
              rmb password
              2/3, 2/4 -->
            <div>
              <div class="d-flex info-box py-3 px-6 mb-2">
                <div class="grow font-weight-bold body-2 text_2--text">Browser</div>
                <div class="ml-auto text-right caption text_2--text">Chrome V82.04103.61</div>
              </div>
              <v-select outlined placeholder="Please specify device"></v-select>
            </div>
            <div>
              <v-text-field type="password" outlined placeholder="Enter Password here" />
            </div>

            <!-- Returning user
              New device
              no password set up
              2/2 -->
            <div>
              <v-expansion-panels multiple>
                <v-expansion-panel class="mb-2">
                  <v-expansion-panel-header class="py-2">
                    <div class="grow font-weight-bold body-2 text_2--text">Device - Mac OS</div>
                    <v-icon small class="d-inline-flex ml-auto success--text shrink" v-text="'$vuetify.icons.check_circle_filled'" />
                  </v-expansion-panel-header>
                  <v-expansion-panel-content class="pa-5">
                    <div class="body-2 text_2--text mb-4">
                      Login to app.tor.us from the stored browser below to verify your identity.
                    </div>

                    <div class="d-flex info-box py-3 px-6 mb-2">
                      <div class="grow font-weight-bold body-2 text_2--text">Chrome V82.04103.61</div>
                      <div class="ml-auto text-right caption text_2--text">Reference ID: 1323</div>
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </div>

            <div>
              <div class="d-flex info-box py-3 px-6 mb-2">
                <div class="grow font-weight-bold body-2 text_2--text">Chrome V82.04103.61</div>
                <div class="ml-auto text-right caption text_2--text">Reference ID: 1323</div>
              </div>
            </div>
            <div class="headline font-weight-regular text_2--text text-center">
              Return to your new platform to continue with the login
            </div>

            <v-layout class="mx-n2 mt-10 mb-12 align-center">
              <v-flex class="xs4 px-2"></v-flex>
              <v-flex class="xs4 px-2">
                <a class="caption" href="#" :style="{ textDecoration: 'none' }">Verify via another method</a>
              </v-flex>
              <v-flex class="xs4 px-2">
                <v-btn block large color="torusBrand1" class="white--text">Confirm</v-btn>
              </v-flex>
            </v-layout>

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
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
@import 'TkeyNewDevice.scss';
</style>
