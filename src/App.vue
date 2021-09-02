<template>
  <v-app class="torus-app">
    <router-view />
  </v-app>
</template>

<script>
export default {
  mounted() {
    const pageHtml = document.querySelector('html')
    const pageBody = document.querySelector('body')
    const pageApplication = document.querySelector('.v-application')

    if (this.$route.name === 'popup') {
      pageHtml.style.background = 'none'
      pageBody.style.background = 'none'
      pageApplication.style.background = 'none'
    } else {
      pageHtml.style.background = ''
      pageBody.style.background = ''
      pageApplication.style.background = ''
    }
  },
}
</script>

<style lang="scss">
@import 'App.scss';
</style>
