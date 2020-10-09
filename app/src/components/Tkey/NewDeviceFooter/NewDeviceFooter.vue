<template>
  <div class="tkey-footer" :class="{ 'is-mobile': $vuetify.breakpoint.xsOnly }">
    <v-divider class="mb-2"></v-divider>
    <v-layout class="align-center">
      <v-flex class="x6">
        <div class="d-flex align-center">
          <v-icon size="16" class="text_2--text mr-1">$vuetify.icons.lock_filled</v-icon>
          <div class="text_2--text caption">{{ t('tkeyNew.secureTorus') }}</div>
        </div>
      </v-flex>
      <v-flex class="x6 caption text-right text_2--text">
        {{ t('tkeyNew.contactSupport') }}
      </v-flex>
    </v-layout>
  </div>
</template>

<style lang="scss" scoped>
@import 'NewDeviceFooter.scss';
</style>
