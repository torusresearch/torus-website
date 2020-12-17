<template>
  <v-dialog v-model="deleteShareDialog" width="375">
    <template v-slot:activator="{ on }">
      <v-btn class="delete-btn" color="text_2" icon small :aria-label="`Delete`" v-on="on">
        <v-icon x-small>$vuetify.icons.trash</v-icon>
      </v-btn>
    </template>
    <v-card class="delete-share">
      <v-layout class="card-header" wrap>
        <v-flex text-center xs12 py-10 px-6>
          <div class="delete-headline">Delete Authentication Factor</div>
          <v-btn class="close-btn" icon aria-label="Close Add Token" title="Close Backup phrase" @click="deleteShareDialog = false">
            <v-icon>$vuetify.icons.close</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
      <v-layout mx-6 pt-6 pb-10 wrap>
        <v-flex xs12>
          <div class="title d-flex justify-center">
            <v-icon size="16" class="mr-2 warning--text">$vuetify.icon.alert_circle_filled</v-icon>
            This action cannot be undone.
          </div>
        </v-flex>
      </v-layout>
      <v-layout mx-6 pb-10 wrap>
        <v-flex xs12 mb-8>
          <div class="body-2 text-center" :class="$vuetify.theme.dark ? 'text_3--text' : 'text_2--text'">
            Please be very sure before you click confirm to delete this as an Authentication Factor.
          </div>
        </v-flex>
        <v-flex xs12>
          <v-layout mx-n2>
            <v-flex xs6 px-2>
              <v-btn block large text @click="deleteShareDialog = false">{{ t('walletSettings.close') }}</v-btn>
            </v-flex>
            <v-flex xs6 px-2>
              <v-btn block large color="torusBrand1" class="white--text" type="button" @click="confirm">
                {{ t('walletSettings.confirm') }}
              </v-btn>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    shareToDelete: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      deleteShareDialog: false,
    }
  },
  methods: {
    closeDialog() {
      this.$emit('close')
    },
    confirm() {
      this.$emit('confirm', this.shareToDelete)
      this.deleteShareDialog = false
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'DeleteShare.scss';
</style>
