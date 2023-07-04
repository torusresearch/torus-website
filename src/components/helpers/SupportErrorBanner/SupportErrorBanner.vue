<template>
  <div
    class="error-box d-md-flex align-center justify-center error lighten-4 py-3 py-sm-5 px-5"
    :class="{ 'is-mobile': $vuetify.breakpoint.smAndDown }"
  >
    <div class="d-flex justify-md-center mb-2 mb-md-0">
      <v-icon size="22" class="black--text mr-2">$vuetify.icons.alert</v-icon>
      <div class="text-caption text-sm-body-2">{{ message }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SupportErrorBanner',
  props: {
    message: {
      type: String,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'SupportErrorBanner.scss';
</style>
