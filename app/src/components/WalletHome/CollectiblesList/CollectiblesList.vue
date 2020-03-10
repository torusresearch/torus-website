<template>
  <v-layout class="collectibles-tab-container mx-n4" wrap align-center>
    <v-flex v-for="(collectible, i) in collectibles" :key="i" class="xs12 sm6 md4 lg3 px-4 my-4">
      <v-card class="elevation-1">
        <v-list-item class="py-4" router-link :to="{ name: 'walletHomeCollectible', params: { address: collectible.address } }">
          <v-list-item-content class="subtitle-1 font-weight-bold">{{ collectible.name }}</v-list-item-content>
          <v-list-item-avatar size="100">
            <v-img :src="collectible.logo" :alt="collectible.name"></v-img>
          </v-list-item-avatar>
        </v-list-item>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  computed: {
    collectibles() {
      return this.$store.getters.collectibleBalances
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'CollectiblesList.scss';
</style>
