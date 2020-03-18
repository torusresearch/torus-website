<template>
  <div class="privacy-security-container" :class="$vuetify.breakpoint.xsOnly ? '' : 'py-5 px-2'">
    <v-list>
      <v-list-item id="private-key-btn" @click="privateKeyDialog = true">
        <v-list-item-action class="mr-4">
          <v-icon :small="$vuetify.breakpoint.xsOnly" size="20" class="mr-4 text_2--text" v-text="'$vuetify.icons.key'" />
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title class="body-2">{{ t('walletSettings.privateKey') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item id="dapp-permisson-btn" @click="dappPermissionDialog = true">
        <v-list-item-action class="mr-4">
          <v-icon :size="$vuetify.breakpoint.xsOnly ? 12 : 14" class="mr-4 text_2--text" v-text="'$vuetify.icons.list'" />
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title class="body-2">{{ t('walletSettings.dappPermission') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-dialog v-model="privateKeyDialog" max-width="1000" :fullscreen="$vuetify.breakpoint.xsOnly">
      <PrivateKeys @onClose="privateKeyDialog = false" />
    </v-dialog>
    <v-dialog v-model="dappPermissionDialog" max-width="1000" :fullscreen="$vuetify.breakpoint.xsOnly">
      <DappPermissions @onClose="dappPermissionDialog = false" />
    </v-dialog>
  </div>
</template>

<script>
import DappPermissions from '../DappPermissions'
import PrivateKeys from '../PrivateKeys'

export default {
  name: 'PrivacySecuritySettings',
  components: {
    PrivateKeys,
    DappPermissions
  },
  data() {
    return {
      privateKeyDialog: false,
      dappPermissionDialog: false
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'PrivacySecurity.scss';
</style>
