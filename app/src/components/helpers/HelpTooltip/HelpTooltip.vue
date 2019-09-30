<template>
  <v-tooltip top :value="showTooltip">
    <template v-slot:activator="{ on }">
      <v-icon small v-text="'$vuetify.icons.question'" v-on="on"></v-icon>
    </template>
    <span>
      <div class="primary--text subtitle-2">{{ title }}</div>
      <v-divider class="my-2"></v-divider>
      <slot name="description">
        <div class="body-2 text-justify">
          {{ description }}
        </div>
      </slot>
    </span>
  </v-tooltip>
</template>

<script>
export default {
  props: ['title', 'description'],
  data() {
    return {
      showTooltip: true
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'HelpTooltip.scss';
</style>
