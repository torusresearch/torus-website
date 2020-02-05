<template>
  <v-card class="advance-option message-modal">
    <div class="text-right">
      <v-btn icon class="close-btn" small @click="onCancel">
        <v-icon size="8">$vuetify.icons.close</v-icon>
      </v-btn>
    </div>
    <v-card-text class="text_1--text pa-0">
      <v-layout wrap class="image-container text-center">
        <v-flex xs12 px-4 mt-6>
          <img width="240" :src="badge.winningBadge[0].url" />
        </v-flex>
      </v-layout>
      <v-layout wrap class="badge-info">
        <v-flex xs12 md10 mx-auto px-4 text-center>
          <div class="font-weight-bold headline mt-4 mb-2">Congratulations</div>
        </v-flex>

        <v-flex xs10 md9 mx-auto text-center mb-6>
          <div v-if="!isCompleted" class="badge-title subtitle-1">You have completed the Badge:</div>
          <div v-if="!isCompleted" class="font-weight-bold badge-task-is-complete subtitle-1">"{{ text }}"</div>
          <div v-else class="font-weight-bold badge-is-completed subtitle-1">{{ text }}</div>
        </v-flex>

        <v-flex xs12 mx-auto px-4 text-center pb-4>
          <v-btn v-if="!isCompleted" large depressed class="px-12 return-btn" @click="onCancel">Return</v-btn>
          <v-btn v-else color="primary" large depressed class="px-12">Allow</v-btn>
        </v-flex>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: ['text', 'isCompleted', 'badge'],
  methods: {
    onCancel() {
      this.$emit('onCloseBadgeModal')
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'BadgeModal.scss';
</style>
