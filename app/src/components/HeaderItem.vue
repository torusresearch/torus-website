<template>
  <v-tab :to="to" :href="href">
    <v-icon>{{ icon }}</v-icon>
    <span class="ml-1" :class="computedClass">
      <slot></slot>
    </span>
  </v-tab>
</template>

<script>
export default {
  name: 'headerItem',
  props: ['icon', 'isSelected', 'to', 'href'],
  computed: {
    computedClass: function() {
      return !this.isSelected ? 'hidden-sm-and-down' : ''
    }
  }
}
</script>

<style lang="scss">
.temp {
  padding: 0px;
  margin: 0px;
}
</style>
