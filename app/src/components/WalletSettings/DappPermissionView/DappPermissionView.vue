<template>
  <v-card class="px-4 py-1 mb-4">
    <v-list dense>
      <v-list-item>
        <v-list-item-icon class="mr-1">
          <img width="14" height="14" :src="require('../../../../public/img/icons/tag.svg')" />
        </v-list-item-icon>
        <v-list-item-content class="subtitle-2 py-0">Etheremon.com</v-list-item-content>
        <v-spacer></v-spacer>
        <v-list-item-action class="text_2--text caption my-0">
          15 April 2019 @ 13:45:49
        </v-list-item-action>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item>
        <v-list-item-content class="caption py-0">Type:</v-list-item-content>
        <v-spacer></v-spacer>
        <v-list-item-action class="text_1--text caption my-0">
          ERC 20 Transfer
        </v-list-item-action>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item>
        <v-list-item-content class="caption py-0">Amount:</v-list-item-content>
        <v-spacer></v-spacer>
        <v-list-item-action class="text_1--text font-weight-bold caption my-0">
          10.00 USD
        </v-list-item-action>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item>
        <v-list-item-content class="caption py-0">Period of Validity:</v-list-item-content>
        <v-spacer></v-spacer>
        <v-list-item-action class="text_1--text caption my-0">
          1 Month (15 April ~ May 2019)
        </v-list-item-action>
      </v-list-item>

      <v-card-actions class="mt-2">
        <v-spacer></v-spacer>
        <v-btn color="error" class="mr-2" text @click="onDelete">Delete</v-btn>
        <v-btn color="primary" outlined @click="onEdit">Edit</v-btn>
      </v-card-actions>
    </v-list>
  </v-card>
</template>

<script>
export default {
  methods: {
    onEdit() {
      this.$emit('onEdit')
    },
    onDelete() {
      this.$emit('onDelete')
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'DappPermissionView.scss';
</style>
