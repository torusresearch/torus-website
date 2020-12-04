<template>
  <v-dialog :value="showTkeyConfirmDialog" width="635" persistent>
    <v-card class="tkey-confirm-dialog" :class="[$vuetify.breakpoint.xsOnly ? 'is-mobile' : '', { 'is-dark': $vuetify.theme.dark }]">
      <!-- IMAGE -->
      <div
        class="text-center"
        :class="$vuetify.breakpoint.xsOnly ? 'mb-6' : 'mb-4'"
        :style="{ height: $vuetify.breakpoint.xsOnly ? '66px' : '100px' }"
      >
        <img
          src="../../../assets/images/ob-verification.svg"
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
            {{ t('tkeyNew.newLoginTrying') }}
          </div>
          <div class="new-device-header__description">
            <span class="font-weight-bold">{{ t('tkeyNew.matchRefId1') }}</span>
            {{ t('tkeyNew.matchRefId2') }}
          </div>
        </template>
      </div>

      <div class="d-flex info-box mb-2 align-center">
        <div class="grow d-flex align-center">
          <v-icon :size="$vuetify.breakpoint.xsOnly ? '16' : ''" class="text_2--text mr-2">
            $vuetify.icons.device_{{ confirmDetails.platformType }}
          </v-icon>
          <div>
            <div class="font-weight-bold text_2--text">
              <div :class="$vuetify.breakpoint.xsOnly ? 'caption' : 'body-2'">{{ confirmDetails.browserName }}</div>
              <div class="font-weight-regular caption-3">{{ confirmDetails.timestamp }}</div>
            </div>
            <div v-if="$vuetify.breakpoint.xsOnly" class="text_2--text caption-3">{{ t('tkeyNew.refId') }}: {{ confirmDetails.shortIndex }}</div>
          </div>
        </div>
        <div v-if="!$vuetify.breakpoint.xsOnly" class="ml-auto text-right text_2--text caption">
          {{ t('tkeyNew.refId') }}: {{ confirmDetails.shortIndex }}
        </div>
      </div>
      <div class="text-right caption mb-6 text_2--text">
        {{ t('tkeyNew.reportNotMe1') }},
        <a href="mailto:hello@tor.us" class="text-decoration-none" target="_blank" rel="noreferrer noopener">
          {{ t('tkeyNew.reportNotMe2') }}
        </a>
      </div>
      <v-layout class="mx-n2 mb-12 align-center">
        <v-flex class="px-2 text-center xs6">
          <a class="caption text-decoration-none" :class="$vuetify.theme.dark ? 'torusFont1--text' : 'torusBrand1--text'" @click="cancel">
            {{ t('tkeyNew.cancel') }}
          </a>
        </v-flex>
        <v-flex class="px-2 xs6">
          <v-btn block large color="torusBrand1" class="caption font-weight-bold white--text" @click="confirm">{{ t('tkeyNew.confirm') }}</v-btn>
        </v-flex>
      </v-layout>
      <NewDeviceFooter />
    </v-card>
  </v-dialog>
</template>

<script>
import NewDeviceFooter from '../NewDeviceFooter'

export default {
  components: { NewDeviceFooter },
  props: {
    showTkeyConfirmDialog: {
      type: Boolean,
      default: false,
    },
    currentTkeyConfirmDialog: {
      type: Object,
      default() {
        return {}
      },
    },
    deviceShareIndex: {
      type: String,
      default: '',
    },
  },
  computed: {
    confirmDetails() {
      const shortIndex = this.deviceShareIndex.toString().slice(0, 4)
      return {
        shortIndex,
        timestamp: new Date(this.currentTkeyConfirmDialog.timestamp).toLocaleString(),
        browserName: this.currentTkeyConfirmDialog.browserDetail
          ? `${this.currentTkeyConfirmDialog.browserDetail.browser.name} V${this.currentTkeyConfirmDialog.browserDetail.browser.version}`
          : '',
        platformType: this.currentTkeyConfirmDialog.browserDetail ? this.currentTkeyConfirmDialog.browserDetail.platform.type : 'desktop',
      }
    },
  },
  methods: {
    cancel() {
      this.$emit('denyShareTransfer', this.currentTkeyConfirmDialog.encPubKeyX)
    },
    confirm() {
      this.$emit('confirmShareTransfer', this.currentTkeyConfirmDialog.encPubKeyX)
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'TkeyConfirmLogin.scss';
</style>
