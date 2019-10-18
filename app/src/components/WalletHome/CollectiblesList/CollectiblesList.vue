<template>
  <v-layout wrap align-center>
    <v-flex class="xs12 sm6 md4 lg3 px-4 my-4" v-for="(contract, i) in contracts" :key="i">
      <v-card class="card-shadow">
        <v-list-item class="py-4" router-link :to="{ name: 'walletHomeCollectible', params: { address: contract.address } }">
          <v-list-item-content class="subtitle-1 font-weight-bold">{{ contract.name }}</v-list-item-content>
          <v-list-item-avatar size="100">
            <v-img :src="contract.logo"></v-img>
          </v-list-item-avatar>
        </v-list-item>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  computed: {
    contracts() {
      return this.$store.getters.collectibleBalances
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'CollectiblesList.scss';
</style>
