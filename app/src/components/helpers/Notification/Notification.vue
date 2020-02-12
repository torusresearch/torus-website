<template>
  <v-alert v-if="alertShow" :value="alertShow" tile class="ma-0 save-alert caption" :type="alertType" text dense>
    <v-container>
      <div class="items">
        <div class="message">
          <v-icon :class="`${alertType}--text`">
            {{ alertType === 'success' ? '$vuetify.icons.check_circle' : '$vuetify.icons.close_circle' }}
          </v-icon>
          <span>
            {{ alertText }}
          </span>
        </div>
        <v-btn text x-small color="text_1" class="float-right" @click="hideAlert">
          <v-icon text size="8">$vuetify.icons.close</v-icon>
        </v-btn>
      </div>
    </v-container>
  </v-alert>
</template>

<script>
export default {
  props: ['alertShow', 'alertText', 'alertType'],
  methods: {
    hideAlert() {
      this.$emit('closeAlert')
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'Notification.scss';
</style>
