<template>
  <v-container class="permission-container px-0 py-6">
    <v-row wrap>
      <v-col class="card-shadow text-center py-6 mb-4" cols="12">
        <img src="../../../assets/images/security.svg" alt="Security Icon" />
        <div :class="isDarkMode ? 'text-text_3' : 'text-text_2'" class="headline font-weight-bold">
          {{ $t('dappPermission.permission') }}
        </div>
      </v-col>
      <v-col class="mx-6 mb-4" cols="12">
        <v-row align="top" no-gutters>
          <v-col cols="3" style="position: relative">
            <div class="logo-container d-flex align-center justify-center float-right">
              <!-- Update with proper logo -->
              <img class="logo-from" :src="`${logosUrl}/augur_logo.png`" :alt="`${origin} Logo`" />
            </div>
            <br />
            <br />
            <div :class="isDarkMode ? 'text-text_3' : 'text-text_2'" class="float-right caption text-center logo-label" :title="origin">
              {{ origin }}
            </div>
          </v-col>
          <v-col cols="6">
            <div :class="isDarkMode ? 'text-text_3' : 'text-text_2'" class="pt-2 network-container">
              <v-icon size="12">$network</v-icon>
              <span class="">{{ selectedNetwork }}</span>
            </div>
          </v-col>
          <v-col cols="3">
            <!-- Update with proper target -->
            <div class="logo-container d-flex align-center justify-center float-left">
              <img src="../../../assets/images/oval-google.svg" alt="Target Logo" />
            </div>
            <br />
            <br />
            <div
              :class="isDarkMode ? 'text-text_3' : 'text-text_2'"
              class="float-left caption text-center logo-label logo-label--right"
              title="AugurAugurAugurAugurAugur.com"
            >
              AugurAugurAugurAugurAugur.com
            </div>
          </v-col>
        </v-row>
      </v-col>
      <v-col class="mb-4 mx-6" cols="12">
        <div :class="isDarkMode ? 'text-text_3' : 'text-text_2'" class="caption mb-2">{{ $t('dappPermission.toAllow') }}:</div>

        <v-card class="permission-list card-shadow px-3 py-4 mb-4">
          <div class="mb-4">
            <div :class="isDarkMode ? 'text-text_3' : 'text-text_2'" class="permission-list--title">
              <v-icon size="12">$person</v-icon>
              {{ $t('dappPermission.accessUserInfo') }}
            </div>
            <div :class="isDarkMode ? 'text-text_3' : 'text-text_2'" class="permission-list--subtitle">
              {{ $t('dappPermission.displayUserInfo') }}
            </div>
          </div>
          <div class="mb-4">
            <div :class="isDarkMode ? 'text-text_3' : 'text-text_2'" class="permission-list--title">
              <v-icon size="12">$time</v-icon>
              {{ $t('dappPermission.transactHours').replace(/\{num\}/gi, 6) }}
            </div>
            <div :class="isDarkMode ? 'text-text_3' : 'text-text_2'" class="permission-list--subtitle"></div>
          </div>
          <div class="mb-4">
            <div :class="isDarkMode ? 'text-text_3' : 'text-text_2'" class="permission-list--title">
              <v-icon size="12">$network</v-icon>
              {{ $t('dappPermission.changeNetwork').replace(/\{network\}/gi, 'Rinkeby Network') }}
            </div>
            <div :class="isDarkMode ? 'text-text_3' : 'text-text_2'" class="permission-list--subtitle"></div>
          </div>
        </v-card>

        <v-card class="card-shadow px-3 py-4 mb-8">
          <div :class="isDarkMode ? 'text-text_3' : 'text-text_2'" class="caption permission-note">
            <img src="../../../assets/images/exclamation-triangle.png" alt="Alert Icon" />
            {{ $t('dappPermission.note').replace(/\{num\}/gi, 6) }}.
            <a class="font-italic" rel="noreferrer noopener" :class="isDarkMode ? 'text-text_3' : 'text-text_2'">
              {{ $t('dappPermission.learnMore') }}
            </a>
          </div>
        </v-card>

        <v-row class="px-2">
          <v-col cols="6">
            <v-btn block variant="text" size="large" :class="isDarkMode ? 'text-text_3' : 'text-text_2'" @click="triggerDeny">
              {{ $t('dappPermission.cancel') }}
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn block depressed size="large" color="torusBrand1" class="ml-2 text-white" @click="triggerSign">
              {{ $t('dappPermission.allow') }}
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

import config from '../../../config'

export default {
  name: 'PermissionConfirm',
  data() {
    return {
      logosUrl: config.logosUrl,
    }
  },
  computed: {
    ...mapState({
      networkType: 'networkType',
      whiteLabel: 'whiteLabel',
      selectedNetwork(state) {
        let finalNetwork = ''

        if (this.network) {
          return this.supportedNetworks[this.network].networkName
        }

        finalNetwork = !state.networkType.networkName ? state.networkType.host : state.networkType.networkName
        return finalNetwork
      },
    }),
    ...mapGetters({
      supportedNetworks: 'supportedNetworks',
    }),
    isDarkMode() {
      return this.$vuetify.theme.name === 'dark'
    },
  },
  methods: {
    triggerSign() {
      this.$emit('triggerSign')
    },
    triggerDeny() {
      this.$emit('triggerDeny')
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'PermissionConfirm.scss';
</style>
