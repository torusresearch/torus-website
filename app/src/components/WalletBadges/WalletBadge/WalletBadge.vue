<template>
  <v-layout wrap align-center>
    <v-card color="card-shadow pb-6 pt-1">
      <v-card-text class="text_1--text px-6">
        <v-layout>
          <v-flex xs12 lg12 text-center>
            <img width="150" v-if="badge.isCompleted" :src="badge.completedImageUrl[0].url" />
            <img width="150" v-else :src="badge.unCompletedImageUrl[0].url" />
            <div class="font-weight-bold title font-fit mh-2">{{ badge.title }}</div>
            <div class="text-gray body-1 mt--2 mh-4">
              {{ badge.description }}
            </div>
            <div v-if="badge.isCompleted">
              <img src="../../../../public/images/check-icon.svg" alt="Completed icon" />
              <div class="body-1 font-weight-bold text-complete">Completed</div>
            </div>
            <div v-else>
              <v-btn v-if="badge.action" block large @click="handleLinkOpen(badge.link)" depressed class="status-btn mt-2 mr-4">
                {{ badge.action }}
              </v-btn>
              <div v-else class="mh-1"></div>
            </div>
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
    handleLinkOpen(name) {
      if (name.startsWith('https') || name.startsWith('http')) {
        window.open(name, '_blank')
      } else {
        this.$router.push({ name })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'WalletBadge';
</style>
