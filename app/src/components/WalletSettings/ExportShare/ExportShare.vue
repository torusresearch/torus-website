<template>
  <v-dialog :value="!!shareToExport" width="400">
    <v-card>
      <v-card-text class="pt-8 pb-4">
        <v-layout wrap>
          <v-flex xs12 class="mb-2">
            <div class="text-subtitle-2 mb-2">{{ t('tkeyBackup.shareMnemonic') }}</div>
            <v-textarea hide-details :value="shareToExport" outlined readonly></v-textarea>
          </v-flex>
          <v-flex xs12 class="text-right">
            <ShowToolTip :address="shareToExport">
              <v-btn small aria-label="Copy share mnemonic">
                <v-icon class="caption text_2--text" left size="12" v-text="'$vuetify.icons.copy'" />
                <span class="caption text_2--text">{{ t('tkeyBackup.copyShareMnemonic') }}</span>
              </v-btn>
            </ShowToolTip>
          </v-flex>
        </v-layout>
      </v-card-text>

      <v-card-actions class="pb-8">
        <v-flex xs8 offset-xs2>
          <v-btn color="torusBrand1" block depressed class="px-12 py-1 white--text" @click="closeDialog">
            {{ t('walletSettings.close') }}
          </v-btn>
        </v-flex>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import ShowToolTip from '../../helpers/ShowToolTip'

export default {
  components: { ShowToolTip },
  props: {
    shareToExport: {
      type: String,
      default: '',
    },
  },
  methods: {
    closeDialog() {
      this.$emit('close')
    },
  },
}
</script>
