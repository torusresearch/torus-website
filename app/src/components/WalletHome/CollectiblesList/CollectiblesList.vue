<template>
  <v-layout wrap align-center>
    <v-flex class="xs12 sm6 md4 lg3 px-4 my-4" v-for="n in 5" :key="n">
      <v-card class="card-shadow py-4" @click="loadCollectible(n)">
        <v-list-item router-link :to="{ name: 'walletHomeCollectible' }">
          <v-list-item-content class="subtitle-1 font-weight-bold">Proof of Attendance Protocol</v-list-item-content>
          <v-list-item-avatar size="100">
            <v-img :src="require(`../../../../public/images/kitty-eth.svg`)"></v-img>
          </v-list-item-avatar>
        </v-list-item>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  methods: {
    loadCollectible(selectedCollectible) {
      this.selectedCollectible = selectedCollectible
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'CollectiblesList.scss';
</style>
