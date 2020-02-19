<template>
  <v-card class="advance-option message-modal">
    <div class="text-right">
      <v-btn icon class="close-btn" small @click="onCancel">
        <v-icon size="8">$vuetify.icons.close</v-icon>
      </v-btn>
    </div>
    <v-card-text text-center class="text_1--text pa-0">
      <v-layout wrap justify-center class="image-container text-center">
        <v-flex xs6 text-center>
          <img width="240" :src="badge.winningBadge[0].url" />
        </v-flex>
      </v-layout>
      <v-layout wrap class="badge-info">
        <v-flex xs12 md10 mx-auto px-4 text-center>
          <div class="font-weight-bold headline mt-4 mb-2">Congratulations</div>
        </v-flex>

        <v-flex xs10 md9 mx-auto text-center mb-6>
          <span class="title text-gray">Would you like to share this information with the system?</span>
        </v-flex>

        <v-flex xs6 mx-auto px-4 mt-6 text-center pb-4>
          <v-btn color="primary" large block depressed class="px-12 allow-btn">Allow</v-btn>
          <v-btn text large block depressed class="px-12 mt-3 return-btn" @click="onCancel">No, do not share</v-btn>
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
