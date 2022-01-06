<template>
  <v-app class="torus-app">
    <router-view />
  </v-app>
</template>

<script>
/* eslint-disable vue-scoped-css/enforce-style-type */
export default {
  watch: {
    $route(to) {
      this.updateBackgrounds(to.name)
    },
  },
  mounted() {
    this.updateBackgrounds(this.$route.name)
  },
  methods: {
    updateBackgrounds(routeName) {
      const pageHtml = document.querySelector('html')
      const pageBody = document.querySelector('body')
      const pageApplication = document.querySelector('#app')

      if (routeName === 'popup') {
        pageHtml.style.background = 'none'
        pageBody.style.background = 'none'
        pageApplication.style.background = 'none'
      } else {
        pageHtml.style.background = ''
        pageBody.style.background = ''
        pageApplication.style.background = ''
      }
    },
  },
}
</script>

<style lang="scss">
@import 'App.scss';
</style>
