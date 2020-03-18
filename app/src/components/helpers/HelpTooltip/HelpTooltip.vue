<template>
  <v-tooltip top>
    <template v-slot:activator="{ on }">
      <v-icon small v-on="on" v-text="'$vuetify.icons.question'"></v-icon>
    </template>
    <span>
      <div class="torus_brand1--text subtitle-2">{{ title }}</div>
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
      default: ''
    },
    description: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'HelpTooltip.scss';
</style>
