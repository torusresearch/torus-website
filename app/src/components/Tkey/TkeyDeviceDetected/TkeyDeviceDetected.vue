<template>
  <div>
    <v-container :class="[$vuetify.breakpoint.xsOnly ? 'pt-6 px-0' : 'pa-4']">
      <v-layout class="justify-center">
        <v-flex class="xs12 sm10 md8 lg7">
          <div class="new-device-container" :class="[$vuetify.breakpoint.xsOnly ? 'is-mobile' : '', { 'is-dark': $vuetify.theme.dark }]">
            <!-- IMAGE -->
            <div
              class="text-center"
              :class="$vuetify.breakpoint.xsOnly ? 'mb-7' : 'mb-6'"
              :style="{ height: $vuetify.breakpoint.xsOnly ? '66px' : '100px' }"
            >
              <img
                src="../../../assets/images/ob-verification-done.svg"
                alt="Verified"
                class="mr-2"
                :height="$vuetify.breakpoint.xsOnly ? '82' : '125'"
              />
            </div>

            <!-- TITLE -->
            <div>
              <div class="text-center new-device-header">
                <div class="new-device-header__title" :class="$vuetify.theme.dark ? 'torusFont2--text' : 'torusFont1--text'">
                  {{ t('tkeyNew.saveDevice') }}
                </div>
                <div class="new-device-header__description text_2--text">{{ t('tkeyNew.saveNewDevice') }}</div>
              </div>
            </div>
            <div>
              <v-tabs v-model="activeTab" height="30" centered :fixed-tabs="$vuetify.breakpoint.xsOnly" class="device-list-tab">
                <v-tab>{{ t($vuetify.breakpoint.xsOnly ? 'tkeyNew.newDevice' : 'tkeyNew.newDeviceLong') }}</v-tab>
                <v-tab>{{ t($vuetify.breakpoint.xsOnly ? 'tkeyNew.oldDevice' : 'tkeyNew.oldDeviceLong') }}</v-tab>
              </v-tabs>
              <v-tabs-items v-model="activeTab">
                <v-tab-item class="py-3">
                  <div
                    class="d-flex align-center info-box py-3 px-6"
                    :class="[{ 'is-dark': $vuetify.theme.dark, 'is-mobile': $vuetify.breakpoint.xsOnly }]"
                  >
                    <div class="mr-4">
                      <v-icon>$vuetify.icons.device_detailed</v-icon>
                    </div>
                    <div class="device-details">
                      <div class="grow d-flex align-center">
                        <span class="device-details--name mr-1">{{ browser.os.name }}</span>
                        <span class="device-details--index">({{ t('tkeyNew.currentDevice') }})</span>
                      </div>
                      <div class="grow device-details--list">{{ browser.browser.name }}</div>
                    </div>
                  </div>
                </v-tab-item>
                <v-tab-item class="py-3">
                  <v-menu offset-y bottom class="device-menu">
                    <template v-slot:activator="{ on }">
                      <div
                        class="d-flex align-center info-box info-box--link py-3 px-6"
                        :class="[{ 'is-dark': $vuetify.theme.dark, 'is-mobile': $vuetify.breakpoint.xsOnly }]"
                        v-on="on"
                      >
                        <div class="mr-4">
                          <v-icon>$vuetify.icons.device_detailed</v-icon>
                        </div>
                        <div class="device-details">
                          <div class="grow d-flex align-center">
                            <span class="device-details--name mr-1">{{ selectedDeviceDetails.osName }}</span>
                            <span class="device-details--index">({{ selectedDeviceDetails.indexShort }})</span>
                          </div>
                          <div class="grow device-details--index font-weight-regular">{{ selectedDeviceDetails.browserList }}</div>
                          <div class="grow device-details--index">{{ selectedDeviceDetails.dateFormated }}</div>
                        </div>
                        <div class="ml-auto">
                          <v-icon right>$vuetify.icons.select</v-icon>
                        </div>
                      </div>
                    </template>
                    <div
                      v-for="device in devices"
                      :key="device.index"
                      class="d-flex align-center info-box py-3 px-6 info-box--link info-box--menu"
                      :class="[{ 'is-dark': $vuetify.theme.dark, 'is-mobile': $vuetify.breakpoint.xsOnly }]"
                      @click="selectBrowser(device.index)"
                    >
                      <div class="mr-4">
                        <v-icon>$vuetify.icons.device_detailed</v-icon>
                      </div>
                      <div class="device-details">
                        <div class="grow d-flex align-center">
                          <span class="device-details--name mr-1">{{ device.osName }}</span>
                          <span class="device-details--index">({{ device.indexShort }})</span>
                        </div>
                        <div class="grow device-details--name font-weight-regular">{{ device.browserList }}</div>
                        <div class="grow device-details--index">{{ device.dateFormated }}</div>
                      </div>
                    </div>
                  </v-menu>
                </v-tab-item>
              </v-tabs-items>
            </div>
            <v-layout class="mx-n2 mb-12 align-center btn-container">
              <v-flex v-if="!$vuetify.breakpoint.smAndDown" class="xs6 lg4 px-2"></v-flex>
              <v-flex class="px-2 text-center xs5 sm6 lg4">
                <a
                  class="caption text-decoration-none"
                  :class="$vuetify.theme.dark ? 'torusFont1--text' : 'torusBrand1--text'"
                  @click="doNotSaveDevice"
                >
                  {{ t('tkeyNew.doNotSave') }}
                </a>
              </v-flex>
              <v-flex class="px-2 xs7 sm6 lg4">
                <v-btn :loading="isConfirming" block large color="torusBrand1" class="caption font-weight-bold white--text" @click="confirm">
                  {{ t('tkeyNew.confirmAndSave') }}
                </v-btn>
              </v-flex>
            </v-layout>
            <NewDeviceFooter />
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import bowser from 'bowser'

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
  },
  data() {
    return {
      activeTab: 0,
      selectedDevice: '',
      isConfirming: false,
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
    browser() {
      return bowser.parse(window.navigator.userAgent)
    },
    selectedDeviceDetails() {
      return this.devices.find((x) => x.index === this.selectedDevice) || {}
    },
  },
  beforeDestroy() {
    this.isConfirming = false
  },
  mounted() {
    this.selectedDevice = this.devices[0].index
  },
  methods: {
    selectBrowser(index) {
      this.selectedDevice = index
    },
    confirm() {
      this.triggerSetDeviceFlow({ isOld: !!this.activeTab, oldIndex: this.selectedDevice })
    },
    doNotSaveDevice() {
      this.triggerSetDeviceFlow({ rejected: true })
    },
    async triggerSetDeviceFlow(details) {
      if (this.isConfirming) return
      this.isConfirming = true
      this.$emit('storeDevice', details)
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'TkeyDeviceDetected.scss';
</style>
