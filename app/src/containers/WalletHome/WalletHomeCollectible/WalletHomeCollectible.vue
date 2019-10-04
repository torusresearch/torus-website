<template>
  <div>
    <v-breadcrumbs class="px-4" :items="items">
      <template v-slot:divider>
        <v-icon>$vuetify.icons.page_next</v-icon>
      </template>
    </v-breadcrumbs>
    <v-layout wrap align-center>
      <v-flex xs6 px-4>
        <v-select :items="items" outlined hide-details append-icon="$vuetify.icons.select"></v-select>
      </v-flex>
      <v-flex xs6 px-4 class="body-2 text_2--text">Something</v-flex>
    </v-layout>
    <v-layout wrap align-center mt-10>
      <v-flex xs6 sm3 md2 px-4 pb-4 v-for="i in 10" :key="i">
        <v-card class="mx-auto" max-width="344">
          <v-img src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg" height="140px"></v-img>
          <v-card-text class="py-1 px-3">
            <div class="body-2">Nisse Fabears</div>
            <div class="text-right asset-details mt-1">
              <div class="font-weight-medium">0.25 ETH</div>
              <div class="text_2--text">$49.38 USD</div>
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        {
          text: 'Dashboard',
          disabled: false,
          href: 'breadcrumbs_dashboard'
        },
        {
          text: 'Link 1',
          disabled: false,
          href: 'breadcrumbs_link_1'
        },
        {
          text: 'Link 2',
          disabled: true,
          href: 'breadcrumbs_link_2'
        }
      ]
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
@import 'WalletHomeCollectible.scss';
</style>
