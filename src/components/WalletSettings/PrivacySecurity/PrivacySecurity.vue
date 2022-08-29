<template>
  <div class="privacy-security-container" :class="$vuetify.display.xs ? '' : 'py-5 px-2'">
    <v-list>
      <v-list-item id="private-key-btn" class="gmt-private-key-modal" @click="privateKeyDialog = true">
        <template #prepend>
          <div class="mr-4">
            <v-icon :size="$vuetify.display.xs ? 'small' : '20'" class="text-text_2" :style="{ marginRight: '10px' }">$key</v-icon>
          </div>
        </template>
        <v-list-item-title class="body-2 text-text_1">{{ $t('walletSettings.accountDetails') }}</v-list-item-title>
      </v-list-item>
    </v-list>

    <v-dialog v-model="privateKeyDialog" max-width="1000" :fullscreen="$vuetify.display.xs">
      <PrivateKeys @onClose="privateKeyDialog = false" />
    </v-dialog>
  </div>
</template>

<script>
import PrivateKeys from '../PrivateKeys'

export default {
  name: 'PrivacySecuritySettings',
  components: {
    PrivateKeys,
  },
  data() {
    return {
      privateKeyDialog: false,
    }
  },
}
</script>

<style lang="scss" scoped>
@import 'PrivacySecurity.scss';
</style>
