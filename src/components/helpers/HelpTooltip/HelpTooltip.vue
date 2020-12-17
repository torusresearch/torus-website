<template>
  <v-tooltip top>
    <template #activator="{ on }">
      <v-icon size="14" class="ml-1 text_3--text" :style="{ marginTop: '-2px' }" v-on="on">$vuetify.icons.question_filled</v-icon>
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
  },
}
</script>

<style lang="scss" scoped>
@import 'HelpTooltip.scss';
</style>
