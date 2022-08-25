<template>
  <v-col sm="8" class="mb-2 mb-sm-0" :cols="!isDapp && '10'" :class="isDapp ? '' : 'ml-auto mr-auto'">
    <div
      class="text_2--text"
      :class="isDapp ? 'headline font-weight-medium' : 'display-1 font-weight-bold'"
      :style="{ maxWidth: isDapp ? 'inherit' : '260px' }"
    >
      {{ $t('login.title') }}
    </div>
  </v-col>
</template>

<script>
export default {
  props: {
    isDapp: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'LoginTitle.scss';
</style>
