<template>
  <v-tooltip top>
    <template #activator="{ on }">
      <v-icon :size="iconSize" class="ml-1 text_3--text tooltip-icon" v-on="on">$vuetify.icons.{{ icon }}</v-icon>
    </template>
    <span>
      <div class="body-2 text_2--text font-weight-bold mb-2">{{ title }}</div>
      <slot name="description">
        <div class="caption text_3--text text-justify">{{ description }}</div>
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
    icon: {
      type: String,
      default: 'question_filled',
    },
    iconSize: {
      type: Number,
      default: 14,
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'HelpTooltip.scss';
</style>
