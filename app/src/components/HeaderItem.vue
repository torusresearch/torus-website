<script>
export default {
  name: 'headerItem',
  props: ['icon', 'isSelected', 'to', 'href'],
  computed: {
    computedClass: function() {
      return !this.isSelected ? 'active' : ''
    }
  }
}
</script>

<template>
  <router-link tag="a" :to="to" class="mr-5 pb-1" :class="computedClass">
    <v-icon>{{ icon }}</v-icon>
    <slot></slot>
  </router-link>
</template>

<style lang="scss">
a {
  color: #b3c0ce !important;
  font-size: 1.2rem;
  text-decoration: none;
}
.router-link-active {
  border-bottom: 2px solid var(--v-torus_blue-base);
  color: black !important;
}
</style>
