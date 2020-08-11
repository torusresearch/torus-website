<template>
  <div class="elevation-1 pa-10">
    <div class="text-center mb-6">
      <div class="headline text_1--text mb-2">Wallet authentication factors</div>
      <div class="body-2 text_2--text">
        You would require any
        <span class="font-weight-bold">TWO</span>
        of the following to authenticate and access your wallet.
      </div>
    </div>
    <div class="mb-8">
      <div class="d-flex align-center mb-2">
        <div class="caption text_2--text">Authentication factors (2/3)</div>
        <div class="ml-auto caption" :style="{ color: '#FBBC05' }">Average</div>
      </div>
      <v-progress-linear class="mb-2" color="#FBBC05" rounded value="15"></v-progress-linear>
      <div class="text_2--text caption">You need to backup on device storage or set up a recovery password to create your 2FA Wallet</div>
    </div>
    <div>
      <v-expansion-panels multiple>
        <v-expansion-panel class="mb-2" disabled>
          <v-expansion-panel-header class="py-2">
            <v-icon small class="d-inline-flex mr-4 success--text shrink" v-text="'$vuetify.icons.check_circle_filled'" />
            <div class="grow font-weight-bold body-2 text_2--text">Google Login</div>
            <div class="ml-auto text-right caption text_2--text">youremailhere@gmail.com</div>
          </v-expansion-panel-header>
        </v-expansion-panel>
        <v-expansion-panel class="mb-2">
          <v-expansion-panel-header class="py-2">
            <v-icon small class="d-inline-flex mr-4 success--text shrink" v-text="'$vuetify.icons.check_circle_filled'" />
            <div class="grow font-weight-bold body-2 text_2--text">Browser</div>
            <div class="ml-auto text-right caption text_2--text">Chrome V82.04103.61</div>
          </v-expansion-panel-header>
          <v-expansion-panel-content class="pa-5">
            <div class="body-2 text_2--text mb-4">
              Authentication via browser is limited to the cookies stored. Click to
              <span class="font-weight-bold">allow device storage as backup</span>
              .
            </div>
            <div class="text-right">
              <v-btn outlined color="torusBrand1">Backup on device storage</v-btn>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel class="mb-2">
          <v-expansion-panel-header class="py-2">
            <v-icon small class="d-inline-flex mr-4 text_2--text shrink" v-text="'$vuetify.icons.check_circle_filled'" />
            <div class="grow font-weight-bold body-2 text_2--text">Recovery Password</div>
          </v-expansion-panel-header>
          <v-expansion-panel-content class="pa-5">
            <v-text-field type="password" outlined placeholder="Min 10 alphanumeric characters" />
            <div class="text-right">
              <v-btn disabled color="torusBrand1" class="white--text">Backup on device storage</v-btn>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
    <v-layout class="mx-n2 mt-9 mb-12">
      <v-flex class="xs6 px-2">
        <v-btn block x-large outlined color="torusBrand1">Cancel</v-btn>
      </v-flex>
      <v-flex class="xs6 px-2">
        <v-btn block x-large color="torusBrand1" class="white--text">Create 2FA Wallet</v-btn>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
export default {
  methods: {
    next() {
      this.$emit('next')
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'SetupWallet.scss';
</style>
