<template>
  <v-layout wrap align-center>
    <v-card color="card-shadow pb-6 pt-1">
      <v-card-text class="text_1--text px-6">
        <v-layout>
          <v-flex xs12 lg12 text-center>
            <img :src="require(`../../../../public/images/example.png`)" />
            <div class="subtitle-1 font-weight-semi-bold">{{ badge.title }}</div>
            <div class="text-gray subtitle">
              {{ badge.description }}
            </div>
            <v-btn block large @click="openModal(badge.title)" v-if="!badge.status" depressed class="status-btn mt-2 mr-4">
              Go to {{ badge.type }}
            </v-btn>
            <v-btn block large v-else disabled class="status-btn mt-2 mr-4">Completed</v-btn>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
  </v-layout>
</template>

<script>
export default {
  props: ['badge'],
  methods: {
    openModal(title) {
      this.$emit('openModal', title)
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'WalletBadge';
</style>
