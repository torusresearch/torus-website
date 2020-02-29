<template>
  <v-alert :value="alertShow" tile class="ma-0 save-alert caption text-center" :type="alertType" text dense>
    <v-icon small :class="`${alertType}--text`">
      {{ alertType === 'success' ? '$vuetify.icons.check_circle' : '$vuetify.icons.close_circle' }}
    </v-icon>
    {{ alertText }}
    <v-btn text small color="text_1" class="float-right" @click="hideAlert">
      <v-icon size="16">$vuetify.icons.close</v-icon>
    </v-btn>
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
