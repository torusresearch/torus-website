<template>
  <v-dialog :value="!!shareToExport" width="375">
    <v-card class="export-share">
      <v-layout class="card-header" wrap>
        <v-flex text-center xs12 py-10 px-6>
          <div class="display-1">{{ t('tkeyBackup.backupPhrase') }}</div>
          <v-btn class="close-btn" icon aria-label="Close Add Token" title="Close Backup phrase" @click="closeDialog">
            <v-icon>$vuetify.icons.close</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
      <v-layout mx-6 pt-6 pb-4 wrap>
        <v-flex xs12>
          <div class="title">{{ t('tkeyBackup.saveCopy') }}</div>
        </v-flex>
      </v-layout>
      <v-divider></v-divider>
      <v-layout mx-6 pt-3 pb-10 wrap>
        <v-flex xs12 mb-4>
          <v-textarea hide-details class="font-weight-bold text_2--text" :value="shareToExport" outlined rows="6" readonly />
        </v-flex>
        <v-flex xs12 class="text-right mb-10">
          <ShowToolTip :address="shareToExport">
            <v-btn class="copy-btn px-4" :color="$vuetify.theme.dark ? 'torusBlack2' : 'torusGray4'" small aria-label="Copy share mnemonic">
              <v-icon class="caption text_2--text mr-2" size="12" v-text="'$vuetify.icons.copy'" />
              <span class="caption text_2--text">{{ t('tkeyBackup.clickToCopy') }}</span>
            </v-btn>
          </ShowToolTip>
        </v-flex>
        <v-flex xs12 mb-8>
          <div class="body-2" :class="$vuetify.theme.dark ? 'text_3--text' : 'text_2--text'">
            {{ t('tkeyBackup.copyShareNote') }}
          </div>
        </v-flex>
        <v-flex xs12>
          <v-layout mx-n2>
            <v-flex xs6 px-2></v-flex>
            <v-flex xs6 px-2>
              <v-btn block large color="torusBrand1" class="white--text" type="button" @click="closeDialog">
                {{ t('walletSettings.close') }}
              </v-btn>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
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

<style lang="scss" scoped>
@import 'ExportShare.scss';
</style>
