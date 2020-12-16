<template>
  <v-container px-0 py-6 class="permission-container">
    <v-layout wrap>
      <v-flex class="card-shadow text-center" py-6 mb-4 xs12>
        <img src="../../../assets/images/security.svg" alt="Security Icon" />
        <div :class="$vuetify.theme.dark ? 'text_3--text' : 'text_2--text'" class="headline font-weight-bold">
          {{ t('dappPermission.permission') }}
        </div>
      </v-flex>
      <v-flex mx-6 mb-4 xs12>
        <v-layout align="top" no-gutters>
          <v-flex xs3 style="position: relative">
            <div class="logo-container d-flex align-center justify-center float-right">
              <!-- Update with proper logo -->
              <img class="logo-from" :src="`${logosUrl}/augur_logo.png`" :alt="`${origin} Logo`" />
            </div>
            <br />
            <br />
            <div :class="$vuetify.theme.dark ? 'text_3--text' : 'text_2--text'" class="float-right caption text-center logo-label" :title="origin">
              {{ origin }}
            </div>
          </v-flex>
          <v-flex xs6>
            <div :class="$vuetify.theme.dark ? 'text_3--text' : 'text_2--text'" class="pt-2 network-container">
              <v-icon size="12" v-text="'$vuetify.icons.network'"></v-icon>
              <span class="">{{ selectedNetwork }}</span>
            </div>
          </v-flex>
          <v-flex xs3>
            <!-- Update with proper target -->
            <div class="logo-container d-flex align-center justify-center float-left">
              <img src="../../../assets/images/oval-google.svg" alt="Target Logo" />
            </div>
            <br />
            <br />
            <div
              :class="$vuetify.theme.dark ? 'text_3--text' : 'text_2--text'"
              class="float-left caption text-center logo-label logo-label--right"
              title="AugurAugurAugurAugurAugur.com"
            >
              AugurAugurAugurAugurAugur.com
            </div>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex mb-4 mx-6 xs12>
        <div :class="$vuetify.theme.dark ? 'text_3--text' : 'text_2--text'" class="caption mb-2">{{ t('dappPermission.toAllow') }}:</div>

        <v-card class="permission-list card-shadow px-3 py-4 mb-4">
          <div class="mb-4">
            <div :class="$vuetify.theme.dark ? 'text_3--text' : 'text_2--text'" class="permission-list--title">
              <v-icon size="12" v-text="'$vuetify.icons.person'"></v-icon>
              {{ t('dappPermission.accessUserInfo') }}
            </div>
            <div :class="$vuetify.theme.dark ? 'text_3--text' : 'text_2--text'" class="permission-list--subtitle">
              {{ t('dappPermission.displayUserInfo') }}
            </div>
          </div>
          <div class="mb-4">
            <div :class="$vuetify.theme.dark ? 'text_3--text' : 'text_2--text'" class="permission-list--title">
              <v-icon size="12" v-text="'$vuetify.icons.time'"></v-icon>
              {{ t('dappPermission.transactHours').replace(/\{num\}/gi, 6) }}
            </div>
            <div :class="$vuetify.theme.dark ? 'text_3--text' : 'text_2--text'" class="permission-list--subtitle"></div>
          </div>
          <div class="mb-4">
            <div :class="$vuetify.theme.dark ? 'text_3--text' : 'text_2--text'" class="permission-list--title">
              <v-icon size="12" v-text="'$vuetify.icons.network'"></v-icon>
              {{ t('dappPermission.changeNetwork').replace(/\{network\}/gi, 'Rinkeby Network') }}
            </div>
            <div :class="$vuetify.theme.dark ? 'text_3--text' : 'text_2--text'" class="permission-list--subtitle"></div>
          </div>
        </v-card>

        <v-card class="card-shadow px-3 py-4 mb-8">
          <div :class="$vuetify.theme.dark ? 'text_3--text' : 'text_2--text'" class="caption permission-note">
            <img src="../../../assets/images/exclamation-triangle.png" alt="Alert Icon" />
            {{ t('dappPermission.note').replace(/\{num\}/gi, 6) }}.
            <a class="font-italic" rel="noreferrer noopener" :class="$vuetify.theme.dark ? 'text_3--text' : 'text_2--text'">
              {{ t('dappPermission.learnMore') }}
            </a>
          </div>
        </v-card>

        <v-layout px-2>
          <v-flex xs6>
            <v-btn block text large :class="$vuetify.theme.dark ? 'text_3--text' : 'text_2--text'" @click="triggerDeny">
              {{ t('dappPermission.cancel') }}
            </v-btn>
          </v-flex>
          <v-flex xs6>
            <v-btn block depressed large color="torusBrand1" class="ml-2 white--text" @click="triggerSign">{{ t('dappPermission.allow') }}</v-btn>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'

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
      supportedNetworks: 'supportedNetworks',
      selectedNetwork(state) {
        let finalNetwork = ''

        if (this.network) {
          return this.supportedNetworks[this.network].networkName
        }

        finalNetwork = !state.networkType.networkName ? state.networkType.host : state.networkType.networkName
        return finalNetwork
      },
    }),
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
