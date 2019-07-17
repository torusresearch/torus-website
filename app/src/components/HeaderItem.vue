<template>
  <router-link tag="a" :to="to" class="mr-5 pb-1" :class="computedClass">
    <slot></slot>
  </router-link>
</template>

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

<style lang="scss" scoped>
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
