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
        <div class="grow text_2--text d-flex align-center">
          <v-icon :size="$vuetify.breakpoint.xsOnly ? '16' : ''" class="mr-1">$vuetify.icons.device_{{ platformType }}</v-icon>
          <span class="font-weight-bold" :class="$vuetify.breakpoint.xsOnly ? 'caption' : 'body-2'">{{ browserName }}</span>
        </div>
        <div class="ml-auto text-right text_2--text caption">{{ t('tkeyNew.refId') }}: {{ shortIndex }}</div>
      </div>
      <div class="text-right caption mb-6 text_2--text">
        {{ t('tkeyNew.reportNotMe1') }},
        <a>{{ t('tkeyNew.reportNotMe2') }}</a>
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
    browserName() {
      return this.currentTkeyConfirmDialog.browserDetail
        ? `${this.currentTkeyConfirmDialog.browserDetail.browser.name} V${this.currentTkeyConfirmDialog.browserDetail.browser.version}`
        : ''
    },
    platformType() {
      return this.currentTkeyConfirmDialog.browserDetail ? this.currentTkeyConfirmDialog.browserDetail.platform.type : 'desktop'
    },
    shortIndex() {
      return this.deviceShareIndex.slice(0, 5)
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
