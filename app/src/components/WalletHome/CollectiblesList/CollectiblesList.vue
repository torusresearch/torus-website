<template>
  <v-layout class="collectibles-tab-container mx-n4" wrap align-center>
    <v-flex v-for="(collectible, i) in collectibles" :key="i" class="xs12 sm6 md4 lg3 px-4 mb-4">
      <v-card class="elevation-1" :class="$vuetify.breakpoint.xsOnly ? 'pt-1 pb-2 px-5' : 'py-3 px-5'">
        <v-list-item class="px-0" router-link :to="{ name: 'walletHomeCollectible', params: { address: collectible.address } }">
          <v-list-item-avatar :size="$vuetify.breakpoint.xsOnly ? 36 : 50">
            <v-img :src="collectible.logo" :alt="collectible.name"></v-img>
          </v-list-item-avatar>
          <v-list-item-content class="subtitle-1 font-weight-bold">
            <v-list-item-title class="mb-2">{{ collectible.name }}</v-list-item-title>
            <v-list-item-subtitle v-if="!$vuetify.breakpoint.xsOnly">{{ collectible.assets.length }} Assets</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <div v-if="$vuetify.breakpoint.xsOnly" class="text-right">{{ collectible.assets.length }} Assets</div>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  computed: {
    collectibles() {
      // eslint-disable-next-line no-console
      console.log('this.$store.getters.collectibleBalances', this.$store.getters.collectibleBalances)
      return this.$store.getters.collectibleBalances
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'CollectiblesList.scss';
</style>
