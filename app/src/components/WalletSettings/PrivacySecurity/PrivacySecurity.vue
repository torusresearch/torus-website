<template>
  <div class="privacy-security-container" :class="$vuetify.breakpoint.xsOnly ? '' : 'py-0 px-12'">
    <v-list>
      <v-list-item id="private-key-btn" @click="privateKeyDialog = true">
        <v-list-item-action class="mr-4">
          <v-icon :small="$vuetify.breakpoint.xsOnly" class="mr-4 text_2--text" v-text="'$vuetify.icons.key'" />
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title class="text_1--text">{{ $vuetify.lang.t('$vuetify.walletSettings.privateKey') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item id="dapp-permisson-btn" @click="dappPermissionDialog = true">
        <v-list-item-action class="mr-4">
          <v-icon :size="$vuetify.breakpoint.xsOnly ? 12 : 16" class="mr-4 text_2--text" v-text="'$vuetify.icons.list'" />
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title class="text_1--text">{{ $vuetify.lang.t('$vuetify.walletSettings.dappPermission') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-dialog v-model="privateKeyDialog" max-width="1000" :fullscreen="$vuetify.breakpoint.xsOnly">
      <private-keys @onClose="privateKeyDialog = false" />
    </v-dialog>
    <v-dialog v-model="dappPermissionDialog" max-width="1000" :fullscreen="$vuetify.breakpoint.xsOnly">
      <dapp-permissions @onClose="dappPermissionDialog = false" />
    </v-dialog>
  </div>
</template>

<script>
import PrivateKeys from '../PrivateKeys'
import DappPermissions from '../DappPermissions'

export default {
  name: 'privacySecuritySettings',
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
