<template>
  <div class="privacy-security-container" :class="$vuetify.breakpoint.xsOnly ? '' : 'py-5 px-2'">
    <v-list>
      <v-list-item id="private-key-btn" class="gmt-private-key-modal" @click="privateKeyDialog = true">
        <v-list-item-action class="mr-4">
          <v-icon :small="$vuetify.breakpoint.xsOnly" size="20" class="ext_2--text" :style="{ marginRight: '10px' }" v-text="'$vuetify.icons.key'" />
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title class="body-2 text_1--text">{{ t('walletSettings.privateKey') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item id="private-key-btn" class="gmt-private-key-modal" @click="seedPhraseDialog = true">
        <v-list-item-action class="mr-4">
          <v-icon
            :small="$vuetify.breakpoint.xsOnly"
            size="20"
            class="ext_2--text"
            :style="{ marginRight: '10px' }"
            v-text="'$vuetify.icons.seed_phrase'"
          />
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title class="body-2 text_1--text">Seed Phrase</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-dialog v-model="privateKeyDialog" max-width="1000" :fullscreen="$vuetify.breakpoint.xsOnly">
      <PrivateKeys @onClose="privateKeyDialog = false" />
    </v-dialog>
    <v-dialog v-model="seedPhraseDialog" max-width="400" :fullscreen="$vuetify.breakpoint.xsOnly">
      <SeedPhrase @onClose="seedPhraseDialog = false" />
    </v-dialog>
  </div>
</template>

<script>
import PrivateKeys from '../PrivateKeys'
import SeedPhrase from '../SeedPhrase'

export default {
  name: 'PrivacySecuritySettings',
  components: {
    PrivateKeys,
    SeedPhrase,
  },
  data() {
    return {
      privateKeyDialog: false,
      seedPhraseDialog: false,
    }
  },
}
</script>

<style lang="scss" scoped>
@import 'PrivacySecurity.scss';
</style>
