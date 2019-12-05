<template>
  <content-loader :height="600" :width="450" :speed="2" primaryColor="#E7EDF3" secondaryColor="#ecebeb">
    <rect x="15.5" y="17.61" rx="0" ry="0" width="46.13" height="28.18" />
    <rect x="15.5" y="63.61" rx="0" ry="0" width="139.18" height="22.12" />
    <rect x="15.5" y="115.61" rx="0" ry="0" width="418.85" height="72.62" />
    <rect x="173.5" y="94.61" rx="0" ry="0" width="255.58" height="13.46" />
    <rect x="15.5" y="195.61" rx="0" ry="0" width="418.85" height="72.62" />
    <rect x="15.5" y="275.61" rx="0" ry="0" width="418.85" height="72.62" />
    <rect x="15.5" y="357.61" rx="0" ry="0" width="418.85" height="72.62" />
  </content-loader>
</template>

<script>
import { ContentLoader } from 'vue-content-loader'

export default {
  components: {
    ContentLoader
  }
}
</script>
