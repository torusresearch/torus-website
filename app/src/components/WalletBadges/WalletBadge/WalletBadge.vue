<template>
  <v-layout wrap align-center>
    <v-card color="card-shadow pb-6 pt-1">
      <v-card-text class="text_1--text px-6">
        <v-layout>
          <v-flex xs12 lg12 text-center>
            <img width="150" v-if="badge.isCompleted" :src="badge.completedImageUrl[0].url" />
            <img width="150" v-else :src="badge.unCompletedImageUrl[0].url" />
            <div class="font-weight-bold font-fit">{{ badge.title }}</div>
            <div class="text-gray subtitle mh-4">
              {{ badge.description }}
            </div>
            <v-btn
              block
              :disabled="index === 0 || badge.isCompleted || index === lastBadgeIndex - 1"
              large
              @click="openBadgeModal"
              depressed
              class="status-btn mt-2 mr-4"
            >
              {{ badge.isCompleted ? 'Completed' : index === 0 ? 'Completed' : `${badge.action}` }}
            </v-btn>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
  </v-layout>
</template>

<script>
export default {
  props: ['badge', 'index', 'lastBadgeIndex'],
  methods: {
    openBadgeModal() {
      this.$root.$emit('showBadgeModal', this.index)
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'WalletBadge';
</style>
