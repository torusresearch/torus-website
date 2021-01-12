<template>
  <div class="privacy-security-container" :class="$vuetify.breakpoint.xsOnly ? '' : 'py-5 px-2'">
    <v-list>
      <v-list-item id="private-key-btn" class="gmt-private-key-modal" @click="privateKeyDialog = true">
        <v-list-item-action class="mr-4">
          <v-icon :small="$vuetify.breakpoint.xsOnly" size="20" class="ext_2--text" :style="{ marginRight: '10px' }" v-text="'$vuetify.icons.key'" />
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title class="body-2 text_1--text">{{ t('walletSettings.accountDetails') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-dialog v-model="privateKeyDialog" max-width="1000" :fullscreen="$vuetify.breakpoint.xsOnly">
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
