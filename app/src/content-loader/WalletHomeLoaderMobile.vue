<template>
  <content-loader :height="600" :width="450" :speed="2" primaryColor="#E7EDF3" secondaryColor="#ecebeb">
    <rect x="15.5" y="17.61" rx="0" ry="0" width="46.13" height="28.18" />
    <rect x="15.5" y="63.61" rx="0" ry="0" width="139.18" height="22.12" />
    <rect x="15.5" y="92.61" rx="0" ry="0" width="418.85" height="66.41" />
    <rect x="15.5" y="238.61" rx="0" ry="0" width="85.72" height="27.31" />
    <rect x="105.5" y="238.61" rx="0" ry="0" width="85.72" height="27.31" />
    <rect x="15.5" y="161.61" rx="0" ry="0" width="418.85" height="66.41" />
    <rect x="15.5" y="267.61" rx="0" ry="0" width="418.85" height="66.41" />
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
