<template>
  <v-flex class="mb-2 mb-sm-0" :class="isDapp ? '' : 'ml-auto mr-auto xs10 sm8'">
    <div
      class="text_2--text"
      :class="isDapp ? 'headline font-weight-medium' : 'display-1 font-weight-bold'"
      :style="{ maxWidth: isDapp ? 'inherit' : '260px' }"
    >
      {{ $t('login.title') }}
    </div>
  </v-flex>
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
