<template>
  <v-layout wrap align-center>
    <v-flex class="xs12 sm6 md4 lg3 px-4 my-4" v-for="contract in contracts" :key="contract.id">
      <v-card class="card-shadow">
        <v-list-item class="py-4" router-link :to="{ name: 'walletHomeCollectible', query: { id: contract.id } }">
          <v-list-item-content class="subtitle-1 font-weight-bold">{{ contract.name }}</v-list-item-content>
          <v-list-item-avatar size="100">
            <v-img :src="contract.image"></v-img>
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
      return [
        {
          id: 1,
          name: 'Cryptokitties',
          image: 'https://www.cryptokitties.co/images/kitty-eth.svg'
        },
        {
          id: 2,
          name: 'My Crypto Heroes',
          image: 'https://pbs.twimg.com/profile_images/1074160618788147200/W-COgBLA_400x400.jpg'
        },
        {
          id: 3,
          name: 'Proof of Attendance Protocol',
          image: 'https://cdn.stateofthedapps.com/dapps/poap/logo_poap_2e95b0adb2b95625bcd5240c61c74b8d1037c29aed9d3f2b6e4d9c1fb6cebdc3_opti.png'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'CollectiblesList.scss';
</style>
