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
        <v-list-item-content class="caption py-0">{{ t('walletSettings.type') }}:</v-list-item-content>
        <v-spacer></v-spacer>
        <v-list-item-action class="caption my-0">
          ERC 20 Transfer
        </v-list-item-action>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item>
        <v-list-item-content class="caption py-0">{{ t('walletSettings.amount') }}:</v-list-item-content>
        <v-spacer></v-spacer>
        <v-list-item-action class="font-weight-bold caption my-0">
          10.00 USD
        </v-list-item-action>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item>
        <v-list-item-content class="caption py-0">{{ t('walletSettings.periodValidity') }}:</v-list-item-content>
        <v-spacer></v-spacer>
        <v-list-item-action class="caption my-0">
          1 Month (15 April ~ May 2019)
        </v-list-item-action>
      </v-list-item>

      <v-card-actions class="mt-2">
        <v-spacer></v-spacer>
        <v-btn color="error" class="mr-2" text @click="onDelete">{{ t('walletSettings.delete') }}</v-btn>
        <v-btn class="white--text" color="torus_brand1" outlined @click="onEdit">{{ t('walletSettings.edit') }}</v-btn>
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
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'DappPermissionView.scss';
</style>
