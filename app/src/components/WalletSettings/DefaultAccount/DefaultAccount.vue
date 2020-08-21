<template>
  <div class="default-account-container" :class="$vuetify.breakpoint.xsOnly ? 'pt-5' : 'py-5 px-4'">
    <div class="body-2 torusFont1--text mb-2 px-1">{{ t('tkeySettings.accounts') }}</div>

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
          <div class="caption torus_1--text">{{ t('tkeySettings.default') }}</div>
        </v-list-item-action>
      </v-list-item>
      <v-list-item class="pl-0 pr-1">
        <v-list-item-avatar class="ma-0">
          <v-icon size="16" class="torusGray1--text">{{ `$vuetify.icons.wallet` }}</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="font-weight-regular caption">
            <span class="text_1--text">{{ t('tkeySettings.twoFaWallet') }}</span>
          </v-list-item-title>
        </v-list-item-content>
        <v-list-item-action class="ma-0">
          <a href="#" class="caption text-decoration-none">{{ t('tkeySettings.switchDefault') }}</a>
        </v-list-item-action>
      </v-list-item>
    </v-list>

    <div class="caption text_3--text mb-4 px-5">{{ t('tkeySettings.note') }}: {{ t('tkeySettings.theSelectedAccount') }}</div>
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
