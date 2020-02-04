<template>
  <v-container pa-0 class="permission-container">
    <v-layout wrap>
      <v-flex class="card-shadow text-center" py-6 mb-4 xs12>
        <img :src="require(`../../../../public/images/security.svg`)" />
        <div :class="$vuetify.theme.dark ? 'text_3--text' : 'text_2--text'" class="headline font-weight-bold">Permissions</div>
      </v-flex>
      <v-flex mx-6 mb-4 xs12>
        <v-layout align="top" no-gutters>
          <v-flex xs3 style="position: relative">
            <div class="logo-container d-flex align-center justify-center float-right">
              <img class="logo-from" :src="require(`../../../../public/images/logos/augur_logo.png`)" />
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
            <div class="logo-container d-flex align-center justify-center float-left">
              <img :src="require(`../../../../public/images/oval-google.svg`)" />
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
        <div :class="$vuetify.theme.dark ? 'text_3--text' : 'text_2--text'" class="caption mb-2">To allow the following:</div>

        <v-card class="permission-list card-shadow px-3 py-4 mb-4">
          <div class="mb-4">
            <div :class="$vuetify.theme.dark ? 'text_3--text' : 'text_2--text'" class="permission-list--title">
              <v-icon size="12" v-text="'$vuetify.icons.person'"></v-icon>
              Access your Google ID, name and profile photo
            </div>
            <div :class="$vuetify.theme.dark ? 'text_3--text' : 'text_2--text'" class="permission-list--subtitle">
              DApp will display this information in app to personalise your experience. Dapp will never store or share the information above.
            </div>
          </div>
          <div class="mb-4">
            <div :class="$vuetify.theme.dark ? 'text_3--text' : 'text_2--text'" class="permission-list--title">
              <v-icon size="12" v-text="'$vuetify.icons.time'"></v-icon>
              Transact with requestor for the next 6 hrs
            </div>
            <div :class="$vuetify.theme.dark ? 'text_3--text' : 'text_2--text'" class="permission-list--subtitle"></div>
          </div>
          <div class="mb-4">
            <div :class="$vuetify.theme.dark ? 'text_3--text' : 'text_2--text'" class="permission-list--title">
              <v-icon size="12" v-text="'$vuetify.icons.network'"></v-icon>
              Change your network to Rinkeby Network
            </div>
            <div :class="$vuetify.theme.dark ? 'text_3--text' : 'text_2--text'" class="permission-list--subtitle"></div>
          </div>
        </v-card>

        <v-card class="card-shadow px-3 py-4 mb-8">
          <div :class="$vuetify.theme.dark ? 'text_3--text' : 'text_2--text'" class="caption permission-note">
            <img :src="require(`../../../../public/images/exclamation-triangle.png`)" />
            NOTE: By clicking allow, you grant the DApp permission for unlimited interaction with your account within the next 6 hrs. Learn more
          </div>
        </v-card>

        <v-layout px-2>
          <v-flex xs6>
            <v-btn block text large :class="$vuetify.theme.dark ? 'text_3--text' : 'text_2--text'" @click="triggerDeny">Cancel</v-btn>
          </v-flex>
          <v-flex xs6>
            <v-btn block depressed large color="primary" class="ml-2" @click="triggerSign">Allow</v-btn>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { SUPPORTED_NETWORK_TYPES } from '../../../utils/enums'

export default {
  name: 'permissionConfirm',
  computed: {
    selectedNetwork() {
      let finalNetwork = ''

      if (this.network) {
        return SUPPORTED_NETWORK_TYPES[this.network].networkName
      }

      finalNetwork =
        !this.$store.state.networkType.networkName || this.$store.state.networkType.networkName === ''
          ? this.$store.state.networkType.host
          : this.$store.state.networkType.networkName
      return finalNetwork
    }
  },
  methods: {
    triggerSign() {
      this.$emit('triggerSign')
    },
    triggerDeny() {
      this.$emit('triggerDeny')
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'PermissionConfirm.scss';
</style>
