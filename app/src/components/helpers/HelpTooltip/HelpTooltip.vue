<template>
  <v-tooltip top>
    <template v-slot:activator="{ on }">
      <v-icon size="14" class="ml-1 text_3--text" :style="{ marginTop: '-2px' }" v-on="on">$vuetify.icons.question_filled</v-icon>
    </template>
    <span>
      <div class="torusBrand1--text text-subtitle-2">{{ title }}</div>
      <v-divider class="my-2"></v-divider>
      <slot name="description">
        <div class="body-2 text-justify">{{ description }}</div>
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
