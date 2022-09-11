<template>
  <v-tooltip location="top">
    <template #activator="{ props }">
      <v-icon size="14" class="ml-1 text-text_3" :style="{ marginTop: '-2px' }" v-bind="props">$question</v-icon>
    </template>
    <span>
      <div class="body-2 text-text_2 font-weight-bold mb-2">{{ title }}</div>
      <slot name="description">
        <div class="caption text-text_3 text-justify">{{ description }}</div>
      </slot>
    </span>
  </v-tooltip>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'HelpTooltip.scss';
</style>
