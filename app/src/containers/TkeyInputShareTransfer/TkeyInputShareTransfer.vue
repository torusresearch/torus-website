<template>
  <div>
    <v-container :class="[$vuetify.breakpoint.xsOnly ? 'pa-0' : 'pa-4']">
      <v-layout class="justify-center">
        <v-flex :class="[$vuetify.breakpoint.xsOnly ? 'xs12' : 'xs7']">
          <div class="new-device-container" :class="[$vuetify.breakpoint.xsOnly ? 'is-mobile' : '', { 'is-dark': $vuetify.theme.dark }]">
            <!-- IMAGE -->
            <div class="text-center">
              <img src="../../assets/images/ob-verification-methods.svg" alt="Verification Methods" class="mr-2" />
            </div>

            <!-- TITLE -->
            <div class="text-center new-device-header">
              <template>
                <div class="new-device-header__title">{{ t('tkeyNew.verificationMethods') }}</div>
                <div class="new-device-header__description">
                  {{ t('tkeyNew.youRequireNum').replace('{num}', tKeyStore.keyDetails.threshold) }}
                </div>
                <div class="new-device-header__description">
                  <span class="font-weight-bold">{{ t('tkeyNew.verifyYourIdentity') }}</span>
                  {{ t('tkeyNew.verifyWithAny') }}:
                </div>
              </template>
            </div>

            <div>
              <v-expansion-panels>
                <v-expansion-panel v-for="device in devices" :key="device.index" class="mb-2">
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
                    <v-icon small class="d-inline-flex ml-auto shrink" v-text="'$vuetify.icons.select'" />
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
                      <div class="ml-auto text-right caption">{{ t('tkeyNew.refId') }}: {{ browser.dateAdded }}</div>
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <!-- If user has password setup -->
                <v-expansion-panel v-if="hasPasswordSetUp" class="mb-2">
                  <v-expansion-panel-header class="py-2">
                    <div class="grow font-weight-bold body-2 text_2--text">
                      <v-icon class="mr-1">$vuetify.icons.password</v-icon>
                      {{ t('tkeyNew.recoveryPass') }}
                    </div>
                    <v-icon
                      v-if="recoveryPasswordSucess"
                      small
                      class="d-inline-flex ml-auto success--text shrink"
                      v-text="'$vuetify.icons.check_circle_filled'"
                    />
                    <v-icon v-else small class="d-inline-flex ml-auto shrink" v-text="'$vuetify.icons.select'" />
                  </v-expansion-panel-header>
                  <v-expansion-panel-content class="pa-5">
                    <v-form v-model="validPasswordForm">
                      <v-text-field
                        v-model="recoveryPassword"
                        :readonly="!!finalRecoveryPassword"
                        :append-icon="showRecoveryPassword ? '$vuetify.icons.visibility_off' : '$vuetify.icons.visibility_on'"
                        :type="showRecoveryPassword ? 'text' : 'password'"
                        :rules="[rules.required, rules.minLength]"
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
                        :rules="[rules.required, equalToPassword]"
                        outlined
                        :placeholder="t('tkeyCreateSetup.confirmPassword')"
                        @click:append="showRecoveryPasswordConfirm = !showRecoveryPasswordConfirm"
                      />
                      <div class="text-right">
                        <v-btn
                          v-if="!finalRecoveryPassword"
                          type="button"
                          :disabled="!validPasswordForm"
                          class="caption white--text font-weight-bold px-10"
                          color="torusBrand1"
                          @click="setFinalPassword"
                        >
                          Confirm
                        </v-btn>
                      </div>
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
/* eslint-disable max-len */
// import { mapState } from 'vuex'

import { passwordValidation } from '../../utils/utils'

// FOR TESTING
const TKEY_STORE = {
  tKey: {
    shares: {
      '034505b3e2e18779f9e870aa5fd0cbc19dbad6016d49a406a72bf9e8f2664dd92c|039381067019534cc7a69f117cae7afbf559845299242a3148ef7f99422c87259b': {
        1: {
          share: { share: 'a052ec69d4e3c9153372013fd59035bc2d620700749a2253d6f54854680871f4', shareIndex: '1' },
          polynomialID:
            '034505b3e2e18779f9e870aa5fd0cbc19dbad6016d49a406a72bf9e8f2664dd92c|039381067019534cc7a69f117cae7afbf559845299242a3148ef7f99422c87259b',
        },
        b26065242571c9d5816ef0c10916a766cb935c9b3b1e5384872859142f59cdb2: {
          share: {
            share: '9a307fe9153cc8cfe484d31a6a8150dd481183879c9cd3b9719444c951945234',
            shareIndex: 'b26065242571c9d5816ef0c10916a766cb935c9b3b1e5384872859142f59cdb2',
          },
          polynomialID:
            '034505b3e2e18779f9e870aa5fd0cbc19dbad6016d49a406a72bf9e8f2664dd92c|039381067019534cc7a69f117cae7afbf559845299242a3148ef7f99422c87259b',
        },
      },
      '034505b3e2e18779f9e870aa5fd0cbc19dbad6016d49a406a72bf9e8f2664dd92c|0304111756a3198bd8654fd45786af96630c98eb9f6d2c81536438e102074ccff0': {
        1: {
          share: { share: 'cd9218832d59ed46760fc5beef9f5014e5d3a8734d5b19f3ee3a57367f9d9cac', shareIndex: '1' },
          polynomialID:
            '034505b3e2e18779f9e870aa5fd0cbc19dbad6016d49a406a72bf9e8f2664dd92c|0304111756a3198bd8654fd45786af96630c98eb9f6d2c81536438e102074ccff0',
        },
        b26065242571c9d5816ef0c10916a766cb935c9b3b1e5384872859142f59cdb2: {
          share: {
            share: '486455175643d8b39a131e7c4244aced70ad607a23f34a5897f2ed3e522c4bea',
            shareIndex: 'b26065242571c9d5816ef0c10916a766cb935c9b3b1e5384872859142f59cdb2',
          },
          polynomialID:
            '034505b3e2e18779f9e870aa5fd0cbc19dbad6016d49a406a72bf9e8f2664dd92c|0304111756a3198bd8654fd45786af96630c98eb9f6d2c81536438e102074ccff0',
        },
        '7f824fa4e20d310224b67727e6eb2a5e14048ccdc4c012e2be53d1cdb4be4154': {
          share: {
            share: 'c06685cec3d9afbc2aece726ee232d348e33c86c1e074132e826b8a52455085b',
            shareIndex: '7f824fa4e20d310224b67727e6eb2a5e14048ccdc4c012e2be53d1cdb4be4154',
          },
          polynomialID:
            '034505b3e2e18779f9e870aa5fd0cbc19dbad6016d49a406a72bf9e8f2664dd92c|0304111756a3198bd8654fd45786af96630c98eb9f6d2c81536438e102074ccff0',
        },
      },
    },
    enableLogging: false,
    privKey: '1fb557390c17669af1f5ea0590b9a22d6db8962b6ce04c793fa06cb1373d51bf',
    metadata: {
      pubKey: '034505b3e2e18779f9e870aa5fd0cbc19dbad6016d49a406a72bf9e8f2664dd92c',
      polyIDList: [
        '034505b3e2e18779f9e870aa5fd0cbc19dbad6016d49a406a72bf9e8f2664dd92c|039381067019534cc7a69f117cae7afbf559845299242a3148ef7f99422c87259b|0x0|1|b26065242571c9d5816ef0c10916a766cb935c9b3b1e5384872859142f59cdb2',
        '034505b3e2e18779f9e870aa5fd0cbc19dbad6016d49a406a72bf9e8f2664dd92c|0304111756a3198bd8654fd45786af96630c98eb9f6d2c81536438e102074ccff0|0x0|1|7f824fa4e20d310224b67727e6eb2a5e14048ccdc4c012e2be53d1cdb4be4154|b26065242571c9d5816ef0c10916a766cb935c9b3b1e5384872859142f59cdb2',
      ],
      scopedStore: {},
      generalStore: {
        securityQuestions: {
          nonce: '53c28c281f53d089d4b847cc2910bfeaad6b56d2b02038c573b951092cea203d',
          polynomialID:
            '034505b3e2e18779f9e870aa5fd0cbc19dbad6016d49a406a72bf9e8f2664dd92c|0304111756a3198bd8654fd45786af96630c98eb9f6d2c81536438e102074ccff0',
          questions: 'what is your password?',
          shareIndex: '7f824fa4e20d310224b67727e6eb2a5e14048ccdc4c012e2be53d1cdb4be4154',
          sqPublicShare: {
            shareCommitment: {
              x: '1dba0b39c0eea77670a2723e3e7f95ce6d0abb3e9d282234dbb52920e2f213fd',
              y: '6879e7a01d0766fbd7dec8a972d00a76e98fafd69ed349e32c90ecc0c6182718',
            },
            shareIndex: '7f824fa4e20d310224b67727e6eb2a5e14048ccdc4c012e2be53d1cdb4be4154',
          },
        },
        shareDescriptions: {
          '7f824fa4e20d310224b67727e6eb2a5e14048ccdc4c012e2be53d1cdb4be4154': [
            '{"module":"securityQuestions","questions":"what is your password?","dateAdded":1601888928747}',
          ],
          b26065242571c9d5816ef0c10916a766cb935c9b3b1e5384872859142f59cdb2: [
            '{"module":"webStorage","userAgent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36","dateAdded":1601888926595}',
          ],
        },
      },
      tkeyStore: {},
    },
  },
  settingsPageData: {
    deviceShare: {
      available: true,
      share: {
        share: {
          share: '9a307fe9153cc8cfe484d31a6a8150dd481183879c9cd3b9719444c951945234',
          shareIndex: 'b26065242571c9d5816ef0c10916a766cb935c9b3b1e5384872859142f59cdb2',
        },
        polynomialID:
          '034505b3e2e18779f9e870aa5fd0cbc19dbad6016d49a406a72bf9e8f2664dd92c|039381067019534cc7a69f117cae7afbf559845299242a3148ef7f99422c87259b',
      },
    },
    allDeviceShares: {
      b26065242571c9d5816ef0c10916a766cb935c9b3b1e5384872859142f59cdb2: {
        index: 'b26065242571c9d5816ef0c10916a766cb935c9b3b1e5384872859142f59cdb2',
        osName: 'macOS (b2606)',
        icon: 'desktop',
        groupTitle: 'Web Storage - macOS Chrome',
        dateAdded: 1601888926595,
        browsers: [
          {
            module: 'webStorage',
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36',
            dateAdded: 1601888926595,
            shareIndex: 'b26065242571c9d5816ef0c10916a766cb935c9b3b1e5384872859142f59cdb2',
            title: 'Chrome 10/5/2020, 5:08:46 PM',
            browserName: 'Chrome',
          },
        ],
      },
    },
    passwordShare: { available: true },
    threshold: '2/3',
  },
  parsedShareDescriptions: [
    {
      module: 'webStorage',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36',
      dateAdded: 1601888926595,
      shareIndex: 'b26065242571c9d5816ef0c10916a766cb935c9b3b1e5384872859142f59cdb2',
      title: 'Chrome 10/5/2020, 5:08:46 PM',
      browserName: 'Chrome',
    },
    {
      module: 'securityQuestions',
      questions: 'what is your password?',
      dateAdded: 1601888928747,
      shareIndex: '7f824fa4e20d310224b67727e6eb2a5e14048ccdc4c012e2be53d1cdb4be4154',
    },
  ],
  keyDetails: {
    pubKey: {
      x: '4505b3e2e18779f9e870aa5fd0cbc19dbad6016d49a406a72bf9e8f2664dd92c',
      y: '63f0537e07be6fd652a8f84f7f7442eab0e8923ced7950462f023d12bcd11b5f',
    },
    requiredShares: -1,
    threshold: 2,
    totalShares: 3,
    shareDescriptions: {
      '7f824fa4e20d310224b67727e6eb2a5e14048ccdc4c012e2be53d1cdb4be4154': [
        '{"module":"securityQuestions","questions":"what is your password?","dateAdded":1601888928747}',
      ],
      b26065242571c9d5816ef0c10916a766cb935c9b3b1e5384872859142f59cdb2: [
        '{"module":"webStorage","userAgent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36","dateAdded":1601888926595}',
      ],
    },
    modules: {
      securityQuestions: { moduleName: 'securityQuestions', tbSDK: { storageLayer: { enableLogging: false, hostUrl: 'https://metadata.tor.us' } } },
      webStorage: {
        moduleName: 'webStorage',
        canUseChromeStorage: true,
        tbSDK: { storageLayer: { enableLogging: false, hostUrl: 'https://metadata.tor.us' } },
      },
    },
  },
}

export default {
  data() {
    return {
      tKeyStore: TKEY_STORE,
      validPasswordForm: true,
      recoveryPassword: '',
      finalRecoveryPassword: '',
      showRecoveryPassword: false,
      recoveryPasswordConfirm: '',
      showRecoveryPasswordConfirm: false,
      recoveryPasswordSucess: false,
      rules: {
        required: (value) => !!value || this.t('tkeyNew.required'),
        minLength: (v) => passwordValidation(v) || this.t('tkeyCreateSetup.passwordRules'),
        equalToPassword: (value) => value === this.recoveryPassword || this.t('tkeyCreateSetup.passwordMatch'),
      },
    }
  },
  computed: {
    // ...mapState(['tKeyStore']),
    devices() {
      if (!this.tKeyStore.settingsPageData) return []
      const { allDeviceShares } = this.tKeyStore.settingsPageData
      return Object.keys(allDeviceShares)
        .map((x) => {
          const share = allDeviceShares[x]
          const dateFormated = new Date(share.dateAdded).toLocaleString()
          share.browserList = share.browsers.map((browser) => browser.browserName).join(', ')
          share.dateFormated = dateFormated
          return share
        })
        .sort((a, b) => b.dateAdded - a.dateAdded)
    },
    equalToPassword() {
      return this.recoveryPasswordConfirm === this.recoveryPassword || this.t('tkeyCreateSetup.passwordMatch')
    },
    hasPasswordSetUp() {
      // Check if user has a password
      return true
    },
  },
  methods: {
    setFinalPassword() {
      // Set new password
      this.recoveryPasswordSucess = true
    },
    verifiedWithDevice() {
      return false
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'TkeyInputShareTransfer.scss';
</style>
