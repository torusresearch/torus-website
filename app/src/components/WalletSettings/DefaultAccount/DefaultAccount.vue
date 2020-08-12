<template>
  <div class="default-account-container" :class="$vuetify.breakpoint.xsOnly ? 'pt-5' : 'py-5 px-4'">
    <div class="body-2 torusFont1--text mb-2 px-1">Accounts</div>

    <v-list dense class="pa-0 factor-list mb-4">
      <v-list-item class="pl-0 pr-1">
        <v-list-item-avatar class="ma-0">
          <v-icon size="16" class="torusGray1--text">{{ `$vuetify.icons.google` }}</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="font-weight-regular caption">
            <span class="text_1--text">llenoil@gmail.com</span>
          </v-list-item-title>
        </v-list-item-content>
        <v-list-item-action class="ma-0">
          <div class="caption torus_1--text">Default</div>
        </v-list-item-action>
      </v-list-item>
      <v-list-item class="pl-0 pr-1">
        <v-list-item-avatar class="ma-0">
          <v-icon size="16" class="torusGray1--text">{{ `$vuetify.icons.wallet` }}</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="font-weight-regular caption">
            <span class="text_1--text">2FA Wallet</span>
          </v-list-item-title>
        </v-list-item-content>
        <v-list-item-action class="ma-0">
          <a href="#" class="caption text-decoration-none">Switch to default</a>
        </v-list-item-action>
      </v-list-item>
    </v-list>

    <div class="caption text_3--text mb-4 px-5">
      Note: The selected default account shall be the account displayed when you sign in on a DApp.
    </div>
  </div>
</template>

<script>
export default {
  name: 'DefaultAccounot',
}
</script>

<style lang="scss" scoped>
@import 'DefaultAccount.scss';
</style>
